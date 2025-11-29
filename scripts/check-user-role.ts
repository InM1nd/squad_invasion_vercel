/**
 * Script to check user role in database
 * 
 * Usage: npx tsx scripts/check-user-role.ts [email]
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.argv[2] || "admin@burn.local";

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing required environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function checkUserRole() {
  console.log(`🔍 Checking user role for: ${email}\n`);

  try {
    // Find user in auth
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const authUser = authUsers?.users.find((u) => u.email === email);

    if (!authUser) {
      console.error(`❌ User with email ${email} not found in auth`);
      process.exit(1);
    }

    console.log("✅ Found in auth:");
    console.log(`   ID: ${authUser.id}`);
    console.log(`   Email: ${authUser.email}`);
    console.log(`   Created: ${authUser.created_at}`);

    // Check in users table
    const { data: dbUser, error: dbError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (dbError) {
      console.error("❌ Error fetching from users table:", dbError);
      process.exit(1);
    }

    if (!dbUser) {
      console.error("❌ User not found in users table");
      process.exit(1);
    }

    console.log("\n✅ Found in users table:");
    console.log(`   ID: ${dbUser.id}`);
    console.log(`   Email: ${dbUser.email}`);
    console.log(`   Username: ${dbUser.username}`);
    console.log(`   Role: ${dbUser.role}`);
    console.log(`   Display Name: ${dbUser.display_name || "N/A"}`);
    console.log(`   Created: ${dbUser.created_at}`);

    if (dbUser.role === "super_admin") {
      console.log("\n✅ User has super_admin role - admin features should be visible");
    } else {
      console.log(`\n⚠️  User has role: ${dbUser.role} (expected: super_admin)`);
      console.log("   To update to super_admin, run: npx tsx scripts/create-super-admin-quick.ts");
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    process.exit(1);
  }
}

checkUserRole();

