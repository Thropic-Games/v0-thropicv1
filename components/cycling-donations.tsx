"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"

interface Donation {
  id: string
  name: string
  amount: string
  game: string
  partner?: string
  avatar?: string
  date?: string
}

interface CyclingDonationsProps {
  visibleCount?: number
  cycleInterval?: number
  showDebug?: boolean
  donations?: Donation[] // Allow passing in donations directly
}

export function CyclingDonations({
  visibleCount = 3,
  cycleInterval = 3000,
  showDebug = false,
  donations = [],
}: CyclingDonationsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { session } = useSupabaseAuth() // Get authentication status

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
    console.log("CyclingDonations mounted with", donations.length, "donations")
    console.log("Authentication status:", session ? "Authenticated" : "Not authenticated")

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [donations.length, session])

  // Get the current visible donations
  const getVisibleDonations = () => {
    if (!donations || donations.length === 0) return []
    if (donations.length <= visibleCount) return donations

    const result = []
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % donations.length
      result.push(donations[index])
    }
    return result
  }

  // Set up cycling interval
  useEffect(() => {
    if (!isClient || !donations || donations.length <= visibleCount) return

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Set up new interval
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % donations.length
        console.log(`Cycling to index ${nextIndex} of ${donations.length}`)
        return nextIndex
      })
    }, cycleInterval)

    console.log(`Set up cycling interval: ${cycleInterval}ms, ${donations.length} donations, ${visibleCount} visible`)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isClient, donations, visibleCount, cycleInterval])

  // If not client-side yet, show loading
  if (!isClient) return <DonationsLoading count={visibleCount} />

  // If no donations, show loading
  if (!donations || donations.length === 0) {
    return <DonationsLoading count={visibleCount} />
  }

  const visibleDonations = getVisibleDonations()

  return (
    <div className="space-y-2">
      {showDebug && (
        <div className="text-xs text-gray-400 mb-2">
          <div>
            Index: {currentIndex}/{donations.length}
          </div>
          <div>Auth: {session ? "Yes" : "No"}</div>
        </div>
      )}
      {visibleDonations.map((donation, index) => (
        <DonationItem key={`${donation.id}-${index}`} donation={donation} />
      ))}
    </div>
  )
}

// Helper component to render a donation item
function DonationItem({ donation }: { donation: Donation }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
        <Image
          src={donation.avatar || "/placeholder.svg?height=40&width=40"}
          alt={donation.name}
          width={40}
          height={40}
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-normal truncate">{donation.name}</p>
        <div className="flex flex-col text-sm">
          <span className="text-yellow-500 font-light">
            {donation.amount} - {donation.game}
          </span>
          {donation.partner && <span className="text-gray-500 text-xs">{donation.partner}</span>}
        </div>
      </div>
    </div>
  )
}

// Loading placeholder
function DonationsLoading({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2 mb-1"></div>
              <div className="h-2 bg-gray-200 rounded animate-pulse w-1/3"></div>
            </div>
          </div>
        ))}
    </div>
  )
}
