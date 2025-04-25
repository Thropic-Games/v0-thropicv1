"use client"

import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import { useEffect, useState } from "react"

export function AuthDebug() {
  const { user, loading, initialized, error } = useSupabaseAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50 max-w-xs">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-1">
        <p>Mounted: {mounted ? "Yes" : "No"}</p>
        <p>Initialized: {initialized ? "Yes" : "No"}</p>
        <p>Loading: {loading ? "Yes" : "No"}</p>
        <p>Authenticated: {user ? "Yes" : "No"}</p>
        <p>User: {user?.email || "None"}</p>
        {error && <p className="text-red-400">Error: {error.message}</p>}
      </div>
    </div>
  )
}
