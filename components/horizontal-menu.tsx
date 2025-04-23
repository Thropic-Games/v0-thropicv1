"use client"

import { useScroll } from "@/hooks/use-scroll"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Compass, GamepadIcon, User, PlusCircle, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function HorizontalMenu() {
  // Use the sidebar-nav ID to detect when it's out of view
  const sidebarScrolledOut = useScroll("sidebar-nav")
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <div
      className={cn(
        "bg-gray-800 shadow-md overflow-hidden transition-all duration-300 ease-in-out hidden md:block rounded-lg",
        sidebarScrolledOut ? "h-14 opacity-100 mb-6" : "h-0 opacity-0 mb-0",
      )}
    >
      <nav className="flex items-center justify-center space-x-8 h-14 px-4">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
            isActive("/") ? "text-yellow-500 font-medium" : "text-gray-300 hover:text-white hover:bg-gray-700",
          )}
        >
          <Compass className="h-5 w-5" />
          <span>Explore</span>
        </Link>
        <Link
          href="/games"
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
            isActive("/games") ? "text-yellow-500 font-medium" : "text-gray-300 hover:text-white hover:bg-gray-700",
          )}
        >
          <GamepadIcon className="h-5 w-5" />
          <span>Games</span>
        </Link>
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
            isActive("/profile") ? "text-yellow-500 font-medium" : "text-gray-300 hover:text-white hover:bg-gray-700",
          )}
        >
          <User className="h-5 w-5" />
          <span>Profile</span>
        </Link>
        <Link
          href="#"
          className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Create a Game</span>
        </Link>
        <Link
          href="#"
          className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  )
}
