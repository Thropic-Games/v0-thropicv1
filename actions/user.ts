"use server"

import { createServerClient } from "@/lib/supabase"
import { supabase } from "@/lib/supabase"
import type { User, Address, UserWithAddress } from "@/types/database"

export type UserProfile = {
  id: string
  email?: string
  name?: string
  phone?: string
  dob?: string
  billing_email?: string
  address_id?: string
  created_ts?: string
  updated_ts?: string
  version?: number
  deleted?: boolean
  deleted_ts?: string | null
  modified_by?: string | null
  tnc_accepted_ts?: string | null
}

export async function getUserProfile(userId: string): Promise<{ data: UserProfile | null; error: any }> {
  try {
    console.log("Fetching user profile for:", userId)

    // Get the user profile from the user table
    const { data: profile, error: profileError } = await supabase.from("user").select("*").eq("id", userId).single()

    if (profileError) {
      // If profile doesn't exist yet, return basic user info
      if (profileError.code === "PGRST116") {
        console.log("User not found, returning basic user info")

        // Try to get user email from auth
        const { data: authUser } = await supabase.auth.admin.getUserById(userId)

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

    console.log("User profile fetched successfully:", profile)
    return { data: profile, error: null }
  } catch (error) {
    console.error("Unexpected error in getUserProfile:", error)
    return { data: null, error }
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase.from("user").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching user:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getUserById:", error)
    return null
  }
}

export async function getUserWithAddressById(userId: string): Promise<UserWithAddress | null> {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase
      .from("user")
      .select(`
        *,
        address:address_id (*)
      `)
      .eq("id", userId)
      .single()

    if (error) {
      console.error("Error fetching user with address:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getUserWithAddressById:", error)
    return null
  }
}

export async function createOrUpdateUser(userData: Partial<User>): Promise<User | null> {
  const supabase = createServerClient()

  try {
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("user")
      .select("*")
      .eq("id", userData.id || "")
      .maybeSingle()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error checking for existing user:", fetchError)
      return null
    }

    // Update timestamp and version
    const now = new Date().toISOString()
    const updateData = {
      ...userData,
      updated_ts: now,
      version: existingUser ? existingUser.version + 1 : 1,
    }

    if (!existingUser) {
      // Create new user
      updateData.created_ts = now
      updateData.deleted = false
    }

    const { data, error } = await supabase.from("user").upsert(updateData).select().single()

    if (error) {
      console.error("Error creating/updating user:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in createOrUpdateUser:", error)
    return null
  }
}

export async function createOrUpdateAddress(addressData: Partial<Address>): Promise<Address | null> {
  const supabase = createServerClient()

  try {
    const now = new Date().toISOString()
    const updateData = {
      ...addressData,
      created_ts: addressData.id ? undefined : now,
    }

    const { data, error } = await supabase.from("address").upsert(updateData).select().single()

    if (error) {
      console.error("Error creating/updating address:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in createOrUpdateAddress:", error)
    return null
  }
}

export async function createUserIfNotExists(authUser: { id: string; email: string }): Promise<User | null> {
  const supabase = createServerClient()

  try {
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("user")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error checking for existing user:", fetchError)
      return null
    }

    if (existingUser) {
      return existingUser
    }

    // Create new user
    const now = new Date().toISOString()
    const newUser = {
      id: authUser.id,
      email: authUser.email,
      created_ts: now,
      updated_ts: now,
      deleted: false,
      version: 1,
    }

    const { data, error } = await supabase.from("user").insert(newUser).select().single()

    if (error) {
      console.error("Error creating new user:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in createUserIfNotExists:", error)
    return null
  }
}

export async function updateUserProfile(
  userId: string,
  profileData: Partial<UserProfile>,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if the user exists
    const { data: existingUser } = await supabase.from("user").select("id, version").eq("id", userId).single()

    if (existingUser) {
      // Update existing user with version increment
      const { error } = await supabase
        .from("user")
        .update({
          ...profileData,
          updated_ts: new Date().toISOString(),
          version: (existingUser.version || 0) + 1,
        })
        .eq("id", userId)

      if (error) throw error
    } else {
      // Create new user
      const { error } = await supabase.from("user").insert([
        {
          id: userId,
          ...profileData,
          created_ts: new Date().toISOString(),
          updated_ts: new Date().toISOString(),
          version: 1,
          deleted: false,
        },
      ])

      if (error) throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating user:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
