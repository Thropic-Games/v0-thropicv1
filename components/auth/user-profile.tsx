"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSupabase } from "@/hooks/use-supabase"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/types/supabase"

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const { supabase } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          // Fetch user profile
          const { data, error } = await supabase.from("profile").select("*").eq("id", user.id).single()

          if (error) {
            console.error("Error fetching profile:", error)
          } else {
            setProfile(data)
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndProfile()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      if (!session?.user) {
        setProfile(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-7 w-40 rounded mb-2"></div>
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-5 w-64 rounded"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-5 w-full rounded"></div>
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-5 w-3/4 rounded"></div>
        </CardContent>
        <CardFooter>
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-9 w-24 rounded"></div>
        </CardFooter>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Not Signed In</CardTitle>
          <CardDescription>You need to sign in to view your profile</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push("/login")}>Sign In</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{profile?.full_name || user.email}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile ? (
          <>
            {profile.username && (
              <p>
                <strong>Username:</strong> {profile.username}
              </p>
            )}
            {profile.bio && (
              <p>
                <strong>Bio:</strong> {profile.bio}
              </p>
            )}
            {profile.website && (
              <p>
                <strong>Website:</strong> {profile.website}
              </p>
            )}
          </>
        ) : (
          <p>No profile information available. Please complete your profile.</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/profile/edit")}>
          Edit Profile
        </Button>
        <Button variant="destructive" onClick={handleSignOut}>
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  )
}
