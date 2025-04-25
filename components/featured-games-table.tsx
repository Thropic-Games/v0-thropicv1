"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useFeaturedGames, type Game } from "@/hooks/use-featured-games"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef } from "react"

export function FeaturedGamesTable() {
  const [sortColumn, setSortColumn] = useState<keyof Game>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const { games, loading, error } = useFeaturedGames()
  const tableBodyRef = useRef<HTMLTableSectionElement>(null)

  const sortedGames = [...games].sort((a, b) => {
    if (sortColumn === "donation") {
      // Remove $ and commas for numeric comparison
      const aValue = Number.parseFloat(a[sortColumn].replace(/[$,]/g, ""))
      const bValue = Number.parseFloat(b[sortColumn].replace(/[$,]/g, ""))
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    } else {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }
  })

  // Set up virtualization for table rows
  const rowVirtualizer = useVirtualizer({
    count: sortedGames.length,
    getScrollElement: () => tableBodyRef.current,
    estimateSize: () => 53, // Approximate height of a row in pixels
    overscan: 5, // Number of items to render before/after the visible area
  })

  const toggleSort = (column: keyof Game) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (column: keyof Game) => {
    if (sortColumn !== column) return null
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
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
    <div className="bg-gray-900 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-transparent">
              <TableHead className="text-gray-400 font-normal cursor-pointer" onClick={() => toggleSort("name")}>
                <div className="flex items-center gap-1">
                  Game Name
                  {getSortIcon("name")}
                </div>
              </TableHead>
              <TableHead className="text-gray-400 font-normal cursor-pointer" onClick={() => toggleSort("partner")}>
                <div className="flex items-center gap-1">
                  Partner
                  {getSortIcon("partner")}
                </div>
              </TableHead>
              <TableHead className="text-gray-400 font-normal cursor-pointer" onClick={() => toggleSort("donation")}>
                <div className="flex items-center gap-1">
                  Donation
                  {getSortIcon("donation")}
                </div>
              </TableHead>
              <TableHead className="text-gray-400 font-normal cursor-pointer" onClick={() => toggleSort("endDate")}>
                <div className="flex items-center gap-1">
                  End Date
                  {getSortIcon("endDate")}
                </div>
              </TableHead>
              <TableHead className="text-gray-400 font-normal cursor-pointer" onClick={() => toggleSort("status")}>
                <div className="flex items-center gap-1">
                  Status
                  {getSortIcon("status")}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody
            ref={tableBodyRef}
            className="max-h-[400px] overflow-auto"
            style={{
              height: `${Math.min(400, sortedGames.length * 53)}px`,
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const game = sortedGames[virtualRow.index]
              return (
                <TableRow
                  key={game.id}
                  className="border-gray-800 hover:bg-gray-800/50 absolute w-full"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <TableCell className="font-normal">{game.name}</TableCell>
                  <TableCell className="font-light">{game.partner}</TableCell>
                  <TableCell className="font-light text-yellow-500">{game.donation}</TableCell>
                  <TableCell className="font-light">{game.endDate}</TableCell>
                  <TableCell>{getStatusBadge(game.status)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
