"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, CheckCircle, AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSupabase } from "@/contexts/supabase-context"

export function CTABox() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "emailLinkDisabled">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const { sendMagicLink, signUp } = useSupabase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) return

    try {
      setStatus("loading")

      // Try magic link first
      try {
        // Send the magic link using Supabase
        const { error } = await sendMagicLink(email)

        if (error) {
          // If there's an error with magic link, show password option
          console.log("Magic link error:", error)
          setStatus("emailLinkDisabled")
          return
        }

        setStatus("success")
        return
      } catch (error: any) {
        // For other errors, show password option
        console.log("Error sending magic link:", error)
        setStatus("emailLinkDisabled")
        return
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

      // Create user with email and password using Supabase
      const { error } = await signUp({
        email,
        password,
        options: {
          data: {
            email: email,
          },
        },
      })

      if (error) {
        throw error
      }

      setStatus("success")
    } catch (error) {
      console.error("Error signing up:", error)
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to sign up")
    }
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-5 mt-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Your home for changing the world</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
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
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
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
          <p className="text-gray-600 dark:text-gray-300">Processing your request...</p>
        </div>
      )}

      {status === "success" && (
        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500" />
          <AlertDescription className="text-green-700 dark:text-green-400">
            Success! You've been signed up. Check your email for confirmation.
          </AlertDescription>
        </Alert>
      )}

      {status === "emailLinkDisabled" && (
        <div className="space-y-4">
          <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-500" />
            <AlertTitle className="text-blue-700 dark:text-blue-400">Email Link Authentication Not Enabled</AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-400">
              Please complete your sign up with a password instead.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleRegularSignUp} className="flex flex-col space-y-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              required
            />
            <Input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              required
            />
            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
              Sign up with password
            </Button>
          </form>
        </div>
      )}

      {status === "error" && (
        <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500" />
          <AlertDescription className="text-red-700 dark:text-red-400">
            {errorMessage || "Something went wrong. Please try again."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
