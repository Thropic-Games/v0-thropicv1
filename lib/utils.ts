import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to generate the correct URL for games
export function getGameUrl(game: any): string {
  // Force the exact URL format without any conditions
  const url = `https://play.thropicgames.com/game/${game.template_id || ""}/${game.id}`
  console.log("Generated URL:", url) // Debug log
  return url
}

// Direct navigation function to bypass any routing
export function navigateToGame(game: any) {
  const url = getGameUrl(game)
  console.log("Navigating to:", url) // Debug log
  window.open(url, "_blank")
}
