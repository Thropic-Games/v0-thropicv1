"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import type { Nonprofit } from "./create-game-form"

interface NonprofitSelectionStepProps {
  onSelect: (nonprofit: Nonprofit) => void
  onBack: () => void
}

// Sample nonprofit data
const nonprofits: Nonprofit[] = [
  {
    id: "1",
    name: "American Red Cross",
    ein: "53-0196605",
    city: "Washington",
    state: "DC",
  },
  {
    id: "2",
    name: "Feeding America",
    ein: "36-3673599",
    city: "Chicago",
    state: "IL",
  },
  {
    id: "3",
    name: "Habitat for Humanity",
    ein: "91-1914868",
    city: "Atlanta",
    state: "GA",
  },
  {
    id: "4",
    name: "St. Jude Children's Research Hospital",
    ein: "62-0646012",
    city: "Memphis",
    state: "TN",
  },
  {
    id: "5",
    name: "World Wildlife Fund",
    ein: "52-1693387",
    city: "Washington",
    state: "DC",
  },
  {
    id: "6",
    name: "United Way Worldwide",
    ein: "13-1635294",
    city: "Alexandria",
    state: "VA",
  },
  {
    id: "7",
    name: "Boys & Girls Clubs of America",
    ein: "13-5562976",
    city: "Atlanta",
    state: "GA",
  },
  {
    id: "8",
    name: "Goodwill Industries International",
    ein: "53-0196517",
    city: "Rockville",
    state: "MD",
  },
  {
    id: "9",
    name: "American Cancer Society",
    ein: "13-1788491",
    city: "Atlanta",
    state: "GA",
  },
  {
    id: "10",
    name: "The Nature Conservancy",
    ein: "53-0242652",
    city: "Arlington",
    state: "VA",
  },
  {
    id: "11",
    name: "UNICEF USA",
    ein: "13-1760110",
    city: "New York",
    state: "NY",
  },
  {
    id: "12",
    name: "Doctors Without Borders",
    ein: "13-3433452",
    city: "New York",
    state: "NY",
  },
]

export function NonprofitSelectionStep({ onSelect, onBack }: NonprofitSelectionStepProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedNonprofit, setSelectedNonprofit] = useState<Nonprofit | null>(null)

  const filteredNonprofits = nonprofits.filter(
    (nonprofit) =>
      nonprofit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nonprofit.ein.includes(searchQuery) ||
      nonprofit.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nonprofit.state.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelect = (nonprofit: Nonprofit) => {
    setSelectedNonprofit(nonprofit)
    onSelect(nonprofit) // Automatically advance to the next step
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Select a Nonprofit</h2>
      <p className="text-gray-500 dark:text-gray-400">
        Choose the nonprofit organization that will receive the funds raised by your game.
      </p>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          type="search"
          placeholder="Search by name, EIN, city, or state..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 pl-10"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-4 gap-4 p-3 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm">
          <div>Name</div>
          <div>EIN</div>
          <div>City</div>
          <div>State</div>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {filteredNonprofits.length > 0 ? (
            filteredNonprofits.map((nonprofit) => (
              <div
                key={nonprofit.id}
                className={`grid grid-cols-4 gap-4 p-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  selectedNonprofit?.id === nonprofit.id ? "bg-gray-100 dark:bg-gray-700" : ""
                }`}
                onClick={() => handleSelect(nonprofit)}
              >
                <div className="font-medium">{nonprofit.name}</div>
                <div>{nonprofit.ein}</div>
                <div>{nonprofit.city}</div>
                <div>{nonprofit.state}</div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No nonprofits found matching your search.
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-start mt-6 pb-6">
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
