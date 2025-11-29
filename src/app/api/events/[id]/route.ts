import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

/**
 * GET /api/events/[id] - Get event details
 * Public endpoint
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
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

    const { data: event, error } = await supabaseService
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
        updated_at,
        organizer_id,
        users:organizer_id (
          id,
          username,
          display_name
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        console.error("Event not found:", id);
        return NextResponse.json(
          { error: "Event not found" },
          { status: 404 }
        );
      }
      console.error("Error fetching event:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: "Failed to fetch event", details: error.message },
        { status: 500 }
      );
    }

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Check if event is public or user is organizer/admin
    // For admin users, always show the event
    if (!isAdmin && !event.is_public) {
      if (!user || user.id !== event.organizer_id) {
        return NextResponse.json(
          { error: "Event not found" },
          { status: 404 }
        );
      }
    }

    console.log("Event fetched successfully:", event.id);
    return NextResponse.json({ event });
  } catch (error) {
    console.error("Error in event details API:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/events/[id] - Update event
 * Admin only or event organizer
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if user is admin or event organizer
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

    // Get event to check organizer
    const { data: event, error: eventError } = await supabaseService
      .from("events")
      .select("organizer_id")
      .eq("id", id)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Check user role
    const { data: userData, error: userDataError } = await supabaseService
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userDataError || !userData) {
      return NextResponse.json(
        { error: "Forbidden: Access denied" },
        { status: 403 }
      );
    }

    // Allow admin, super_admin, or event organizer
    const isAdmin = userData.role === "admin" || userData.role === "super_admin";
    const isOrganizer = event.organizer_id === user.id;

    if (!isAdmin && !isOrganizer) {
      return NextResponse.json(
        { error: "Forbidden: Admin or organizer access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    // Only include fields that are provided
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.game_mode !== undefined) updateData.game_mode = body.game_mode;
    if (body.start_date !== undefined) updateData.start_date = new Date(body.start_date).toISOString();
    if (body.end_date !== undefined) updateData.end_date = body.end_date ? new Date(body.end_date).toISOString() : null;
    if (body.server !== undefined) updateData.server = body.server;
    if (body.map !== undefined) updateData.map = body.map;
    if (body.map_image !== undefined) updateData.map_image = body.map_image;
    if (body.team1_name !== undefined) updateData.team1_name = body.team1_name;
    if (body.team1_image !== undefined) updateData.team1_image = body.team1_image;
    if (body.team2_name !== undefined) updateData.team2_name = body.team2_name;
    if (body.team2_image !== undefined) updateData.team2_image = body.team2_image;
    if (body.max_participants !== undefined) updateData.max_participants = body.max_participants;
    if (body.is_public !== undefined) updateData.is_public = body.is_public;
    if (body.registration_open !== undefined) updateData.registration_open = body.registration_open;
    if (body.status !== undefined) updateData.status = body.status;

    updateData.updated_at = new Date().toISOString();

    const { data: updatedEvent, error: updateError } = await supabaseService
      .from("events")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating event:", updateError);
      return NextResponse.json(
        { error: "Failed to update event", details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ event: updatedEvent });
  } catch (error) {
    console.error("Error in update event API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/events/[id] - Delete event
 * Admin only or event organizer
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if user is admin or event organizer
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

    // Get event to check organizer
    const { data: event, error: eventError } = await supabaseService
      .from("events")
      .select("organizer_id")
      .eq("id", id)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Check user role
    const { data: userData, error: userDataError } = await supabaseService
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userDataError || !userData) {
      return NextResponse.json(
        { error: "Forbidden: Access denied" },
        { status: 403 }
      );
    }

    // Allow admin, super_admin, or event organizer
    const isAdmin = userData.role === "admin" || userData.role === "super_admin";
    const isOrganizer = event.organizer_id === user.id;

    if (!isAdmin && !isOrganizer) {
      return NextResponse.json(
        { error: "Forbidden: Admin or organizer access required" },
        { status: 403 }
      );
    }

    const { error: deleteError } = await supabaseService
      .from("events")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting event:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete event", details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in delete event API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

