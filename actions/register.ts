"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function registerUser(formData: FormData) {
  try {
    // Extract user data from form
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const username = formData.get("username") as string

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !username) {
      return {
        success: false,
        error: "All fields are required",
      }
    }

    // Register user with Supabase auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          username,
        },
      },
    })

    if (authError) {
      console.error("Error registering user:", authError)
      return {
        success: false,
        error: authError.message,
      }
    }

    // If user was created successfully, create a profile entry
    if (authData.user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          username,
          email,
        },
      ])

      if (profileError) {
        console.error("Error creating user profile:", profileError)
        // We don't return an error here since the auth user was created successfully
        // The profile can be created later
      }
    }

    revalidatePath("/login")

    return {
      success: true,
      message: "Account created successfully! Please check your email to confirm your registration.",
    }
  } catch (error) {
    console.error("Unexpected error during registration:", error)
    return {
      success: false,
      error: "An unexpected error occurred during registration",
    }
  }
}
