"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Mail, Download } from "lucide-react"
import Image from "next/image"

interface GameParticipantsProps {
  game: any
}

// Mock participant data
const mockParticipants = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    joined: "2025-03-16",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    joined: "2025-03-16",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    joined: "2025-03-17",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    joined: "2025-03-17",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david@example.com",
    joined: "2025-03-18",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "Jessica Taylor",
    email: "jessica@example.com",
    joined: "2025-03-18",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 7,
    name: "Robert Martinez",
    email: "robert@example.com",
    joined: "2025-03-19",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 8,
    name: "Jennifer Anderson",
    email: "jennifer@example.com",
    joined: "2025-03-19",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function GameParticipants({ game }: GameParticipantsProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredParticipants = mockParticipants.filter(
    (participant) =>
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h3 className="text-lg font-medium">Participants ({mockParticipants.length})</h3>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search participants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 border-gray-700 pl-10"
              />
            </div>
            <Button variant="outline" className="bg-gray-800 border-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
              <Mail className="h-4 w-4 mr-2" />
              Email All
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 font-medium text-gray-400">Participant</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400">Joined</th>
                <th className="text-right py-3 px-4 font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.length > 0 ? (
                filteredParticipants.map((participant) => (
                  <tr key={participant.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            src={participant.avatar || "/placeholder.svg"}
                            alt={participant.name}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                        <span>{participant.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{participant.email}</td>
                    <td className="py-3 px-4 text-gray-400">{participant.joined}</td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-400 hover:text-white">
                        <Mail className="h-4 w-4" />
                        <span className="sr-only">Email</span>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    No participants found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
