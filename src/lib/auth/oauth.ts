import { createClient } from "@/lib/supabase/client";

/**
 * OAuth provider types
 */
export type OAuthProvider = "steam" | "discord" | "google";

/**
 * Initiate OAuth sign in flow
 * 
 * @param provider - OAuth provider (steam or discord)
 * @param redirectTo - Base URL to redirect after successful authentication (defaults to current origin)
 * @param locale - Locale for redirect (defaults to 'ru')
 */
export async function signInWithOAuth(
  provider: OAuthProvider,
  redirectTo: string = window.location.origin,
  locale: string = "ru"
) {
  // Steam uses custom OpenID flow, not Supabase OAuth
  if (provider === "steam") {
    const currentPath = window.location.pathname;
    // Check if we're linking an account (user is already logged in)
    const isLinking = currentPath.includes("/dashboard/settings");
    const steamAuthUrl = `/api/auth/steam?returnTo=${encodeURIComponent(currentPath)}${isLinking ? "&linkAccount=true" : ""}`;
    window.location.href = steamAuthUrl;
    return;
  }

  // Discord and Google use Supabase OAuth
  const supabase = createClient();
  const currentPath = window.location.pathname;
  
  // Check if we're linking an account (user is already logged in)
  const { data: { user } } = await supabase.auth.getUser();
  const isLinking = user !== null && currentPath.includes("/dashboard/settings");
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${redirectTo}/${locale}/auth/callback?next=${encodeURIComponent(currentPath)}${isLinking ? `&linkAccount=true&provider=${provider}` : ""}`,
      // If linking, skip email confirmation
      skipBrowserRedirect: false,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign out current user
 */
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut({
    scope: "global", // Sign out from all sessions
  });
  
  if (error) {
    throw error;
  }
  
  // Reload the page to clear any cached state
  window.location.href = window.location.origin;
}

