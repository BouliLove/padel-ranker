import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .order("elo", { ascending: false });

    if (error) {
      console.error("Error fetching players:", error.message, error.details, error.hint);
      return NextResponse.json(
        { error: "Unable to retrieve player data" }, 
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error in GET /api/players:", error);
    return NextResponse.json(
      { error: "Unable to retrieve player data at this time" }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    
    // Basic validation
    const name = body.name.trim();
    
    if (name.length < 2 || name.length > 50) {
      return NextResponse.json(
        { error: "Name must be between 2 and 50 characters" },
        { status: 400 }
      );
    }
    
    // Check for duplicate name
    const { data: existingPlayers, error: checkError } = await supabase
      .from("players")
      .select("name")
      .ilike("name", name);
      
    if (checkError) {
      console.error("Database error while checking for duplicates:", checkError);
      return NextResponse.json(
        { error: "Unable to validate player information" },
        { status: 500 }
      );
    }
    
    if (existingPlayers && existingPlayers.length > 0) {
      return NextResponse.json(
        { error: "A player with this name already exists" },
        { status: 400 }
      );
    }
    
    // Insert new player
    const { data, error } = await supabase
      .from("players")
      .insert([{
        name: name,
        elo: 1000,
        matches: 0,
        wins: 0,
      }])
      .select();
      
    if (error) {
      console.error("Database error while adding player:", error);
      if (error.code === '23505') {
        return NextResponse.json(
          { error: "This player already exists" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Unable to add player" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data[0]);
  } catch (error: any) {
    console.error("Unexpected error in POST /api/players:", error);
    if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Unable to process request" },
      { status: 500 }
    );
  }
}