"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

export default function ConfirmSignInPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"checking" | "needsEmail" | "signing" | "success" | "error">("checking")
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if the current URL is a sign-in link
    if (isSignInWithEmailLink(auth, window.location.href)) {
      // Get the email from localStorage if available
      const savedEmail = window.localStorage.getItem("emailForSignIn")

      if (savedEmail) {
        // If we have the email, proceed with sign-in
        handleSignIn(savedEmail)
      } else {
        // If we don't have the email, ask the user to provide it
        setStatus("needsEmail")
      }
    } else {
      // Not a sign-in link, redirect to home
      setStatus("error")
      setErrorMessage("Invalid or expired sign-in link")
    }
  }, [])

  const handleSignIn = async (emailToUse: string) => {
    try {
      setStatus("signing")

      // Complete the sign-in process
      await signInWithEmailLink(auth, emailToUse, window.location.href)

      // Clear the email from storage
      window.localStorage.removeItem("emailForSignIn")

      // Sign-in successful
      setStatus("success")

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error) {
      console.error("Error signing in with email link:", error)
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to sign in")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      handleSignIn(email)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <SiteHeader />

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Magic Link Sign In</CardTitle>
            <CardDescription>Complete your sign in process</CardDescription>
          </CardHeader>

          <CardContent>
            {status === "checking" && (
              <div className="flex flex-col items-center py-8">
                <Loader2 className="h-8 w-8 text-yellow-500 animate-spin mb-2" />
                <p className="text-gray-300">Verifying your link...</p>
              </div>
            )}

            {status === "needsEmail" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">
                    Please enter the email address you used to request the sign-in link:
                  </p>
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                  Complete Sign In
                </Button>
              </form>
            )}

            {status === "signing" && (
              <div className="flex flex-col items-center py-8">
                <Loader2 className="h-8 w-8 text-yellow-500 animate-spin mb-2" />
                <p className="text-gray-300">Signing you in...</p>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Successfully Signed In!</h3>
                <p className="text-gray-400 text-center">
                  You're now signed in to your account. Redirecting you to the homepage...
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center py-8">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Sign In Failed</h3>
                <p className="text-gray-400 text-center mb-4">{errorMessage}</p>
                <Button onClick={() => router.push("/")} className="bg-gray-800 hover:bg-gray-700">
                  Return to Homepage
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
