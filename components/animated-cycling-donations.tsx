"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import type { Donation } from "@/hooks/use-recent-donations"

interface AnimatedCyclingDonationsProps {
  donations: Donation[]
  visibleCount?: number
  cycleInterval?: number
  animationDuration?: number
}

export function AnimatedCyclingDonations({
  donations,
  visibleCount = 5,
  cycleInterval = 5000,
  animationDuration = 1000,
}: AnimatedCyclingDonationsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get the current visible donations
  const getVisibleDonations = () => {
    if (!donations || donations.length === 0) return []

    const result = []
    const count = Math.min(visibleCount, donations.length)

    for (let i = 0; i < count; i++) {
      const index = (currentIndex + i) % donations.length
      result.push(donations[index])
    }

    return result
  }

  // Set up cycling interval
  useEffect(() => {
    if (!donations || donations.length <= visibleCount) return

    const cycle = () => {
      setIsAnimating(true)

      // After animation duration, update the index and reset animation state
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % donations.length)
        setIsAnimating(false)
      }, animationDuration)
    }

    // Set up interval for cycling
    intervalRef.current = setInterval(cycle, cycleInterval)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [donations, visibleCount, cycleInterval, animationDuration])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  if (!donations || donations.length === 0) {
    return <div className="text-center py-4">No donations to display</div>
  }

  const visibleDonations = getVisibleDonations()

  return (
    <div className="space-y-2 relative">
      {visibleDonations.map((donation, index) => (
        <div
          key={`${donation.id}-${index}`}
          className={`transition-all duration-${animationDuration}ms ${
            index === 0 && isAnimating ? "opacity-0 -translate-y-full h-0 mb-0 overflow-hidden" : "opacity-100"
          } ${index === visibleCount - 1 && isAnimating ? "translate-y-0" : ""}`}
        >
          <DonationItem donation={donation} />
        </div>
      ))}

      {/* Next donation that will appear (hidden until animation) */}
      {isAnimating && donations.length > visibleCount && (
        <div
          className={`transition-all duration-${animationDuration}ms absolute bottom-0 left-0 right-0 translate-y-full opacity-0 ${
            isAnimating ? "!translate-y-0 !opacity-100" : ""
          }`}
        >
          <DonationItem donation={donations[(currentIndex + visibleCount) % donations.length]} />
        </div>
      )}
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
