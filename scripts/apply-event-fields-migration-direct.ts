import pg from "pg";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("Missing DATABASE_URL environment variable");
  process.exit(1);
}

async function applyMigration() {
  console.log("Connecting to database...");
  
  const client = new pg.Client({
    connectionString: databaseUrl,
  });

  try {
    await client.connect();
    console.log("✓ Connected to database");

    console.log("Applying migration: Add event image and team fields...");

    const queries = [
      `ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "map_image" text;`,
      `ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "team1_name" text;`,
      `ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "team1_image" text;`,
      `ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "team2_name" text;`,
      `ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "team2_image" text;`,
    ];

    for (const query of queries) {
      console.log(`Executing: ${query}`);
      await client.query(query);
      console.log("  ✓ Done");
    }

    console.log("\n✅ Migration applied successfully!");
    
    // Verify columns exist
    const result = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'events' 
      AND column_name IN ('map_image', 'team1_name', 'team1_image', 'team2_name', 'team2_image');
    `);
    
    console.log(`\nVerified ${result.rows.length} new columns exist:`);
    result.rows.forEach(row => console.log(`  - ${row.column_name}`));

  } catch (error) {
    console.error("Error applying migration:", error);
    process.exit(1);
  } finally {
    await client.end();
    console.log("\n✓ Database connection closed");
  }
}

applyMigration();

