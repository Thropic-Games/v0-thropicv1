"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { useSupabase } from "@/contexts/supabase-context"

export default function SupabaseDebugPage() {
  const { user, loading, error } = useSupabase()
  const [envVars, setEnvVars] = useState<Record<string, string>>({})
  const [supabaseStatus, setSupabaseStatus] = useState<"loading" | "success" | "error">("loading")
  const [statusMessage, setStatusMessage] = useState("")

  useEffect(() => {
    // Collect all NEXT_PUBLIC environment variables (safe to expose)
    const publicEnvVars: Record<string, string> = {}
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith("NEXT_PUBLIC_")) {
        // Mask the actual values for security
        const value = process.env[key] || ""
        publicEnvVars[key] = value ? "✓ Set" : "✗ Not set"
      }
    })
    setEnvVars(publicEnvVars)

    // Check Supabase connection
    const checkSupabaseConnection = async () => {
      try {
        const { error } = await fetch("/api/supabase-health-check").then((res) => res.json())

        if (error) {
          setSupabaseStatus("error")
          setStatusMessage(error.message || "Failed to connect to Supabase")
        } else {
          setSupabaseStatus("success")
          setStatusMessage("Successfully connected to Supabase")
        }
      } catch (err) {
        setSupabaseStatus("error")
        setStatusMessage(err instanceof Error ? err.message : "Unknown error checking Supabase connection")
      }
    }

    checkSupabaseConnection()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Supabase Debug</h1>

        {supabaseStatus === "loading" && (
          <Alert className="bg-yellow-500/20 text-yellow-400 border-yellow-600 mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Checking Supabase Connection</AlertTitle>
            <AlertDescription>Please wait while we check the connection to Supabase...</AlertDescription>
          </Alert>
        )}

        {supabaseStatus === "error" && (
          <Alert className="bg-red-500/20 text-red-400 border-red-600 mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Supabase Connection Error</AlertTitle>
            <AlertDescription>
              {statusMessage}
              <div className="mt-2 text-sm">
                Please check your environment variables and make sure they are correctly set.
              </div>
            </AlertDescription>
          </Alert>
        )}

        {supabaseStatus === "success" && (
          <Alert className="bg-green-500/20 text-green-400 border-green-600 mb-4">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Supabase Connected</AlertTitle>
            <AlertDescription>{statusMessage}</AlertDescription>
          </Alert>
        )}

        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Check if your Supabase environment variables are properly set</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-border pb-2">
                  <span className="font-mono text-sm">{key}</span>
                  <span className={value.startsWith("✓") ? "text-green-400" : "text-red-400"}>{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>Current user authentication information</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ) : user ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">User ID:</span>
                  <span className="font-mono text-sm">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Email:</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Email Verified:</span>
                  <span>{user.email_confirmed_at ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Last Sign In:</span>
                  <span>{new Date(user.last_sign_in_at || "").toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">No user is currently signed in</div>
            )}
          </CardContent>
        </Card>

        <div className="bg-card border border-border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Verify that all required Supabase environment variables are set in your Vercel project</li>
            <li>Make sure your Supabase project is properly configured in the Supabase dashboard</li>
            <li>Check if your API key is valid and has the necessary permissions</li>
            <li>Ensure your Supabase project has Authentication enabled</li>
            <li>Try clearing your browser cache and reloading the page</li>
          </ol>
        </div>
      </main>
    </div>
  )
}
