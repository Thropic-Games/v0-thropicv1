"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trophy, Heart, Users, BanknoteIcon as BankIcon, Camera, Edit, Settings, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { Sidebar } from "@/components/sidebar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { GlobalScrollContainer } from "@/components/global-scroll-container"
import { StaticHorizontalMenu } from "@/components/static-horizontal-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context" // CHANGED: Use useSupabaseAuth instead of useSupabase
import { getUserProfile } from "@/actions/user"
import type { UserWithAddress } from "@/types/supabase"

export default function ProfilePage() {
  const [imageHover, setImageHover] = useState(false)
  const { user, loading: authLoading } = useSupabaseAuth() // CHANGED: Use useSupabaseAuth instead of useSupabase
  const [profile, setProfile] = useState<UserWithAddress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Debug log to see auth state
  console.log("Profile page auth state:", {
    user: user?.email || "no user",
    authLoading,
    authenticated: !!user,
  })

  // Mock data for demonstration
  const hasUnclaimedBalance = true
  const unclaimedBalance = 125.0

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        console.log("Fetching profile for user:", user.id)
        const { data, error } = await getUserProfile(user.id)

        if (error) {
          console.error("Error fetching profile:", error)
          setError("Failed to load profile data")
        } else {
          console.log("Profile data retrieved:", data ? "success" : "no data")
          setProfile(data)
        }
      } catch (err) {
        console.error("Unexpected error:", err)
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      fetchProfile()
    }
  }, [user, authLoading])

  // If still loading auth state, show loading indicator
  if (authLoading) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-black text-gray-900 dark:text-white overflow-hidden">
        <SiteHeader />
        <StaticHorizontalMenu />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
            <p>Loading authentication status...</p>
          </div>
        </div>
      </div>
    )
  }

  // If not authenticated, show login prompt
  if (!user) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-black text-gray-900 dark:text-white overflow-hidden">
        <SiteHeader />
        <StaticHorizontalMenu />
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="mb-4">Please sign in to view your profile</p>
                <Button asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // If there was an error loading profile data
  if (error) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-black text-gray-900 dark:text-white overflow-hidden">
        <SiteHeader />
        <StaticHorizontalMenu />
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // If loading profile data
  if (loading) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-black text-gray-900 dark:text-white overflow-hidden">
        <SiteHeader />
        <StaticHorizontalMenu />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
            <p>Loading profile data...</p>
          </div>
        </div>
      </div>
    )
  }

  const displayName = profile?.name || user.email?.split("@")[0] || "User"

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black text-gray-900 dark:text-white overflow-hidden">
      {/* Header spans full width and stays fixed */}
      <SiteHeader />

      {/* Static Horizontal Menu */}
      <StaticHorizontalMenu />

      {/* Scrollable content area containing both sidebar and main content */}
      <GlobalScrollContainer>
        <div className="flex min-h-0">
          {/* Left Sidebar - scrolls with content */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1">
            <div className="px-4 pb-20 md:pb-0 pt-6">
              <div className="max-w-5xl mx-auto">
                {/* Profile Header Card */}
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mb-6">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                      {/* Profile Image with Upload Option */}
                      <div
                        className="relative"
                        onMouseEnter={() => setImageHover(true)}
                        onMouseLeave={() => setImageHover(false)}
                      >
                        <div className="w-28 h-28 rounded-full overflow-hidden">
                          <Image
                            src="/placeholder.svg?height=112&width=112"
                            alt="User Profile"
                            width={112}
                            height={112}
                            className="object-cover"
                          />
                        </div>
                        <button
                          className={`absolute inset-0 bg-black/60 rounded-full flex items-center justify-center transition-opacity ${
                            imageHover ? "opacity-100" : "opacity-0"
                          }`}
                          onClick={() => alert("Upload image functionality would go here")}
                        >
                          <Camera className="h-6 w-6 text-white" />
                        </button>
                      </div>

                      {/* Profile Info */}
                      <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h1 className="text-2xl font-medium">{displayName}</h1>
                            <p className="text-gray-500 dark:text-gray-400 font-light">{user.email}</p>
                          </div>
                          <div className="mt-2 md:mt-0 flex justify-center md:justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                              asChild
                            >
                              <Link href="/profile/edit">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Settings
                            </Button>
                          </div>
                        </div>

                        {/* Bio */}
                        {profile?.name && <p className="mt-2 text-gray-600 dark:text-gray-300">{profile.name}</p>}

                        {/* Stats Row */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4">
                          <div className="flex flex-col items-center md:items-start">
                            <div className="flex items-center gap-1 font-medium text-lg">
                              <Trophy className="h-4 w-4 text-yellow-500" />
                              <span>12</span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Games</span>
                          </div>
                          <div className="flex flex-col items-center md:items-start">
                            <div className="flex items-center gap-1 font-medium text-lg">
                              <Heart className="h-4 w-4 text-red-500" />
                              <span>$350</span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Donated</span>
                          </div>
                          <div className="flex flex-col items-center md:items-start">
                            <div className="flex items-center gap-1 font-medium text-lg">
                              <Users className="h-4 w-4 text-blue-500" />
                              <span>245</span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Friends</span>
                          </div>
                        </div>

                        {/* Unclaimed Balance Alert */}
                        {hasUnclaimedBalance && (
                          <div className="mt-6 bg-amber-50 dark:bg-yellow-500/10 border border-amber-200 dark:border-yellow-600 rounded-lg p-4">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                              <div>
                                <p className="text-amber-600 dark:text-yellow-400 font-medium">
                                  ${unclaimedBalance.toFixed(2)} in unclaimed winnings!
                                </p>
                                <p className="text-sm text-amber-600/80 dark:text-yellow-400/80">
                                  Connect your bank account to receive your funds.
                                </p>
                              </div>
                              <Button
                                className="bg-amber-500 hover:bg-amber-600 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white dark:text-black whitespace-nowrap"
                                asChild
                              >
                                <Link href="/profile/connect-bank">
                                  <BankIcon className="h-4 w-4 mr-2" />
                                  Connect Bank Account
                                </Link>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rest of the profile page content remains the same */}
                {/* Contact Information Card */}
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p>{profile?.email || user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                        <p>{profile?.phone || "Not provided"}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                        <p>
                          {profile?.address ? (
                            <>
                              {profile.address.street}
                              {profile.address.city && profile.address.state
                                ? `, ${profile.address.city}, ${profile.address.state}`
                                : ""}
                              {profile.address.zip ? ` ${profile.address.zip}` : ""}
                              {profile.address.country ? `, ${profile.address.country}` : ""}
                            </>
                          ) : (
                            "Not provided"
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tabs Section */}
                <Tabs defaultValue="activity" className="w-full">
                  <TabsList className="bg-white dark:bg-gray-900 w-full justify-start">
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="donations">Donations</TabsTrigger>
                    <TabsTrigger value="games">My Games</TabsTrigger>
                    <TabsTrigger value="winnings">Winnings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="activity" className="mt-6">
                    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <ActivityItem
                            avatar="/placeholder.svg?height=40&width=40"
                            name={displayName}
                            action="joined the Masters Tournament game"
                            time="2 hours ago"
                          />
                          <ActivityItem
                            avatar="/placeholder.svg?height=40&width=40"
                            name={displayName}
                            action="donated $50 to Goodwill SoCal"
                            time="1 day ago"
                          />
                          <ActivityItem
                            avatar="/placeholder.svg?height=40&width=40"
                            name={displayName}
                            action="won 3rd place in NBA Playoffs bracket"
                            time="3 days ago"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="donations" className="mt-6">
                    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                      <CardHeader>
                        <CardTitle>Your Donations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <DonationCard
                            charity="Goodwill SoCal"
                            amount="$50"
                            date="April 2, 2025"
                            logo="/placeholder.svg?height=60&width=60"
                          />
                          <DonationCard
                            charity="Epilepsy Walk"
                            amount="$100"
                            date="March 15, 2025"
                            logo="/placeholder.svg?height=60&width=60"
                          />
                          <DonationCard
                            charity="Ocean Conservation"
                            amount="$75"
                            date="February 28, 2025"
                            logo="/placeholder.svg?height=60&width=60"
                          />
                          <DonationCard
                            charity="Youth Basketball Programs"
                            amount="$125"
                            date="January 12, 2025"
                            logo="/placeholder.svg?height=60&width=60"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="games" className="mt-6">
                    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                      <CardHeader>
                        <CardTitle>Your Games</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <GameCard
                            title="Masters Tournament"
                            image="/images/hero/mastershero.jpg"
                            gradient="from-green-600 to-yellow-500"
                            status="In Progress"
                          />
                          <GameCard
                            title="NBA Playoffs"
                            image="/images/hero/nbahero.jpg"
                            gradient="from-blue-600 to-red-600"
                            status="Completed"
                          />
                          <GameCard
                            title="Stanley Cup Playoffs"
                            image="/images/hero/hockeyhero.jpg"
                            gradient="from-teal-400 to-blue-500"
                            status="Upcoming"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="winnings" className="mt-6">
                    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                      <CardHeader>
                        <CardTitle>Prize Winnings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <WinningItem game="NBA Playoffs" amount="$75.00" date="April 5, 2025" status="Pending" />
                          <WinningItem
                            game="Masters Tournament"
                            amount="$50.00"
                            date="April 1, 2025"
                            status="Pending"
                          />
                          <WinningItem game="March Madness" amount="$120.00" date="March 20, 2025" status="Paid" />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </main>
        </div>
      </GlobalScrollContainer>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}

interface ActivityItemProps {
  avatar: string
  name: string
  action: string
  time: string
}

function ActivityItem({ avatar, name, action, time }: ActivityItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
        <Image src={avatar || "/placeholder.svg"} alt={name} width={40} height={40} className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-light">
          <span className="font-normal">{name}</span> {action}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{time}</p>
      </div>
    </div>
  )
}

interface DonationCardProps {
  charity: string
  amount: string
  date: string
  logo: string
}

function DonationCard({ charity, amount, date, logo }: DonationCardProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-white p-2 flex items-center justify-center">
        <Image src={logo || "/placeholder.svg"} alt={charity} width={40} height={40} className="object-contain" />
      </div>
      <div>
        <h3 className="font-normal">{charity}</h3>
        <p className="text-amber-500 dark:text-yellow-500 font-medium">{amount}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-light">{date}</p>
      </div>
    </div>
  )
}

interface GameCardProps {
  title: string
  image: string
  gradient: string
  status: string
}

function GameCard({ title, image, gradient, status }: GameCardProps) {
  // Extract a game ID from the title (in a real app, you would use an actual ID)
  const gameId = title.toLowerCase().replace(/\s+/g, "-")

  return (
    <Link href={`/game-details/${gameId}`} className="block group">
      <div className={`bg-gradient-to-br ${gradient} rounded-xl overflow-hidden relative h-36`}>
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30 flex items-end p-4">
          <div>
            <h3 className="font-bold text-white">{title}</h3>
            <p className="text-sm text-white/80">Status: {status}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

interface WinningItemProps {
  game: string
  amount: string
  date: string
  status: "Pending" | "Paid" | "Failed"
}

function WinningItem({ game, amount, date, status }: WinningItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div>
        <h3 className="font-medium">{game}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-amber-500 dark:text-yellow-500 font-medium">{amount}</p>
        <Badge
          className={
            status === "Pending"
              ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
              : status === "Paid"
                ? "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400"
                : "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
          }
        >
          {status}
        </Badge>
      </div>
    </div>
  )
}
