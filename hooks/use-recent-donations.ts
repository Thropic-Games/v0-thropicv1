"use client"
import useSWR from "swr"
import { fetcher } from "@/lib/swr-config"

export interface Donation {
  id: string
  name: string
  amount: string
  game: string
  partner: string
  avatar?: string
  date: string
}

export function useRecentDonations(limit = 10) {
  const { data, error, isLoading, mutate } = useSWR<{
    donations: Donation[]
    debugInfo: any
  }>(`/api/recent-donations?limit=${limit}`, fetcher, {
    revalidateOnMount: true,
    refreshInterval: 30000, // Refresh every 30 seconds
  })

  return {
    donations: data?.donations || [],
    loading: isLoading,
    error,
    debugInfo: data?.debugInfo,
    refresh: mutate,
    supabaseStatus: {
      initialized: true,
      error: null,
      loading: isLoading,
      authenticated: true,
    },
  }
}
