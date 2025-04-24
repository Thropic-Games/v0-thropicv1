"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Sidebar } from "@/components/sidebar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { GlobalScrollContainer } from "@/components/global-scroll-container"
import { StaticHorizontalMenu } from "@/components/static-horizontal-menu"
import { GameCard } from "@/components/game-card"
import { GameListItem } from "@/components/game-list-item"
import { GamesSearchFilter } from "@/components/games-search-filter"
import { ViewToggle } from "@/components/view-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample game data
const allGames = [
  {
    id: 1,
    title: "Masters Tournament",
    image: "/images/hero/mastershero.jpg",
    charity: "Youth Golf Programs",
    status: "In Progress",
    sponsor: "Augusta National",
    donation: "$12,450",
    category: "Golf",
    template_id: "masters",
  },
  {
    id: 2,
    title: "NBA Playoffs",
    image: "/images/hero/nbahero.jpg",
    charity: "Basketball in Schools",
    status: "In Progress",
    sponsor: "NBA Cares",
    donation: "$15,900",
    category: "Basketball",
    template_id: "nba",
  },
  {
    id: 3,
    title: "Stanley Cup Playoffs",
    image: "/images/hero/hockeyhero.jpg",
    charity: "Youth Hockey Equipment",
    status: "Upcoming",
    sponsor: "NHL Foundation",
    donation: "$8,750",
    category: "Hockey",
    template_id: "stanleycup",
  },
  {
    id: 4,
    title: "MLB All-Star Week",
    image: "/images/hero/mlbhero.jpg",
    charity: "Baseball Development",
    status: "Registering",
    sponsor: "MLB Community",
    donation: "$10,200",
    category: "Baseball",
    template_id: "mlb",
  },
  {
    id: 5,
    title: "Oscar Predictions",
    image: "/placeholder.svg?height=200&width=300",
    charity: "Film Education Programs",
    status: "Upcoming",
    sponsor: "Academy Foundation",
    donation: "$7,300",
    category: "Entertainment",
    template_id: "oscars",
  },
  {
    id: 6,
    title: "Grammy Awards Pool",
    image: "/placeholder.svg?height=200&width=300",
    charity: "Music in Schools",
    status: "Completed",
    sponsor: "Recording Academy",
    donation: "$9,100",
    category: "Entertainment",
    template_id: "grammys",
  },
  {
    id: 7,
    title: "Climate Challenge",
    image: "/placeholder.svg?height=200&width=300",
    charity: "Environmental Defense Fund",
    status: "In Progress",
    sponsor: "Green Initiative",
    donation: "$14,500",
    category: "Environment",
    template_id: "climate",
  },
  {
    id: 8,
    title: "Spelling Bee",
    image: "/placeholder.svg?height=200&width=300",
    charity: "Literacy Programs",
    status: "Registering",
    sponsor: "Education First",
    donation: "$6,800",
    category: "Education",
    template_id: "spellingbee",
  },
  {
    id: 9,
    title: "Animal Shelter Drive",
    image: "/placeholder.svg?height=200&width=300",
    charity: "Local Animal Shelters",
    status: "In Progress",
    sponsor: "Pet Lovers Association",
    donation: "$5,200",
    category: "Animals",
    template_id: "animalshelter",
  },
  {
    id: 10,
    title: "Health Awareness Run",
    image: "/placeholder.svg?height=200&width=300",
    charity: "Cancer Research",
    status: "Upcoming",
    sponsor: "Health Foundation",
    donation: "$11,300",
    category: "Health",
    template_id: "healthrun",
  },
  {
    id: 11,
    title: "Football Championship",
    image: "/placeholder.svg?height=200&width=300",
    charity: "Youth Sports Programs",
    status: "In Progress",
    sponsor: "NFL Foundation",
    donation: "$18,500",
    category: "Football",
    template_id: "football",
  },
]

