-- Add google_id column to users table
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "google_id" text;
CREATE UNIQUE INDEX IF NOT EXISTS "users_google_id_idx" ON "users"("google_id");
CREATE UNIQUE INDEX IF NOT EXISTS "users_discord_id_idx" ON "users"("discord_id");

