"use client"

import { useState } from "react"
import { useRecentDonations } from "@/hooks/use-recent-donations"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function DonationsDebug() {
  const { donations, loading, error, debugInfo, supabaseStatus } = useRecentDonations(5)
  const { user, session } = useSupabaseAuth()
  const [showDetails, setShowDetails] = useState(false)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Donations Debug</CardTitle>
        <CardDescription>Troubleshoot issues with donation data fetching</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium">Authentication Status</h3>
            <p className="text-sm text-muted-foreground">{session ? "Authenticated" : "Not authenticated"}</p>
          </div>
          <div>
            <h3 className="font-medium">User ID</h3>
            <p className="text-sm text-muted-foreground">{user?.id || "None"}</p>
          </div>
          <div>
            <h3 className="font-medium">Supabase Status</h3>
            <p className="text-sm text-muted-foreground">
              {supabaseStatus.initialized ? "Initialized" : "Not initialized"}
              {supabaseStatus.loading ? " (Loading)" : ""}
              {supabaseStatus.error ? " (Error)" : ""}
            </p>
          </div>
          <div>
            <h3 className="font-medium">Donations Count</h3>
            <p className="text-sm text-muted-foreground">{loading ? "Loading..." : donations.length}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-md border border-red-200">
            <h3 className="font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-600">{error.message}</p>
          </div>
        )}

        <Button onClick={() => setShowDetails(!showDetails)} variant="outline" size="sm">
          {showDetails ? "Hide Details" : "Show Details"}
        </Button>

        {showDetails && (
          <div className="bg-gray-50 p-4 rounded-md border overflow-auto max-h-96">
            <h3 className="font-medium mb-2">Debug Information</h3>
            <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={() => window.location.reload()} variant="outline">
          Refresh Page
        </Button>
      </CardFooter>
    </Card>
  )
}
