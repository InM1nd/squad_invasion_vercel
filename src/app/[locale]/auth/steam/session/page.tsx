"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Steam session creation page
 * 
 * This page receives the user ID from Steam callback and creates a session
 * using Supabase Auth's signInWithPassword or custom token approach.
 * 
 * For now, we'll use a simplified approach with service role to generate a session.
 * In production, consider using Supabase Auth's custom tokens.
 */
export default function SteamSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const returnTo = searchParams.get("returnTo") || "/";

  useEffect(() => {
    async function createSession() {
      if (!userId) {
        router.push(`/auth/login?error=${encodeURIComponent("Missing user ID")}`);
        return;
      }

      // Call API to get magic link
      try {
        const response = await fetch(`/api/auth/steam/session?userId=${userId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create session");
        }

        // If we have a magic link, redirect to it (this will auto-sign in)
        if (data.magicLink) {
          window.location.href = data.magicLink;
          return;
        }

        // Fallback: redirect to return URL
        router.push(returnTo);
      } catch (error) {
        console.error("Error creating session:", error);
        router.push(`/auth/login?error=${encodeURIComponent("Session creation failed")}`);
      }
    }

    createSession();
  }, [userId, returnTo, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-lg">Creating session...</p>
      </div>
    </div>
  );
}

