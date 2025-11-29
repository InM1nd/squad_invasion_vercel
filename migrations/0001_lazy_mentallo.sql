ALTER TYPE "public"."user_role" ADD VALUE 'squad_leader' BEFORE 'event_admin';--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "map_image" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "team1_name" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "team1_image" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "team2_name" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "team2_image" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "google_id" text;--> statement-breakpoint
CREATE INDEX "users_discord_id_idx" ON "users" USING btree ("discord_id");--> statement-breakpoint
CREATE INDEX "users_google_id_idx" ON "users" USING btree ("google_id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_google_id_unique" UNIQUE("google_id");