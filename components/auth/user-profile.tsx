"use client"

import { useFirebase } from "@/contexts/firebase-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { BanknoteIcon as BankIcon } from "lucide-react"

interface UserData {
  displayName?: string
  photoURL?: string
  email?: string
  bio?: string
}

export function UserProfile() {
  const { user, signOut, db } = useFirebase()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasStripeConnected, setHasStripeConnected] = useState(false)
  const [unclaimedBalance, setUnclaimedBalance] = useState(125.0)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData)
        } else {
          // If no custom data, use auth data
          setUserData({
            displayName: user.displayName || undefined,
            photoURL: user.photoURL || undefined,
            email: user.email || undefined,
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user, db])

  useEffect(() => {
    if (user) {
      // In a real app, you would fetch this data from your backend
      // This is just a mock implementation for demonstration
      setHasStripeConnected(false)
      setUnclaimedBalance(125.0)
    }
  }, [user])

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>
  }

  if (!user) {
    return <div className="text-center py-8">Please sign in to view your profile.</div>
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 max-w-md mx-auto">
      <div className="flex flex-col items-center">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={userData?.photoURL || ""} alt={userData?.displayName || "User"} />
          <AvatarFallback className="bg-yellow-500 text-white text-xl">
            {userData?.displayName?.[0] || userData?.email?.[0] || "U"}
          </AvatarFallback>
        </Avatar>

        <h2 className="text-xl font-medium mb-1">{userData?.displayName || "User"}</h2>

        <p className="text-gray-400 mb-4">{userData?.email}</p>

        {userData?.bio && <p className="text-center mb-6 text-gray-300">{userData.bio}</p>}

        {unclaimedBalance > 0 && !hasStripeConnected && (
          <div className="mt-6 bg-yellow-500/10 border border-yellow-600 rounded-lg p-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div>
                <p className="text-yellow-400 font-medium">${unclaimedBalance.toFixed(2)} in unclaimed winnings!</p>
                <p className="text-sm text-yellow-400/80">Connect your bank account to receive your funds.</p>
              </div>
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 text-black whitespace-nowrap"
                onClick={() => (window.location.href = "/profile/connect-bank")}
              >
                <BankIcon className="h-4 w-4 mr-2" />
                Connect Bank Account
              </Button>
            </div>
          </div>
        )}

        {hasStripeConnected && (
          <div className="mt-6 bg-green-500/10 border border-green-600 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <BankIcon className="h-4 w-4 text-green-500" />
              <p className="text-green-400">Bank account connected</p>
            </div>
          </div>
        )}

        <Button variant="outline" onClick={signOut} className="mt-4">
          Sign Out
        </Button>
      </div>
    </div>
  )
}
