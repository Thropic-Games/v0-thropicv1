"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Search, X, Loader2, Database } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAuthStatus } from "@/components/auth/user-auth-status"
import {
  searchGamesAndPartners,
  type SearchResult,
  type GameSearchResult,
  type FeatheryFormSearchResult,
  type PartnerSearchResult,
} from "@/actions/search"
import { useDebounce } from "@/hooks/use-debounce"

export function SiteHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Debug log for component mount
  useEffect(() => {
    console.log("SiteHeader component mounted")
  }, [])

  // Fetch search results when debounced query changes
  useEffect(() => {
    async function fetchSearchResults() {
      console.log("Search query changed:", debouncedSearchQuery)

      if (debouncedSearchQuery.length < 2) {
        setSearchResults([])
        setIsDropdownOpen(false)
        setSearchError(null)
        return
      }

      setIsLoading(true)
      setIsDropdownOpen(true) // Always show dropdown when searching
      setSearchError(null)

      try {
        console.log("Fetching search results for:", debouncedSearchQuery)
        const results = await searchGamesAndPartners(debouncedSearchQuery)
        console.log("Search results:", results)
        setSearchResults(results)
      } catch (error) {
        console.error("Search error:", error)
        setSearchResults([])
        setSearchError("An error occurred while searching. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSearchResults()
  }, [debouncedSearchQuery])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Type guard functions
  const isGameResult = (result: SearchResult): result is GameSearchResult => {
    return result.type === "game"
  }

  const isFeatheryFormResult = (result: SearchResult): result is FeatheryFormSearchResult => {
    return result.type === "feathery_form"
  }

  const isPartnerResult = (result: SearchResult): result is PartnerSearchResult => {
    return result.type === "partner"
  }

  // Function to generate the correct URL for games
  const getGameUrl = (game: GameSearchResult): string => {
    // Force the exact URL format without any conditions
    const url = `https://play.thropicgames.com/game/${game.template_id || ""}/${game.id}`
    console.log("Generated URL:", url) // Debug log
    return url
  }

  // Function to generate the correct URL for feathery forms
  const getFeatheryFormUrl = (form: FeatheryFormSearchResult): string => {
    return `https://play.thropicgames.com/challenge/${form.name}/${form.form_id}`
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-4 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Logo size="large" className="hidden md:block" />
          <Logo size="small" className="md:hidden" />
        </Link>
      </div>

      {/* Search field - hidden on mobile */}
      <div ref={searchRef} className="relative w-full max-w-md hidden md:block">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          type="search"
          id="search-input"
          name="search"
          aria-label="Search"
          autoComplete="off"
          placeholder="Search games and partners"
          className="bg-gray-100 dark:bg-gray-800 border-none rounded-full pl-10 text-gray-800 dark:text-white"
          value={searchQuery}
          onChange={(e) => {
            console.log("Search input changed:", e.target.value)
            setSearchQuery(e.target.value)
          }}
          onFocus={() => {
            // Show dropdown immediately on focus if there's a query
            if (searchQuery.length >= 2) {
              setIsDropdownOpen(true)
            }
          }}
        />
        {searchQuery && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            onClick={() => setSearchQuery("")}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          </button>
        )}

        {/* Search dropdown */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-[100]">
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-500 dark:text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Searching...</span>
                </div>
              ) : searchError ? (
                <div className="px-4 py-3 text-sm text-red-500 dark:text-red-400 flex items-center justify-center">
                  <span>{searchError}</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="py-2">
                  <div className="grid grid-cols-2 gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div>Game Name</div>
                    <div>Partner Name</div>
                  </div>

                  {/* Game results with related partner - make entire row clickable */}
                  {searchResults.filter(isGameResult).map((game) => (
                    <div
                      key={`game-${game.id}`}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => {
                        const url = getGameUrl(game)
                        console.log("Navigating to:", url)
                        window.open(url, "_blank")
                        setIsDropdownOpen(false)
                      }}
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-900 dark:text-white truncate">{game.name}</div>
                        <div className="text-gray-600 dark:text-gray-400 truncate">
                          {game.partner_name || "No partner"}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Feathery Form results with custom URL format and partner name */}
                  {searchResults.filter(isFeatheryFormResult).map((form) => (
                    <div
                      key={`form-${form.id}`}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => {
                        window.open(getFeatheryFormUrl(form), "_blank")
                        setIsDropdownOpen(false)
                      }}
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-900 dark:text-white truncate">{form.name}</div>
                        <div className="text-gray-600 dark:text-gray-400 truncate font-medium">
                          {form.partner_name || "No partner"}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Partner results with related games */}
                  {searchResults.filter(isPartnerResult).map((partner) => (
                    <div key={`partner-${partner.id}`} className="border-t border-gray-200 dark:border-gray-700">
                      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800">
                        <Link
                          href={`/partner/${partner.id}`}
                          className="font-medium text-gray-900 dark:text-white hover:underline"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          {partner.name}
                        </Link>
                      </div>

                      {/* Partner's related games */}
                      {partner.related_games.length > 0 ? (
                        partner.related_games.map((game) => (
                          <div
                            key={`partner-game-${game.id}`}
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                            onClick={() => {
                              console.log("Warning: Partner game may not have template_id")
                              const url = `https://play.thropicgames.com/game/${game.template_id || ""}/${game.id}`
                              console.log("Partner game URL:", url)
                              window.open(url, "_blank")
                              setIsDropdownOpen(false)
                            }}
                          >
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-gray-900 dark:text-white truncate">{game.name}</div>
                              <div className="text-gray-600 dark:text-gray-400 truncate">{partner.name}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">No related games</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-3 flex items-center justify-center">
                  <Database className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {searchQuery.length < 2
                      ? "Type at least 2 characters to search"
                      : "No results found. Try a different search term."}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserAuthStatus />
      </div>
    </header>
  )
}
