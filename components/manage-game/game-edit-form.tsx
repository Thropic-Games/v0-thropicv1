"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, DollarSign, Clock } from "lucide-react"
import type { GameDetails } from "@/components/create-game/create-game-form"

interface GameEditFormProps {
  game: any
  onSave: (details: GameDetails) => void
  onCancel: () => void
}

export function GameEditForm({ game, onSave, onCancel }: GameEditFormProps) {
  const [formData, setFormData] = useState<GameDetails>({
    title: game.title,
    description: game.description || "",
    startDate: game.startDate,
    endDate: game.endDate,
    entryFee: game.entryFee,
    fundraisingGoal: game.fundraisingGoal,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card className="bg-gray-900 border-gray-800 mb-20">
      <CardHeader>
        <CardTitle>Edit Game</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Game Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a title for your game"
              required
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your game and fundraising cause"
              rows={4}
              className="bg-gray-800 border-gray-700 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="bg-gray-800 border-gray-700 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="bg-gray-800 border-gray-700 pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entryFee">Entry Fee ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="entryFee"
                  name="entryFee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.entryFee}
                  onChange={handleChange}
                  required
                  className="bg-gray-800 border-gray-700 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fundraisingGoal">Fundraising Goal ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="fundraisingGoal"
                  name="fundraisingGoal"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.fundraisingGoal}
                  onChange={handleChange}
                  required
                  className="bg-gray-800 border-gray-700 pl-10"
                />
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between pb-6">
        <Button variant="outline" onClick={onCancel} className="bg-gray-800 border-gray-700">
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="bg-yellow-500 hover:bg-yellow-600 text-black">
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  )
}
