"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { sendMagicLink } from "@/actions/auth"

export function RegisterFormSimple() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("isRegister", "true")
      const result = await sendMagicLink(formData)

      if (!result.success) {
        setError(result.error || "Failed to send registration link")
        setSuccess(false)
      } else {
        setSuccess(true)
        setEmail("")
      }
    } catch (err) {
      console.error("Error in registration form:", err)
      setError("An unexpected error occurred. Please try again.")
      setSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {!success ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md"
              required
              disabled={isLoading}
            />

            {error && (
              <div className="mt-2 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#fb6542] to-[#ffbb00] hover:from-[#e55a3a] hover:to-[#f0b000] text-white font-medium py-2.5 rounded-md"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending link...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-gray-950 px-4 text-sm text-gray-500 dark:text-gray-400">OR</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full flex justify-center items-center gap-2 py-2.5 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign up with Google
          </button>
        </form>
      ) : (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/30">
          <div className="flex items-center gap-2 text-[#fb6542] dark:text-[#ffbb00] mb-2">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="font-medium">Check your inbox</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            We've sent a magic link to your email address. Click the link in the email to create your account.
          </p>
          <Button
            variant="outline"
            className="mt-4 w-full border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-50 hover:text-[#fb6542] dark:hover:text-[#ffbb00]"
            onClick={() => {
              setSuccess(false)
              setError(null)
            }}
          >
            Use a different email
          </Button>
        </div>
      )}
    </>
  )
}
