"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function SupabaseClientDebugPage() {
  const [clientStatus, setClientStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [envStatus, setEnvStatus] = useState<{
    NEXT_PUBLIC_SUPABASE_URL: boolean
    NEXT_PUBLIC_SUPABASE_ANON_KEY: boolean
  }>({
    NEXT_PUBLIC_SUPABASE_URL: false,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: false,
  })

  useEffect(() => {
    // Check environment variables
    setEnvStatus({
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })

    // Test Supabase client
    try {
      const supabase = createClientComponentClient()

      // Simple test query
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .then(() => {
          setClientStatus("success")
        })
        .catch((error) => {
          setClientStatus("error")
          setErrorMessage(error.message || "Unknown error")
        })
    } catch (error: any) {
      setClientStatus("error")
      setErrorMessage(error.message || "Unknown error")
    }
  }, [])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Supabase Client Debug</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Environment Variables
              <Badge
                variant="outline"
                className={`ml-2 ${
                  Object.values(envStatus).every(Boolean)
                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : "bg-red-500/10 text-red-500 border-red-500/20"
                }`}
              >
                {Object.values(envStatus).every(Boolean) ? "OK" : "Missing"}
              </Badge>
            </CardTitle>
            <CardDescription>Required Supabase environment variables</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {Object.entries(envStatus).map(([key, isSet]) => (
                <li key={key} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isSet ? "bg-green-500" : "bg-red-500"}`}></span>
                  <span>
                    {key}: {isSet ? "Set" : "Missing"}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Supabase Client
              <Badge
                variant="outline"
                className={`ml-2 ${
                  clientStatus === "loading"
                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    : clientStatus === "success"
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : "bg-red-500/10 text-red-500 border-red-500/20"
                }`}
              >
                {clientStatus === "loading" ? "Testing" : clientStatus === "success" ? "Working" : "Error"}
              </Badge>
            </CardTitle>
            <CardDescription>Testing Supabase client connection</CardDescription>
          </CardHeader>
          <CardContent>
            {clientStatus === "loading" && <p>Testing Supabase client connection...</p>}
            {clientStatus === "success" && <p className="text-green-600">Supabase client is working correctly!</p>}
            {clientStatus === "error" && (
              <div>
                <p className="text-red-600">Error connecting to Supabase:</p>
                <pre className="bg-red-50 p-2 rounded mt-2 text-xs overflow-auto">{errorMessage}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
