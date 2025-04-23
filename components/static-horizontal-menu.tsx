"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import {
  Trophy,
  Activity,
  CircleDot,
  Zap,
  Sparkles,
  Flag,
  PawPrintIcon as Paw,
  GraduationCap,
  Leaf,
  Heart,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function StaticHorizontalMenu() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category")

  const menuItems = [
    { name: "Football", icon: <Trophy className="h-4 w-4" />, category: "Football" },
    { name: "Basketball", icon: <Activity className="h-4 w-4" />, category: "Basketball" },
    { name: "Baseball", icon: <CircleDot className="h-4 w-4" />, category: "Baseball" },
    { name: "Hockey", icon: <Zap className="h-4 w-4" />, category: "Hockey" },
    { name: "Awards Shows", icon: <Sparkles className="h-4 w-4" />, category: "Entertainment" },
    { name: "Golf", icon: <Flag className="h-4 w-4" />, category: "Golf" },
    // New categories
    { name: "Animals", icon: <Paw className="h-4 w-4" />, category: "Animals" },
    { name: "Education", icon: <GraduationCap className="h-4 w-4" />, category: "Education" },
    { name: "Environment", icon: <Leaf className="h-4 w-4" />, category: "Environment" },
    { name: "Health", icon: <Heart className="h-4 w-4" />, category: "Health" },
  ]

  const isActive = (category: string) => {
    // Check if we're on the games page and the category matches
    return pathname.startsWith("/games") && currentCategory === category
  }

  return (
    <div className="bg-gray-900 border-b border-gray-800 hidden md:block">
      <div className="container mx-auto px-4 overflow-x-auto">
        <nav className="flex items-center space-x-6 h-10 min-w-max">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={`/games?category=${encodeURIComponent(item.category)}`}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors whitespace-nowrap text-sm",
                isActive(item.category)
                  ? "text-yellow-500 font-medium"
                  : "text-gray-300 hover:text-white hover:bg-gray-800",
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
