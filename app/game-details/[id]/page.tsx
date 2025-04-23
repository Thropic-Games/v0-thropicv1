"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { Sidebar } from "@/components/sidebar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { GlobalScrollContainer } from "@/components/global-scroll-container"
import { StaticHorizontalMenu } from "@/components/static-horizontal-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Download, Users, DollarSign, Calendar, Clock, Share2 } from "lucide-react"

// Mock data for the game details
const mockGameData = {
  "masters-tournament": {
    id: "masters-tournament",
    title: "Masters Tournament",
    image: "/images/hero/mastershero.jpg",
    description: "Join our Masters Tournament pool to support youth golf programs nationwide.",
    status: "In Progress",
    startDate: "April 10, 2025",
    endDate: "April 14, 2025",
    participants: 45,
    totalDonations: 4500,
    donorsCount: 38,
    gradient: "from-green-600 to-yellow-500",
    charity: "Youth Golf Programs",
    donationGoal: 10000,
  },
  "nba-playoffs": {
    id: "nba-playoffs",
    title: "NBA Playoffs",
    image: "/images/hero/nbahero.jpg",
    description: "NBA Playoffs bracket and prediction challenge to support basketball in underserved communities.",
    status: "Completed",
    startDate: "March 15, 2025",
    endDate: "April 5, 2025",
    participants: 78,
    totalDonations: 7800,
    donorsCount: 65,
    gradient: "from-blue-600 to-red-600",
    charity: "Basketball in Schools",
    donationGoal: 8000,
  },
  "stanley-cup-playoffs": {
    id: "stanley-cup-playoffs",
    title: "Stanley Cup Playoffs",
    image: "/images/hero/hockeyhero.jpg",
    description: "Stanley Cup Playoffs bracket challenge to fund hockey equipment for youth programs.",
    status: "Upcoming",
    startDate: "May 1, 2025",
    endDate: "June 15, 2025",
    participants: 32,
    totalDonations: 3200,
    donorsCount: 28,
    gradient: "from-teal-400 to-blue-500",
    charity: "Youth Hockey Equipment",
    donationGoal: 15000,
  },
}

// Mock data for charts
const donationsByDayData = [
  { day: "Day 1", amount: 850 },
  { day: "Day 2", amount: 1200 },
  { day: "Day 3", amount: 750 },
  { day: "Day 4", amount: 950 },
  { day: "Day 5", amount: 750 },
]

const participantsByDayData = [
  { day: "Day 1", count: 12 },
  { day: "Day 2", count: 8 },
  { day: "Day 3", count: 15 },
  { day: "Day 4", count: 6 },
  { day: "Day 5", count: 4 },
]

const donorTypeData = [
  { name: "New Donors", value: 65 },
  { name: "Returning Donors", value: 35 },
]

const DONOR_COLORS = ["#3b82f6", "#f59e0b"]

// Mock donor data for CSV export
const mockDonorData = [
  { id: 1, name: "John Smith", email: "john@example.com", amount: 50, date: "2025-04-10" },
  { id: 2, name: "Sarah Johnson", email: "sarah@example.com", amount: 100, date: "2025-04-10" },
  { id: 3, name: "Michael Brown", email: "michael@example.com", amount: 75, date: "2025-04-11" },
  { id: 4, name: "Emily Davis", email: "emily@example.com", amount: 50, date: "2025-04-11" },
  { id: 5, name: "David Wilson", email: "david@example.com", amount: 200, date: "2025-04-12" },
  { id: 6, name: "Jessica Taylor", email: "jessica@example.com", amount: 25, date: "2025-04-12" },
  { id: 7, name: "Robert Martinez", email: "robert@example.com", amount: 150, date: "2025-04-13" },
  { id: 8, name: "Jennifer Anderson", email: "jennifer@example.com", amount: 50, date: "2025-04-13" },
]

