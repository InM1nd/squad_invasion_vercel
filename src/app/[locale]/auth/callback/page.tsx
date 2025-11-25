import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authenticating...",
  description: "Completing authentication",
};

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ code?: string; next?: string; error?: string }>;
};

export default async function AuthCallbackPage({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  const { code, next, error: errorParam } = await searchParams;

  if (errorParam) {
    redirect(`/${locale}/auth/login?error=${encodeURIComponent(errorParam)}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      redirect(
        `/${locale}/auth/login?error=${encodeURIComponent(error.message)}`
      );
    }

    // After successful authentication, ensure user exists in users table
    if (data?.user) {
      const user = data.user;
      
      // Extract provider info from user metadata
      const provider = user.app_metadata?.provider || user.user_metadata?.provider || "discord";
      
      // Discord provides user data in user_metadata
      // Discord ID is usually in user_metadata.sub or user_metadata.provider_id
      const discordId = user.user_metadata?.sub || 
                       user.user_metadata?.provider_id || 
                       user.user_metadata?.discord_id ||
                       user.identities?.find((id: any) => id.provider === "discord")?.id;
      
      const steamId = user.user_metadata?.steam_id;
      
      // Generate username from Discord data or email
      const username = user.user_metadata?.preferred_username || 
                      user.user_metadata?.username || 
                      user.user_metadata?.full_name?.toLowerCase().replace(/\s+/g, "_") ||
                      user.email?.split("@")[0] || 
                      `user_${user.id.slice(0, 8)}`;
      
      // Ensure username is unique by appending user ID if needed
      let finalUsername = username;
      
      // Check if user already exists in users table
      const { data: existingUser } = await supabase
        .from("users")
        .select("id, discord_id")
        .eq("id", user.id)
        .single();

      if (!existingUser) {
        // Check if username is already taken
        const { data: usernameCheck } = await supabase
          .from("users")
          .select("id")
          .eq("username", finalUsername)
          .single();
        
        if (usernameCheck) {
          finalUsername = `${username}_${user.id.slice(0, 6)}`;
        }

        // Create user in users table
        const userData: {
          id: string;
          email: string;
          username: string;
          display_name?: string;
          discord_id?: string;
          steam_id?: string;
        } = {
          id: user.id,
          email: user.email || `${provider}_${user.id}@local.local`,
          username: finalUsername,
          display_name: user.user_metadata?.full_name || 
                       user.user_metadata?.name || 
                       user.user_metadata?.preferred_username ||
                       finalUsername,
        };

        if (discordId) {
          userData.discord_id = String(discordId);
        }

        if (steamId) {
          userData.steam_id = String(steamId);
        }

        const { error: createError } = await supabase
          .from("users")
          .insert(userData);

        if (createError) {
          console.error("Error creating user in users table:", createError);
          // Don't redirect to error page, just log it - user is still authenticated
        }
      } else {
        // Update user if they exist but missing provider ID
        const updateData: {
          discord_id?: string;
          steam_id?: string;
        } = {};

        if (discordId && !existingUser.discord_id) {
          updateData.discord_id = String(discordId);
        }

        if (steamId) {
          updateData.steam_id = String(steamId);
        }

        if (Object.keys(updateData).length > 0) {
          await supabase
            .from("users")
            .update(updateData)
            .eq("id", user.id);
        }
      }
    }

    // Redirect to the page user was trying to access, or home
    const redirectTo = next ? decodeURIComponent(next) : `/${locale}`;
    redirect(redirectTo);
  }

  // If no code, redirect to login
  redirect(`/${locale}/auth/login`);
}

