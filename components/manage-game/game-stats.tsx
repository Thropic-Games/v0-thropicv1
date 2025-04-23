"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface GameStatsProps {
  game: any
}

// Mock data for the chart
const mockData = [
  { day: "Day 1", participants: 12, donations: 120 },
  { day: "Day 2", participants: 19, donations: 190 },
  { day: "Day 3", participants: 8, donations: 80 },
  { day: "Day 4", participants: 6, donations: 60 },
  { day: "Day 5", participants: 0, donations: 0 },
]

export function GameStats({ game }: GameStatsProps) {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Participation & Donations</h3>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="day" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#333",
                  border: "1px solid #555",
                  borderRadius: "4px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="participants" name="Participants" fill="#f59e0b" />
              <Bar dataKey="donations" name="Donations ($)" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Total Participants</p>
            <p className="text-2xl font-medium">{game.participants}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Total Raised</p>
            <p className="text-2xl font-medium text-yellow-500">${game.currentAmount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
