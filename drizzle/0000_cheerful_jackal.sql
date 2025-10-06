CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cards" (
	"id" uuid PRIMARY KEY NOT NULL,
	"oracle_id" uuid NOT NULL,
	"name" text NOT NULL,
	"set" text NOT NULL,
	"set_name" text NOT NULL,
	"collector_number" text NOT NULL,
	"rarity" text NOT NULL,
	"mana_cost" text,
	"cmc" integer,
	"type_line" text NOT NULL,
	"oracle_text" text,
	"power" text,
	"toughness" text,
	"colors" jsonb,
	"color_identity" jsonb,
	"keywords" jsonb,
	"frame_effects" jsonb,
	"full_art" boolean DEFAULT false,
	"border_color" text,
	"finishes" jsonb,
	"promo_types" jsonb,
	"image_uris" jsonb,
	"artist" text,
	"flavor_text" text,
	"released_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "deck_cards" (
	"deck_id" uuid NOT NULL,
	"card_id" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"is_commander" boolean DEFAULT false,
	"added_at" timestamp DEFAULT now(),
	CONSTRAINT "deck_cards_deck_id_card_id_pk" PRIMARY KEY("deck_id","card_id")
);
--> statement-breakpoint
CREATE TABLE "decks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"draft_id" uuid,
	"name" text NOT NULL,
	"description" text,
	"format" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "drafts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"pack_count" integer DEFAULT 6 NOT NULL,
	"allowed_sets" jsonb,
	"rarity_restrictions" jsonb,
	"color_restrictions" jsonb,
	"type_restrictions" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"created_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean NOT NULL,
	"image" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"dust_balance" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"card_id" uuid NOT NULL,
	"draft_id" uuid,
	"is_foil" boolean DEFAULT false,
	"quantity" integer DEFAULT 1,
	"is_sacrificed" boolean DEFAULT false,
	"sacrificed_at" timestamp,
	"acquired_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deck_cards" ADD CONSTRAINT "deck_cards_deck_id_decks_id_fk" FOREIGN KEY ("deck_id") REFERENCES "public"."decks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deck_cards" ADD CONSTRAINT "deck_cards_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decks" ADD CONSTRAINT "decks_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decks" ADD CONSTRAINT "decks_draft_id_drafts_id_fk" FOREIGN KEY ("draft_id") REFERENCES "public"."drafts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drafts" ADD CONSTRAINT "drafts_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_cards" ADD CONSTRAINT "user_cards_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_cards" ADD CONSTRAINT "user_cards_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_cards" ADD CONSTRAINT "user_cards_draft_id_drafts_id_fk" FOREIGN KEY ("draft_id") REFERENCES "public"."drafts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "oracle_id_idx" ON "cards" USING btree ("oracle_id");--> statement-breakpoint
CREATE INDEX "set_rarity_idx" ON "cards" USING btree ("set","rarity");--> statement-breakpoint
CREATE INDEX "set_collector_idx" ON "cards" USING btree ("set","collector_number");--> statement-breakpoint
CREATE INDEX "rarity_idx" ON "cards" USING btree ("rarity");--> statement-breakpoint
CREATE INDEX "deck_user_draft_idx" ON "decks" USING btree ("user_id","draft_id");--> statement-breakpoint
CREATE INDEX "user_draft_idx" ON "user_cards" USING btree ("user_id","draft_id");--> statement-breakpoint
CREATE INDEX "user_card_idx" ON "user_cards" USING btree ("user_id","card_id");