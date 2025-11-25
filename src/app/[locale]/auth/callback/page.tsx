"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLocale } from "next-intl";
import { AuthLoader } from "@/components/ui/auth-loader";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [error, setError] = useState<string | null>(null);
  const hasProcessedRef = { current: false };

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessedRef.current) return;

    async function handleCallback() {
      const code = searchParams.get("code");
      const next = searchParams.get("next");
      const errorParam = searchParams.get("error");
      
      hasProcessedRef.current = true;

      if (errorParam) {
        setError(errorParam);
        setStatus("error");
        setTimeout(() => {
          router.push(`/${locale}`);
        }, 2000);
        return;
      }

      if (!code) {
        setError("No authorization code provided");
        setStatus("error");
        setTimeout(() => {
          router.push(`/${locale}`);
        }, 2000);
        return;
      }

      try {
        const supabase = createClient();
        const { error: exchangeError, data } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          console.error("Error exchanging code:", exchangeError);
          setError(exchangeError.message);
          setStatus("error");
          setTimeout(() => {
            router.push(`/${locale}`);
          }, 2000);
          return;
        }

        // After successful authentication, ensure user exists in users table
        if (data?.user) {
          const user = data.user;
          
          // Extract provider info from user metadata
          const provider = user.app_metadata?.provider || user.user_metadata?.provider || "discord";
          
          // Discord provides user data in user_metadata
          const discordId = user.user_metadata?.sub || 
                           user.user_metadata?.provider_id || 
                           user.user_metadata?.discord_id ||
                           user.identities?.find((id: { provider: string; id: string }) => id.provider === "discord")?.id;
          
          const steamId = user.user_metadata?.steam_id;
          
          // Generate username from Discord data or email
          const username = user.user_metadata?.preferred_username || 
                          user.user_metadata?.username || 
                          user.user_metadata?.full_name?.toLowerCase().replace(/\s+/g, "_") ||
                          user.email?.split("@")[0] || 
                          `user_${user.id.slice(0, 8)}`;
          
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

        setStatus("success");
        
        // Redirect to the page user was trying to access, or home
        const redirectTo = next ? decodeURIComponent(next) : `/${locale}`;
        
        // Use router.push instead of window.location to avoid full page reload
        // Small delay to ensure session is fully established
        setTimeout(() => {
          router.push(redirectTo);
        }, 300);
      } catch (err) {
        console.error("Error in callback:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setStatus("error");
        setTimeout(() => {
          router.push(`/${locale}`);
        }, 2000);
      }
    }

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  if (status === "loading") {
    return <AuthLoader />;
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-destructive">Authentication failed</p>
          {error && <p className="text-sm text-muted-foreground mt-2">{error}</p>}
        </div>
      </div>
    );
  }

  return <AuthLoader />;
}
