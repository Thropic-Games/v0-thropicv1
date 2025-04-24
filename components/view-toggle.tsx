"use client"

import { Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ViewToggleProps {
  view: "grid" | "list"
  onChange: (view: "grid" | "list") => void
  className?: string
}

export function ViewToggle({ view, onChange, className }: ViewToggleProps) {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange("grid")}
        className={cn(
          "h-8 w-8",
          view === "grid"
            ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
            : "text-gray-500 hover:text-gray-900 dark:hover:text-white",
        )}
      >
        <Grid className="h-4 w-4" />
        <span className="sr-only">Grid view</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange("list")}
        className={cn(
          "h-8 w-8",
          view === "list"
            ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
            : "text-gray-500 hover:text-gray-900 dark:hover:text-white",
        )}
      >
        <List className="h-4 w-4" />
        <span className="sr-only">List view</span>
      </Button>
    </div>
  )
}
