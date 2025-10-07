// src/routes/api/cards/random/+server.ts
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { cards } from "$lib/server/db/schema";
import { eq, sql } from "drizzle-orm";

export const GET: RequestHandler = async () => {
  // Get 5 random cards
  const randomCards = await db
    .select()
    .from(cards)
    .where(eq(cards.rarity, "mythic"))
    .orderBy(sql`RANDOM()`)
    .limit(5);

  return json(randomCards);
};
