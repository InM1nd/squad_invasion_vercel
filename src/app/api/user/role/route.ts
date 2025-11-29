import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

/**
 * Get current user's role
 * This endpoint uses service role key to bypass RLS
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Use service role client to bypass RLS
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

    const { data: userData, error: dataError } = await supabaseService
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (dataError) {
      console.error("Error fetching user role:", dataError);
      return NextResponse.json(
        { error: "Failed to fetch user role" },
        { status: 500 }
      );
    }

    return NextResponse.json({ role: userData?.role || "user" });
  } catch (error) {
    console.error("Error in role API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

