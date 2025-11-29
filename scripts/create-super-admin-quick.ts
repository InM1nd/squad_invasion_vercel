/**
 * Quick script to create a super admin user with default credentials
 * 
 * Usage: npx tsx scripts/create-super-admin-quick.ts
 * 
 * Default credentials:
 * Email: admin@burn.local
 * Password: admin123456
 * Username: superadmin
 * 
 * IMPORTANT: Change these credentials after first login!
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Default credentials (can be overridden by env vars)
const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || "admin@burn.local";
const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "admin123456";
const superAdminUsername = process.env.SUPER_ADMIN_USERNAME || "superadmin";

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing required environment variables:");
  console.error("   - NEXT_PUBLIC_SUPABASE_URL");
  console.error("   - SUPABASE_SERVICE_ROLE_KEY");
  console.error("\nPlease ensure these are set in your .env.local file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createSuperAdmin() {
  console.log("🚀 Creating super admin user...");
  console.log(`   Email: ${superAdminEmail}`);
  console.log(`   Username: ${superAdminUsername}`);
  console.log(`   Password: ${superAdminPassword}`);
  console.log("\n⚠️  WARNING: Using default credentials. Change them after first login!\n");

  try {
    // Check if user already exists in auth
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find((u) => u.email === superAdminEmail);

    let authUserId: string;

    if (existingUser) {
      console.log("✅ User already exists in auth, updating...");
      authUserId = existingUser.id;

      // Update user to ensure they have the correct email and password
      const { error: updateError } = await supabase.auth.admin.updateUserById(authUserId, {
        email: superAdminEmail,
        password: superAdminPassword,
        email_confirm: true,
        user_metadata: {
          role: "super_admin",
        },
        app_metadata: {
          role: "super_admin",
        },
      });

      if (updateError) {
        console.error("❌ Error updating auth user:", updateError);
        process.exit(1);
      }
      console.log("✅ Auth user updated");
    } else {
      // Create new auth user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: superAdminEmail,
        password: superAdminPassword,
        email_confirm: true,
        user_metadata: {
          role: "super_admin",
        },
        app_metadata: {
          role: "super_admin",
        },
      });

      if (createError || !newUser) {
        console.error("❌ Error creating auth user:", createError);
        process.exit(1);
      }

      authUserId = newUser.user.id;
      console.log("✅ Auth user created:", authUserId);
    }

    // Check if user exists in users table
    const { data: existingDbUser, error: fetchError } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", authUserId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("❌ Error checking user in database:", fetchError);
      process.exit(1);
    }

    if (existingDbUser) {
      // Update existing user to super_admin
      const { error: updateError } = await supabase
        .from("users")
        .update({
          role: "super_admin",
          email: superAdminEmail,
          username: superAdminUsername,
        })
        .eq("id", authUserId);

      if (updateError) {
        console.error("❌ Error updating user in database:", updateError);
        process.exit(1);
      }

      console.log("✅ User updated to super_admin in database");
    } else {
      // Create user in users table
      const { error: insertError } = await supabase.from("users").insert({
        id: authUserId,
        email: superAdminEmail,
        username: superAdminUsername,
        display_name: "Super Admin",
        role: "super_admin",
        rating: 1000,
        is_banned: false,
      });

      if (insertError) {
        console.error("❌ Error creating user in database:", insertError);
        console.error("   Details:", insertError.message);
        process.exit(1);
      }

      console.log("✅ User created in database");
    }

    console.log("\n✅ Super admin created successfully!");
    console.log("\n📝 Login credentials:");
    console.log(`   Email: ${superAdminEmail}`);
    console.log(`   Password: ${superAdminPassword}`);
    console.log(`   Username: ${superAdminUsername}`);
    console.log("\n🔐 IMPORTANT: Change these credentials after first login!");
    console.log("   You can do this by updating SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in .env.local");
    console.log("   and running this script again, or by changing password in the dashboard settings.");
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    if (error instanceof Error) {
      console.error("   Message:", error.message);
      console.error("   Stack:", error.stack);
    }
    process.exit(1);
  }
}

createSuperAdmin();

