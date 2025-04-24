"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Compass, GamepadIcon, User, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSupabase } from "@/contexts/supabase-context"

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useSupabase()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (user) {
      router.push("/profile")
    } else {
      router.push("/login")
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 md:hidden">
      <nav className="flex items-center justify-around h-16">
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center justify-center w-full h-full",
            isActive("/") ? "text-orange-600 dark:text-yellow-500" : "text-gray-600 dark:text-gray-400",
          )}
        >
          <Compass className="h-6 w-6" />
          <span className="text-xs mt-1">Explore</span>
        </Link>
        <Link
          href="/games"
          className={cn(
            "flex flex-col items-center justify-center w-full h-full",
            isActive("/games") ? "text-orange-600 dark:text-yellow-500" : "text-gray-600 dark:text-gray-400",
          )}
        >
          <GamepadIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Games</span>
        </Link>
        <Link
          href="/create-game"
          className={cn(
            "flex flex-col items-center justify-center w-full h-full",
            isActive("/create-game") ? "text-orange-600 dark:text-yellow-500" : "text-gray-600 dark:text-gray-400",
          )}
        >
          <PlusCircle className="h-6 w-6" />
          <span className="text-xs mt-1">Create</span>
        </Link>
        <a
          href="#"
          onClick={handleProfileClick}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full",
            isActive("/profile") ? "text-orange-600 dark:text-yellow-500" : "text-gray-600 dark:text-gray-400",
          )}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </a>
      </nav>
    </div>
  )
}
