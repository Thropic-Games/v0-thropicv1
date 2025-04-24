import Image from "next/image"
import { Carousel } from "@/components/carousel"
import { SiteHeader } from "@/components/site-header"
import { Sidebar } from "@/components/sidebar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { GlobalScrollContainer } from "@/components/global-scroll-container"
import { StaticHorizontalMenu } from "@/components/static-horizontal-menu"
import { DatabaseDonations } from "@/components/database-donations"

export default function Home() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-black text-gray-800 dark:text-white overflow-hidden">
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
              {/* Featured Banner and Donations */}
              <div className="flex flex-col lg:flex-row gap-6 pt-0">
                <div className="flex-1">
                  {/* The Carousel now automatically sources images from /images/hero/ */}
                  <Carousel height={400} className="mb-0" />
                </div>

                {/* Right Sidebar - Recent Donations - Reduced width */}
                <aside className="w-full lg:w-64 lg:flex-shrink-0">
                  <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 h-[400px] overflow-hidden">
                    <h3 className="font-bold text-lg mb-4">Recent Donations</h3>
                    <div className="vertical-carousel">
                      <DatabaseDonations
                        limit={20}
                        visibleCount={5}
                        cycleInterval={5000}
                        animationDuration={1000}
                        carouselMode={true}
                        filterNullAmounts={true}
                      />
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
          </main>
        </div>
      </GlobalScrollContainer>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
