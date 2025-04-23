"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Compass, GamepadIcon, User, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileBottomNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-800 md:hidden">
      <nav className="flex items-center justify-around h-16">
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center justify-center w-full h-full",
            isActive("/") ? "text-yellow-500" : "text-gray-400",
          )}
        >
          <Compass className="h-6 w-6" />
          <span className="text-xs mt-1">Explore</span>
        </Link>
        <Link
          href="/games"
          className={cn(
            "flex flex-col items-center justify-center w-full h-full",
            isActive("/games") ? "text-yellow-500" : "text-gray-400",
          )}
        >
          <GamepadIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Games</span>
        </Link>
        <Link
          href="/create-game"
          className={cn(
            "flex flex-col items-center justify-center w-full h-full",
            isActive("/create-game") ? "text-yellow-500" : "text-gray-400",
          )}
        >
          <PlusCircle className="h-6 w-6" />
          <span className="text-xs mt-1">Create</span>
        </Link>
        <Link
          href="/profile"
          className={cn(
            "flex flex-col items-center justify-center w-full h-full",
            isActive("/profile") ? "text-yellow-500" : "text-gray-400",
          )}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </nav>
    </div>
  )
}
