"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import type { Donation } from "@/hooks/use-recent-donations"

interface VerticalCarouselProps {
  items: Donation[]
  visibleCount?: number
  cycleInterval?: number
  animationDuration?: number
}

export function VerticalCarousel({
  items,
  visibleCount = 5,
  cycleInterval = 5000,
  animationDuration = 1000,
}: VerticalCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const totalItems = items.length

  // Function to get the visible items
  const getVisibleItems = () => {
    const visibleItems = []
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % totalItems
      visibleItems.push(items[index])
    }
    return visibleItems
  }

  // Set up the automatic cycling
  useEffect(() => {
    if (totalItems <= visibleCount) return

    const cycle = () => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % totalItems)
        setIsTransitioning(false)
      }, animationDuration)
    }

    intervalRef.current = setInterval(cycle, cycleInterval)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [totalItems, visibleCount, cycleInterval, animationDuration])

  if (totalItems === 0) {
    return <div className="text-center text-gray-600 dark:text-gray-300">No donations available</div>
  }

  const visibleItems = getVisibleItems()

  return (
    <div className="vertical-carousel-container h-full">
      <div
        className="vertical-carousel-track"
        style={{
          transform: isTransitioning ? `translateY(-${100 / visibleCount}%)` : "translateY(0)",
          transition: isTransitioning ? `transform ${animationDuration}ms ease` : "none",
        }}
      >
        {/* Current visible items */}
        {visibleItems.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="vertical-carousel-item py-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                <Image
                  src={item.avatar || "/placeholder.svg?height=40&width=40"}
                  alt={item.name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-normal truncate text-gray-900 dark:text-white">{item.name}</p>
                <div className="flex flex-col text-sm">
                  <span className="text-orange-600 dark:text-yellow-500 font-light">
                    {item.amount} - {item.game}
                  </span>
                  {item.partner && <span className="text-gray-500 dark:text-gray-400 text-xs">{item.partner}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Next item that will appear (for smooth transition) */}
        {isTransitioning && totalItems > visibleCount && (
          <div className="vertical-carousel-item py-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                <Image
                  src={
                    items[(currentIndex + visibleCount) % totalItems].avatar || "/placeholder.svg?height=40&width=40"
                  }
                  alt={items[(currentIndex + visibleCount) % totalItems].name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-normal truncate text-gray-900 dark:text-white">
                  {items[(currentIndex + visibleCount) % totalItems].name}
                </p>
                <div className="flex flex-col text-sm">
                  <span className="text-orange-600 dark:text-yellow-500 font-light">
                    {items[(currentIndex + visibleCount) % totalItems].amount} -{" "}
                    {items[(currentIndex + visibleCount) % totalItems].game}
                  </span>
                  {items[(currentIndex + visibleCount) % totalItems].partner && (
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      {items[(currentIndex + visibleCount) % totalItems].partner}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
