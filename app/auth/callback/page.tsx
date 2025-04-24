"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash from the URL if it exists
        const hash = window.location.hash

        // Log the hash for debugging (will be removed in production)
        if (hash) {
          console.log("Auth callback hash detected")
        }

        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          setStatus("error")
          setErrorMessage(error.message)
          setDebugInfo(`Error code: ${error.status || "unknown"}`)
          return
        }

        if (!data.session) {
          console.warn("No session found in auth callback")
          setStatus("error")
          setErrorMessage("Authentication failed. No session was created.")
          return
        }

        console.log("Auth callback successful, session established")
        setStatus("success")

        // Redirect after successful authentication
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } catch (error) {
        console.error("Error during auth callback:", error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        setStatus("error")
        setErrorMessage("An unexpected error occurred during authentication")
        setDebugInfo(errorMessage)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>Completing your sign in process</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          {status === "loading" && (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p>Verifying your authentication...</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
              <p className="text-center mb-4">Successfully authenticated! Redirecting you to the dashboard...</p>
            </>
          )}

          {status === "error" && (
            <>
              <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
              <p className="text-center text-red-500 mb-4">{errorMessage}</p>
              {debugInfo && (
                <div className="text-xs bg-red-100 dark:bg-red-900/40 p-2 rounded overflow-auto max-h-24 mb-4 w-full">
                  <code>{debugInfo}</code>
                </div>
              )}
              <Button onClick={() => router.push("/login")}>Return to Login</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
