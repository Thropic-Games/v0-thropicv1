import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

// Singleton pattern for Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null

// Add back the createServerClient function that was missing
export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables")
    throw new Error("Missing Supabase environment variables")
  }

  return createClient<Database>(supabaseUrl, supabaseKey)
}

export function getSupabase() {
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
    throw new Error("Missing Supabase environment variables")
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storageKey: "thropic-auth-storage",
    },
  })

  return supabaseInstance
}

// For backward compatibility
export const supabase = getSupabase()

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Log warning if environment variables are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables are missing. Some features may not work correctly.\n" +
      "This is expected in local development if you haven't set up environment variables.",
  )
}

// For server components
export function getSupabaseServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Missing Supabase environment variables for server client")
    // Return null or a dummy client instead of throwing an error
    return null
  }

  try {
    return createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
  } catch (error) {
    console.error("Failed to initialize Supabase server client:", error)
    return null
  }
}

// For admin operations
export function getSupabaseServiceClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn("Missing Supabase environment variables for service client")
    // Return null or a dummy client instead of throwing an error
    return null
  }

  try {
    return createClient<Database>(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  } catch (error) {
    console.error("Failed to initialize Supabase service client:", error)
    return null
  }
}
