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
 * 
 * For OpenID 2.0 verification, we need to send back all the parameters
 * from the response, changing only openid.mode to "check_authentication"
 */
async function verifySteamOpenID(params: URLSearchParams): Promise<boolean> {
  // Get the list of signed parameters
  const signedParams = params.get("openid.signed")?.split(",") || [];
  
  // Create a new URLSearchParams to build the verification request
  // We'll copy all openid.* parameters and change only the mode
  const verifyParams = new URLSearchParams();
  
  // Copy all openid.* parameters exactly as received
  // URLSearchParams handles encoding automatically, but we need to preserve values
  for (const [key, value] of params.entries()) {
    if (key.startsWith("openid.") && key !== "openid.mode") {
      verifyParams.append(key, value);
    }
  }
  
  // Set mode to check_authentication (this replaces any existing mode)
  verifyParams.set("openid.mode", "check_authentication");

  try {
    // Convert to form-encoded string
    // URLSearchParams.toString() will properly encode the parameters
    const body = verifyParams.toString();
    
    console.log("Sending verification request to Steam...");
    console.log("Body length:", body.length);
    
    const response = await fetch(STEAM_OPENID_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "*/*",
      },
      body,
    });

    if (!response.ok) {
      console.error("Steam verification response not OK:", response.status, response.statusText);
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      return false;
    }

    const text = await response.text();
    console.log("Steam verification response received, length:", text.length);
    
    // Steam returns "ns:http://specs.openid.net/auth/2.0\nis_valid:true" on success
    const isValid = text.includes("is_valid:true");
    
    if (!isValid) {
      console.error("Steam verification failed. Response:", text.substring(0, 500));
      console.error("Verification params count:", verifyParams.toString().split("&").length);
      console.error("Signed params:", signedParams);
    } else {
      console.log("Steam verification successful!");
    }
    
    return isValid;
  } catch (error) {
    console.error("Error verifying Steam OpenID:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }
    return false;
  }
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const returnTo = requestUrl.searchParams.get("returnTo") || "/";
  const linkAccount = requestUrl.searchParams.get("linkAccount") === "true";
  
  // Extract locale from returnTo or default to 'ru'
  const localeMatch = returnTo.match(/\/(ru|en)(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : "ru";

  // Create URLSearchParams from the original query string to preserve encoding
  // This is important for OpenID verification
  const params = new URLSearchParams(requestUrl.search);

  // Check if this is a valid OpenID response
  if (params.get("openid.mode") !== "id_res") {
    console.error("Invalid Steam response mode:", params.get("openid.mode"));
    return NextResponse.redirect(
      new URL(`/${locale}?error=${encodeURIComponent("Invalid Steam response")}`, requestUrl.origin)
    );
  }

  // Log received parameters for debugging
  console.log("Steam callback received. OpenID mode:", params.get("openid.mode"));
  console.log("Return to from Steam:", params.get("openid.return_to"));

  // Verify the OpenID response
  const isValid = await verifySteamOpenID(params);
  if (!isValid) {
    console.error("Steam OpenID verification failed.");
    console.error("Received params:", Object.fromEntries(params.entries()));
    return NextResponse.redirect(
      new URL(`/${locale}?error=${encodeURIComponent("Steam authentication failed")}`, requestUrl.origin)
    );
  }
  
  console.log("Steam OpenID verification successful");

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
      new URL(`/${locale}?error=${encodeURIComponent("Invalid Steam ID format")}`, requestUrl.origin)
    );
  }

  // If linking account, check if user is already logged in
  if (linkAccount) {
    const supabase = await createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (currentUser) {
      // Update existing user with Steam ID
      const { error: updateError } = await supabase
        .from("users")
        .update({ steam_id: steamId })
        .eq("id", currentUser.id);
      
      if (updateError) {
        console.error("Error linking Steam account:", updateError);
        return NextResponse.redirect(
          new URL(`/${locale}/dashboard/settings?error=${encodeURIComponent("Failed to link Steam account")}`, requestUrl.origin)
        );
      }
      
      // Redirect back to settings
      return NextResponse.redirect(
        new URL(`/${locale}/dashboard/settings`, requestUrl.origin)
      );
    }
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
  
  // Try to get Steam username from Steam API
  let steamUsername = `steam_${steamId}`;
  let steamDisplayName = `Steam User ${steamId}`;
  
  if (process.env.STEAM_API_KEY) {
    try {
      const steamApiResponse = await fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${steamId}`
      );
      
      if (steamApiResponse.ok) {
        const steamData = await steamApiResponse.json();
        const player = steamData.response?.players?.[0];
        
        if (player?.personaname) {
          steamDisplayName = player.personaname;
          // Use persona name as username, but sanitize it
          steamUsername = player.personaname.toLowerCase().replace(/[^a-z0-9_]/g, "_").substring(0, 32) || `steam_${steamId}`;
        }
      }
    } catch (error) {
      console.error("Error fetching Steam profile:", error);
      // Continue with default username
    }
  }
  
  const username = steamUsername;

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
        new URL(`/${locale}?error=${encodeURIComponent("Failed to create user")}`, requestUrl.origin)
      );
    }

    authUser = newAuthUser.user;
  }

  // Check if user exists in our users table
  const supabase = await createClient();
  const { data: existingUser } = await supabase
    .from("users")
    .select("id, steam_id, display_name")
    .eq("id", authUser.id)
    .single();

  if (!existingUser) {
    // Check if steam_id is already taken by another user
    const { data: steamUser } = await supabase
      .from("users")
      .select("id")
      .eq("steam_id", steamId)
      .single();

    if (steamUser) {
      console.error("Steam ID already linked to another account");
      return NextResponse.redirect(
        new URL(`/${locale}?error=${encodeURIComponent("Steam account already linked")}`, requestUrl.origin)
      );
    }

    // Create user in our users table
    const { error: createUserError } = await supabase
      .from("users")
      .insert({
        id: authUser.id,
        email: authUser.email || email,
        username,
        steam_id: steamId,
        display_name: steamDisplayName,
      });

    if (createUserError) {
      console.error("Error creating user in users table:", createUserError);
    }
  } else if (!existingUser.steam_id) {
    // Update existing user with Steam ID if missing
    const { error: updateError } = await supabase
      .from("users")
      .update({ steam_id: steamId, display_name: steamDisplayName })
      .eq("id", authUser.id);
    
    if (updateError) {
      console.error("Error updating user with Steam ID:", updateError);
    }
  } else {
    // Update display name if it's still the default
    if (existingUser.display_name?.startsWith("Steam User")) {
      const { error: updateError } = await supabase
        .from("users")
        .update({ display_name: steamDisplayName })
        .eq("id", authUser.id);
      
      if (updateError) {
        console.error("Error updating display name:", updateError);
      }
    }
  }

  // Generate a magic link for the user to sign in
  // This is the simplest way to create a session without passwords
  const { data: linkData, error: linkError } = await supabaseService.auth.admin.generateLink({
    type: "magiclink",
    email: authUser.email || email,
    options: {
      redirectTo: `${requestUrl.origin}/${locale}/auth/steam/verify?returnTo=${encodeURIComponent(returnTo)}`,
    },
  });

  if (linkError || !linkData?.properties?.action_link) {
    console.error("Error generating magic link:", linkError);
    // Fallback: redirect to session page
    return NextResponse.redirect(
      new URL(`/${locale}/auth/steam/session?userId=${authUser.id}&returnTo=${encodeURIComponent(returnTo)}`, requestUrl.origin)
    );
  }

  // Redirect to magic link (this will automatically sign in the user)
  return NextResponse.redirect(linkData.properties.action_link);
}

