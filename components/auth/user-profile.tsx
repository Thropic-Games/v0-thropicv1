"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserWithAddress } from "@/types/database"

export default function UserProfile({ initialUser }: { initialUser?: UserWithAddress }) {
  const [user, setUser] = useState<UserWithAddress | null>(initialUser || null)
  const [loading, setLoading] = useState(!initialUser)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadUserData() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session?.user) {
          setUser(null)
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from("user")
          .select(`
            *,
            address:address_id (*)
          `)
          .eq("id", session.user.id)
          .single()

        if (error) {
          console.error("Error loading user data:", error)
          setUser(null)
        } else {
          setUser(data)
        }
      } catch (error) {
        console.error("Error in loadUserData:", error)
      } finally {
        setLoading(false)
      }
    }

    if (!initialUser) {
      loadUserData()
    }
  }, [initialUser, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const handleEditProfile = () => {
    router.push("/profile/edit")
  }

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="h-32 w-32 rounded-full bg-gray-200 animate-pulse" />
          </div>
          <div className="space-y-2 mt-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <p className="mb-4">You are not logged in.</p>
          <Button onClick={() => router.push("/login")}>Log In</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Name</p>
          <p>{user.name || "Not provided"}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Email</p>
          <p>{user.email}</p>
        </div>

        {user.phone && (
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Phone</p>
            <p>{user.phone}</p>
          </div>
        )}

        {user.dob && (
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
            <p>{new Date(user.dob).toLocaleDateString()}</p>
          </div>
        )}

        {user.address && (
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Address</p>
            <p>
              {user.address.street}
              <br />
              {user.address.city}, {user.address.state} {user.address.postal_code}
              <br />
              {user.address.country}
            </p>
          </div>
        )}

        <div className="pt-4 flex flex-col sm:flex-row gap-2">
          <Button onClick={handleEditProfile} className="flex-1">
            Edit Profile
          </Button>
          <Button onClick={handleSignOut} variant="outline" className="flex-1">
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
