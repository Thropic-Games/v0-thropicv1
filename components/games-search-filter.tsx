"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface GamesSearchFilterProps {
  onSearch: (query: string) => void
  onFilterChange: (filters: Record<string, string[]>) => void
  initialFilters?: Record<string, string[]>
}

export function GamesSearchFilter({ onSearch, onFilterChange, initialFilters }: GamesSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    status: [],
    category: [],
  })

  // Initialize with any provided initial filters - only run once on mount
  // or when initialFilters reference changes
  useEffect(() => {
    if (initialFilters) {
      setActiveFilters(initialFilters)
    }
  }, []) // Empty dependency array to run only once on mount

  const handleSearch = () => {
    onSearch(searchQuery)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev }
      if (newFilters[category].includes(value)) {
        newFilters[category] = newFilters[category].filter((item) => item !== value)
      } else {
        newFilters[category] = [...newFilters[category], value]
      }
      onFilterChange(newFilters)
      return newFilters
    })
  }

  const removeFilter = (category: string, value: string) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev }
      newFilters[category] = newFilters[category].filter((item) => item !== value)
      onFilterChange(newFilters)
      return newFilters
    })
  }

  const clearFilters = () => {
    const emptyFilters = {
      status: [],
      category: [],
    }
    setActiveFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  const hasActiveFilters = activeFilters.status.length > 0 || activeFilters.category.length > 0

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
            <DropdownMenuCheckboxItem
              checked={activeFilters.status.includes("In Progress")}
              onCheckedChange={() => toggleFilter("status", "In Progress")}
            >
              In Progress
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilters.status.includes("Upcoming")}
              onCheckedChange={() => toggleFilter("status", "Upcoming")}
            >
              Upcoming
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilters.status.includes("Completed")}
              onCheckedChange={() => toggleFilter("status", "Completed")}
            >
              Completed
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilters.status.includes("Registering")}
              onCheckedChange={() => toggleFilter("status", "Registering")}
            >
              Registering
            </DropdownMenuCheckboxItem>

            <DropdownMenuLabel className="mt-2">Category</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
            <DropdownMenuCheckboxItem
              checked={activeFilters.category.includes("Football")}
              onCheckedChange={() => toggleFilter("category", "Football")}
            >
              Football
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilters.category.includes("Basketball")}
              onCheckedChange={() => toggleFilter("category", "Basketball")}
            >
              Basketball
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilters.category.includes("Baseball")}
              onCheckedChange={() => toggleFilter("category", "Baseball")}
            >
              Baseball
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilters.category.includes("Hockey")}
              onCheckedChange={() => toggleFilter("category", "Hockey")}
            >
              Hockey
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilters.category.includes("Golf")}
              onCheckedChange={() => toggleFilter("category", "Golf")}
            >
              Golf
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilters.category.includes("Entertainment")}
              onCheckedChange={() => toggleFilter("category", "Entertainment")}
            >
              Entertainment
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilters.category.includes("Education")}
              onCheckedChange={() => toggleFilter("category", "Education")}
            >
              Education
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilters.category.includes("Environment")}
              onCheckedChange={() => toggleFilter("category", "Environment")}
            >
              Environment
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilters.category.includes("Animals")}
              onCheckedChange={() => toggleFilter("category", "Animals")}
            >
              Animals
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilters.category.includes("Health")}
              onCheckedChange={() => toggleFilter("category", "Health")}
            >
              Health
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={handleSearch} className="bg-yellow-500 hover:bg-yellow-600 text-black">
          Search
        </Button>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
          {activeFilters.status.map((status) => (
            <Badge
              key={status}
              variant="outline"
              className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 flex items-center gap-1 text-gray-900 dark:text-white"
            >
              {status}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("status", status)} />
            </Badge>
          ))}
          {activeFilters.category.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 flex items-center gap-1 text-gray-900 dark:text-white"
            >
              {category}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("category", category)} />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white h-7 px-2"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
