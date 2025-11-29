import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

/**
 * Link OAuth account to existing user
 * 
 * This endpoint handles linking a new OAuth provider to an existing user account.
 * Since Supabase doesn't support direct identity linking via Admin API after OAuth,
 * we need to merge the accounts by updating the new user's identity to point to the current user.
 */
export async function POST(request: NextRequest) {
  try {
    const { code, provider } = await request.json();

    if (!code || !provider) {
      return NextResponse.json(
        { error: "Code and provider are required" },
        { status: 400 }
      );
    }

    // Get current user from session
    const supabase = await createClient();
    const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();

    if (userError || !currentUser) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Use service role to exchange code for tokens
    const supabaseService = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Exchange code for session to get the new identity
    const { data: exchangeData, error: exchangeError } = await supabaseService.auth.exchangeCodeForSession(code);

    if (exchangeError || !exchangeData?.user) {
      console.error("Error exchanging code:", exchangeError);
      return NextResponse.json(
        { error: "Failed to exchange code" },
        { status: 400 }
      );
    }

    const newUser = exchangeData.user;
    const newIdentity = newUser.identities?.find((id: any) => id.provider === provider);

    if (!newIdentity) {
      return NextResponse.json(
        { error: "Identity not found in OAuth response" },
        { status: 400 }
      );
    }

    // Check if this identity is already linked to current user
    const currentUserIdentities = currentUser.identities || [];
    if (currentUserIdentities.some((id: any) => id.id === newIdentity.id && id.provider === provider)) {
      return NextResponse.json({ success: true, message: "Account already linked" });
    }

    // Check if this identity is already linked to another user
    if (newUser.id !== currentUser.id) {
      // The OAuth created a new user or different user
      // We need to merge the accounts by:
      // 1. Getting the provider ID from the new identity
      // 2. Updating the current user's metadata with the provider ID
      // 3. Deleting the new user (optional, or keep it for reference)
      
      const providerId = newIdentity.id;
      const providerIdField = provider === "discord" ? "discord_id" : provider === "google" ? "google_id" : provider === "steam" ? "steam_id" : null;

      // Update current user's metadata
      const currentProviders = currentUser.app_metadata?.providers || [];
      const updatedProviders = currentProviders.includes(provider)
        ? currentProviders
        : [...currentProviders, provider];

      const { error: updateError } = await supabaseService.auth.admin.updateUserById(currentUser.id, {
        app_metadata: {
          ...currentUser.app_metadata,
          providers: updatedProviders,
        },
        user_metadata: {
          ...currentUser.user_metadata,
          [`${provider}_id`]: providerId,
        },
      });

      if (updateError) {
        console.error("Error updating user:", updateError);
        return NextResponse.json(
          { error: "Failed to link account" },
          { status: 500 }
        );
      }

      // Update users table with provider ID
      if (providerIdField) {
        console.log(`Updating users table: ${providerIdField} = ${providerId} for user ${currentUser.id}`);
        const { data: updateData, error: dbError } = await supabase
          .from("users")
          .update({ [providerIdField]: String(providerId) })
          .eq("id", currentUser.id)
          .select();

        if (dbError) {
          console.error("Error updating users table:", dbError);
          return NextResponse.json(
            { error: `Failed to update users table: ${dbError.message}` },
            { status: 500 }
          );
        }
        
        console.log("Users table updated successfully:", updateData);
      } else {
        console.error("No providerIdField for provider:", provider);
        return NextResponse.json(
          { error: "Invalid provider" },
          { status: 400 }
        );
      }

      // Note: We can't directly link the identity to the current user via Admin API
      // The identity will remain associated with the new user, but we've stored
      // the provider ID in the current user's metadata and users table
      // This is a limitation of Supabase - identities are immutable once created
    } else {
      // Same user, just update metadata if needed
      const providerId = newIdentity.id;
      const providerIdField = provider === "discord" ? "discord_id" : provider === "google" ? "google_id" : provider === "steam" ? "steam_id" : null;

      if (providerIdField) {
        console.log(`Updating users table: ${providerIdField} = ${providerId} for user ${currentUser.id}`);
        const { data: updateData, error: dbError } = await supabase
          .from("users")
          .update({ [providerIdField]: String(providerId) })
          .eq("id", currentUser.id)
          .select();

        if (dbError) {
          console.error("Error updating users table:", dbError);
          return NextResponse.json(
            { error: `Failed to update users table: ${dbError.message}` },
            { status: 500 }
          );
        }
        
        console.log("Users table updated successfully:", updateData);
      } else {
        console.error("No providerIdField for provider:", provider);
        return NextResponse.json(
          { error: "Invalid provider" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ success: true, message: "Account linked successfully" });
  } catch (error) {
    console.error("Error linking account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

