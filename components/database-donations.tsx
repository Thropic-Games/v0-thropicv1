"use client"

import { useRecentDonations } from "@/hooks/use-recent-donations"
import { CyclingDonations } from "@/components/cycling-donations"
import { useEffect, useState } from "react"

export function DatabaseDonations() {
  const { donations, loading, error, supabaseStatus } = useRecentDonations(10)
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
    console.log("DatabaseDonations mounted")
  }, [])

  useEffect(() => {
    if (isClient) {
      console.log("Database donations:", donations?.length || 0)
      console.log("Loading:", loading)
      console.log("Error:", error?.message)
      console.log("Supabase status:", supabaseStatus)
    }
  }, [isClient, donations, loading, error, supabaseStatus])

  // If we're still on the server, show a loading state
  if (!isClient) {
    return <div className="text-center py-4">Loading...</div>
  }

  // If still loading, show loading state
  if (loading) {
    return <div className="text-center py-4">Loading donations...</div>
  }

  // If there's an error or no donations, show error message
  if (error || !donations || donations.length === 0) {
    console.log("Error fetching donations:", error?.message || "No donations found")
    return (
      <div className="text-center py-4 text-red-400">
        <p>Unable to load donations from database.</p>
        <p className="text-sm text-red-300 mt-1">{error ? `Error: ${error.message}` : "No donations found"}</p>
      </div>
    )
  }

  // Otherwise use the database donations
  console.log("Using database donations:", donations.length)
  return <CyclingDonations visibleCount={3} cycleInterval={3000} donations={donations} />
}
