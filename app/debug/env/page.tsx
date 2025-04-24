"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function EnvDebugPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({})

  useEffect(() => {
    // Only collect public environment variables
    const publicEnvVars: Record<string, string> = {}

    // Collect all NEXT_PUBLIC_ environment variables
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith("NEXT_PUBLIC_")) {
        publicEnvVars[key] = process.env[key] || "(empty)"
      }
    })

    // Add specific variables we're interested in
    publicEnvVars["NEXT_PUBLIC_SITE_URL"] = process.env.NEXT_PUBLIC_SITE_URL || "(not set)"
    publicEnvVars["NEXT_PUBLIC_SUPABASE_URL"] = process.env.NEXT_PUBLIC_SUPABASE_URL || "(not set)"
    publicEnvVars["NEXT_PUBLIC_SUPABASE_ANON_KEY"] = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "(set)" : "(not set)"

    setEnvVars(publicEnvVars)
  }, [])

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Environment Variables Debug</CardTitle>
          <CardDescription>Checking public environment variables (NEXT_PUBLIC_*)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md">
              <p className="text-amber-800 dark:text-amber-300 text-sm">
                Note: This page only shows public environment variables for security reasons. Private environment
                variables are not accessible from the client.
              </p>
            </div>

            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="px-4 py-2 text-left">Variable</th>
                    <th className="px-4 py-2 text-left">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(envVars).map(([key, value]) => (
                    <tr key={key} className="border-t">
                      <td className="px-4 py-2 font-mono text-sm">{key}</td>
                      <td className="px-4 py-2 font-mono text-sm">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
