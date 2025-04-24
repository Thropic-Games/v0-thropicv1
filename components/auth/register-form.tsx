"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { registerUser } from "@/actions/register"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData(event.currentTarget)
      const password = formData.get("password") as string
      const confirmPassword = formData.get("confirmPassword") as string

      // Check if passwords match
      if (password !== confirmPassword) {
        setError("Passwords do not match")
        setIsLoading(false)
        return
      }

      const result = await registerUser(formData)

      if (result.success) {
        setSuccess(result.message)
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        setError(result.error)
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium">
            First Name
          </label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            required
            className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium">
            Last Name
          </label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            required
            className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <Input
          id="username"
          name="username"
          type="text"
          required
          className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          disabled={isLoading}
          minLength={8}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          disabled={isLoading}
          minLength={8}
        />
      </div>

      <div className="pt-2">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
        By creating an account, you agree to our{" "}
        <a href="/terms" className="text-[#fb6542] dark:text-[#ffbb00] hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="text-[#fb6542] dark:text-[#ffbb00] hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  )
}
