"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
  const returnTo = searchParams.get("returnTo") || "/";

  useEffect(() => {
    async function verifySession() {
      const supabase = createClient();
      
      // Check if we have a session in the URL hash (from magic link)
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        router.push(`/auth/login?error=${encodeURIComponent("Session verification failed")}`);
        return;
      }

      // Session is valid, redirect to return URL
      router.push(returnTo);
    }

    verifySession();
  }, [returnTo, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-lg">Verifying session...</p>
      </div>
    </div>
  );
}

