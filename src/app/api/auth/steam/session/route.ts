import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

/**
 * Create Supabase Auth session for Steam user
 * 
 * This endpoint generates a magic link for the user to sign in.
 * The magic link will automatically create a session when clicked.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const userId = requestUrl.searchParams.get("userId");
  const returnTo = requestUrl.searchParams.get("returnTo") || "/";
  const locale = requestUrl.searchParams.get("locale") || "ru";

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  // Use service role to generate magic link
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

  try {
    // Get user data
    const { data: userData, error: userError } = await supabaseService.auth.admin.getUserById(userId);
    
    if (userError || !userData?.user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Generate a magic link that will auto-sign in the user
    // This is the simplest way to create a session without passwords
    const { data: linkData, error: linkError } = await supabaseService.auth.admin.generateLink({
      type: "magiclink",
      email: userData.user.email!,
      options: {
        redirectTo: `${requestUrl.origin}/${locale}/auth/steam/verify?returnTo=${encodeURIComponent(returnTo)}`,
      },
    });

    if (linkError || !linkData?.properties?.action_link) {
      console.error("Error generating magic link:", linkError);
      return NextResponse.json(
        { error: "Failed to generate session link" },
        { status: 500 }
      );
    }

    // Return the magic link - client will redirect to it
    return NextResponse.json({
      magicLink: linkData.properties.action_link,
      userId,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

