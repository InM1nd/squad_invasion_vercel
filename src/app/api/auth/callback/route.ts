import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * OAuth callback handler
 * 
 * This route handles OAuth callbacks from Supabase.
 * Supabase redirects here after successful OAuth authentication.
 * 
 * Note: The actual callback page is at /[locale]/auth/callback
 * This API route is kept for backward compatibility if needed.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";
  const error = requestUrl.searchParams.get("error");

  if (error) {
    // Redirect to login with error
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error: authError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!authError) {
      // Redirect to the page user was trying to access, or home
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // If there's an error or no code, redirect to login with error message
  return NextResponse.redirect(
    new URL(`/auth/login?error=${encodeURIComponent("Authentication failed")}`, request.url)
  );
}

