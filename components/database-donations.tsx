"use client"

import { useRecentDonations } from "@/hooks/use-recent-donations"
import { AnimatedCyclingDonations } from "@/components/animated-cycling-donations"
import { VerticalCarousel } from "@/components/vertical-carousel"
import { useEffect, useState } from "react"

interface DatabaseDonationsProps {
  limit?: number
  visibleCount?: number
  cycleInterval?: number
  animationDuration?: number
  carouselMode?: boolean
  filterNullAmounts?: boolean
}

export function DatabaseDonations({
  limit = 20,
  visibleCount = 5,
  cycleInterval = 5000,
  animationDuration = 1000,
  carouselMode = false,
  filterNullAmounts = false,
}: DatabaseDonationsProps) {
  const { donations, loading, error, supabaseStatus } = useRecentDonations(limit)
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
    console.log("DatabaseDonations mounted")
  }, [])

  // Filter out donations with null amounts if requested
  const filteredDonations = filterNullAmounts
    ? donations?.filter(
        (donation) =>
          donation.amount !== null &&
          donation.amount !== undefined &&
          donation.amount !== "Unknown" &&
          donation.amount !== "$0" &&
          donation.amount !== "0",
      )
    : donations

  useEffect(() => {
    if (isClient) {
      console.log("Database donations:", donations?.length || 0)
      if (filterNullAmounts) {
        console.log("Filtered donations (no null amounts):", filteredDonations?.length || 0)
      }
      console.log("Loading:", loading)
      console.log("Error:", error?.message)
      console.log("Supabase status:", supabaseStatus)
    }
  }, [isClient, donations, filteredDonations, filterNullAmounts, loading, error, supabaseStatus])

  // If we're still on the server, show a loading state
  if (!isClient) {
    return <div className="text-center py-4 text-gray-600 dark:text-gray-300">Loading...</div>
  }

  // If still loading, show loading state
  if (loading) {
    return <div className="text-center py-4 text-gray-600 dark:text-gray-300">Loading donations...</div>
  }

  // If there's an error or no donations, show error message
  if (error || !filteredDonations || filteredDonations.length === 0) {
    console.log("Error fetching donations:", error?.message || "No donations found")
    return (
      <div className="text-center py-4 text-red-600 dark:text-red-400">
        <p>Unable to load donations from database.</p>
        <p className="text-sm text-red-500 dark:text-red-300 mt-1">
          {error ? `Error: ${error.message}` : "No donations found"}
        </p>
      </div>
    )
  }

  // Use either the carousel or animated cycling component based on the prop
  console.log("Using database donations:", filteredDonations.length)

  if (carouselMode) {
    return (
      <VerticalCarousel
        items={filteredDonations}
        visibleCount={visibleCount}
        cycleInterval={cycleInterval}
        animationDuration={animationDuration}
      />
    )
  }

  return (
    <AnimatedCyclingDonations
      donations={filteredDonations}
      visibleCount={visibleCount}
      cycleInterval={cycleInterval}
      animationDuration={animationDuration}
    />
  )
}
