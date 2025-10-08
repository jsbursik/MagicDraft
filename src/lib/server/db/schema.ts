// db/schema.ts
import { pgTable, text, integer, real, timestamp, boolean, jsonb, uuid, primaryKey, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================
// BETTER AUTH TABLES
// ============================================
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),

  // DraftBox custom fields
  dustBalance: integer("dust_balance").notNull().default(0),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

// ============================================
// CARDS - Scryfall data
// ============================================
export const cards = pgTable(
  "cards",
  {
    id: uuid("id").primaryKey(), // Scryfall card ID
    oracleId: uuid("oracle_id").notNull(), // Groups all printings of same card
    name: text("name").notNull(),
    set: text("set").notNull(), // Set code (e.g., 'inr', 'c21')
    setName: text("set_name").notNull(),
    collectorNumber: text("collector_number").notNull(),
    rarity: text("rarity").notNull(), // common, uncommon, rare, mythic

    // Card details
    manaCost: text("mana_cost"),
    cmc: real("cmc"),
    typeLine: text("type_line").notNull(),
    oracleText: text("oracle_text"),
    power: text("power"),
    toughness: text("toughness"),
    colors: jsonb("colors").$type<string[]>(),
    colorIdentity: jsonb("color_identity").$type<string[]>(),
    keywords: jsonb("keywords").$type<string[]>(),

    // Visual/treatment info
    frameEffects: jsonb("frame_effects").$type<string[]>(), // showcase, borderless, etc.
    fullArt: boolean("full_art").default(false),
    borderColor: text("border_color"),
    finishes: jsonb("finishes").$type<string[]>(), // foil, nonfoil
    promoTypes: jsonb("promo_types").$type<string[]>(),

    // Images
    imageUris: jsonb("image_uris").$type<{
      small: string;
      normal: string;
      large: string;
      png: string;
      art_crop: string;
      border_crop: string;
    }>(),

    // Proxy Images
    proxyImageUrl: text("proxy_image_url"),
    proxySourceId: text("proxy_source_id"), // Which source provided the image
    proxyPriority: integer("proxy_priority"), // Priority of the source
    proxyArtist: text("proxy_artist"), // Artist from proxy filename
    proxySetCode: text("proxy_set_code"), // Set code if available in filename
    proxyLastIndexed: timestamp("proxy_last_indexed"),

    // Metadata
    artist: text("artist"),
    flavorText: text("flavor_text"),
    releasedAt: timestamp("released_at"),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    oracleIdIdx: index("oracle_id_idx").on(table.oracleId),
    setRarityIdx: index("set_rarity_idx").on(table.set, table.rarity),
    setCollectorIdx: index("set_collector_idx").on(table.set, table.collectorNumber),
    rarityIdx: index("rarity_idx").on(table.rarity),
  })
);

// ============================================
// DRAFTS - Admin-created play drafts
// ============================================
export const drafts = pgTable("drafts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),

  // Draft rules
  packCount: integer("pack_count").notNull().default(6),
  allowedSets: jsonb("allowed_sets").$type<string[]>(), // null = all sets

  // Restrictions (null = no restriction)
  rarityRestrictions: jsonb("rarity_restrictions").$type<string[]>(), // e.g., ['common', 'uncommon']
  colorRestrictions: jsonb("color_restrictions").$type<string[]>(), // e.g., ['R', 'G']
  typeRestrictions: jsonb("type_restrictions").$type<string[]>(), // e.g., ['Creature', 'Artifact']

  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id),
});

// ============================================
// USER_CARDS - Junction table for ownership
// ============================================
export const userCards = pgTable(
  "user_cards",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    cardId: uuid("card_id")
      .notNull()
      .references(() => cards.id),
    draftId: uuid("draft_id").references(() => drafts.id), // null = global collection

    // User preferences
    isFoil: boolean("is_foil").default(false),
    quantity: integer("quantity").default(1),

    // Sacrifice system
    isSacrificed: boolean("is_sacrificed").default(false),
    sacrificedAt: timestamp("sacrificed_at"),

    acquiredAt: timestamp("acquired_at").defaultNow(),
  },
  (table) => ({
    userDraftIdx: index("user_draft_idx").on(table.userId, table.draftId),
    userCardIdx: index("user_card_idx").on(table.userId, table.cardId),
  })
);

// ============================================
// DECKS - User-created decks
// ============================================
export const decks = pgTable(
  "decks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    draftId: uuid("draft_id").references(() => drafts.id), // null = uses global collection

    name: text("name").notNull(),
    description: text("description"),
    format: text("format"), // commander, standard, etc.

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    userDraftIdx: index("deck_user_draft_idx").on(table.userId, table.draftId),
  })
);

// ============================================
// DECK_CARDS - Cards in decks
// ============================================
export const deckCards = pgTable(
  "deck_cards",
  {
    deckId: uuid("deck_id")
      .notNull()
      .references(() => decks.id, { onDelete: "cascade" }),
    cardId: uuid("card_id")
      .notNull()
      .references(() => cards.id),
    quantity: integer("quantity").notNull().default(1),
    isCommander: boolean("is_commander").default(false), // for Commander format

    addedAt: timestamp("added_at").defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.deckId, table.cardId] }),
  })
);

// ============================================
// RELATIONS
// ============================================
export const userRelations = relations(user, ({ many }) => ({
  drafts: many(drafts),
  userCards: many(userCards),
  decks: many(decks),
}));

export const cardsRelations = relations(cards, ({ many }) => ({
  userCards: many(userCards),
  deckCards: many(deckCards),
}));

export const draftsRelations = relations(drafts, ({ one, many }) => ({
  createdByUser: one(user, {
    fields: [drafts.createdBy],
    references: [user.id],
  }),
  userCards: many(userCards),
  decks: many(decks),
}));

export const userCardsRelations = relations(userCards, ({ one }) => ({
  user: one(user, {
    fields: [userCards.userId],
    references: [user.id],
  }),
  card: one(cards, {
    fields: [userCards.cardId],
    references: [cards.id],
  }),
  draft: one(drafts, {
    fields: [userCards.draftId],
    references: [drafts.id],
  }),
}));

export const decksRelations = relations(decks, ({ one, many }) => ({
  user: one(user, {
    fields: [decks.userId],
    references: [user.id],
  }),
  draft: one(drafts, {
    fields: [decks.draftId],
    references: [drafts.id],
  }),
  deckCards: many(deckCards),
}));

export const deckCardsRelations = relations(deckCards, ({ one }) => ({
  deck: one(decks, {
    fields: [deckCards.deckId],
    references: [decks.id],
  }),
  card: one(cards, {
    fields: [deckCards.cardId],
    references: [cards.id],
  }),
}));
