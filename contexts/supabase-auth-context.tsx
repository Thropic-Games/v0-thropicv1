"use client"

import { createContext, useContext, useEffect, useState, useRef, useCallback, useMemo, type ReactNode } from "react"
import { getSupabase } from "@/lib/supabase"
import type { User, Session } from "@supabase/supabase-js"

interface SupabaseAuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  error: Error | null
  signOut: () => Promise<void>
  initialized: boolean
  refreshSession: () => Promise<void>
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined)

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [initialized, setInitialized] = useState(false)

  // Use refs to track initialization state and prevent duplicate listeners
  const authCheckComplete = useRef(false)
  const authListenerSet = useRef(false)

  // Get the Supabase client (singleton)
  const supabase = getSupabase()

  // Function to refresh the session
  const refreshSession = useCallback(async () => {
    try {
      setLoading(true)
      console.log("Manually refreshing session...")

      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Error refreshing session:", error)
        throw error
      }

      console.log("Session refresh result:", data.session ? "Session found" : "No session")
      setSession(data.session)
      setUser(data.session?.user ?? null)
    } catch (err) {
      console.error("Error in session refresh:", err)
      setError(err instanceof Error ? err : new Error("Unknown error refreshing session"))
    } finally {
      setLoading(false)
    }
  }, [supabase.auth])

  // Initial auth check - only run once
  useEffect(() => {
    if (typeof window === "undefined" || authCheckComplete.current) return

    const getInitialSession = async () => {
      try {
        console.log("Checking initial auth session...")
        setLoading(true)

        // Try to get the session
        const { data: sessionData, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting initial session:", error)
          throw error
        }

        // Session retrieved successfully
        console.log("Auth session retrieved:", sessionData.session ? "Authenticated" : "Not authenticated")
        setSession(sessionData.session)
        setUser(sessionData.session?.user ?? null)
      } catch (err) {
        console.error("Error in auth initialization:", err)
        setError(err instanceof Error ? err : new Error("Unknown error getting session"))

        // Set empty state on error
        setSession(null)
        setUser(null)
      } finally {
        setLoading(false)
        setInitialized(true)
        authCheckComplete.current = true

        // Log the final auth state for debugging
        console.log("Supabase auth initialized with state:", {
          authenticated: !!session,
          user: session?.user?.email || null,
        })
      }
    }

    console.log("Initial auth check - authCheckComplete:", authCheckComplete.current)
    getInitialSession()
  }, [supabase.auth]) // Only depend on supabase.auth, not session

  // Set up auth state change listener - only once
  useEffect(() => {
    if (typeof window === "undefined" || authListenerSet.current) return

    authListenerSet.current = true
    console.log("Setting up auth state change listener")

    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      // Avoid logging every minor event
      if (event !== "TOKEN_REFRESHED") {
        console.log("Supabase auth state changed:", event, newSession?.user?.email || "no user")
      }

      // Only update state if it actually changed
      const newUserId = newSession?.user?.id
      const currentUserId = user?.id

      if (newUserId !== currentUserId || !!newSession !== !!session || newSession?.expires_at !== session?.expires_at) {
        console.log("Auth state update - User or session changed")
        setSession(newSession)
        setUser(newSession?.user ?? null)
        setLoading(false)
        setInitialized(true)

        // Log the updated auth state
        console.log("Supabase status updated:", {
          initialized: true,
          authenticated: !!newSession,
          user: newSession?.user?.email || null,
          expires: newSession?.expires_at ? new Date(newSession.expires_at * 1000).toISOString() : null,
        })
      }
    })

    // Cleanup subscription
    return () => {
      if (authListener?.subscription) {
        try {
          console.log("Unsubscribing from auth listener")
          authListener.subscription.unsubscribe()
          authListenerSet.current = false
        } catch (err) {
          console.error("Error unsubscribing from auth listener:", err)
        }
      }
    }
  }, [supabase.auth]) // Only depend on supabase.auth

  // Memoize the signOut function
  const signOut = useCallback(async () => {
    try {
      if (!supabase?.auth) {
        throw new Error("Supabase auth not initialized")
      }

      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Clear state after sign out
      setUser(null)
      setSession(null)
    } catch (err) {
      console.error("Error signing out:", err)
      setError(err instanceof Error ? err : new Error("Unknown error signing out"))
      throw err
    }
  }, [supabase.auth])

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      error,
      signOut,
      initialized,
      refreshSession,
    }),
    [user, session, loading, error, signOut, initialized, refreshSession],
  )

  return <SupabaseAuthContext.Provider value={value}>{children}</SupabaseAuthContext.Provider>
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext)
  if (context === undefined) {
    throw new Error("useSupabaseAuth must be used within a SupabaseAuthProvider")
  }
  return context
}
