// scripts/import-scryfall.ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { cards } from "../src/lib/server/db/schema";
import { readFile } from "fs/promises";
import { sql } from "drizzle-orm";

// Create db connection directly in script
const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

interface ScryfallCard {
  id: string;
  oracle_id: string;
  name: string;
  set: string;
  set_name: string;
  collector_number: string;
  rarity: string;
  mana_cost?: string;
  cmc: number;
  type_line: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  colors?: string[];
  color_identity?: string[];
  keywords?: string[];
  frame_effects?: string[];
  full_art?: boolean;
  border_color?: string;
  finishes?: string[];
  promo_types?: string[];
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
  artist?: string;
  flavor_text?: string;
  released_at?: string;
}

async function importCards() {
  console.log("📦 Reading Scryfall bulk data...");

  const fileContent = await readFile("./default-cards.json", "utf-8");
  const scryfallCards: ScryfallCard[] = JSON.parse(fileContent);

  console.log(`📊 Found ${scryfallCards.length} cards`);

  // Filter out unwanted cards (tokens, art cards, etc.)
  const validCards = scryfallCards.filter(
    (card) =>
      card.type_line && // Make sure type_line exists
      !["token", "art_series", "vanguard", "plane", "scheme", "phenomenon"].includes(card.type_line.toLowerCase()) &&
      card.image_uris // Must have images
  );

  console.log(`✅ ${validCards.length} valid cards after filtering`);

  // Transform to match our schema
  const cardsToInsert = validCards.map((card) => ({
    id: card.id,
    oracleId: card.oracle_id,
    name: card.name,
    set: card.set,
    setName: card.set_name,
    collectorNumber: card.collector_number,
    rarity: card.rarity,
    manaCost: card.mana_cost || null,
    cmc: card.cmc,
    typeLine: card.type_line,
    oracleText: card.oracle_text || null,
    power: card.power || null,
    toughness: card.toughness || null,
    colors: card.colors || null,
    colorIdentity: card.color_identity || null,
    keywords: card.keywords || null,
    frameEffects: card.frame_effects || null,
    fullArt: card.full_art || false,
    borderColor: card.border_color || null,
    finishes: card.finishes || null,
    promoTypes: card.promo_types || null,
    imageUris: card.image_uris || null,
    artist: card.artist || null,
    flavorText: card.flavor_text || null,
    releasedAt: card.released_at ? new Date(card.released_at) : null,
  }));

  // Batch insert in chunks to avoid memory issues
  const BATCH_SIZE = 1000;
  let inserted = 0;

  console.log("🚀 Starting batch insert...");

  for (let i = 0; i < cardsToInsert.length; i += BATCH_SIZE) {
    const batch = cardsToInsert.slice(i, i + BATCH_SIZE);

    await db.insert(cards).values(batch).onConflictDoNothing(); // Skip duplicates if re-running

    inserted += batch.length;
    console.log(`   Inserted ${inserted}/${cardsToInsert.length} cards...`);
  }

  console.log("✨ Import complete!");

  // Show some stats
  const stats = await db.execute(sql`
    SELECT 
      rarity,
      COUNT(*) as count
    FROM cards
    GROUP BY rarity
    ORDER BY 
      CASE rarity
        WHEN 'common' THEN 1
        WHEN 'uncommon' THEN 2
        WHEN 'rare' THEN 3
        WHEN 'mythic' THEN 4
        ELSE 5
      END
  `);

  console.log("\n📈 Cards by rarity:");
  console.table(stats);

  process.exit(0);
}

importCards().catch(console.error);
