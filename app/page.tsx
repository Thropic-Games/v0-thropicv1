import { SiteHeader } from "@/components/site-header"
import { Sidebar } from "@/components/sidebar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { GlobalScrollContainer } from "@/components/global-scroll-container"
import { StaticHorizontalMenu } from "@/components/static-horizontal-menu"
import { HomeContent } from "@/components/home-content"

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
            <HomeContent />
          </main>
        </div>
      </GlobalScrollContainer>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
