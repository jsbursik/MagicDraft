import { google } from "googleapis";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { cards } from "$lib/server/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { PROXY_SOURCES, type ProxySource } from "./proxy-sources";
import "dotenv/config";

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client);

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
  parents?: string[];
}

async function listFilesRecursive(folderId: string, source: ProxySource, folderPath: string = "", pageToken?: string): Promise<DriveFile[]> {
  const response = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false`,
    fields: "nextPageToken, files(id, name, mimeType, parents)",
    pageSize: 1000,
    pageToken,
  });

  let allFiles: DriveFile[] = [];
  const files = (response.data.files || []) as DriveFile[];

  for (const file of files) {
    if (file.mimeType === "application/vnd.google-apps.folder") {
      const folderName = file.name;

      // Apply folder filter if defined
      if (source.folderFilter) {
        const mode = source.folderFilterMode || "include";
        const matches = source.folderFilter.test(folderName);

        if ((mode === "include" && !matches) || (mode === "exclude" && matches)) {
          console.log(`   ⏭️  Skipping folder: ${folderPath}/${folderName}`);
          continue;
        }
      }

      console.log(`   📁 Scanning folder: ${folderPath}/${folderName}`);

      // Recursively scan subfolders
      const subFiles = await listFilesRecursive(file.id, source, `${folderPath}/${folderName}`);
      allFiles = [...allFiles, ...subFiles];
    } else if (file.mimeType?.startsWith("image/")) {
      allFiles.push(file);
    }
  }

  // Handle pagination
  if (response.data.nextPageToken) {
    const nextFiles = await listFilesRecursive(folderId, source, folderPath, response.data.nextPageToken);
    allFiles = [...allFiles, ...nextFiles];
  }

  return allFiles;
}

async function indexSource(source: ProxySource) {
  console.log(`\n🔍 Indexing: ${source.name} (Priority ${source.priority})`);
  console.log(`   ${source.description}`);

  const files = await listFilesRecursive(source.driveId, source, "");

  console.log(`\n📊 Found ${files.length} image files`);

  let matched = 0;
  let updated = 0;
  let skipped = 0;
  let unmatched = 0;

  for (const file of files) {
    // Parse filename using source's parser
    const parsed = source.filenameParser(file.name);

    if (!parsed) {
      unmatched++;
      continue;
    }

    // Build query to find matching card(s)
    let whereClause;

    if (parsed.setCode) {
      // Best case: name + set code = exact match
      whereClause = and(eq(cards.name, parsed.cardName), eq(cards.set, parsed.setCode.toLowerCase()));
    } else if (parsed.artist) {
      // Fallback: name + artist to get the specific printing
      whereClause = and(eq(cards.name, parsed.cardName), eq(cards.artist, parsed.artist));
    } else {
      // Last resort: just name (will match multiple, but that's the best we can do)
      whereClause = eq(cards.name, parsed.cardName);
    }

    const matchingCards = await db.select().from(cards).where(whereClause);

    if (matchingCards.length === 0) {
      unmatched++;
      if (unmatched % 100 === 0) {
        console.log(`   ❌ ${unmatched} unmatched so far... (e.g., "${parsed.cardName}" by ${parsed.artist || "unknown artist"})`);
      }
      continue;
    }

    matched += matchingCards.length;

    // Generate direct download URL
    const directUrl = `https://drive.google.com/uc?export=download&id=${file.id}`;

    // Update each matching card (considering priority)
    for (const card of matchingCards) {
      // Only update if this source has higher priority (lower number)
      // or if no proxy image exists yet
      if (!card.proxyPriority || source.priority < card.proxyPriority) {
        await db
          .update(cards)
          .set({
            proxyImageUrl: directUrl,
            proxySourceId: source.id,
            proxyPriority: source.priority,
            proxyArtist: parsed.artist || null,
            proxySetCode: parsed.setCode || null,
            proxyLastIndexed: new Date(),
          })
          .where(eq(cards.id, card.id));

        updated++;
      } else {
        skipped++;
      }
    }

    if (matched % 500 === 0) {
      console.log(`   ✅ Matched ${matched} cards...`);
    }
  }

  console.log(`\n📈 Results for ${source.name}:`);
  console.log(`   ✅ Matched: ${matched} cards`);
  console.log(`   🔄 Updated: ${updated} cards`);
  console.log(`   ⏭️  Skipped (lower priority): ${skipped} cards`);
  console.log(`   ❌ Unmatched: ${unmatched} files`);
}

async function indexAllSources() {
  console.log("🚀 Starting proxy source indexing...\n");

  // Sort sources by priority to process highest priority first
  const sortedSources = [...PROXY_SOURCES].sort((a, b) => a.priority - b.priority);

  for (const source of sortedSources) {
    await indexSource(source);
  }

  // Final stats
  const stats = await db.execute(sql`
    SELECT 
      proxy_source_id,
      COUNT(*) as count
    FROM cards
    WHERE proxy_image_url IS NOT NULL
    GROUP BY proxy_source_id
    ORDER BY count DESC
  `);

  console.log("\n\n🎉 Indexing complete!");
  console.log("\n📊 Cards by proxy Source:");
  console.table(stats);

  const totalProxy = await db.execute(sql`
    SELECT COUNT(*) as total 
    FROM cards 
    WHERE proxy_image_url IS NOT NULL
  `);

  const totalCards = await db.execute(sql`
    SELECT COUNT(*) as total FROM cards
  `);

  console.log(`\n📈 Coverage: ${totalProxy[0].total}/${totalCards[0].total} cards have proxy images`);

  process.exit(0);
}

indexAllSources().catch(console.error);
