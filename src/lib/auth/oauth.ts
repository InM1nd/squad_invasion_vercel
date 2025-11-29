import { createClient } from "@/lib/supabase/client";

/**
 * OAuth provider types
 */
export type OAuthProvider = "steam" | "discord" | "google";

/**
 * Get the base URL for redirects
 * Always uses current window.location.origin to automatically detect environment
 * 
 * This ensures that:
 * - On localhost → uses http://localhost:3000
 * - On production → uses https://squad-invasion.vercel.app
 * 
 * IMPORTANT: Both URLs must be added to Supabase Redirect URLs list
 * 
 * NOTE: We NEVER use NEXT_PUBLIC_SITE_URL in client code to ensure
 * the correct URL is always used based on where the code is running
 */
function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // CRITICAL: Always use current origin - never use env variable in client
    // This ensures localhost works when developing locally
    // and production URL works when deployed
    return window.location.origin;
  }
  
  // Fallback for SSR (shouldn't happen in OAuth flow, but just in case)
  // Default to localhost for SSR - this should never be used in OAuth flow
  return "http://localhost:3000";
}

/**
 * Initiate OAuth sign in flow
 * 
 * @param provider - OAuth provider (steam or discord)
 * @param redirectTo - Base URL to redirect after successful authentication (defaults to current origin or NEXT_PUBLIC_SITE_URL)
 * @param locale - Locale for redirect (defaults to 'ru')
 */
export async function signInWithOAuth(
  provider: OAuthProvider,
  redirectTo?: string,
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
  
  // Use provided redirectTo or get base URL
  const baseUrl = redirectTo || getBaseUrl();
  const redirectUrl = `${baseUrl}/${locale}/auth/callback?next=${encodeURIComponent(currentPath)}${isLinking ? `&linkAccount=true&provider=${provider}` : ""}`;
  
  // Debug logging
  console.log("🔐 OAuth redirect URL:", {
    provider,
    baseUrl,
    currentOrigin: window.location.origin,
    redirectUrl,
    isLinking,
  });
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl,
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

