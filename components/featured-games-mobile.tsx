"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFeaturedGames, type Game } from "@/hooks/use-featured-games"

export function FeaturedGamesMobile() {
  const [sortBy, setSortBy] = useState<keyof Game>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const { games, loading, error } = useFeaturedGames()

  const sortedGames = [...games].sort((a, b) => {
    if (sortBy === "donation") {
      const aValue = Number.parseFloat(a[sortBy].replace(/[$,]/g, ""))
      const bValue = Number.parseFloat(b[sortBy].replace(/[$,]/g, ""))
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    } else {
      const aValue = a[sortBy]
      const bValue = b[sortBy]
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }
  })

  const toggleSort = (column: keyof Game) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortDirection("asc")
    }
  }

  const getStatusBadge = (status: Game["status"]) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 font-light">Active</Badge>
      case "Upcoming":
        return <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 font-light">Upcoming</Badge>
      case "Expired":
        return <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 font-light">Expired</Badge>
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-xl overflow-hidden p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500 mx-auto"></div>
        <p className="mt-2 text-gray-400">Loading featured games...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-xl overflow-hidden p-6 text-center">
        <p className="text-red-400">Error loading games: {error.message}</p>
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl overflow-hidden p-6 text-center">
        <p className="text-gray-400">No featured games available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleSort("name")}
          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
        >
          Name{" "}
          {sortBy === "name" &&
            (sortDirection === "asc" ? (
              <ChevronUp className="h-3 w-3 ml-1" />
            ) : (
              <ChevronDown className="h-3 w-3 ml-1" />
            ))}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleSort("partner")}
          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
        >
          Partner{" "}
          {sortBy === "partner" &&
            (sortDirection === "asc" ? (
              <ChevronUp className="h-3 w-3 ml-1" />
            ) : (
              <ChevronDown className="h-3 w-3 ml-1" />
            ))}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleSort("donation")}
          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
        >
          Donation{" "}
          {sortBy === "donation" &&
            (sortDirection === "asc" ? (
              <ChevronUp className="h-3 w-3 ml-1" />
            ) : (
              <ChevronDown className="h-3 w-3 ml-1" />
            ))}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleSort("endDate")}
          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
        >
          End Date{" "}
          {sortBy === "endDate" &&
            (sortDirection === "asc" ? (
              <ChevronUp className="h-3 w-3 ml-1" />
            ) : (
              <ChevronDown className="h-3 w-3 ml-1" />
            ))}
        </Button>
      </div>

      {sortedGames.map((game) => (
        <Card key={game.id} className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <h3 className="font-normal text-lg">{game.name}</h3>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <p className="text-xs text-gray-400">Partner</p>
                <p className="font-light">{game.partner}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Donation</p>
                <p className="font-light text-yellow-500">{game.donation}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">End Date</p>
                <p className="font-light">{game.endDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <div className="mt-1">{getStatusBadge(game.status)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
