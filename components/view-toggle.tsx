"use client"

import { Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ViewToggleProps {
  view: "grid" | "list"
  onChange: (view: "grid" | "list") => void
  className?: string
}

export function ViewToggle({ view, onChange, className = "" }: ViewToggleProps) {
  return (
    <div className={cn("flex bg-gray-800 rounded-md p-1", className)}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 px-2 rounded-sm",
          view === "grid" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700/50",
        )}
        onClick={() => onChange("grid")}
      >
        <Grid className="h-4 w-4 mr-2" />
        <span className="text-xs">Grid</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 px-2 rounded-sm",
          view === "list" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700/50",
        )}
        onClick={() => onChange("list")}
      >
        <List className="h-4 w-4 mr-2" />
        <span className="text-xs">List</span>
      </Button>
    </div>
  )
}
