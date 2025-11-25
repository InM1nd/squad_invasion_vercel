import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

/**
 * Steam OAuth callback handler
 * 
 * Verifies Steam OpenID response and creates/updates user in Supabase
 */

const STEAM_OPENID_URL = "https://steamcommunity.com/openid/login";

interface SteamOpenIDResponse {
  "openid.ns": string;
  "openid.mode": string;
  "openid.op_endpoint": string;
  "openid.claimed_id": string;
  "openid.identity": string;
  "openid.return_to": string;
  "openid.response_nonce": string;
  "openid.assoc_handle": string;
  "openid.signed": string;
  "openid.sig": string;
}

/**
 * Extract SteamID from OpenID identity URL
 * Steam identity URL format: https://steamcommunity.com/openid/id/76561198000000000
 */
function extractSteamId(identity: string): string | null {
  const match = identity.match(/\/id\/(\d+)$/);
  return match ? match[1] : null;
}

/**
 * Verify Steam OpenID response
 */
async function verifySteamOpenID(params: URLSearchParams): Promise<boolean> {
  // Add verification parameters
  const verifyParams = new URLSearchParams(params);
  verifyParams.set("openid.mode", "check_authentication");

  try {
    const response = await fetch(STEAM_OPENID_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: verifyParams.toString(),
    });

    const text = await response.text();
    // Steam returns "ns:http://specs.openid.net/auth/2.0\nis_valid:true" on success
    return text.includes("is_valid:true");
  } catch (error) {
    console.error("Error verifying Steam OpenID:", error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const returnTo = requestUrl.searchParams.get("returnTo") || "/";
  const params = requestUrl.searchParams;

  // Check if this is a valid OpenID response
  if (params.get("openid.mode") !== "id_res") {
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent("Invalid Steam response")}`, requestUrl.origin)
    );
  }

  // Verify the OpenID response
  const isValid = await verifySteamOpenID(params);
  if (!isValid) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent("Steam authentication failed")}`, requestUrl.origin)
    );
  }

  // Extract SteamID
  const identity = params.get("openid.claimed_id") || params.get("openid.identity");
  if (!identity) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent("Steam ID not found")}`, requestUrl.origin)
    );
  }

  const steamId = extractSteamId(identity);
  if (!steamId) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent("Invalid Steam ID format")}`, requestUrl.origin)
    );
  }

  // Use service role client for admin operations
  const supabaseService = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // Generate email from Steam ID (Steam doesn't provide email)
  const email = `steam_${steamId}@steam.local`;
  const username = `steam_${steamId}`;

  // Check if user exists in auth.users
  const { data: authUsers } = await supabaseService.auth.admin.listUsers();
  let authUser = authUsers?.users.find(
    (u) => u.user_metadata?.steam_id === steamId || u.email === email
  );

  // Create or get auth user
  if (!authUser) {
    // Create user in Supabase Auth
    const { data: newAuthUser, error: createAuthError } = await supabaseService.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        steam_id: steamId,
        provider: "steam",
      },
      app_metadata: {
        provider: "steam",
        providers: ["steam"],
      },
    });

    if (createAuthError || !newAuthUser) {
      console.error("Error creating auth user:", createAuthError);
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent("Failed to create user")}`, requestUrl.origin)
      );
    }

    authUser = newAuthUser.user;
  }

  // Check if user exists in our users table
  const supabase = await createClient();
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("steam_id", steamId)
    .single();

  if (!existingUser) {
    // Create user in our users table
    const { error: createUserError } = await supabase
      .from("users")
      .insert({
        id: authUser.id,
        email: authUser.email || email,
        username,
        steam_id: steamId,
        display_name: `Steam User ${steamId}`,
      });

    if (createUserError) {
      console.error("Error creating user in users table:", createUserError);
    }
  }

  // Generate a magic link for the user to sign in
  // This is the simplest way to create a session without passwords
  const { data: linkData, error: linkError } = await supabaseService.auth.admin.generateLink({
    type: "magiclink",
    email: authUser.email || email,
    options: {
      redirectTo: `${requestUrl.origin}/auth/steam/verify?returnTo=${encodeURIComponent(returnTo)}`,
    },
  });

  if (linkError || !linkData?.properties?.action_link) {
    console.error("Error generating magic link:", linkError);
    // Fallback: redirect to session page
    return NextResponse.redirect(
      new URL(`/auth/steam/session?userId=${authUser.id}&returnTo=${encodeURIComponent(returnTo)}`, requestUrl.origin)
    );
  }

  // Redirect to magic link (this will automatically sign in the user)
  return NextResponse.redirect(linkData.properties.action_link);
}

