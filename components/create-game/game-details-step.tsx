"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Calendar, DollarSign, Clock, Target } from "lucide-react"
import type { GameTemplate, Nonprofit, OrganizationType, GameDetails } from "./create-game-form"

interface GameDetailsStepProps {
  onSubmit: (details: GameDetails) => void
  onBack: () => void
  template: GameTemplate | null
  organizationType: OrganizationType
  nonprofit: Nonprofit | null
}

export function GameDetailsStep({ onSubmit, onBack, template, organizationType, nonprofit }: GameDetailsStepProps) {
  const [formData, setFormData] = useState<GameDetails>({
    title: template ? `${template.name} Fundraiser` : "",
    description: "",
    startDate: "",
    endDate: "",
    entryFee: "10.00",
    fundraisingGoal: "1000.00",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Game Details</h2>
      <p className="text-gray-400">Configure the details for your fundraising game.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
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
                  <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
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

            <div className="flex justify-between mt-6 pb-6">
              {" "}
              {/* Added bottom padding */}
              <Button type="button" variant="outline" onClick={onBack} className="bg-gray-800 border-gray-700">
                Back
              </Button>
              <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                Create Game
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Selected Template</h3>
              {template && (
                <div className="space-y-2">
                  <div className="relative h-32 rounded-md overflow-hidden">
                    <Image
                      src={template.image || "/placeholder.svg"}
                      alt={template.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-gray-400">{template.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Organization</h3>
              {organizationType === "nonprofit" && nonprofit ? (
                <div>
                  <p className="font-medium">{nonprofit.name}</p>
                  <p className="text-sm text-gray-400">EIN: {nonprofit.ein}</p>
                  <p className="text-sm text-gray-400">
                    {nonprofit.city}, {nonprofit.state}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-400">Local Organization (Stripe Connected)</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
