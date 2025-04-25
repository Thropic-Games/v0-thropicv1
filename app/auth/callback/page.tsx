"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabase } from "@/lib/supabase"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const supabase = getSupabase()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Log the current URL for debugging
        console.log("Auth callback triggered")
        console.log("URL:", window.location.href)
        console.log("Has code param:", window.location.search.includes("code="))

        // Get the hash or query parameters
        const hash = window.location.hash
        const query = window.location.search

        // Check if we have a hash with access_token (implicit grant)
        if (hash && hash.includes("access_token=")) {
          console.log("Hash with access_token detected, setting session...")

          // The hash contains the session data, Supabase client will handle it automatically
          // Just need to check if we have a session after a short delay
          setTimeout(async () => {
            const { data, error } = await supabase.auth.getSession()

            if (error || !data.session) {
              console.error("Error getting session after hash auth:", error)
              setStatus("error")
              setErrorMessage(error?.message || "Failed to get session after authentication")
              return
            }

            console.log("Authentication successful via hash, session established")
            setStatus("success")

            // Redirect after successful authentication
            setTimeout(() => {
              router.push("/profile")
            }, 1000)
          }, 500)

          return
        }

        // Check if we have a code parameter (OAuth or magic link)
        if (query.includes("code=")) {
          console.log("Code parameter detected, exchanging for session...")

          // Extract the code
          const code = new URLSearchParams(query).get("code")

          if (!code) {
            throw new Error("No code parameter found in URL")
          }

          // Exchange the code for a session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)

          if (error) {
            console.error("Error exchanging code for session:", error)
            setStatus("error")
            setErrorMessage(error.message)
            return
          }

          if (!data.session) {
            console.error("No session returned from code exchange")
            setStatus("error")
            setErrorMessage("Authentication failed. No session was created.")
            return
          }

          console.log("Authentication successful, session established")
          setStatus("success")

          // Redirect after successful authentication
          setTimeout(() => {
            router.push("/profile")
          }, 1000)
        } else {
          // No code parameter, check if we already have a session
          const { data, error } = await supabase.auth.getSession()

          if (error) {
            console.error("Error getting session:", error)
            setStatus("error")
            setErrorMessage(error.message)
            return
          }

          if (data.session) {
            console.log("Existing session found")
            setStatus("success")

            // Redirect after successful authentication
            setTimeout(() => {
              router.push("/profile")
            }, 1000)
          } else {
            console.error("No session or code parameter found")
            setStatus("error")
            setErrorMessage("Authentication failed. No session or code parameter found.")
          }
        }
      } catch (error) {
        console.error("Error during auth callback:", error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        setStatus("error")
        setErrorMessage("An unexpected error occurred during authentication")
        setDebugInfo(errorMessage)
      }
    }

    handleAuthCallback()
  }, [router, supabase.auth])

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
              <p className="text-center mb-4">Successfully authenticated! Redirecting you...</p>
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
