"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Sidebar } from "@/components/sidebar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { GlobalScrollContainer } from "@/components/global-scroll-container"
import { StaticHorizontalMenu } from "@/components/static-horizontal-menu"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getUserProfile, updateUserProfile, type UserProfile } from "@/actions/user"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

export default function EditProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileImage, setProfileImage] = useState<string>("/placeholder.svg?height=112&width=112")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    bio: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone_number: "",
  })

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        setLoading(true)

        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session?.user) {
          setError("Please sign in to edit your profile")
          setLoading(false)
          return
        }

        setUserId(session.user.id)

        // Fetch user profile data
        const { data: profileData, error: profileError } = await getUserProfile(session.user.id)

        if (profileError) {
          console.error("Error fetching profile:", profileError)
          setError("Failed to load profile data")
        } else if (profileData) {
          // Set form data from profile
          setFormData({
            first_name: profileData.first_name || "",
            last_name: profileData.last_name || "",
            username: profileData.username || "",
            email: profileData.email || "",
            bio: profileData.bio || "",
            address: profileData.address || "",
            city: profileData.city || "",
            state: profileData.state || "",
            zip: profileData.zip || "",
            phone_number: profileData.phone_number || "",
          })

          // Set profile image if available
          if (profileData.avatar_url) {
            setProfileImage(profileData.avatar_url)
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err)
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        // In a real app, you would upload the file to Supabase storage
        // For this demo, we'll just create a local URL
        const imageUrl = URL.createObjectURL(file)
        setProfileImage(imageUrl)

        // TODO: Upload to Supabase storage
        // const { data, error } = await supabase.storage
        //   .from('avatars')
        //   .upload(`${userId}/${file.name}`, file)

        // if (error) throw error

        // const avatarUrl = supabase.storage.from('avatars').getPublicUrl(data.path).data.publicUrl
        // setProfileImage(avatarUrl)
      } catch (err) {
        console.error("Error uploading image:", err)
        toast({
          title: "Error uploading image",
          description: "There was a problem uploading your profile image.",
          variant: "destructive",
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) {
      toast({
        title: "Authentication error",
        description: "You must be signed in to update your profile.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Update profile in Supabase
      const { success, error } = await updateUserProfile(userId, {
        ...formData,
        // Add avatar_url when implemented
        // avatar_url: profileImage !== "/placeholder.svg?height=112&width=112" ? profileImage : undefined,
      })

      if (error) {
        throw error
      }

      if (success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        })

        // Navigate back to profile page
        router.push("/profile")
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-black text-gray-900 dark:text-white overflow-hidden">
        <SiteHeader />
        <StaticHorizontalMenu />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !userId) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-black text-gray-900 dark:text-white overflow-hidden">
        <SiteHeader />
        <StaticHorizontalMenu />
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
                <p className="mb-4">{error || "Please sign in to edit your profile"}</p>
                <Button onClick={() => router.push("/login")}>Sign In</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black text-gray-900 dark:text-white overflow-hidden">
      <SiteHeader />
      <StaticHorizontalMenu />

      <GlobalScrollContainer>
        <div className="flex min-h-0">
          <Sidebar />

          <main className="flex-1">
            <div className="px-4 pb-32 md:pb-32 pt-6">
              <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-medium mb-6">Edit Profile</h1>

                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mb-32">
                  <CardHeader>
                    <CardTitle>Your Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Profile Image */}
                      <div className="flex flex-col items-center mb-4">
                        <div className="relative cursor-pointer" onClick={handleImageClick}>
                          <div className="w-24 h-24 rounded-full overflow-hidden">
                            <Image
                              src={profileImage || "/placeholder.svg"}
                              alt="Profile"
                              width={96}
                              height={96}
                              className="object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Camera className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        <button
                          type="button"
                          className="mt-2 text-xs text-blue-400 hover:text-blue-300"
                          onClick={handleImageClick}
                        >
                          Change Photo
                        </button>
                      </div>

                      {/* Name Fields - Side by side */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="first_name" className="text-sm">
                            First Name
                          </Label>
                          <Input
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-9"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="last_name" className="text-sm">
                            Last Name
                          </Label>
                          <Input
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-9"
                          />
                        </div>
                      </div>

                      {/* Username and Email - Side by side */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="username" className="text-sm">
                            Username
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">@</span>
                            <Input
                              id="username"
                              name="username"
                              value={formData.username}
                              onChange={handleChange}
                              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 pl-8 h-9"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="email" className="text-sm">
                            Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-9"
                            disabled
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-1">
                        <Label htmlFor="phone_number" className="text-sm">
                          Phone Number
                        </Label>
                        <Input
                          id="phone_number"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleChange}
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-9"
                          placeholder="(555) 123-4567"
                        />
                      </div>

                      {/* Address */}
                      <div className="space-y-1">
                        <Label htmlFor="address" className="text-sm">
                          Address
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-9"
                          placeholder="Street address"
                        />
                      </div>

                      {/* City, State, Zip - Side by side */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="col-span-2 space-y-1">
                          <Label htmlFor="city" className="text-sm">
                            City
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-9"
                            placeholder="City"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="state" className="text-sm">
                            State
                          </Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-9"
                            placeholder="State"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="zip" className="text-sm">
                            ZIP Code
                          </Label>
                          <Input
                            id="zip"
                            name="zip"
                            value={formData.zip}
                            onChange={handleChange}
                            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-9"
                            placeholder="ZIP"
                          />
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="space-y-1">
                        <Label htmlFor="bio" className="text-sm">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 min-h-[80px]"
                          placeholder="Tell us about yourself"
                        />
                      </div>

                      {/* Privacy Note */}
                      <Alert className="bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-600 py-2">
                        <AlertDescription className="text-blue-600 dark:text-blue-400 text-xs">
                          Your email address and personal information are only used for account purposes and will not be
                          displayed publicly.
                        </AlertDescription>
                      </Alert>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-between pb-6">
                    <Button
                      variant="outline"
                      onClick={() => router.push("/profile")}
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </GlobalScrollContainer>

      <MobileBottomNav />
    </div>
  )
}
