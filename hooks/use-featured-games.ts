"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/swr-config"

export interface Game {
  id: string
  name: string
  partner: string
  donation: string
  endDate: string
  status: "Active" | "Upcoming" | "Expired"
}

export function useFeaturedGames() {
  const { data, error, isLoading, mutate } = useSWR<Game[]>("/api/featured-games", fetcher, {
    revalidateOnMount: true,
    revalidateIfStale: true,
  })

  return {
    games: data || [],
    loading: isLoading,
    error,
    refresh: mutate,
  }
}
