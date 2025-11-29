import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Steam OAuth handler
 * 
 * Steam uses OpenID 2.0, not OAuth 2.0, so we need custom handling.
 * 
 * Flow:
 * 1. GET /api/auth/steam - Initiate Steam login
 * 2. User authenticates on Steam
 * 3. Steam redirects back to /api/auth/steam/callback
 * 4. We verify the OpenID response and create/update user in Supabase
 */

const STEAM_OPENID_URL = "https://steamcommunity.com/openid/login";
const STEAM_API_KEY = process.env.STEAM_API_KEY;

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const returnTo = requestUrl.searchParams.get("returnTo") || "/";
  const linkAccount = requestUrl.searchParams.get("linkAccount") === "true";
  
  // Build callback URL with all necessary parameters
  const callbackUrl = new URL(`${requestUrl.origin}/api/auth/steam/callback`);
  callbackUrl.searchParams.set("returnTo", returnTo);
  if (linkAccount) {
    callbackUrl.searchParams.set("linkAccount", "true");
  }
  
  // Build Steam OpenID login URL
  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": callbackUrl.toString(),
    "openid.realm": requestUrl.origin,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  });

  const steamLoginUrl = `${STEAM_OPENID_URL}?${params.toString()}`;
  
  return NextResponse.redirect(steamLoginUrl);
}

