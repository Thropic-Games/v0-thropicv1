"use client"

import type React from "react"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { navigateToGame } from "@/lib/utils"

interface GameCardProps {
  title: string
  image: string
  charity?: string
  status?: "In Progress" | "Upcoming" | "Completed" | "Registering"
  sponsor?: string
  donation?: string
  className?: string
  size?: "small" | "medium" | "large"
  game?: any // Add game prop to pass game data
}

export function GameCard({
  title,
  image,
  charity,
  status,
  sponsor,
  donation,
  className = "",
  size = "medium",
  game,
}: GameCardProps) {
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

  const sizeClasses = {
    small: "h-32",
    medium: "h-48",
    large: "h-64",
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (game) {
      navigateToGame(game)
    }
  }

  return (
    <div className={`block group ${className}`}>
      <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden relative">
        <div className={`relative ${sizeClasses[size]}`} onClick={handleClick} style={{ cursor: "pointer" }}>
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 flex items-end p-4">
            <div>
              <h3 className="font-normal text-white">{title}</h3>
              {charity && <p className="text-sm text-white/80 font-light">Supporting: {charity}</p>}
              {status && (
                <div className="mt-2">
                  <Badge className={`font-light ${getStatusColor(status)}`}>{status}</Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center">
            {sponsor && <p className="text-sm text-gray-600 dark:text-gray-400">By {sponsor}</p>}
            {donation && <p className="text-sm text-orange-600 dark:text-yellow-500 font-medium">{donation}</p>}
          </div>
          {game && (
            <Button
              size="sm"
              variant="outline"
              className="w-full mt-2 flex items-center justify-center"
              onClick={handleClick}
            >
              Open Game <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
