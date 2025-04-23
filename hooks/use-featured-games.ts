"use client"

import { useState } from "react"

export interface Game {
  id: number
  name: string
  partner: string
  donation: string
  status: "Active" | "Upcoming" | "Expired"
  endDate?: string
}

// Fallback data
const fallbackGames: Game[] = [
  {
    id: 1,
    name: "NBA Playoffs",
    partner: "Goodwill SoCal",
    donation: "$12,500",
    status: "Active",
    endDate: "06/15/2023",
  },
  {
    id: 2,
    name: "Masters Tournament",
    partner: "Carson PTA",
    donation: "$8,750",
    status: "Upcoming",
    endDate: "07/10/2023",
  },
  {
    id: 3,
    name: "Stanley Cup Playoffs",
    partner: "Epilepsy Walk",
    donation: "$15,200",
    status: "Active",
    endDate: "08/22/2023",
  },
  {
    id: 4,
    name: "MLB All-Star Week",
    partner: "Penn State Alumni",
    donation: "$9,300",
    status: "Upcoming",
    endDate: "09/05/2023",
  },
  {
    id: 5,
    name: "US Open Tennis",
    partner: "Cancer Research",
    donation: "$11,800",
    status: "Upcoming",
    endDate: "10/12/2023",
  },
  {
    id: 6,
    name: "World Cup Qualifiers",
    partner: "Youth Soccer Foundation",
    donation: "$18,200",
    status: "Active",
    endDate: "11/15/2023",
  },
  {
    id: 7,
    name: "Olympic Trials",
    partner: "Team USA Support",
    donation: "$22,500",
    status: "Upcoming",
    endDate: "12/10/2023",
  },
  {
    id: 8,
    name: "Super Bowl Pool",
    partner: "Veterans Association",
    donation: "$31,750",
    status: "Expired",
    endDate: "02/12/2023",
  },
]

export function useFeaturedGames() {
  const [games, setGames] = useState<Game[]>(fallbackGames)
  const [loading, setLoading] = useState(false) // Changed to false since we have fallback data
  const [error, setError] = useState<Error | null>(null)

  // We're just using the fallback data directly now
  // No need to try to fetch from Supabase

  return { games, loading, error }
}
