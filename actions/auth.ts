"use server"

import { supabase } from "@/lib/supabase"
import { createClient } from "@supabase/supabase-js"

export async function sendMagicLink(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const isRegistration = formData.get("isRegister") === "true"

    if (!email || !email.includes("@")) {
      return {
        success: false,
        error: "Please enter a valid email address",
      }
    }

    console.log(`Sending magic link for ${isRegistration ? "registration" : "login"} to: ${email}`)

    // Get the site URL from environment variable or use a fallback
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"

    const redirectPath = isRegistration ? "/auth/register-callback" : "/auth/callback"
    console.log(`Using redirect URL: ${siteUrl}${redirectPath}`)

    // Check if supabase client is properly initialized
    if (!supabase || !supabase.auth) {
      console.error("Supabase client is not properly initialized")

      // Try to create a new client instance
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        return {
          success: false,
          error: "Supabase configuration is missing",
          debugInfo: `NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? "Set" : "Missing"}, NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? "Set" : "Missing"}`,
        }
      }

      // Create a new client for this request
      const tempClient = createClient(supabaseUrl, supabaseAnonKey)

      const { error } = await tempClient.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${siteUrl}${redirectPath}`,
          data: {
            name: "Thropic Games User",
            source: isRegistration ? "registration" : "magic_link",
            brand: "Thropic Games",
            tagline: "Gaming for Good",
          },
        },
      })

      if (error) {
        console.error("Error sending magic link with temp client:", error)
        return {
          success: false,
          error: error.message,
          debugInfo: `Error code: ${error.status || "unknown"}, URL: ${siteUrl}${redirectPath}`,
        }
      }

      return {
        success: true,
        message: "Check your email for the login link",
      }
    }

    // Use the existing supabase client
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteUrl}${redirectPath}`,
        data: {
          name: "Thropic Games User",
          source: isRegistration ? "registration" : "magic_link",
          brand: "Thropic Games",
          tagline: "Gaming for Good",
        },
      },
    })

    if (error) {
      console.error("Error sending magic link:", error)
      return {
        success: false,
        error: error.message,
        debugInfo: `Error code: ${error.status || "unknown"}, URL: ${siteUrl}${redirectPath}`,
      }
    }

    return {
      success: true,
      message: "Check your email for the login link",
    }
  } catch (error) {
    console.error("Unexpected error sending magic link:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return {
      success: false,
      error: "An unexpected error occurred",
      debugInfo: `Exception: ${errorMessage}`,
    }
  }
}
