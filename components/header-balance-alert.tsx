"use client"

import { useState, useEffect } from "react"
import { AlertCircle, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useFirebase } from "@/contexts/firebase-context"

export function HeaderBalanceAlert() {
  const [dismissed, setDismissed] = useState(false)
  const [hasUnclaimedBalance, setHasUnclaimedBalance] = useState(false)
  const [hasStripeConnected, setHasStripeConnected] = useState(false)
  const router = useRouter()
  const { user } = useFirebase()

  useEffect(() => {
    // In a real app, you would fetch this data from your backend
    // This is just a mock implementation for demonstration
    if (user) {
      // Mock check for unclaimed balance
      setHasUnclaimedBalance(true)

      // Mock check for Stripe connection status
      setHasStripeConnected(false)
    }
  }, [user])

  // Don't show the alert if user has no balance, has already connected Stripe, or dismissed the alert
  if (!hasUnclaimedBalance || hasStripeConnected || dismissed) {
    return null
  }

  return (
    <Alert className="bg-yellow-500/10 border-yellow-600 mb-0 rounded-none">
      <div className="container mx-auto flex items-center justify-between py-1">
        <div className="flex items-center">
          <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
          <AlertDescription className="text-yellow-400">
            You have unclaimed prize winnings! Connect your bank account to receive your funds.
          </AlertDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-yellow-500 hover:bg-yellow-600 text-black h-8"
            onClick={() => router.push("/profile/connect-bank")}
          >
            Connect Bank
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white h-8 p-0 w-8"
            onClick={() => setDismissed(true)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </div>
    </Alert>
  )
}
