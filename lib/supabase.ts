import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Check if the required environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Check your .env file or environment configuration.")
}

// Create the Supabase client
export const supabase = createClient<Database>(supabaseUrl || "", supabaseAnonKey || "")

// Export a function to get a new client instance (useful for server components)
export function getSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  )
}
