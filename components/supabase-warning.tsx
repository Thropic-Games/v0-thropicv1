"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export function SupabaseWarning() {
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    // Check if Supabase environment variables are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      setShowWarning(true)
    }
  }, [])

  if (!showWarning) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Supabase Configuration Error</AlertTitle>
      <AlertDescription>
        Supabase environment variables are missing or invalid. Please check your environment configuration.
      </AlertDescription>
    </Alert>
  )
}
