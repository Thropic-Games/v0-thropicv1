"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import type { User, Session } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Add the signUp method to the SupabaseContextType interface

interface SupabaseContextType {
  supabase: SupabaseClient<Database>
  user: User | null
  session: Session | null
  loading: boolean
  error: Error | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  sendMagicLink: (email: string) => Promise<void>
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          throw error
        }

        setSession(data.session)
        setUser(data.session?.user ?? null)
      } catch (err) {
        console.error("Error getting session:", err)
        setError(err instanceof Error ? err : new Error("Unknown error during session retrieval"))
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Supabase auth state changed:", event)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Cleanup subscription
    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    }
  }

  // Sign up function
  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  // Send magic link function
  const sendMagicLink = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) throw error
    } catch (error) {
      console.error("Magic link error:", error)
      throw error
    }
  }

  // Context value
  const value = {
    supabase,
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    sendMagicLink,
  }

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>
}

// Custom hook to use the Supabase context
export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider")
  }
  return context
}
