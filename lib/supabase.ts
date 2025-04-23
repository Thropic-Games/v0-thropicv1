import { createClient } from "@supabase/supabase-js"

// Create a singleton instance for the browser client
let supabaseInstance: ReturnType<typeof createClient> | null = null

// Create a more robust mock client
const createMockClient = () => {
  return {
    from: (table: string) => ({
      select: (query?: string) => ({
        eq: (field: string, value: any) => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
        order: (column: string, options?: { ascending?: boolean }) => ({
          limit: (limit: number) => Promise.resolve({ data: [], error: null }),
        }),
        limit: (limit: number) => Promise.resolve({ data: [], error: null }),
        or: (query: string) => ({
          limit: (limit: number) => Promise.resolve({ data: [], error: null }),
        }),
      }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    },
    rpc: (name: string) => ({
      select: (query: string) => Promise.resolve({ data: [], error: null }),
    }),
  } as any
}

export const supabase = (() => {
  // Only run this in the browser
  if (typeof window === "undefined") {
    return createMockClient()
  }

  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase client initialization failed: Missing environment variables", {
      NEXT_PUBLIC_SUPABASE_URL: !!supabaseUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!supabaseAnonKey,
    })

    // Return a mock client that won't throw errors
    return createMockClient()
  }

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
    console.log("Supabase client initialized successfully")
    return supabaseInstance
  } catch (error) {
    console.error("Error initializing Supabase client:", error)
    return createMockClient()
  }
})()
