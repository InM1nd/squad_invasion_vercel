import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

/**
 * GET /api/events/debug - Debug endpoint to check events in database
 * Shows all events without filters for debugging
 */
export async function GET(request: NextRequest) {
  try {
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

    // Get all events without any filters
    const { data: allEvents, error: allError } = await supabaseService
      .from("events")
      .select("*")
      .order("start_date", { ascending: true });

    if (allError) {
      return NextResponse.json(
        { error: "Failed to fetch events", details: allError },
        { status: 500 }
      );
    }

    // Get public events
    const { data: publicEvents, error: publicError } = await supabaseService
      .from("events")
      .select("*")
      .eq("is_public", true)
      .order("start_date", { ascending: true });

    // Get upcoming events
    const { data: upcomingEvents, error: upcomingError } = await supabaseService
      .from("events")
      .select("*")
      .eq("status", "upcoming")
      .order("start_date", { ascending: true });

    return NextResponse.json({
      total: allEvents?.length || 0,
      public: publicEvents?.length || 0,
      upcoming: upcomingEvents?.length || 0,
      allEvents: allEvents || [],
      publicEvents: publicEvents || [],
      upcomingEvents: upcomingEvents || [],
      errors: {
        all: allError,
        public: publicError,
        upcoming: upcomingError,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

