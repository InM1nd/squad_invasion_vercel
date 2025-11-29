import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

/**
 * GET /api/events - Get list of events
 * Public endpoint - returns upcoming public events
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    // Optional filters
    const status = searchParams.get("status") || "upcoming";
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Check if user is admin (for admin endpoints, show all events)
    const { data: { user } } = await supabase.auth.getUser();
    let isAdmin = false;
    
    if (user) {
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
      
      const { data: userData } = await supabaseService
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();
      
      isAdmin = userData?.role === "admin" || userData?.role === "super_admin";
    }

    // Use service client to bypass RLS for reliable access
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

    // Build query
    let query = supabaseService
      .from("events")
      .select(`
        id,
        title,
        description,
        type,
        game_mode,
        start_date,
        end_date,
        server,
        map,
        map_image,
        team1_name,
        team1_image,
        team2_name,
        team2_image,
        max_participants,
        is_public,
        registration_open,
        status,
        created_at,
        organizer_id,
        users:organizer_id (
          id,
          username,
          display_name
        )
      `)
      .order("start_date", { ascending: true })
      .range(offset, offset + limit - 1);

    // Only filter by is_public for non-admin users
    // For admin users, show all events (public and private)
    if (!isAdmin) {
      query = query.eq("is_public", true);
    }
    // Admin users can see all events regardless of is_public

    // Filter by status
    if (status !== "all") {
      if (status === "upcoming") {
        // For "upcoming", show events with status "upcoming" OR events in the future
        // This ensures events are shown even if status wasn't updated correctly
        const now = new Date().toISOString();
        query = query.or(`status.eq.upcoming,start_date.gte.${now}`);
      } else {
        query = query.eq("status", status);
      }
    }
    // For "all", show all events regardless of status

    const { data: events, error } = await query;

    if (error) {
      console.error("Error fetching events:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      console.error("Query filters:", { status, isAdmin, limit, offset });
      return NextResponse.json(
        { error: "Failed to fetch events", details: error.message, code: error.code },
        { status: 500 }
      );
    }

    console.log(`Fetched ${events?.length || 0} events (status: ${status}, isAdmin: ${isAdmin}, limit: ${limit})`);
    
    if (events && events.length > 0) {
      console.log("Sample event:", {
        id: events[0].id,
        title: events[0].title,
        status: events[0].status,
        is_public: events[0].is_public,
        start_date: events[0].start_date,
      });
    }

    return NextResponse.json({ events: events || [] });
  } catch (error) {
    console.error("Error in events API:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/events - Create new event
 * Admin only endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if user is admin or super_admin
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

    const { data: currentUserData, error: currentUserError } = await supabaseService
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (currentUserError || !currentUserData) {
      return NextResponse.json(
        { error: "Forbidden: Access denied" },
        { status: 403 }
      );
    }

    // Allow admin and super_admin to create events
    if (currentUserData.role !== "admin" && currentUserData.role !== "super_admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log("Creating event with data:", JSON.stringify(body, null, 2));
    
    const {
      title,
      description,
      type,
      game_mode,
      start_date,
      end_date,
      server,
      map,
      map_image,
      team1_name,
      team1_image,
      team2_name,
      team2_image,
      max_participants,
      is_public,
      registration_open,
    } = body;

    // Validate required fields
    if (!title || !type || !game_mode || !start_date) {
      console.error("Missing required fields:", { title, type, game_mode, start_date });
      return NextResponse.json(
        { error: "Missing required fields: title, type, game_mode, start_date" },
        { status: 400 }
      );
    }

    const eventData = {
      title,
      description: description || null,
      type,
      game_mode,
      start_date: new Date(start_date).toISOString(),
      end_date: end_date ? new Date(end_date).toISOString() : null,
      server: server || null,
      map: map || null,
      map_image: map_image || null,
      team1_name: team1_name || null,
      team1_image: team1_image || null,
      team2_name: team2_name || null,
      team2_image: team2_image || null,
      max_participants: max_participants || 50,
      organizer_id: user.id,
      is_public: is_public !== undefined ? is_public : true,
      registration_open: registration_open !== undefined ? registration_open : true,
      status: "upcoming",
    };

    console.log("Inserting event:", JSON.stringify(eventData, null, 2));

    // Create event using service client to bypass RLS
    const { data: newEvent, error: createError } = await supabaseService
      .from("events")
      .insert(eventData)
      .select()
      .single();

    if (createError) {
      console.error("Error creating event:", createError);
      console.error("Error details:", JSON.stringify(createError, null, 2));
      return NextResponse.json(
        { error: "Failed to create event", details: createError.message, code: createError.code },
        { status: 500 }
      );
    }

    console.log("Event created successfully:", newEvent?.id);
    return NextResponse.json({ event: newEvent }, { status: 201 });
  } catch (error) {
    console.error("Error in create event API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

