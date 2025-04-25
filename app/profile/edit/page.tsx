"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UserWithAddress, User, Address } from "@/types/database"

export default function EditProfilePage() {
  const [user, setUser] = useState<UserWithAddress | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  })

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
          router.push("/login")
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
          setFormData({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
            street: data.address?.street || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            postal_code: data.address?.postal_code || "",
            country: data.address?.country || "",
          })
        }
      } catch (error) {
        console.error("Error in loadUserData:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [supabase, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (!user) return

      // First, handle the address
      let addressId = user.address_id

      if (formData.street && formData.city && formData.postal_code) {
        // Create or update address
        const addressData: Partial<Address> = {
          id: user.address?.id,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
        }

        const { data: address, error: addressError } = await supabase
          .from("address")
          .upsert(addressData)
          .select()
          .single()

        if (addressError) {
          console.error("Error saving address:", addressError)
          return
        }

        addressId = address.id
      }

      // Now update the user
      const userData: Partial<User> = {
        id: user.id,
        name: formData.name,
        phone: formData.phone || null,
        dob: formData.dob || null,
        address_id: addressId,
        updated_ts: new Date().toISOString(),
        version: (user.version || 0) + 1,
      }

      const { error: userError } = await supabase.from("user").update(userData).eq("id", user.id)

      if (userError) {
        console.error("Error saving user:", userError)
        return
      }

      router.push("/profile")
      router.refresh()
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <p className="mb-4">You need to be logged in to edit your profile.</p>
          <Button onClick={() => router.push("/login")}>Log In</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" value={formData.email} disabled placeholder="Your email" />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} />
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-medium mb-2">Address</h3>

            <div className="space-y-2">
              <Label htmlFor="street">Street</Label>
              <Input
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State/Province"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  placeholder="Postal code"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-2">
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/profile")}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
