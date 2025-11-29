/**
 * Script to apply squad_leader role migration
 * 
 * This script adds the 'squad_leader' value to the user_role enum in Supabase
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load environment variables
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing required environment variables:");
  if (!supabaseUrl) console.error("   - NEXT_PUBLIC_SUPABASE_URL");
  if (!supabaseServiceKey) console.error("   - SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

async function applyMigration() {
  console.log("🔄 Applying squad_leader role migration...\n");

  // Create Supabase client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // Read migration SQL
    const migrationPath = path.join(process.cwd(), "migrations", "0002_add_squad_leader_role.sql");
    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

    console.log("📄 Migration SQL:");
    console.log(migrationSQL);
    console.log("\n");

    // Execute SQL using Supabase RPC or direct query
    // Note: Supabase JS client doesn't support direct SQL execution
    // We need to use the REST API or execute via psql
    
    console.log("⚠️  Supabase JS client doesn't support ALTER TYPE directly.");
    console.log("📝 Please execute the following SQL in Supabase Dashboard:\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(migrationSQL);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    
    console.log("📍 Steps to apply migration:");
    console.log("1. Go to Supabase Dashboard → SQL Editor");
    console.log("2. Paste the SQL above");
    console.log("3. Click 'Run' to execute");
    console.log("4. Verify the migration was successful\n");

    // Try to verify if the enum value exists
    console.log("🔍 Checking if squad_leader role already exists...");
    
    // We can't directly check enum values via Supabase JS client,
    // but we can try to query users table to see if it's being used
    const { data: testUser, error: testError } = await supabase
      .from("users")
      .select("role")
      .limit(1)
      .single();

    if (!testError && testUser) {
      console.log("✅ Database connection successful");
      console.log("ℹ️  Note: You still need to execute the SQL manually in Supabase Dashboard\n");
    }

  } catch (error) {
    console.error("❌ Error applying migration:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    process.exit(1);
  }
}

applyMigration();

