import { createClient } from "@/lib/supabase/client";

/**
 * OAuth provider types
 */
export type OAuthProvider = "steam" | "discord";

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
  const supabase = createClient();
  
  // Get current pathname for redirect after auth
  const currentPath = window.location.pathname;
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${redirectTo}/${locale}/auth/callback?next=${encodeURIComponent(currentPath)}`,
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
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
}