export default function GamesPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    status: [],
    category: [],
  })
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Use a ref to track if we've already initialized from URL
  const initializedFromUrl = useRef(false)

  // Initialize filters from URL query parameters - only once on mount
  useEffect(() => {
    if (initializedFromUrl.current) return

    const categoryParam = searchParams.get("category")
    if (categoryParam) {
      setActiveFilters({
        status: [],
        category: [categoryParam],
      })
    }

    initializedFromUrl.current = true
  }, [searchParams])

  // Handle filter changes from the search filter component
  const handleFilterChange = (filters: Record<string, string[]>) => {
    setActiveFilters(filters)
  }

  // Filter games based on search query and active filters
  const filteredGames = allGames.filter((game) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.charity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.sponsor.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = activeFilters.status.length === 0 || activeFilters.status.includes(game.status)

    // Category filter
    const matchesCategory = activeFilters.category.length === 0 || activeFilters.category.includes(game.category)

    return matchesSearch && matchesStatus && matchesCategory
  })

  // Get recommended games (for demo, just showing first 3)
  const recommendedGames = allGames.slice(0, 3)

  // Get active games (status is "In Progress")
  const activeGames = allGames.filter((game) => game.status === "In Progress")

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black text-gray-900 dark:text-white overflow-hidden">
      {/* Header spans full width and stays fixed */}
      <SiteHeader />

      {/* Static Horizontal Menu */}
      <StaticHorizontalMenu />

      {/* Scrollable content area containing both sidebar and main content */}
      <GlobalScrollContainer>
        <div className="flex min-h-0">
          {/* Left Sidebar - scrolls with content */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1">
            <div className="px-4 pb-20 md:pb-0 pt-6">
              <h1 className="text-3xl font-medium mb-6">Games</h1>

              {/* Two-column layout for larger screens */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main column - All Games */}
                <div className="lg:col-span-2 space-y-8">
                  {/* All Games Section */}
                  <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <CardTitle>All Games</CardTitle>
                      <ViewToggle view={viewMode} onChange={setViewMode} className="mt-2 sm:mt-0" />
                    </CardHeader>
                    <CardContent>
                      <GamesSearchFilter
                        onSearch={setSearchQuery}
                        onFilterChange={handleFilterChange}
                        initialFilters={activeFilters}
                      />

                      <div className="mt-6">
                        {filteredGames.length > 0 ? (
                          viewMode === "grid" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {filteredGames.map((game) => (
                                <GameCard
                                  key={game.id}
                                  title={game.title}
                                  image={game.image}
                                  charity={game.charity}
                                  status={game.status as any}
                                  sponsor={game.sponsor}
                                  donation={game.donation}
                                  game={game}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {filteredGames.map((game) => (
                                <GameListItem
                                  key={game.id}
                                  id={game.id}
                                  title={game.title}
                                  image={game.image}
                                  charity={game.charity}
                                  status={game.status as any}
                                  sponsor={game.sponsor}
                                  donation={game.donation}
                                  template_id={game.template_id}
                                />
                              ))}
                            </div>
                          )
                        ) : (
                          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                            No games found matching your search criteria.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Active Games Section */}
                  <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <CardHeader>
                      <CardTitle>Active Games</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeGames.map((game) => (
                          <GameCard
                            key={game.id}
                            title={game.title}
                            image={game.image}
                            charity={game.charity}
                            status={game.status as any}
                            sponsor={game.sponsor}
                            donation={game.donation}
                            game={game}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar column - Recommended Games */}
                <div className="space-y-6">
                  <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <CardHeader>
                      <CardTitle>Recommended For You</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recommendedGames.map((game) => (
                          <GameCard
                            key={game.id}
                            title={game.title}
                            image={game.image}
                            charity={game.charity}
                            size="small"
                            game={game}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Links */}
                  <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <CardHeader>
                      <CardTitle>Quick Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="popular">
                        <TabsList className="bg-gray-100 dark:bg-gray-800 w-full">
                          <TabsTrigger value="popular">Popular</TabsTrigger>
                          <TabsTrigger value="new">New</TabsTrigger>
                          <TabsTrigger value="ending">Ending Soon</TabsTrigger>
                        </TabsList>
                        <TabsContent value="popular" className="mt-4 space-y-2">
                          <QuickLinkItem title="Masters Tournament" donation="$12,450" />
                          <QuickLinkItem title="NBA Playoffs" donation="$15,900" />
                          <QuickLinkItem title="Climate Challenge" donation="$14,500" />
                        </TabsContent>
                        <TabsContent value="new" className="mt-4 space-y-2">
                          <QuickLinkItem title="Spelling Bee" donation="$6,800" />
                          <QuickLinkItem title="Oscar Predictions" donation="$7,300" />
                          <QuickLinkItem title="MLB All-Star Week" donation="$10,200" />
                        </TabsContent>
                        <TabsContent value="ending" className="mt-4 space-y-2">
                          <QuickLinkItem title="Grammy Awards Pool" donation="$9,100" />
                          <QuickLinkItem title="Stanley Cup Playoffs" donation="$8,750" />
                          <QuickLinkItem title="NBA Playoffs" donation="$15,900" />
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </GlobalScrollContainer>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}

// Helper component for quick links
function QuickLinkItem({ title, donation }: { title: string; donation: string }) {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
      <span className="font-light text-gray-900 dark:text-white">{title}</span>
      <span className="text-orange-600 dark:text-yellow-500">{donation}</span>
    </div>
  )
}
