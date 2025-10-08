ALTER TABLE "cards" ADD COLUMN "proxy_image_url" text;--> statement-breakpoint
ALTER TABLE "cards" ADD COLUMN "proxy_source_id" text;--> statement-breakpoint
ALTER TABLE "cards" ADD COLUMN "proxy_priority" integer;--> statement-breakpoint
ALTER TABLE "cards" ADD COLUMN "proxy_artist" text;--> statement-breakpoint
ALTER TABLE "cards" ADD COLUMN "proxy_set_code" text;--> statement-breakpoint
ALTER TABLE "cards" ADD COLUMN "proxy_last_indexed" timestamp;