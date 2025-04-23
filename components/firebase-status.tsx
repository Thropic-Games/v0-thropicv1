"use client"

import { useFirebase } from "@/contexts/firebase-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export function FirebaseStatus() {
  const { error, loading } = useFirebase()

  if (loading) {
    return (
      <Alert className="bg-yellow-500/20 text-yellow-400 border-yellow-600 mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Initializing Firebase</AlertTitle>
        <AlertDescription>Please wait while we connect to Firebase services...</AlertDescription>
      </Alert>
    )
  }

  if (error) {
    return (
      <Alert className="bg-red-500/20 text-red-400 border-red-600 mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Firebase Error</AlertTitle>
        <AlertDescription>
          {error.message}
          <div className="mt-2 text-sm">
            Please check your environment variables and make sure they are correctly set.
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="bg-green-500/20 text-green-400 border-green-600 mb-4">
      <CheckCircle className="h-4 w-4" />
      <AlertTitle>Firebase Connected</AlertTitle>
      <AlertDescription>Successfully connected to Firebase services.</AlertDescription>
    </Alert>
  )
}
