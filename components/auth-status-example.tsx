"use client"

import { useSupabaseAuth } from "@/contexts/supabase-auth-context"

export function AuthStatusExample() {
  const { user, authenticated, loading } = useSupabaseAuth()

  if (loading) {
    return <div className="p-4 text-center">Loading authentication status...</div>
  }

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-bold mb-2">Authentication Status</h2>
      <p>Status: {authenticated ? "Authenticated" : "Not authenticated"}</p>
      {authenticated && user && (
        <div className="mt-2">
          <p>User ID: {user.id}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  )
}
