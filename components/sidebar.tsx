"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Compass, GamepadIcon, User, PlusCircle, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { CTABox } from "@/components/cta-box"

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block border-r border-gray-800 overflow-hidden">
      <div className="py-6 px-0 h-full flex flex-col" id="sidebar-nav">
        <nav className="space-y-1">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 py-3 px-4",
              isActive("/")
                ? "border-l-[3px] border-orange-600 bg-gradient-to-r from-orange-600/20 to-transparent text-yellow-500 font-medium"
                : "hover:bg-gradient-to-r hover:from-gray-800/80 hover:to-transparent font-light",
            )}
          >
            <Compass className="h-5 w-5" />
            <span>Explore</span>
          </Link>
          <Link
            href="/games"
            className={cn(
              "flex items-center gap-3 py-3 px-4",
              isActive("/games")
                ? "border-l-[3px] border-orange-600 bg-gradient-to-r from-orange-600/20 to-transparent text-yellow-500 font-medium"
                : "hover:bg-gradient-to-r hover:from-gray-800/80 hover:to-transparent font-light",
            )}
          >
            <GamepadIcon className="h-5 w-5" />
            <span>Games</span>
          </Link>
          <Link
            href="/profile"
            className={cn(
              "flex items-center gap-3 py-3 px-4",
              isActive("/profile")
                ? "border-l-[3px] border-orange-600 bg-gradient-to-r from-orange-600/20 to-transparent text-yellow-500 font-medium"
                : "hover:bg-gradient-to-r hover:from-gray-800/80 hover:to-transparent font-light",
            )}
          >
            <User className="h-5 w-5" />
            <span>Profile</span>
          </Link>

          <div className="my-6 border-t border-gray-800"></div>

          <Link
            href="/create-game"
            className={cn(
              "flex items-center gap-3 py-3 px-4",
              isActive("/create-game")
                ? "border-l-[3px] border-orange-600 bg-gradient-to-r from-orange-600/20 to-transparent text-yellow-500 font-medium"
                : "hover:bg-gradient-to-r hover:from-gray-800/80 hover:to-transparent font-light",
            )}
          >
            <PlusCircle className="h-5 w-5" />
            <span>Create a Game</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 py-3 px-4 hover:bg-gradient-to-r hover:from-gray-800/80 hover:to-transparent font-light"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>

          {/* CTA Box - Moved below Settings */}
          <div className="px-4 mt-6">
            <CTABox />
          </div>
        </nav>
      </div>
    </aside>
  )
}
