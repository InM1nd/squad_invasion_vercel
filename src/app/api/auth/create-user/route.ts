import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

/**
 * Create user in users table
 * 
 * This endpoint uses service role to bypass RLS and create users.
 * It should only be called from authenticated contexts.
 */
export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();

    if (!userData.id || !userData.email || !userData.username) {
      return NextResponse.json(
        { error: "Missing required fields: id, email, username" },
        { status: 400 }
      );
    }

    // Use service role to bypass RLS
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

    // Check if user already exists
    const { data: existingUser } = await supabaseService
      .from("users")
      .select("id")
      .eq("id", userData.id)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { success: true, message: "User already exists", user: existingUser },
        { status: 200 }
      );
    }

    // Create user
    const { data: insertedUser, error: createError } = await supabaseService
      .from("users")
      .insert(userData)
      .select()
      .single();

    if (createError) {
      console.error("Error creating user:", createError);
      return NextResponse.json(
        { 
          error: "Failed to create user",
          details: createError.message,
          code: createError.code
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "User created successfully",
      user: insertedUser 
    });
  } catch (error) {
    console.error("Error in create-user API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

