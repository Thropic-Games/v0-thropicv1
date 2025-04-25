"use server"

import { getSupabaseServerClient } from "@/lib/supabase"

export async function getRecentDonations(limit = 10) {
  try {
    const supabase = getSupabaseServerClient()

    // Try to get donations from user_order table
    const { data: orderData, error: orderError } = await supabase
      .from("user_order")
      .select("*")
      .order("created_ts", { ascending: false })
      .limit(limit)

    if (orderError) {
      console.error("Error fetching user_order data:", orderError)
      throw orderError
    }

    if (orderData && orderData.length > 0) {
      // Process order data
      const formattedDonations = []

      for (const order of orderData) {
        // Get user data
        let userName = "Anonymous"
        if (order.user_id) {
          const { data: userData } = await supabase.from("user").select("name, email").eq("id", order.user_id).single()

          if (userData) {
            userName = userData.name || userData.email || "Anonymous"
          }
        }

        // Get game data
        let gameName = "Unknown Game"
        let partnerName = "Unknown Partner"
        if (order.game_id) {
          const { data: gameData } = await supabase
            .from("game")
            .select("name, partner_id")
            .eq("id", order.game_id)
            .single()

          if (gameData) {
            gameName = gameData.name || "Unknown Game"

            // Get partner data
            if (gameData.partner_id) {
              const { data: partnerData } = await supabase
                .from("partner")
                .select("name")
                .eq("id", gameData.partner_id)
                .single()

              if (partnerData) {
                partnerName = partnerData.name || "Unknown Partner"
              }
            }
          }
        }

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

        formattedDonations.push({
          id: order.id,
          name: userName,
          amount: formattedAmount,
          game: gameName,
          partner: partnerName,
          date: new Date(order.created_ts).toLocaleDateString(),
        })
      }

      return { donations: formattedDonations, source: "user_order" }
    }

    // If no user_order data, try feathery_form
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
      throw featheryError
    }

    if (featheryData && featheryData.length > 0) {
      const formattedDonations = []

      for (const form of featheryData) {
        let partnerName = "Unknown Partner"
        if (form.partner_id) {
          const { data: partnerData } = await supabase.from("partner").select("name").eq("id", form.partner_id).single()

          if (partnerData) {
            partnerName = partnerData.name || "Unknown Partner"
          }
        }

        formattedDonations.push({
          id: form.id,
          name: form.user_name || form.email?.split("@")[0] || "Anonymous",
          amount: `$${Number.parseFloat(form.amount || "0").toLocaleString()}`,
          game: form.game_name || "Unknown Game",
          partner: partnerName,
          date: new Date(form.created_ts).toLocaleDateString(),
        })
      }

      return { donations: formattedDonations, source: "feathery_form" }
    }

    // No data found in either table
    return { donations: [], source: "none" }
  } catch (error) {
    console.error("Error in getRecentDonations:", error)
    return {
      donations: [],
      source: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
