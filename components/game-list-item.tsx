import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface GameListItemProps {
  id: number
  title: string
  image: string
  charity?: string
  status?: "In Progress" | "Upcoming" | "Completed" | "Registering"
  sponsor?: string
  donation?: string
  className?: string
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
}: GameListItemProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "In Progress":
        return "bg-green-500/20 text-green-400 hover:bg-green-500/30"
      case "Upcoming":
        return "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
      case "Completed":
        return "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
      case "Registering":
        return "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
    }
  }

  return (
    <Link href="#" className={cn("block group", className)}>
      <div className="bg-gray-900 hover:bg-gray-800 rounded-xl overflow-hidden transition-colors">
        <div className="flex items-center p-3">
          <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
            <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          </div>

          <div className="ml-4 flex-1 min-w-0">
            <h3 className="font-normal text-white">{title}</h3>
            {charity && <p className="text-sm text-gray-400 font-light">Supporting: {charity}</p>}

            <div className="flex items-center gap-3 mt-1">
              {status && <Badge className={`font-light text-xs ${getStatusColor(status)}`}>{status}</Badge>}
              {sponsor && <span className="text-xs text-gray-500">By {sponsor}</span>}
            </div>
          </div>

          {donation && (
            <div className="ml-4 flex-shrink-0">
              <p className="text-yellow-500 font-medium">{donation}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
