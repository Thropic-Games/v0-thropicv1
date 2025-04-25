"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { AlertTriangle, CheckCircle, RefreshCw, Trash } from "lucide-react"

export default function AuthResetPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const checkSession = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const { data, error } = await supabase.auth.getSession()

      if (error) {
        throw error
      }

      setSessionInfo(data.session)
      setSuccess("Session retrieved successfully")
    } catch (err: any) {
      console.error("Error checking session:", err)
      setError(err.message || "Failed to check session")
      setSessionInfo(null)
    } finally {
      setIsLoading(false)
    }
  }

  const clearSession = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      // Clear local storage
      localStorage.clear()

      // Clear cookies (this is a simple approach, might need to be more specific)
      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
      })

      setSessionInfo(null)
      setSuccess("Session cleared successfully. You are now signed out.")

      // Refresh the page after a short delay
      setTimeout(() => {
        router.refresh()
      }, 1000)
    } catch (err: any) {
      console.error("Error clearing session:", err)
      setError(err.message || "Failed to clear session")
    } finally {
      setIsLoading(false)
    }
  }

  const forceResetAuth = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      // Clear all auth-related storage
      localStorage.clear()
      sessionStorage.clear()

      // Clear cookies
      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
      })

      // Force sign out
      await supabase.auth.signOut({ scope: "global" })

      setSuccess("Authentication state completely reset. Refreshing page...")

      // Hard refresh the page after a short delay
      setTimeout(() => {
        window.location.href = "/"
      }, 1000)
    } catch (err: any) {
      console.error("Error resetting auth:", err)
      setError(err.message || "Failed to reset authentication")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Authentication Debug & Reset</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Use this page to diagnose and fix authentication issues, especially after domain changes.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
            <CardDescription>Check your current authentication session</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert
                variant="default"
                className="mb-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900"
              >
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Button onClick={checkSession} disabled={isLoading} className="mb-4">
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                "Check Current Session"
              )}
            </Button>

            {sessionInfo && (
              <div className="mt-4 border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                <h3 className="font-medium mb-2">Session Details:</h3>
                <pre className="text-xs overflow-auto p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  {JSON.stringify(
                    {
                      user: {
                        id: sessionInfo.user?.id,
                        email: sessionInfo.user?.email,
                        role: sessionInfo.user?.role,
                        aud: sessionInfo.user?.aud,
                      },
                      expires_at: sessionInfo.expires_at,
                      provider_token: sessionInfo.provider_token ? "Present" : "None",
                      provider_refresh_token: sessionInfo.provider_refresh_token ? "Present" : "None",
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reset Authentication</CardTitle>
            <CardDescription>Clear your current session and authentication state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Standard Sign Out</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Signs you out normally, preserving other browser data.
              </p>
              <Button variant="outline" onClick={clearSession} disabled={isLoading}>
                {isLoading ? "Signing Out..." : "Sign Out"}
              </Button>
            </div>

            <div>
              <h3 className="font-medium mb-2">Force Reset Authentication</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Completely clears all authentication data and storage. Use this if you're experiencing persistent auth
                issues.
              </p>
              <Button variant="destructive" onClick={forceResetAuth} disabled={isLoading}>
                <Trash className="mr-2 h-4 w-4" />
                {isLoading ? "Resetting..." : "Force Reset Auth"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-gray-500 dark:text-gray-400">
            Note: Resetting authentication will sign you out and clear all local authentication data.
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting Authentication After Domain Change</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">1. Session Cookie Domain Mismatch</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              When you change domains, your existing authentication cookies may no longer be valid. Use the "Force Reset
              Auth" button to clear all authentication data.
            </p>
          </div>

          <div>
            <h3 className="font-medium">2. Environment Variables Not Available</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Check that your Supabase environment variables are correctly set for the new domain. Visit the{" "}
              <a href="/debug/environment" className="text-blue-600 dark:text-blue-400 underline">
                Environment Debug
              </a>{" "}
              page.
            </p>
          </div>

          <div>
            <h3 className="font-medium">3. Redirect URLs Not Updated</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Make sure you've updated the allowed redirect URLs in your Supabase project settings to include your new
              domain.
            </p>
          </div>

          <div>
            <h3 className="font-medium">4. Clear Browser Cache</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Try clearing your browser cache or using incognito mode to ensure you're not seeing cached authentication
              data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
