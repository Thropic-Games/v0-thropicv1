"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { OrganizationTypeStep } from "@/components/create-game/organization-type-step"
import { NonprofitSelectionStep } from "@/components/create-game/nonprofit-selection-step"
import { StripeConnectStep } from "@/components/create-game/stripe-connect-step"
import { GameTemplateStep } from "@/components/create-game/game-template-step"
import { GameDetailsStep } from "@/components/create-game/game-details-step"
import { CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export type OrganizationType = "nonprofit" | "local" | null
export type Nonprofit = {
  id: string
  name: string
  ein: string
  city: string
  state: string
}
export type GameTemplate = {
  id: string
  name: string
  description: string
  image: string
  category?: string
}
export type GameDetails = {
  title: string
  description: string
  startDate: string
  endDate: string
  entryFee: string
  fundraisingGoal: string
}

export function CreateGameForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [organizationType, setOrganizationType] = useState<OrganizationType>(null)
  const [selectedNonprofit, setSelectedNonprofit] = useState<Nonprofit | null>(null)
  const [stripeConnected, setStripeConnected] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<GameTemplate | null>(null)
  const [gameDetails, setGameDetails] = useState<GameDetails | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [gameId, setGameId] = useState<string | null>(null)

  const totalSteps = 4

  const handleOrganizationTypeSelect = (type: OrganizationType) => {
    setOrganizationType(type)
    setCurrentStep(2)
  }

  const handleNonprofitSelect = (nonprofit: Nonprofit) => {
    setSelectedNonprofit(nonprofit)
    setCurrentStep(3) // Go directly to game template selection
  }

  const handleStripeConnect = () => {
    setStripeConnected(true)
    setCurrentStep(3) // Go to game template selection
  }

  const handleTemplateSelect = (template: GameTemplate) => {
    setSelectedTemplate(template)
    setCurrentStep(4) // Go to game details
  }

  const handleGameDetailsSubmit = (details: GameDetails) => {
    setGameDetails(details)
    setIsComplete(true)
    // In a real app, you would save the game to your database and get an ID back
    setGameId("1") // Mock ID for demonstration
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleManageGame = () => {
    if (gameId) {
      router.push(`/manage-game/${gameId}`)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <OrganizationTypeStep onSelect={handleOrganizationTypeSelect} />
      case 2:
        if (organizationType === "nonprofit") {
          return <NonprofitSelectionStep onSelect={handleNonprofitSelect} onBack={handleBack} />
        } else {
          return <StripeConnectStep onComplete={handleStripeConnect} onBack={handleBack} />
        }
      case 3:
        return <GameTemplateStep onSelect={handleTemplateSelect} onBack={handleBack} />
      case 4:
        return (
          <GameDetailsStep
            onSubmit={handleGameDetailsSubmit}
            onBack={handleBack}
            template={selectedTemplate}
            organizationType={organizationType}
            nonprofit={selectedNonprofit}
          />
        )
      default:
        return null
    }
  }

  if (isComplete) {
    return (
      <Card className="bg-gray-900 border-gray-800 mb-20">
        <CardHeader>
          <CardTitle className="text-center">Game Created Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <p className="text-center text-lg mb-2">
            Your game has been created and is ready to share with participants.
          </p>
          <div className="bg-gray-800 p-4 rounded-lg w-full max-w-md mt-4">
            <h3 className="font-medium mb-2">Game Details</h3>
            <p>
              <span className="text-gray-400">Title:</span> {gameDetails?.title}
            </p>
            <p>
              <span className="text-gray-400">Template:</span> {selectedTemplate?.name}
            </p>
            <p>
              <span className="text-gray-400">Organization:</span>{" "}
              {organizationType === "nonprofit" ? selectedNonprofit?.name : "Local Organization"}
            </p>
            <p>
              <span className="text-gray-400">Start Date:</span> {gameDetails?.startDate}
            </p>
            <p>
              <span className="text-gray-400">End Date:</span> {gameDetails?.endDate}
            </p>
            <p>
              <span className="text-gray-400">Entry Fee:</span> {gameDetails?.entryFee}
            </p>
            <p>
              <span className="text-gray-400">Fundraising Goal:</span> {gameDetails?.fundraisingGoal}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <Button onClick={handleManageGame} className="bg-yellow-500 hover:bg-yellow-600 text-black">
            Manage Your Game
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900 border-gray-800 mb-20">
      <CardHeader>
        <CardTitle>Create a New Game</CardTitle>
        <CardDescription>Follow the steps below to set up your fundraising game</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Wider progress indicator */}
        <div className="mb-8 w-full max-w-2xl mx-auto">
          <div className="relative">
            {/* Horizontal line connecting all steps */}
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-800">
              <div
                className="h-full bg-yellow-500 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              ></div>
            </div>

            {/* Step circles and labels */}
            <div className="relative flex justify-between">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                      index + 1 <= currentStep ? "bg-yellow-500 text-black" : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs text-gray-400 mt-2 text-center w-24">
                    {index === 0
                      ? "Organization Type"
                      : index === 1
                        ? organizationType === "nonprofit"
                          ? "Select Nonprofit"
                          : "Connect Payment"
                        : index === 2
                          ? "Game Template"
                          : "Game Details"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {renderStep()}
      </CardContent>
    </Card>
  )
}
