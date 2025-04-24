"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function AuthRegisterCallbackPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the auth code from the URL
        const { searchParams } = new URL(window.location.href)
        const code = searchParams.get("code")

        if (!code) {
          setError("No authentication code found in the URL")
          return
        }

        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          console.error("Error exchanging code for session:", error)
          setError(error.message)
          return
        }

        // Redirect to profile completion page after successful registration
        router.push("/profile/edit?new=true")
      } catch (err) {
        console.error("Unexpected error during authentication callback:", err)
        setError("An unexpected error occurred during authentication")
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-gray-950">
      <div className="w-full max-w-md p-8 space-y-4 text-center">
        {error ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/30">
            <h2 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">Authentication Error</h2>
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => router.push("/register")}
              className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800/60"
            >
              Back to Registration
            </button>
          </div>
        ) : (
          <>
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#fb6542] dark:text-[#ffbb00]" />
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">Setting up your account...</h2>
            <p className="text-gray-600 dark:text-gray-400">Please wait while we complete your registration.</p>
          </>
        )}
      </div>
    </div>
  )
}
