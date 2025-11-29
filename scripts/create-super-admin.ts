/**
 * Script to create a super admin user
 * 
 * Usage:
 * 1. Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in .env.local
 * 2. Run: npx tsx scripts/create-super-admin.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;
const superAdminUsername = process.env.SUPER_ADMIN_USERNAME || "superadmin";

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing required environment variables:");
  console.error("   - NEXT_PUBLIC_SUPABASE_URL");
  console.error("   - SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

if (!superAdminEmail || !superAdminPassword) {
  console.error("❌ Missing super admin credentials:");
  console.error("   - SUPER_ADMIN_EMAIL");
  console.error("   - SUPER_ADMIN_PASSWORD");
  console.error("\nPlease add these to your .env.local file");
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
    const { data: existingDbUser } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", authUserId)
      .single();

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
        process.exit(1);
      }

      console.log("✅ User created in database");
    }

    console.log("\n✅ Super admin created successfully!");
    console.log("\n📝 Login credentials:");
    console.log(`   Email: ${superAdminEmail}`);
    console.log(`   Password: ${superAdminPassword}`);
    console.log("\n🔐 Keep these credentials secure!");
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    process.exit(1);
  }
}

createSuperAdmin();

