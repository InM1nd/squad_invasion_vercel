/**
 * Script to apply squad_leader role migration directly via PostgreSQL
 * 
 * This script connects directly to Supabase PostgreSQL and adds the 'squad_leader' value to the user_role enum
 */

import { Client } from "pg";
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

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ Missing required environment variable: DATABASE_URL");
  console.error("   DATABASE_URL should be your Supabase connection string");
  console.error("   Format: postgresql://postgres:[password]@[host]:[port]/postgres");
  process.exit(1);
}

async function applyMigration() {
  console.log("🔄 Applying squad_leader role migration...\n");

  const client = new Client({
    connectionString: databaseUrl,
  });

  try {
    await client.connect();
    console.log("✅ Connected to database\n");

    // Read migration SQL
    const migrationPath = path.join(process.cwd(), "migrations", "0002_add_squad_leader_role.sql");
    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

    console.log("📄 Executing migration SQL:");
    console.log(migrationSQL);
    console.log("\n");

    // Check if the enum value already exists
    const checkQuery = `
      SELECT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'squad_leader' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
      ) as exists;
    `;

    const checkResult = await client.query(checkQuery);
    const alreadyExists = checkResult.rows[0]?.exists;

    if (alreadyExists) {
      console.log("ℹ️  The 'squad_leader' role already exists in the enum");
      console.log("✅ Migration already applied\n");
      await client.end();
      return;
    }

    // Execute the migration
    await client.query(migrationSQL);
    console.log("✅ Migration applied successfully!\n");

    // Verify the migration
    const verifyResult = await client.query(checkQuery);
    const nowExists = verifyResult.rows[0]?.exists;

    if (nowExists) {
      console.log("✅ Verification: 'squad_leader' role is now in the enum");
    } else {
      console.log("⚠️  Warning: Could not verify the migration");
    }

    await client.end();
    console.log("\n🎉 Migration completed successfully!");

  } catch (error) {
    console.error("❌ Error applying migration:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      
      // Check if it's a "already exists" error
      if (error.message.includes("already exists")) {
        console.log("\nℹ️  The enum value already exists. Migration may have been applied previously.");
      }
    }
    await client.end().catch(() => {});
    process.exit(1);
  }
}

applyMigration();

