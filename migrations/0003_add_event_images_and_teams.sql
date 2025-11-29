-- Add new columns to events table for map image and team information
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "map_image" text;
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "team1_name" text;
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "team1_image" text;
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "team2_name" text;
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "team2_image" text;

