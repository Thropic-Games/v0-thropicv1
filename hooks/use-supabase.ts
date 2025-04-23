"use client"

import { useState, useEffect } from "react"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

export function useSupabase() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only initialize in the browser
    if (typeof window === "undefined") return

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
          "Supabase URL or Anon Key is missing. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
        )
      }

      const client = createClient(supabaseUrl, supabaseAnonKey)
      setSupabase(client)
      setLoading(false)
    } catch (err) {
      console.error("Error initializing Supabase client:", err)
      setError(err instanceof Error ? err : new Error("Failed to initialize Supabase client"))
      setLoading(false)
    }
  }, [])

  return { supabase, error, loading }
}
