import { getSupabaseServerClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

    const supabase = getSupabaseServerClient()

    if (!supabase) {
      return NextResponse.json(
        {
          donations: [],
          debugInfo: { error: "Supabase client not initialized" },
        },
        { status: 500 },
      )
    }

    // Optimized query - only select needed fields
    const { data: orderData, error: orderError } = await supabase
      .from("user_order")
      .select(`
        id,
        amount,
        created_ts,
        user_id,
        game_id
      `)
      .order("created_ts", { ascending: false })
      .limit(limit)

    if (orderError) {
      console.error("Error fetching user_order data:", orderError)
      return NextResponse.json(
        {
          donations: [],
          debugInfo: { error: orderError.message },
        },
        { status: 500 },
      )
    }

    // If we have order data, get the related information
    if (orderData && orderData.length > 0) {
      // Get all unique user IDs and game IDs
      const userIds = [...new Set(orderData.filter((order) => order.user_id).map((order) => order.user_id))]
      const gameIds = [...new Set(orderData.filter((order) => order.game_id).map((order) => order.game_id))]

      // Batch fetch users
      const { data: usersData } =
        userIds.length > 0 ? await supabase.from("user").select("id, name, email").in("id", userIds) : { data: [] }

      // Batch fetch games
      const { data: gamesData } =
        gameIds.length > 0 ? await supabase.from("game").select("id, name, partner_id").in("id", gameIds) : { data: [] }

      // Get all unique partner IDs
      const partnerIds = [...new Set(gamesData?.filter((game) => game.partner_id).map((game) => game.partner_id) || [])]

      // Batch fetch partners
      const { data: partnersData } =
        partnerIds.length > 0 ? await supabase.from("partner").select("id, name").in("id", partnerIds) : { data: [] }

      // Create lookup maps
      const usersMap = new Map(usersData?.map((user) => [user.id, user]) || [])
      const gamesMap = new Map(gamesData?.map((game) => [game.id, game]) || [])
      const partnersMap = new Map(partnersData?.map((partner) => [partner.id, partner]) || [])

      // Format donations
      const formattedDonations = orderData.map((order) => {
        // Get user data
        const user = order.user_id ? usersMap.get(order.user_id) : null
        const userName = user ? user.name || user.email || "Anonymous" : "Anonymous"

        // Get game data
        const game = order.game_id ? gamesMap.get(order.game_id) : null
        const gameName = game ? game.name || "Unknown Game" : "Unknown Game"

        // Get partner data
        const partner = game?.partner_id ? partnersMap.get(game.partner_id) : null
        const partnerName = partner ? partner.name || "Unknown Partner" : "Unknown Partner"

        // Format amount
        let formattedAmount = "Unknown"
        if (order.amount !== null && order.amount !== undefined) {
          const amount =
            typeof order.amount === "number"
              ? order.amount > 1000
                ? order.amount / 100
                : order.amount
              : Number.parseFloat(order.amount)

          formattedAmount = `$${amount.toLocaleString()}`
        }

        return {
          id: order.id,
          name: userName,
          amount: formattedAmount,
          game: gameName,
          partner: partnerName,
          avatar: undefined,
          date: new Date(order.created_ts).toLocaleDateString(),
        }
      })

      return NextResponse.json({
        donations: formattedDonations,
        debugInfo: {
          orderCount: orderData.length,
          userCount: usersData?.length || 0,
          gameCount: gamesData?.length || 0,
          partnerCount: partnersData?.length || 0,
        },
      })
    } else {
      // Try feathery_form as fallback
      const { data: featheryData, error: featheryError } = await supabase
        .from("feathery_form")
        .select(`
          id,
          user_name,
          email,
          amount,
          game_name,
          partner_id,
          created_ts
        `)
        .order("created_ts", { ascending: false })
        .limit(limit)

      if (featheryError) {
        console.error("Error fetching feathery_form data:", featheryError)
        return NextResponse.json(
          {
            donations: [],
            debugInfo: { error: featheryError.message },
          },
          { status: 500 },
        )
      }

      if (featheryData && featheryData.length > 0) {
        // Get all unique partner IDs
        const partnerIds = [...new Set(featheryData.filter((form) => form.partner_id).map((form) => form.partner_id))]

        // Batch fetch partners
        const { data: partnersData } =
          partnerIds.length > 0 ? await supabase.from("partner").select("id, name").in("id", partnerIds) : { data: [] }

        // Create lookup map
        const partnersMap = new Map(partnersData?.map((partner) => [partner.id, partner]) || [])

        // Format donations
        const formattedDonations = featheryData.map((form) => {
          // Get partner data
          const partner = form.partner_id ? partnersMap.get(form.partner_id) : null
          const partnerName = partner ? partner.name || "Unknown Partner" : "Unknown Partner"

          return {
            id: form.id,
            name: form.user_name || form.email?.split("@")[0] || "Anonymous",
            amount: `$${Number.parseFloat(form.amount || "0").toLocaleString()}`,
            game: form.game_name || "Unknown Game",
            partner: partnerName,
            avatar: undefined,
            date: new Date(form.created_ts).toLocaleDateString(),
          }
        })

        return NextResponse.json({
          donations: formattedDonations,
          debugInfo: {
            featheryCount: featheryData.length,
            partnerCount: partnersData?.length || 0,
          },
        })
      } else {
        // No data found in either table
        return NextResponse.json({
          donations: [],
          debugInfo: { message: "No donation data found" },
        })
      }
    }
  } catch (error) {
    console.error("Unexpected error in recent donations API:", error)
    return NextResponse.json(
      {
        donations: [],
        debugInfo: { error: "An unexpected error occurred" },
      },
      { status: 500 },
    )
  }
}