export default function GameDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [game, setGame] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // In a real app, you would fetch the game data from your API
    setLoading(true)

    // Simulate API call with timeout
    setTimeout(() => {
      const gameId = params.id as string
      const gameData = mockGameData[gameId as keyof typeof mockGameData]

      if (gameData) {
        setGame(gameData)
      }

      setLoading(false)
    }, 500)
  }, [params.id])

  const handleDownloadCSV = () => {
    // In a real app, you would fetch this data from your API
    // For this demo, we'll use the mock data

    // Convert data to CSV format
    const headers = ["ID", "Name", "Email", "Amount", "Date"]
    const csvRows = [
      headers.join(","),
      ...mockDonorData.map((row) => [row.id, row.name, row.email, row.amount, row.date].join(",")),
    ]
    const csvString = csvRows.join("\n")

    // Create a blob and download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${game.title.replace(/\s+/g, "-")}-donors.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col h-full bg-black text-white overflow-hidden">
      <SiteHeader />
      <StaticHorizontalMenu />

      <GlobalScrollContainer>
        <div className="flex min-h-0">
          <Sidebar />

          <main className="flex-1">
            <div className="px-4 pb-20 md:pb-0 pt-6">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading game details...</p>
                  </div>
                </div>
              ) : game ? (
                <div className="max-w-5xl mx-auto">
                  {/* Game Header */}
                  <div className="relative h-48 md:h-64 rounded-xl overflow-hidden mb-6">
                    <Image src={game.image || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                      <div className="w-full">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <h1 className="text-3xl font-medium text-white">{game.title}</h1>
                            <p className="text-gray-300 font-light">Supporting: {game.charity}</p>
                          </div>
                          <Badge
                            className={`self-start md:self-auto ${
                              game.status === "In Progress"
                                ? "bg-green-500/20 text-green-400"
                                : game.status === "Upcoming"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-purple-500/20 text-purple-400"
                            }`}
                          >
                            {game.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Game Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-gray-900 border-gray-800">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-blue-500/20 p-3 rounded-full">
                          <Users className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Participants</p>
                          <p className="text-2xl font-medium">{game.participants}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900 border-gray-800">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-yellow-500/20 p-3 rounded-full">
                          <DollarSign className="h-6 w-6 text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Total Donations</p>
                          <p className="text-2xl font-medium">${game.totalDonations}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900 border-gray-800">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-green-500/20 p-3 rounded-full">
                          <Calendar className="h-6 w-6 text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Duration</p>
                          <p className="text-2xl font-medium">
                            {game.startDate} - {game.endDate}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Tabs Section */}
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex justify-between items-center mb-4">
                      <TabsList className="bg-gray-900">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="donors">Donors</TabsTrigger>
                      </TabsList>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button
                          size="sm"
                          className="bg-yellow-500 hover:bg-yellow-600 text-black"
                          onClick={handleDownloadCSV}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download CSV
                        </Button>
                      </div>
                    </div>

                    <TabsContent value="overview">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                          <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                              <CardTitle>Game Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-300">{game.description}</p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
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
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                              <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <ActivityItem
                                  avatar="/placeholder.svg?height=40&width=40"
                                  name="John Smith"
                                  action="joined the game"
                                  time="2 hours ago"
                                />
                                <ActivityItem
                                  avatar="/placeholder.svg?height=40&width=40"
                                  name="Sarah Johnson"
                                  action="donated $100"
                                  time="1 day ago"
                                />
                                <ActivityItem
                                  avatar="/placeholder.svg?height=40&width=40"
                                  name="Michael Brown"
                                  action="updated their bracket"
                                  time="3 days ago"
                                />
                              </div>
                            </CardContent>
                          </Card>
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
                                  <span className="text-yellow-500 font-medium">${game.totalDonations}</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-2.5">
                                  <div
                                    className="bg-yellow-500 h-2.5 rounded-full"
                                    style={{
                                      width: `${Math.min((game.totalDonations / game.donationGoal) * 100, 100)}%`,
                                    }}
                                  ></div>
                                </div>
                                <div className="flex justify-between mt-1">
                                  <span className="text-gray-400">Goal</span>
                                  <span>${game.donationGoal}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                              <CardTitle>Top Donors</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <DonorItem
                                  name="David Wilson"
                                  amount="$200"
                                  avatar="/placeholder.svg?height=40&width=40"
                                />
                                <DonorItem
                                  name="Robert Martinez"
                                  amount="$150"
                                  avatar="/placeholder.svg?height=40&width=40"
                                />
                                <DonorItem
                                  name="Sarah Johnson"
                                  amount="$100"
                                  avatar="/placeholder.svg?height=40&width=40"
                                />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="analytics">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-gray-900 border-gray-800">
                          <CardHeader>
                            <CardTitle>Donations by Day</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-80">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={donationsByDayData}>
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
                                  <Bar dataKey="amount" name="Donations ($)" fill="#f59e0b" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gray-900 border-gray-800">
                          <CardHeader>
                            <CardTitle>Participants by Day</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-80">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={participantsByDayData}>
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
                                  <Bar dataKey="count" name="Participants" fill="#3b82f6" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gray-900 border-gray-800">
                          <CardHeader>
                            <CardTitle>Donor Types</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-80">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={donorTypeData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                  >
                                    {donorTypeData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={DONOR_COLORS[index % DONOR_COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip
                                    contentStyle={{
                                      backgroundColor: "#333",
                                      border: "1px solid #555",
                                      borderRadius: "4px",
                                      color: "#fff",
                                    }}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gray-900 border-gray-800">
                          <CardHeader>
                            <CardTitle>Key Metrics</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-sm text-gray-400">Average Donation</p>
                                <p className="text-2xl font-medium">
                                  ${(game.totalDonations / game.donorsCount).toFixed(2)}
                                </p>
                              </div>
                              <div className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-sm text-gray-400">Total Donors</p>
                                <p className="text-2xl font-medium">{game.donorsCount}</p>
                              </div>
                              <div className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-sm text-gray-400">Conversion Rate</p>
                                <p className="text-2xl font-medium">
                                  {((game.donorsCount / game.participants) * 100).toFixed(1)}%
                                </p>
                              </div>
                              <div className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-sm text-gray-400">Goal Progress</p>
                                <p className="text-2xl font-medium">
                                  {((game.totalDonations / game.donationGoal) * 100).toFixed(1)}%
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="donors">
                      <Card className="bg-gray-900 border-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>Donor List</CardTitle>
                          <Button
                            size="sm"
                            className="bg-yellow-500 hover:bg-yellow-600 text-black"
                            onClick={handleDownloadCSV}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download CSV
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-gray-800">
                                  <th className="text-left py-3 px-4 font-medium text-gray-400">Name</th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-400">Email</th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-400">Amount</th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-400">Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {mockDonorData.map((donor) => (
                                  <tr key={donor.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="py-3 px-4">{donor.name}</td>
                                    <td className="py-3 px-4 text-gray-400">{donor.email}</td>
                                    <td className="py-3 px-4 text-yellow-500">${donor.amount}</td>
                                    <td className="py-3 px-4 text-gray-400">{donor.date}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-medium mb-2">Game Not Found</h2>
                  <p className="text-gray-400 mb-6">The game you're looking for doesn't exist or has been removed.</p>
                  <Button
                    onClick={() => router.push("/profile")}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    Back to Profile
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

// Helper components
function ActivityItem({ avatar, name, action, time }: { avatar: string; name: string; action: string; time: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
        <Image src={avatar || "/placeholder.svg"} alt={name} width={40} height={40} className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-light">
          <span className="font-normal">{name}</span> {action}
        </p>
        <p className="text-sm text-gray-400">{time}</p>
      </div>
    </div>
  )
}

function DonorItem({ name, amount, avatar }: { name: string; amount: string; avatar: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
        <Image src={avatar || "/placeholder.svg"} alt={name} width={32} height={32} className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-normal truncate">{name}</p>
      </div>
      <p className="text-yellow-500 font-medium">{amount}</p>
    </div>
  )
}
