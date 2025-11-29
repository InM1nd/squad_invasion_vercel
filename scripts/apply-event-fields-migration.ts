import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function applyMigration() {
  console.log("Applying migration: Add event image and team fields...");

  const queries = [
    `ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "map_image" text;`,
    `ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "team1_name" text;`,
    `ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "team1_image" text;`,
    `ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "team2_name" text;`,
    `ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "team2_image" text;`,
  ];

  try {
    for (const query of queries) {
      console.log(`Executing: ${query}`);
      const { error } = await supabase.rpc("exec_sql", { sql_query: query });
      
      if (error) {
        // Try direct query if RPC doesn't work
        console.log("RPC failed, trying direct connection...");
        // For direct SQL execution, we need to use the Postgres connection
        // This is a fallback - the columns might already exist
        console.warn("Note: Direct SQL execution requires Postgres connection string");
        console.warn("You may need to run these SQL commands manually in Supabase SQL Editor:");
        queries.forEach(q => console.log(q));
        break;
      }
    }

    // Verify columns exist by trying to select them
    const { data, error: selectError } = await supabase
      .from("events")
      .select("id, map_image, team1_name, team1_image, team2_name, team2_image")
      .limit(1);

    if (selectError) {
      if (selectError.message.includes("column") && selectError.message.includes("does not exist")) {
        console.error("\n❌ Migration failed: Columns do not exist");
        console.error("Please run these SQL commands in Supabase SQL Editor:");
        queries.forEach(q => console.log(`  ${q}`));
        process.exit(1);
      } else {
        // Other errors might be okay (like no rows)
        console.log("✓ Columns exist (or table is empty)");
      }
    } else {
      console.log("✓ Migration applied successfully!");
      console.log("✓ All columns are accessible");
    }
  } catch (error) {
    console.error("Error applying migration:", error);
    console.error("\nPlease run these SQL commands manually in Supabase SQL Editor:");
    queries.forEach(q => console.log(`  ${q}`));
    process.exit(1);
  }
}

applyMigration();

