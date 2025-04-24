"use client"

import type React from "react"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { navigateToGame } from "@/lib/utils"

interface GameListItemProps {
  id: number
  title: string
  image: string
  charity?: string
  status?: "In Progress" | "Upcoming" | "Completed" | "Registering"
  sponsor?: string
  donation?: string
  className?: string
  template_id?: string
}

export function GameListItem({
  id,
  title,
  image,
  charity,
  status,
  sponsor,
  donation,
  className = "",
  template_id,
}: GameListItemProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "In Progress":
        return "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/30"
      case "Upcoming":
        return "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-500/30"
      case "Completed":
        return "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-500/30"
      case "Registering":
        return "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-500/30"
      default:
        return "bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-500/30"
    }
  }

  const game = { id, template_id }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    navigateToGame(game)
  }

  return (
    <div className={cn("block group", className)} onClick={handleClick} style={{ cursor: "pointer" }}>
      <div className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl overflow-hidden transition-colors">
        <div className="flex items-center p-3">
          <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
            <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          </div>

          <div className="ml-4 flex-1 min-w-0">
            <h3 className="font-normal text-gray-900 dark:text-white">{title}</h3>
            {charity && <p className="text-sm text-gray-600 dark:text-gray-400 font-light">Supporting: {charity}</p>}

            <div className="flex items-center gap-3 mt-1">
              {status && <Badge className={`font-light text-xs ${getStatusColor(status)}`}>{status}</Badge>}
              {sponsor && <span className="text-xs text-gray-500 dark:text-gray-500">By {sponsor}</span>}
            </div>
          </div>

          <div className="ml-4 flex-shrink-0">
            {donation && <p className="text-orange-600 dark:text-yellow-500 font-medium mb-2">{donation}</p>}
            <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={handleClick}>
              Open <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
