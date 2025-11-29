"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { AuthLoader } from "@/components/ui/auth-loader";

/**
 * Steam verification page
 * 
 * This page handles the magic link callback from Supabase.
 * After the user clicks the magic link, Supabase redirects here
 * and we can extract the session from the URL hash.
 */
export default function SteamVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const returnTo = searchParams.get("returnTo") || `/${locale}`;

  useEffect(() => {
    async function verifySession() {
      const supabase = createClient();
      
      // Extract tokens from URL hash (Supabase magic links put tokens in hash)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const errorParam = hashParams.get("error");
      
      if (errorParam) {
        console.error("Auth error in hash:", errorParam);
        router.push(`/${locale}?error=${encodeURIComponent("Authentication failed")}`);
        return;
      }
      
      // If we have tokens in the hash, set the session
      if (accessToken && refreshToken) {
        const { data: { session }, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        
        if (error || !session) {
          console.error("Error setting session:", error);
          router.push(`/${locale}?error=${encodeURIComponent("Session verification failed")}`);
          return;
        }
        
        // Clear the hash from URL
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        
        // Session is valid, redirect to return URL
        router.push(returnTo);
        return;
      }
      
      // Fallback: try to get existing session
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        console.error("No session found. Hash:", window.location.hash);
        router.push(`/${locale}?error=${encodeURIComponent("Session verification failed")}`);
        return;
      }

      // Session is valid, redirect to return URL
      router.push(returnTo);
    }

    verifySession();
  }, [returnTo, router, locale]);

  return <AuthLoader />;
}

