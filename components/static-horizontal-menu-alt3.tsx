"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dumbbell, CircleDot, Swords, Ticket, Flag } from "lucide-react"
import { cn } from "@/lib/utils"

export function StaticHorizontalMenuAlt3() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  // Note: Some of these icons might not be available in the current Lucide version
  // If any aren't available, they would need to be replaced with available alternatives
  const menuItems = [
    { name: "Football", icon: <Dumbbell className="h-5 w-5" />, path: "/football" },
    { name: "Basketball", icon: <CircleDot className="h-5 w-5" />, path: "/basketball" },
    // Baseball icon might not exist in Lucide, so using CircleDot as fallback
    { name: "Baseball", icon: <CircleDot className="h-5 w-5" />, path: "/baseball" },
    { name: "Hockey", icon: <Swords className="h-5 w-5" />, path: "/hockey" },
    { name: "Awards Shows", icon: <Ticket className="h-5 w-5" />, path: "/awards" },
    // GolfIcon might not exist in Lucide, so using Flag as fallback
    { name: "Golf", icon: <Flag className="h-5 w-5" />, path: "/golf" },
  ]

  return (
    <div className="bg-gray-900 border-b border-gray-800 hidden md:block">
      <div className="container mx-auto px-4">
        <nav className="flex items-center space-x-8 h-12 overflow-x-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap",
                isActive(item.path)
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
