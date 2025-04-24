"use client"

import type React from "react"

import { useState } from "react"
import { sendMagicLink } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

export function MagicLinkForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setDebugInfo(null)

    try {
      const formData = new FormData()
      formData.append("email", email)
      const result = await sendMagicLink(formData)

      if (!result.success) {
        setError(result.error || "Failed to send login link")
        if (result.debugInfo) {
          setDebugInfo(result.debugInfo)
        }
        setSuccess(false)
      } else {
        setSuccess(true)
        setEmail("")
      }
    } catch (err) {
      console.error("Error in magic link form:", err)
      setError("An unexpected error occurred. Please try again.")
      setSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      {!success ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-gray-300 dark:border-gray-700 focus:ring-[#ffbb00] focus:border-[#ffbb00]"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="flex flex-col gap-2 text-red-600 dark:text-red-400 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
              {debugInfo && (
                <div className="text-xs bg-red-100 dark:bg-red-900/40 p-2 rounded overflow-auto max-h-24">
                  <code>{debugInfo}</code>
                </div>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#fb6542] to-[#ffbb00] hover:from-[#e55a3a] hover:to-[#f0b000] text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending link...
              </>
            ) : (
              "Send Magic Link"
            )}
          </Button>
        </form>
      ) : (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/30">
          <div className="flex items-center gap-2 text-[#fb6542] dark:text-[#ffbb00] mb-2">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="font-medium">Check your inbox</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            We've sent a magic link to your email address. Click the link in the email to sign in.
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
    </div>
  )
}
