"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import type { User, Session } from "@supabase/supabase-js"

interface SupabaseAuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  error: Error | null
  signOut: () => Promise<void>
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined)

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        setSession(data.session)
        setUser(data.session?.user ?? null)
      } catch (err) {
        console.error("Error getting initial session:", err)
        setError(err instanceof Error ? err : new Error("Unknown error getting session"))
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

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (err) {
      console.error("Error signing out:", err)
      setError(err instanceof Error ? err : new Error("Unknown error signing out"))
      throw err
    }
  }

  const value = {
    user,
    session,
    loading,
    error,
    signOut,
  }

  return <SupabaseAuthContext.Provider value={value}>{children}</SupabaseAuthContext.Provider>
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext)
  if (context === undefined) {
    throw new Error("useSupabaseAuth must be used within a SupabaseAuthProvider")
  }
  return context
}
