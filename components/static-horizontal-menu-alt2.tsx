"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Trophy, BarChart4, Crosshair, Snowflake, Sparkles, Flag } from "lucide-react"
import { cn } from "@/lib/utils"

export function StaticHorizontalMenuAlt2() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  const menuItems = [
    { name: "Football", icon: <Trophy className="h-5 w-5" />, path: "/football" },
    { name: "Basketball", icon: <BarChart4 className="h-5 w-5" />, path: "/basketball" },
    { name: "Baseball", icon: <Crosshair className="h-5 w-5" />, path: "/baseball" },
    { name: "Hockey", icon: <Snowflake className="h-5 w-5" />, path: "/hockey" },
    { name: "Awards Shows", icon: <Sparkles className="h-5 w-5" />, path: "/awards" },
    { name: "Golf", icon: <Flag className="h-5 w-5" />, path: "/golf" },
  ]

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 hidden md:block">
      <div className="container mx-auto px-4">
        <nav className="flex items-center space-x-8 h-12 overflow-x-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap",
                isActive(item.path)
                  ? "text-orange-600 dark:text-yellow-500 font-medium"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800",
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
