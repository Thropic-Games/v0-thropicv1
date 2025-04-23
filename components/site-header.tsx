"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { HeaderBalanceAlert } from "@/components/header-balance-alert"

export function SiteHeader() {
  return (
    <>
      <HeaderBalanceAlert />
      <header className="sticky top-0 z-50 bg-black border-b border-gray-800 px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Removed MobileNav (hamburger menu) */}
          <Link href="/">
            <Logo size="large" className="hidden md:block" />
            <Logo size="small" className="md:hidden" />
          </Link>
        </div>

        {/* Search field - hidden on mobile */}
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input type="search" placeholder="Search" className="bg-gray-800 border-none rounded-full pl-10 text-white" />
        </div>

        <div className="flex items-center gap-4">
          <Link href="/firebase-test" className="hidden md:block text-sm text-yellow-500 hover:text-yellow-400">
            Firebase Test
          </Link>

          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Profile"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        </div>
      </header>
    </>
  )
}
