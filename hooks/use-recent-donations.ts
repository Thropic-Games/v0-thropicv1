"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "./use-supabase"

export interface Donation {
  id: string
  name: string
  amount: string
  game: string
  partner: string
  avatar?: string
  date: string
}

export function useRecentDonations(limit = 10) {
  const { supabase, error: supabaseError, loading: supabaseLoading } = useSupabase()
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    // Don't try to fetch data if Supabase isn't initialized yet
    if (supabaseLoading) {
      console.log("Supabase is still loading, waiting...")
      return
    }

    // If there was an error initializing Supabase, set that as our error
    if (supabaseError) {
      console.error("Supabase initialization error:", supabaseError)
      setError(supabaseError)
      setLoading(false)
      return
    }

    // If supabase is null, set an error
    if (!supabase) {
      console.error("Supabase client is null")
      setError(new Error("Supabase client is null"))
      setLoading(false)
      return
    }

    console.log("Supabase initialized, fetching donations...")

    async function fetchRecentDonations() {
      try {
        console.log("Fetching recent donations...")

        // First, let's try a simpler query to see if we get any data
        const { data: orderData, error: orderError } = await supabase
          .from("user_order")
          .select("*")
          .order("created_ts", { ascending: false })
          .limit(limit)

        if (orderError) {
          console.error("Error fetching user_order data:", orderError)
          throw orderError
        }

        console.log("Raw user_order data:", orderData?.length || 0, "records")
        setDebugInfo({ orderData })

        // If we have order data, let's try to get the related information
        if (orderData && orderData.length > 0) {
          const formattedDonations = await Promise.all(
            orderData.map(async (order) => {
              // Get user data
              let userName = "Anonymous"
              if (order.user_id) {
                const { data: userData } = await supabase
                  .from("user")
                  .select("name, email")
                  .eq("id", order.user_id)
                  .single()

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

              // Format the amount - handle different possible formats
              let formattedAmount = "Unknown"
              if (order.amount !== null && order.amount !== undefined) {
                // Check if amount is already in dollars or in cents
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
            }),
          )

          console.log("Formatted donations:", formattedDonations.length)
          setDonations(formattedDonations)
        } else {
          // If no user_order data, try feathery_form as a fallback
          console.log("No user_order data found, trying feathery_form...")
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

          console.log("Raw feathery_form data:", featheryData?.length || 0, "records")

          if (featheryData && featheryData.length > 0) {
            const formattedDonations = await Promise.all(
              featheryData.map(async (form) => {
                let partnerName = "Unknown Partner"
                if (form.partner_id) {
                  const { data: partnerData } = await supabase
                    .from("partner")
                    .select("name")
                    .eq("id", form.partner_id)
                    .single()

                  if (partnerData) {
                    partnerName = partnerData.name || "Unknown Partner"
                  }
                }

                return {
                  id: form.id,
                  name: form.user_name || form.email?.split("@")[0] || "Anonymous",
                  amount: `$${Number.parseFloat(form.amount || "0").toLocaleString()}`,
                  game: form.game_name || "Unknown Game",
                  partner: partnerName,
                  avatar: undefined,
                  date: new Date(form.created_ts).toLocaleDateString(),
                }
              }),
            )

            console.log("Formatted feathery donations:", formattedDonations.length)
            setDonations(formattedDonations)
          } else {
            console.log("No data found in either table")
            // No data found in either table
            setDonations([])
          }
        }
      } catch (err) {
        console.error("Error in useRecentDonations:", err)
        setError(err instanceof Error ? err : new Error("Unknown error occurred"))
      } finally {
        setLoading(false)
      }
    }

    fetchRecentDonations()
  }, [limit, supabase, supabaseError, supabaseLoading])

  return {
    donations,
    loading: loading || supabaseLoading,
    error,
    debugInfo,
    supabaseStatus: {
      initialized: !!supabase,
      error: supabaseError,
      loading: supabaseLoading,
    },
  }
}
