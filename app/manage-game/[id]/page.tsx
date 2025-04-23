"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Sidebar } from "@/components/sidebar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { GlobalScrollContainer } from "@/components/global-scroll-container"
import { StaticHorizontalMenu } from "@/components/static-horizontal-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { GameEditForm } from "@/components/manage-game/game-edit-form"
import { GameParticipants } from "@/components/manage-game/game-participants"
import { GameStats } from "@/components/manage-game/game-stats"
import { AlertCircle, Clock, Calendar, DollarSign, Users, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import type { GameDetails } from "@/components/create-game/create-game-form"

// Mock data - in a real app, this would come from your database
const mockGame = {
  id: "1",
  title: "Masters Tournament Fundraiser",
  description: "Join our Masters Tournament pool to support youth golf programs nationwide.",
  startDate: "2025-04-10",
  endDate: "2025-04-14",
  entryFee: "10.00",
  fundraisingGoal: "1000.00",
  currentAmount: "450.00",
  participants: 45,
  status: "Upcoming", // Could be "Upcoming", "In Progress", "Completed"
  template: {
    id: "4",
    name: "The Masters",
    description: "Golf tournament pool with player drafts",
    image: "/images/hero/mastershero.jpg",
  },
  organizationType: "nonprofit",
  nonprofit: {
    id: "5",
    name: "World Wildlife Fund",
    ein: "52-1693387",
    city: "Washington",
    state: "DC",
  },
  createdAt: "2025-03-15",
}

export default function ManageGamePage() {
  const params = useParams()
  const router = useRouter()
  const [game, setGame] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // In a real app, you would fetch the game data from your database
    // using the ID from params.id
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setGame(mockGame)
      setLoading(false)
    }, 500)
  }, [params.id])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = (updatedDetails: GameDetails) => {
    // In a real app, you would save the updated details to your database
    setGame({
      ...game,
      ...updatedDetails,
    })
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleDelete = () => {
    // In a real app, you would delete the game from your database
    // and redirect to a different page
    router.push("/games")
  }

  const isGameEditable = game?.status === "Upcoming"

  return (
    <div className="flex flex-col h-full bg-black text-white overflow-hidden">
      <SiteHeader />
      <StaticHorizontalMenu />

      <GlobalScrollContainer>
        <div className="flex min-h-0">
          <Sidebar />

          <main className="flex-1">
            <div className="px-4 pb-32 md:pb-32 pt-6">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading game details...</p>
                  </div>
                </div>
              ) : game ? (
                <>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                      <h1 className="text-3xl font-medium">{game.title}</h1>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          className={`${
                            game.status === "Upcoming"
                              ? "bg-blue-500/20 text-blue-400"
                              : game.status === "In Progress"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-purple-500/20 text-purple-400"
                          }`}
                        >
                          {game.status}
                        </Badge>
                        <span className="text-gray-400">Created on {game.createdAt}</span>
                      </div>
                    </div>

                    {isGameEditable && !isEditing && (
                      <div className="flex gap-2">
                        <Button onClick={handleEdit} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Game
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleDelete}
                          className="bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>

                  {!isGameEditable && (
                    <Alert className="mb-6 bg-yellow-500/10 text-yellow-400 border-yellow-600">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Game Cannot Be Edited</AlertTitle>
                      <AlertDescription>
                        This game has already started and cannot be edited. You can still view statistics and manage
                        participants.
                      </AlertDescription>
                    </Alert>
                  )}

                  {isEditing ? (
                    <GameEditForm game={game} onSave={handleSaveEdit} onCancel={handleCancelEdit} />
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-gray-900 border-gray-800">
                          <CardHeader>
                            <CardTitle>Game Details</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p className="text-gray-300">{game.description}</p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="flex items-center gap-3">
                                  <Calendar className="h-5 w-5 text-yellow-500" />
                                  <div>
                                    <p className="text-sm text-gray-400">Start Date</p>
                                    <p>{game.startDate}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Clock className="h-5 w-5 text-yellow-500" />
                                  <div>
                                    <p className="text-sm text-gray-400">End Date</p>
                                    <p>{game.endDate}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <DollarSign className="h-5 w-5 text-yellow-500" />
                                  <div>
                                    <p className="text-sm text-gray-400">Entry Fee</p>
                                    <p>${game.entryFee}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Users className="h-5 w-5 text-yellow-500" />
                                  <div>
                                    <p className="text-sm text-gray-400">Participants</p>
                                    <p>{game.participants}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Tabs defaultValue="stats">
                          <TabsList className="bg-gray-800">
                            <TabsTrigger value="stats">Statistics</TabsTrigger>
                            <TabsTrigger value="participants">Participants</TabsTrigger>
                          </TabsList>
                          <TabsContent value="stats" className="mt-4">
                            <GameStats game={game} />
                          </TabsContent>
                          <TabsContent value="participants" className="mt-4">
                            <GameParticipants game={game} />
                          </TabsContent>
                        </Tabs>
                      </div>

                      <div className="space-y-6">
                        <Card className="bg-gray-900 border-gray-800">
                          <CardHeader>
                            <CardTitle>Fundraising Progress</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between mb-2">
                                <span className="text-gray-400">Current</span>
                                <span className="text-yellow-500 font-medium">${game.currentAmount}</span>
                              </div>
                              <div className="w-full bg-gray-800 rounded-full h-2.5">
                                <div
                                  className="bg-yellow-500 h-2.5 rounded-full"
                                  style={{
                                    width: `${Math.min(
                                      (Number.parseFloat(game.currentAmount) /
                                        Number.parseFloat(game.fundraisingGoal)) *
                                        100,
                                      100,
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-gray-400">Goal</span>
                                <span>${game.fundraisingGoal}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gray-900 border-gray-800">
                          <CardHeader>
                            <CardTitle>Template</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="relative h-32 rounded-md overflow-hidden">
                                <Image
                                  src={game.template.image || "/placeholder.svg"}
                                  alt={game.template.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <h3 className="font-medium">{game.template.name}</h3>
                              <p className="text-sm text-gray-400">{game.template.description}</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gray-900 border-gray-800">
                          <CardHeader>
                            <CardTitle>Organization</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {game.organizationType === "nonprofit" && game.nonprofit ? (
                              <div>
                                <p className="font-medium">{game.nonprofit.name}</p>
                                <p className="text-sm text-gray-400">EIN: {game.nonprofit.ein}</p>
                                <p className="text-sm text-gray-400">
                                  {game.nonprofit.city}, {game.nonprofit.state}
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-400">Local Organization (Stripe Connected)</p>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-medium mb-2">Game Not Found</h2>
                  <p className="text-gray-400 mb-6">The game you're looking for doesn't exist or has been removed.</p>
                  <Button
                    onClick={() => router.push("/games")}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    Back to Games
                  </Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </GlobalScrollContainer>

      <MobileBottomNav />
    </div>
  )
}
