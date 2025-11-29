import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { canGrantAdminRights } from "@/lib/auth/permissions";

/**
 * GET /api/admin/users/[id] - Get user details
 * Admin only
 */
export async function GET(
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

    // Verify current user is admin or super_admin
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

    // Allow admin and super_admin to access
    if (currentUserData.role !== "admin" && currentUserData.role !== "super_admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Fetch user data
    const { data: userData, error: dataError } = await supabaseService
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (dataError) {
      if (dataError.code === "PGRST116") {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      console.error("Error fetching user:", dataError);
      return NextResponse.json(
        { error: "Failed to fetch user" },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error("Error in get user API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/users/[id] - Update user
 * Admin only
 * Only super_admin can grant admin rights
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

    // Verify current user is admin or super_admin
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

    // Allow admin and super_admin to access
    if (currentUserData.role !== "admin" && currentUserData.role !== "super_admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    // Check if trying to change role to admin or super_admin
    if (body.role !== undefined) {
      const newRole = body.role;
      const isAdminRole = newRole === "admin" || newRole === "super_admin";
      
      // Only super_admin can grant admin rights
      if (isAdminRole && !canGrantAdminRights({ id: user.id, role: currentUserData.role })) {
        return NextResponse.json(
          { error: "Forbidden: Only super_admin can grant admin rights" },
          { status: 403 }
        );
      }

      // Prevent changing own role to non-admin if you're the only admin
      if (id === user.id && isAdminRole === false) {
        // Check if there are other admins
        const { data: otherAdmins } = await supabaseService
          .from("users")
          .select("id")
          .in("role", ["admin", "super_admin"])
          .neq("id", user.id)
          .limit(1);

        if (!otherAdmins || otherAdmins.length === 0) {
          return NextResponse.json(
            { error: "Cannot remove admin rights: you are the only admin" },
            { status: 400 }
          );
        }
      }

      updateData.role = newRole;
    }

    // Only include fields that are provided
    if (body.display_name !== undefined) updateData.display_name = body.display_name;
    if (body.username !== undefined) {
      // Check if username is already taken
      const { data: existingUser } = await supabaseService
        .from("users")
        .select("id")
        .eq("username", body.username)
        .neq("id", id)
        .single();

      if (existingUser) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 }
        );
      }

      updateData.username = body.username;
    }
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.rating !== undefined) updateData.rating = body.rating;
    if (body.is_banned !== undefined) updateData.is_banned = body.is_banned;
    if (body.banned_until !== undefined) {
      updateData.banned_until = body.banned_until ? new Date(body.banned_until).toISOString() : null;
    }
    if (body.ban_reason !== undefined) updateData.ban_reason = body.ban_reason;

    updateData.updated_at = new Date().toISOString();

    const { data: updatedUser, error: updateError } = await supabaseService
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating user:", updateError);
      return NextResponse.json(
        { error: "Failed to update user", details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error in update user API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

