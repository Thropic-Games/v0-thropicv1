"use client"

import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AuthDebugPanel() {
  const { user, session, loading, initialized, refreshSession } = useSupabaseAuth()
  const [expanded, setExpanded] = useState(false)

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)} className="mb-2">
        {expanded ? "Hide Auth Debug" : "Show Auth Debug"}
      </Button>

      {expanded && (
        <Card className="w-80 shadow-lg">
          <CardHeader className="py-2">
            <CardTitle className="text-sm">Auth Debug Panel</CardTitle>
          </CardHeader>
          <CardContent className="py-2 text-xs">
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Status:</span>{" "}
                {loading ? "Loading..." : user ? "Authenticated" : "Not Authenticated"}
              </div>
              <div>
                <span className="font-semibold">Initialized:</span> {initialized ? "Yes" : "No"}
              </div>
              <div>
                <span className="font-semibold">User Email:</span> {user?.email || "None"}
              </div>
              <div>
                <span className="font-semibold">User ID:</span> {user?.id || "None"}
              </div>
              <div>
                <span className="font-semibold">Session:</span> {session ? "Active" : "None"}
              </div>
              <div className="pt-2">
                <Button variant="secondary" size="sm" onClick={refreshSession} className="w-full">
                  Refresh Session
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
