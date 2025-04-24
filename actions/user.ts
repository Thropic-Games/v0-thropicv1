"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export type UserProfile = {
  id: string
  email?: string
  first_name?: string
  last_name?: string
  username?: string
  bio?: string
  avatar_url?: string
  phone_number?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  created_at?: string
}

export async function getUserProfile(userId: string): Promise<{ data: UserProfile | null; error: any }> {
  try {
    console.log("Fetching user profile for:", userId)

    // First, get the user from auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId)

    if (authError) {
      console.error("Error fetching auth user:", authError)
      return { data: null, error: authError }
    }

    // Then get the user profile from the profiles table
    const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (profileError) {
      // If profile doesn't exist yet, return basic user info
      if (profileError.code === "PGRST116") {
        console.log("Profile not found, returning basic user info")
        return {
          data: {
            id: userId,
            email: authUser?.user?.email,
          },
          error: null,
        }
      }

      console.error("Error fetching user profile:", profileError)
      return { data: null, error: profileError }
    }

    // Combine auth user and profile data
    const userData: UserProfile = {
      id: userId,
      email: authUser?.user?.email,
      ...profile,
    }

    console.log("User profile fetched successfully:", userData)
    return { data: userData, error: null }
  } catch (error) {
    console.error("Unexpected error in getUserProfile:", error)
    return { data: null, error }
  }
}

export async function updateUserProfile(
  userId: string,
  profileData: Partial<UserProfile>,
): Promise<{ success: boolean; error: any }> {
  try {
    console.log("Updating user profile for:", userId, profileData)

    // Remove id and email from the update data
    const { id, email, created_at, ...updateData } = profileData

    // Check if profile exists
    const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", userId).single()

    let result

    if (existingProfile) {
      // Update existing profile
      result = await supabase.from("profiles").update(updateData).eq("id", userId)
    } else {
      // Insert new profile
      result = await supabase.from("profiles").insert([{ id: userId, ...updateData }])
    }

    const { error } = result

    if (error) {
      console.error("Error updating user profile:", error)
      return { success: false, error }
    }

    // Revalidate the profile page to show updated data
    revalidatePath("/profile")
    revalidatePath("/profile/edit")

    console.log("User profile updated successfully")
    return { success: true, error: null }
  } catch (error) {
    console.error("Unexpected error in updateUserProfile:", error)
    return { success: false, error }
  }
}
