"use server"

import { supabase } from "@/lib/supabase"

export async function checkUserExists(userId: string): Promise<{ exists: boolean; error?: any }> {
  try {
    const { data, error } = await supabase.from("user").select("id").eq("id", userId).single()

    if (error) {
      // If the error is that no rows were returned, it means the user doesn't exist
      if (error.code === "PGRST116") {
        return { exists: false }
      }

      // Otherwise, it's a different error
      console.error("Error checking if user exists:", error)
      return { exists: false, error }
    }

    return { exists: !!data }
  } catch (error) {
    console.error("Unexpected error checking user:", error)
    return { exists: false, error }
  }
}

// Add the missing checkUserProfileExists function (alias for checkUserExists)
export async function checkUserProfileExists(userId: string): Promise<{ exists: boolean; error?: any }> {
  return checkUserExists(userId)
}

export async function createInitialUser(userData: { id: string; email: string }): Promise<{
  success: boolean
  error?: any
}> {
  try {
    // Check if user already exists to avoid duplicates
    const { exists } = await checkUserExists(userData.id)

    if (exists) {
      return { success: true } // User already exists, no need to create
    }

    // Create a new user with minimal information
    const { error } = await supabase.from("user").insert({
      id: userData.id,
      email: userData.email,
      created_ts: new Date().toISOString(),
      version: 1,
      deleted: false,
    })

    if (error) {
      console.error("Error creating initial user:", error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error creating user:", error)
    return { success: false, error }
  }
}

export async function createInitialUserProfile(userData: { id: string; email: string }): Promise<{
  success: boolean
  error?: any
}> {
  // This is now an alias for createInitialUser for backward compatibility
  return createInitialUser(userData)
}
