"use client"

import { Suspense } from "react"
import Image from "next/image"
import dynamic from "next/dynamic"

// Dynamically import components that aren't needed for initial render
const Carousel = dynamic(() => import("@/components/carousel").then((mod) => ({ default: mod.Carousel })), {
  loading: () => (
    <div className="w-full h-[400px] bg-gray-800 animate-pulse rounded-xl flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
    </div>
  ),
  ssr: false, // Disable SSR for carousel to avoid hydration issues
})

const DatabaseDonations = dynamic(
  () => import("@/components/database-donations").then((mod) => ({ default: mod.DatabaseDonations })),
  {
    loading: () => (
      <div className="w-full h-full bg-gray-900 animate-pulse rounded-xl p-4">
        <div className="h-6 w-32 bg-gray-800 rounded mb-4"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-800 rounded"></div>
          ))}
        </div>
      </div>
    ),
  },
)

export function HomeContent() {
  return (
    <div className="px-4 pb-20 md:pb-0 pt-6">
      {/* Featured Banner and Donations */}
      <div className="flex flex-col lg:flex-row gap-6 pt-0">
        <div className="flex-1">
          {/* The Carousel now automatically sources images from /images/hero/ */}
          <Suspense fallback={<div className="w-full h-[400px] bg-gray-800 animate-pulse rounded-xl"></div>}>
            <Carousel height={400} className="mb-0" />
          </Suspense>
        </div>

        {/* Right Sidebar - Recent Donations - Reduced width */}
        <aside className="w-full lg:w-64 lg:flex-shrink-0">
          <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 h-[400px] overflow-hidden">
            <h3 className="font-bold text-lg mb-4">Recent Donations</h3>
            <div className="vertical-carousel">
              <Suspense
                fallback={
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-10 bg-gray-800 rounded animate-pulse"></div>
                    ))}
                  </div>
                }
              >
                <DatabaseDonations
                  limit={20}
                  visibleCount={5}
                  cycleInterval={5000}
                  animationDuration={1000}
                  carouselMode={true}
                  filterNullAmounts={true}
                />
              </Suspense>
            </div>
          </div>
        </aside>
      </div>

      {/* Games Section */}
      <h2 className="text-2xl font-medium my-8">Games for Good</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {/* Game Card 1 */}
        <div className="bg-gradient-to-br from-orange-500 to-blue-600 rounded-xl overflow-hidden relative h-48">
          <Image src="/images/hero/nbahero.jpg" alt="NBA Playoffs" fill className="object-cover" />
        </div>

        {/* Game Card 2 */}
        <div className="bg-white rounded-xl overflow-hidden relative h-48">
          <Image src="/images/hero/mastershero.jpg" alt="Masters Tournament" fill className="object-cover" />
        </div>

        {/* Game Card 3 */}
        <div className="bg-gradient-to-r from-blue-600 to-red-600 rounded-xl overflow-hidden relative h-48">
          <Image src="/images/hero/hockeyhero.jpg" alt="Stanley Cup Playoffs" fill className="object-cover" />
        </div>

        {/* Game Card 4 */}
        <div className="bg-gradient-to-b from-teal-400 to-pink-500 rounded-xl overflow-hidden relative h-48">
          <Image src="/images/hero/mlbhero.jpg" alt="MLB All-Star Week" fill className="object-cover" />
        </div>
      </div>
    </div>
  )
}
