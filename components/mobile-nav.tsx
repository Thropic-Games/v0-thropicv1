"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Compass, GamepadIcon, User, PlusCircle, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-black text-white border-r border-gray-800 p-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" onClick={() => setOpen(false)}>
              <Logo size="medium" />
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <nav className="space-y-1">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-3 py-3 px-4",
                isActive("/")
                  ? "border-l-[3px] border-orange-600 bg-gradient-to-r from-orange-600/20 to-transparent text-yellow-500 font-normal"
                  : "hover:bg-gradient-to-r hover:from-gray-800/80 hover:to-transparent font-light",
              )}
              onClick={() => setOpen(false)}
            >
              <Compass className="h-5 w-5" />
              <span>Explore</span>
            </Link>
            <Link
              href="/games"
              className={cn(
                "flex items-center gap-3 py-3 px-4",
                isActive("/games")
                  ? "border-l-[3px] border-orange-600 bg-gradient-to-r from-orange-600/20 to-transparent text-yellow-500 font-normal"
                  : "hover:bg-gradient-to-r hover:from-gray-800/80 hover:to-transparent font-light",
              )}
              onClick={() => setOpen(false)}
            >
              <GamepadIcon className="h-5 w-5" />
              <span>Games</span>
            </Link>
            <Link
              href="/profile"
              className={cn(
                "flex items-center gap-3 py-3 px-4",
                isActive("/profile")
                  ? "border-l-[3px] border-orange-600 bg-gradient-to-r from-orange-600/20 to-transparent text-yellow-500 font-normal"
                  : "hover:bg-gradient-to-r hover:from-gray-800/80 hover:to-transparent font-light",
              )}
              onClick={() => setOpen(false)}
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
                  ? "border-l-[3px] border-orange-600 bg-gradient-to-r from-orange-600/20 to-transparent text-yellow-500 font-normal"
                  : "hover:bg-gradient-to-r hover:from-gray-800/80 hover:to-transparent font-light",
              )}
              onClick={() => setOpen(false)}
            >
              <PlusCircle className="h-5 w-5" />
              <span>Create a Game</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 py-3 px-4 hover:bg-gradient-to-r hover:from-gray-800/80 hover:to-transparent font-light"
              onClick={() => setOpen(false)}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
