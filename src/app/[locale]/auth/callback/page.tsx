"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLocale } from "next-intl";
import { AuthLoader } from "@/components/ui/auth-loader";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const hasProcessedRef = { current: false };

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessedRef.current) return;

    async function handleCallback() {
      const code = searchParams.get("code");
      const next = searchParams.get("next");
      const errorParam = searchParams.get("error");
      const linkAccount = searchParams.get("linkAccount") === "true";
      
      hasProcessedRef.current = true;

      if (errorParam) {
        console.error("Auth error:", errorParam);
        // Show loader and redirect without showing error message
        setTimeout(() => {
          router.push(`/${locale}`);
        }, 1500);
        return;
      }

      if (!code) {
        console.error("No authorization code provided");
        // Show loader and redirect without showing error message
        setTimeout(() => {
          router.push(`/${locale}`);
        }, 1500);
        return;
      }

      try {
        const supabase = createClient();
        
        // If linking account, check if user is already logged in
        if (linkAccount) {
          const { data: { user: currentUser }, error: currentUserError } = await supabase.auth.getUser();
          if (currentUser && !currentUserError) {
            // User is already logged in, we need to link the new provider
            // Use server API to link the account properly
            
            // Determine provider from the callback URL
            const provider = searchParams.get("provider") || 
                            (next?.includes("discord") ? "discord" : 
                             next?.includes("google") ? "google" : "discord");
            
            try {
              // Call server API to link the account
              const linkResponse = await fetch("/api/auth/link-account", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ code, provider }),
              });

              const linkData = await linkResponse.json();

              if (!linkResponse.ok) {
                console.error("Error linking account:", linkData.error);
                setTimeout(() => {
                  router.push(`/${locale}/dashboard/settings?error=${encodeURIComponent(linkData.error || "Failed to link account")}`);
                }, 500);
                return;
              }

              // Account linked successfully, refresh session to get updated identities
              await supabase.auth.refreshSession();
              
              // Redirect to settings
              setTimeout(() => {
                router.push(`/${locale}/dashboard/settings`);
              }, 500);
              return;
            } catch (linkError) {
              console.error("Error in link account API:", linkError);
              setTimeout(() => {
                router.push(`/${locale}/dashboard/settings?error=${encodeURIComponent("Failed to link account")}`);
              }, 500);
              return;
            }
          }
        }
        
        // Supabase automatically handles the code exchange when we call getSession()
        // This is the recommended way for OAuth callbacks with PKCE
        // The code_verifier is stored in sessionStorage by Supabase during OAuth initiation
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        let user;
        
        if (sessionError || !session) {
          console.error("Error getting session:", sessionError);
          // Try to exchange code manually as fallback (but this might fail without code_verifier)
          console.log("Attempting manual code exchange...");
          const { error: exchangeError, data } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError || !data?.user) {
            console.error("Error exchanging code:", exchangeError);
            console.error("This might be due to missing code_verifier for PKCE");
            setTimeout(() => {
              router.push(`/${locale}`);
            }, 1500);
            return;
          }
          
          user = data.user;
        } else {
          // Get user from session
          user = session.user;
        }

        if (!user) {
          console.error("No user found after authentication");
          setTimeout(() => {
            router.push(`/${locale}`);
          }, 1500);
          return;
        }

        // After successful authentication, ensure user exists in users table
        console.log("User authenticated:", user.id, user.email);
        
        // Extract provider IDs from identities
        interface Identity {
          provider: string;
          id: string;
        }
        const identities: Identity[] = user.identities || [];
          
          // Extract provider info from user metadata or identities
          // If no OAuth provider, it's email/password registration
          const hasOAuthProvider = identities.length > 0 && identities.some((id: Identity) => 
            id.provider === "discord" || id.provider === "google" || id.provider === "steam"
          );
          const provider = hasOAuthProvider 
            ? (user.app_metadata?.provider || user.user_metadata?.provider || identities[0]?.provider || "discord")
            : "email";
          const discordIdentity = identities.find((id: Identity) => id.provider === "discord");
          const googleIdentity = identities.find((id: Identity) => id.provider === "google");
          const steamIdentity = identities.find((id: Identity) => id.provider === "steam");
          
          // Discord provides user data in user_metadata
          const discordId = discordIdentity?.id || 
                           user.user_metadata?.sub || 
                           user.user_metadata?.provider_id || 
                           user.user_metadata?.discord_id;
          
          // Google provides user data in identities (sub is the Google user ID)
          const googleId = googleIdentity?.id || 
                          (provider === "google" ? user.user_metadata?.sub : null);
          
          const steamId = user.user_metadata?.steam_id || steamIdentity?.id;
          
          // Generate username from provider data or email
          const username = user.user_metadata?.preferred_username || 
                          user.user_metadata?.username || 
                          user.user_metadata?.name?.toLowerCase().replace(/\s+/g, "_") ||
                          user.user_metadata?.full_name?.toLowerCase().replace(/\s+/g, "_") ||
                          user.email?.split("@")[0] || 
                          `user_${user.id.slice(0, 8)}`;
          
          let finalUsername = username;
          
          // Check if user already exists in users table
          console.log("Checking if user exists in users table:", user.id);
          const { data: existingUser, error: fetchError } = await supabase
            .from("users")
            .select("id, discord_id, steam_id")
            .eq("id", user.id)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            // PGRST116 means no rows found, which is expected for new users
            console.error("Error fetching existing user:", fetchError);
          }

          if (!existingUser) {
            console.log("User does not exist in users table, creating new user...");
            console.log("User data:", {
              id: user.id,
              email: user.email,
              provider,
              discordId,
              googleId,
              steamId,
              username: finalUsername,
            });

            // Check if username is already taken
            const { data: usernameCheck } = await supabase
              .from("users")
              .select("id")
              .eq("username", finalUsername)
              .single();
            
            if (usernameCheck) {
              finalUsername = `${username}_${user.id.slice(0, 6)}`;
              console.log("Username taken, using:", finalUsername);
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

            // Note: google_id column might not exist in database yet
            // Uncomment when migration is applied:
            // if (googleId) {
            //   userData.google_id = String(googleId);
            // }

            if (steamId) {
              userData.steam_id = String(steamId);
            }

            console.log("Inserting user data:", userData);
            
            // Use server API to create user (bypasses RLS)
            try {
              const createResponse = await fetch("/api/auth/create-user", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
              });

              const createResult = await createResponse.json();

              if (!createResponse.ok) {
                console.error("❌ Error creating user via API:", createResult);
                
                // If it's a unique constraint violation, user might already exist
                if (createResult.code === '23505') {
                  console.log("User might already exist, trying to fetch...");
                  const { data: existingUserAfterError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("id", user.id)
                    .single();
                  
                  if (existingUserAfterError) {
                    console.log("✅ User found after error:", existingUserAfterError);
                  }
                }
              } else {
                console.log("✅ User created successfully via API:", createResult.user);
              }
            } catch (apiError) {
              console.error("❌ Error calling create-user API:", apiError);
              
              // Fallback: try direct insert (might fail due to RLS)
              const { data: insertedUser, error: createError } = await supabase
                .from("users")
                .insert(userData)
                .select()
                .single();

              if (createError) {
                console.error("❌ Fallback insert also failed:", createError);
              } else {
                console.log("✅ User created via fallback:", insertedUser);
              }
            }
          } else {
            console.log("User already exists in users table, updating if needed...");
            // Update user if they exist but missing provider ID
            // This handles account linking - when user connects a new provider
            const updateData: {
              discord_id?: string;
              steam_id?: string;
            } = {};

            if (discordId && !existingUser.discord_id) {
              updateData.discord_id = String(discordId);
            }

            // Note: google_id column might not exist in database yet
            // Uncomment when migration is applied:
            // if (googleId && !existingUser.google_id) {
            //   updateData.google_id = String(googleId);
            // }

            if (steamId && !existingUser.steam_id) {
              updateData.steam_id = String(steamId);
            }

            if (Object.keys(updateData).length > 0) {
              console.log("Updating user with provider IDs:", updateData);
              const { data: updatedUser, error: updateError } = await supabase
                .from("users")
                .update(updateData)
                .eq("id", user.id)
                .select();

              if (updateError) {
                console.error("Error updating user:", updateError);
              } else {
                console.log("User updated successfully:", updatedUser);
              }
            } else {
              console.log("No updates needed for user");
            }
          }

        // Redirect to the page user was trying to access, or home
        const redirectTo = next ? decodeURIComponent(next) : `/${locale}`;
        
        // Use router.push instead of window.location to avoid full page reload
        // Small delay to ensure session is fully established
        setTimeout(() => {
          router.push(redirectTo);
        }, 300);
      } catch (err) {
        console.error("Error in callback:", err);
        // Show loader and redirect without showing error message
        setTimeout(() => {
          router.push(`/${locale}`);
        }, 1500);
      }
    }

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Always show loader, even on error - redirect will happen automatically
  return <AuthLoader />;
}
