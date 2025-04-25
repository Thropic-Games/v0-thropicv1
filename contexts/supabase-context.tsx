"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { getSupabase } from "@/lib/supabase"
import type { SupabaseClient } from "@supabase/supabase-js"

type SupabaseContextType = {
  supabase: SupabaseClient
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  // Use the singleton pattern to get the Supabase client
  const [supabase] = useState(() => getSupabase())

  return <SupabaseContext.Provider value={{ supabase }}>{children}</SupabaseContext.Provider>
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider")
  }
  return context
}
