"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Search, X } from "lucide-react"
import type { GameTemplate } from "./create-game-form"

interface GameTemplateStepProps {
  onSelect: (template: GameTemplate) => void
  onBack: () => void
}

// Sample game templates with categories
const gameTemplates: GameTemplate[] = [
  {
    id: "1",
    name: "March Madness",
    description: "NCAA Basketball Tournament bracket challenge",
    image: "/images/hero/nbahero.jpg",
    category: "Basketball",
  },
  {
    id: "2",
    name: "NBA Playoffs",
    description: "NBA Playoffs bracket and prediction challenge",
    image: "/images/hero/nbahero.jpg",
    category: "Basketball",
  },
  {
    id: "3",
    name: "NHL Playoffs",
    description: "Stanley Cup Playoffs bracket challenge",
    image: "/images/hero/hockeyhero.jpg",
    category: "Hockey",
  },
  {
    id: "4",
    name: "The Masters",
    description: "Golf tournament pool with player drafts",
    image: "/images/hero/mastershero.jpg",
    category: "Golf",
  },
  {
    id: "5",
    name: "MLB All-Star Game",
    description: "Baseball All-Star game prediction challenge",
    image: "/images/hero/mlbhero.jpg",
    category: "Baseball",
  },
  {
    id: "6",
    name: "Super Bowl",
    description: "Football championship squares and prop bets",
    image: "/placeholder.svg?height=200&width=300",
    category: "Football",
  },
  {
    id: "7",
    name: "Oscar Predictions",
    description: "Predict winners for the Academy Awards",
    image: "/placeholder.svg?height=200&width=300",
    category: "Entertainment",
  },
  {
    id: "8",
    name: "Fantasy Football",
    description: "Season-long fantasy football league",
    image: "/placeholder.svg?height=200&width=300",
    category: "Football",
  },
  {
    id: "9",
    name: "World Cup Bracket",
    description: "International soccer tournament predictions",
    image: "/placeholder.svg?height=200&width=300",
    category: "Soccer",
  },
]

export function GameTemplateStep({ onSelect, onBack }: GameTemplateStepProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<GameTemplate | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState(gameTemplates)

  // Extract unique categories for filter options
  const categories = Array.from(new Set(gameTemplates.map((template) => template.category || "Other")))

  // Filter templates based on search query and active filters
  useEffect(() => {
    let result = gameTemplates

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (template) => template.name.toLowerCase().includes(query) || template.description.toLowerCase().includes(query),
      )
    }

    // Apply category filters
    if (activeFilters.length > 0) {
      result = result.filter((template) => activeFilters.includes(template.category || "Other"))
    }

    setFilteredTemplates(result)
  }, [searchQuery, activeFilters])

  const handleSelect = (template: GameTemplate) => {
    setSelectedTemplate(template)
    onSelect(template) // Automatically advance to the next step
  }

  const toggleFilter = (category: string) => {
    setActiveFilters((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]))
  }

  const clearFilters = () => {
    setActiveFilters([])
    setSearchQuery("")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Select a Game Template</h2>
      <p className="text-gray-500 dark:text-gray-400">
        Choose a game template that will engage your participants and raise funds for your cause.
      </p>

      {/* Search and filter section */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className={`cursor-pointer ${
                activeFilters.includes(category)
                  ? "bg-amber-100 text-amber-600 border-amber-300 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => toggleFilter(category)}
            >
              {category}
            </Badge>
          ))}

          {(activeFilters.length > 0 || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Templates grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-yellow-500 cursor-pointer transition-all overflow-hidden ${
                selectedTemplate?.id === template.id
                  ? "border-amber-500 dark:border-yellow-500 ring-1 ring-amber-500 dark:ring-yellow-500"
                  : ""
              }`}
              onClick={() => handleSelect(template)}
            >
              <div className="relative h-40">
                <Image src={template.image || "/placeholder.svg"} alt={template.name} fill className="object-cover" />
                {template.category && <Badge className="absolute top-2 right-2 bg-black/60">{template.category}</Badge>}
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-lg">{template.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{template.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-2">No templates match your search criteria.</p>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
          >
            Clear Filters
          </Button>
        </div>
      )}

      <div className="flex justify-start mt-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        >
          Back
        </Button>
      </div>
    </div>
  )
}
