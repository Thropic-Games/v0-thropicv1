"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

// Define the context type
type SessionContextType = {
  session: Session | null
  loading: boolean
  authenticated: boolean
  error: Error | null
  refresh: () => Promise<void>
}

// Create the context with default values
const SessionContext = createContext<SessionContextType>({
  session: null,
  loading: true,
  authenticated: false,
  error: null,
  refresh: async () => {},
})

// Props type for the SessionProvider
interface SessionProviderProps {
  children: React.ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  // Function to refresh the session
  const refresh = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        throw error
      }

      setSession(data.session)
      setError(null)
    } catch (err) {
      console.error("Error refreshing session:", err)
      setError(err instanceof Error ? err : new Error("Failed to refresh session"))
    } finally {
      setLoading(false)
    }
  }

  // Initialize session on mount
  useEffect(() => {
    console.log("SessionProvider: Initializing")

    // Get initial session
    const initializeSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        setSession(data.session)
      } catch (err) {
        console.error("Error getting session:", err)
        setError(err instanceof Error ? err : new Error("Failed to get session"))
      } finally {
        setLoading(false)
      }
    }

    initializeSession()

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log(`SessionProvider: Auth state changed - ${event}`)
      setSession(newSession)
      setLoading(false)
    })

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Compute authenticated state
  const authenticated = !!session

  // Context value
  const value = {
    session,
    loading,
    authenticated,
    error,
    refresh,
  }

  return (
    <SessionContext.Provider value={value}>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      ) : (
        children
      )}
    </SessionContext.Provider>
  )
}

// Custom hook to use the session context
export function useSession() {
  const context = useContext(SessionContext)

  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider")
  }

  return context
}
