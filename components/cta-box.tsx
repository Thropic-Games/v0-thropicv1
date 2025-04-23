"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sendSignInLinkToEmail, createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Loader2, CheckCircle, AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function CTABox() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "emailLinkDisabled">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) return

    try {
      setStatus("loading")

      // Try magic link first
      try {
        // Configure the actionCodeSettings
        const actionCodeSettings = {
          // URL you want to redirect back to after sign-in
          url: window.location.origin + "/auth/confirm",
          // This must be true for email link sign-in
          handleCodeInApp: true,
        }

        // Save the email to localStorage for confirmation
        window.localStorage.setItem("emailForSignIn", email)

        // Send the magic link
        await sendSignInLinkToEmail(auth, email, actionCodeSettings)
        setStatus("success")
        return
      } catch (error: any) {
        // Check if the error is because email link auth is not enabled
        if (error.code === "auth/operation-not-allowed") {
          console.log("Email link authentication is not enabled in Firebase Console")
          setStatus("emailLinkDisabled")
          return
        }

        // For other errors, rethrow to be caught by the outer catch
        throw error
      }
    } catch (error) {
      console.error("Error sending sign-in link:", error)
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to send login link")
    }
  }

  const handleRegularSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) return

    try {
      setStatus("loading")

      // Create user with email and password
      await createUserWithEmailAndPassword(auth, email, password)

      setStatus("success")
    } catch (error) {
      console.error("Error signing up:", error)
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to sign up")
    }
  }

  return (
    <div className="bg-gray-800 rounded-xl p-5 mt-6">
      <h3 className="text-lg font-medium text-white mb-2">Your home for changing the world</h3>
      <p className="text-gray-300 text-sm mb-4">
        Streamline nonprofit fundraising, marketing, and donor management in one powerful platform—rated for ease of
        use.
      </p>

      {status === "idle" && (
        <div className="relative">
          {isExpanded ? (
            <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
              <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                Sign up for free
              </Button>
            </form>
          ) : (
            <Button
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
              onMouseEnter={() => setIsExpanded(true)}
            >
              Sign up for free
            </Button>
          )}
        </div>
      )}

      {status === "loading" && (
        <div className="flex flex-col items-center py-4">
          <Loader2 className="h-8 w-8 text-yellow-500 animate-spin mb-2" />
          <p className="text-gray-300">Processing your request...</p>
        </div>
      )}

      {status === "success" && (
        <Alert className="bg-green-900/20 border-green-800">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-400">
            Success! You've been signed up. Check your email for confirmation.
          </AlertDescription>
        </Alert>
      )}

      {status === "emailLinkDisabled" && (
        <div className="space-y-4">
          <Alert className="bg-blue-900/20 border-blue-800">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-400">Email Link Authentication Not Enabled</AlertTitle>
            <AlertDescription className="text-blue-400">
              Please complete your sign up with a password instead.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleRegularSignUp} className="flex flex-col space-y-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
            <Input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
              Sign up with password
            </Button>
          </form>
        </div>
      )}

      {status === "error" && (
        <Alert className="bg-red-900/20 border-red-800">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-400">
            {errorMessage || "Something went wrong. Please try again."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
