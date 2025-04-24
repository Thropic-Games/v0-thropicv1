import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          error: {
            message: "Missing Supabase environment variables",
          },
        },
        { status: 500 },
      )
    }

    // Create a Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Test the connection by making a simple query
    const { data, error } = await supabase.from("user_order").select("count", { count: "exact" })

    if (error) {
      return NextResponse.json(
        {
          error: {
            message: `Failed to connect to Supabase: ${error.message}`,
          },
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Successfully connected to Supabase",
      count: data,
    })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json(
      {
        error: {
          message: `Error checking Supabase connection: ${errorMessage}`,
        },
      },
      { status: 500 },
    )
  }
}
