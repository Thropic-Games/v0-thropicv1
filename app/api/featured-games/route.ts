import { getSupabaseServerClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()

    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not initialized" }, { status: 500 })
    }

    // Optimized query - only select needed fields
    const { data, error } = await supabase
      .from("game")
      .select(`
        id,
        name,
        end_date,
        status,
        donation_amount,
        partner:partner_id(name)
      `)
      .order("created_ts", { ascending: false })
      .limit(20)

    if (error) {
      console.error("Error fetching featured games:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform the data to match the expected format
    const formattedGames = data.map((game) => ({
      id: game.id,
      name: game.name,
      partner: game.partner?.name || "Unknown Partner",
      donation: game.donation_amount ? `$${Number(game.donation_amount).toLocaleString()}` : "$0",
      endDate: game.end_date ? new Date(game.end_date).toLocaleDateString() : "N/A",
      status: game.status || "Active",
    }))

    return NextResponse.json(formattedGames)
  } catch (error) {
    console.error("Unexpected error in featured games API:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
