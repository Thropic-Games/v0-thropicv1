"use client"

import type React from "react"

import { useState, useRef } from "react"
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
import { Camera, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function EditProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileImage, setProfileImage] = useState<string>("/placeholder.svg?height=112&width=112")
  const [formData, setFormData] = useState({
    firstName: "Gabriel",
    lastName: "Erickson",
    username: "gabriel_erickson",
    email: "gabriel@example.com",
    bio: "Passionate about sports and fundraising for good causes.",
    address: "123 Main Street, Apt 4B",
    city: "Los Angeles",
    state: "CA",
    zip: "90001",
    phoneNumber: "(555) 123-4567",
    dob: "1990-05-15",
  })

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file to your server or cloud storage
      // For this demo, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file)
      setProfileImage(imageUrl)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call to update profile
    setTimeout(() => {
      setIsSubmitting(false)
      // Navigate back to profile page
      router.push("/profile")
    }, 1500)
  }

  return (
    <div className="flex flex-col h-full bg-black text-white overflow-hidden">
      <SiteHeader />
      <StaticHorizontalMenu />

      <GlobalScrollContainer>
        <div className="flex min-h-0">
          <Sidebar />

          <main className="flex-1">
            <div className="px-4 pb-32 md:pb-32 pt-6">
              <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-medium mb-6">Edit Profile</h1>

                <Card className="bg-gray-900 border-gray-800 mb-32">
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
                          <Label htmlFor="firstName" className="text-sm">
                            First Name
                          </Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="bg-gray-800 border-gray-700 h-9"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="lastName" className="text-sm">
                            Last Name
                          </Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="bg-gray-800 border-gray-700 h-9"
                            required
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
                              className="bg-gray-800 border-gray-700 pl-8 h-9"
                              required
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
                            className="bg-gray-800 border-gray-700 h-9"
                            required
                          />
                        </div>
                      </div>

                      {/* Phone and DOB - Side by side */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="phoneNumber" className="text-sm">
                            Phone Number
                          </Label>
                          <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="bg-gray-800 border-gray-700 h-9"
                            placeholder="(555) 123-4567"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="dob" className="text-sm">
                            Date of Birth
                          </Label>
                          <Input
                            id="dob"
                            name="dob"
                            type="date"
                            value={formData.dob}
                            onChange={handleChange}
                            className="bg-gray-800 border-gray-700 h-9"
                          />
                        </div>
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
                          className="bg-gray-800 border-gray-700 h-9"
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
                            className="bg-gray-800 border-gray-700 h-9"
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
                            className="bg-gray-800 border-gray-700 h-9"
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
                            className="bg-gray-800 border-gray-700 h-9"
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
                          className="bg-gray-800 border-gray-700 min-h-[80px]"
                          placeholder="Tell us about yourself"
                        />
                      </div>

                      {/* Privacy Note */}
                      <Alert className="bg-blue-500/10 border-blue-600 py-2">
                        <AlertDescription className="text-blue-400 text-xs">
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
                      className="bg-gray-800 border-gray-700"
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
