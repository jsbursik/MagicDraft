import { PROXY_SOURCES } from "$lib/scripts/proxy-sources.ts";
import { google } from "googleapis";

import path from "path";
import { json } from "@sveltejs/kit";
import { existsSync } from "fs";
import { readdir, unlink, writeFile, mkdir, readFile } from "fs/promises";

import type { RequestHandler } from "@sveltejs/kit";

const STATIC_DIR = "./static/proxy-images";
const SYNC_STATE_FILE = "./sync-state.json";
const BATCH_SIZE = 50;
const DELAY_MS = 2000;
const MIN_SYNC_INTERVAL_HOURS = 24;

interface SyncState {
  lastSync: string | null;
  totalImages: number;
}

const drive = google.drive({
  version: "v3",
  auth: new google.auth.GoogleAuth({
    keyFile: "./draftbox-creds.json",
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  }),
});

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

async function getSyncState(): Promise<SyncState> {
  if (!existsSync(SYNC_STATE_FILE)) {
    return { lastSync: null, totalImages: 0 };
  }
  const content = await readFile(SYNC_STATE_FILE, "utf-8");
  return JSON.parse(content);
}

async function setSyncState(state: SyncState): Promise<void> {
  await writeFile(SYNC_STATE_FILE, JSON.stringify(state, null, 2));
}

async function listAllDriveFiles(folderId: string, pageToken?: string): Promise<DriveFile[]> {
  const response = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false and mimeType contains 'image/'`,
    fields: "nextPageToken, files(id, name, mimeType)",
    pageSize: 1000,
    pageToken,
  });

  let files = (response.data.files || []) as DriveFile[];

  if (response.data.nextPageToken) {
    const nextFiles = await listAllDriveFiles(folderId, response.data.nextPageToken);
    files = [...files, ...nextFiles];
  }

  return files;
}

async function listAllDriveFilesRecursive(folderId: string): Promise<Set<string>> {
  const response = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false`,
    fields: "nextPageToken, files(id, name, mimeType)",
    pageSize: 1000,
  });

  const fileIds = new Set<string>();
  const folders: string[] = [];

  for (const file of response.data.files || []) {
    if (file.mimeType === "application/vnd.google-apps.folder") {
      folders.push(file.id!);
    } else if (file.mimeType?.startsWith("image/")) {
      fileIds.add(file.id!);
    }
  }

  // Recursively get files from subfolders
  for (const subfolderId of folders) {
    const subFiles = await listAllDriveFilesRecursive(subfolderId);
    subFiles.forEach((id) => fileIds.add(id));
  }

  return fileIds;
}

async function getLocalFiles(sourceId: string): Promise<Set<string>> {
  const dir = path.join(STATIC_DIR, sourceId);
  if (!existsSync(dir)) {
    return new Set();
  }

  const files = await readdir(dir);
  // Remove .jpg extension to get just the file IDs
  return new Set(files.map((f) => f.replace(".jpg", "")));
}

async function downloadImage(fileId: string, sourceId: string): Promise<void> {
  const url = `https://lh3.googleusercontent.com/d/${fileId}=s400`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  const filepath = path.join(STATIC_DIR, sourceId, `${fileId}.jpg`);
  await writeFile(filepath, Buffer.from(buffer));
}

async function syncSource(sourceId: string, driveId: string) {
  console.log(`\n🔍 Syncing source: ${sourceId}`);

  // Create directory if it doesn't exist
  const dir = path.join(STATIC_DIR, sourceId);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  // Get Drive files
  console.log("   📡 Fetching Drive file list...");
  const driveFiles = await listAllDriveFilesRecursive(driveId);
  console.log(`   📊 Found ${driveFiles.size} files in Drive`);

  // Get local files
  const localFiles = await getLocalFiles(sourceId);
  console.log(`   💾 Found ${localFiles.size} files locally`);

  // Calculate diff
  const toDownload = [...driveFiles].filter((id) => !localFiles.has(id));
  const toDelete = [...localFiles].filter((id) => !driveFiles.has(id));

  console.log(`   ⬇️  Need to download: ${toDownload.length}`);
  console.log(`   🗑️  Need to delete: ${toDelete.length}`);

  // Delete removed files
  for (const fileId of toDelete) {
    const filepath = path.join(STATIC_DIR, sourceId, `${fileId}.jpg`);
    await unlink(filepath);
  }
  if (toDelete.length > 0) {
    console.log(`   ✅ Deleted ${toDelete.length} removed files`);
  }

  // Download new files in batches
  let downloaded = 0;
  let failed = 0;

  for (let i = 0; i < toDownload.length; i += BATCH_SIZE) {
    const batch = toDownload.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (fileId) => {
        try {
          await downloadImage(fileId, sourceId);
          downloaded++;
          if (downloaded % 10 === 0) {
            console.log(`   📥 Downloaded ${downloaded}/${toDownload.length}...`);
          }
        } catch (error) {
          console.log(`   ❌ Failed to download ${fileId}: ${error}`);
          failed++;
        }
      })
    );

    // Delay between batches
    if (i + BATCH_SIZE < toDownload.length) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }
  }

  console.log(`   ✅ Downloaded ${downloaded} new files`);
  if (failed > 0) {
    console.log(`   ⚠️  Failed ${failed} downloads`);
  }

  return {
    downloaded,
    deleted: toDelete.length,
    failed,
    total: driveFiles.size,
  };
}

export const POST: RequestHandler = async ({ url }) => {
  const force = url.searchParams.get("force") === "true";

  // Check if sync is needed
  const state = await getSyncState();
  if (!force && state.lastSync) {
    const lastSyncTime = new Date(state.lastSync).getTime();
    const now = Date.now();
    const hoursSinceLastSync = (now - lastSyncTime) / (1000 * 60 * 60);

    if (hoursSinceLastSync < MIN_SYNC_INTERVAL_HOURS) {
      return json({
        status: "skipped",
        message: `Last sync was ${hoursSinceLastSync.toFixed(1)} hours ago. Use ?force=true to override.`,
        lastSync: state.lastSync,
      });
    }
  }

  console.log("🚀 Starting proxy image sync...");

  const results = [];
  let totalImages = 0;

  for (const source of PROXY_SOURCES) {
    const result = await syncSource(source.id, source.driveId);
    results.push({ source: source.id, ...result });
    totalImages += result.total;
  }

  // Update sync state
  await setSyncState({
    lastSync: new Date().toISOString(),
    totalImages,
  });

  console.log("\n🎉 Sync complete!");

  return json({
    status: "success",
    results,
    totalImages,
    timestamp: new Date().toISOString(),
  });
};
