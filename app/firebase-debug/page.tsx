"use client"

import { useEffect, useState } from "react"
import { FirebaseStatus } from "@/components/firebase-status"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"

export default function FirebaseDebugPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({})

  useEffect(() => {
    // Collect all NEXT_PUBLIC environment variables (safe to expose)
    const publicEnvVars: Record<string, string> = {}
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith("NEXT_PUBLIC_")) {
        // Mask the actual values for security
        const value = process.env[key] || ""
        publicEnvVars[key] = value ? "✓ Set" : "✗ Not set"
      }
    })
    setEnvVars(publicEnvVars)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Firebase Debug</h1>

        <FirebaseStatus />

        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Check if your Firebase environment variables are properly set</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="font-mono text-sm">{key}</span>
                  <span className={value.startsWith("✓") ? "text-green-400" : "text-red-400"}>{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Verify that all required Firebase environment variables are set in your Vercel project</li>
            <li>Make sure your Firebase project is properly configured in the Firebase console</li>
            <li>Check if your API key is valid and has the necessary permissions</li>
            <li>Ensure your Firebase project has Authentication enabled if you're using auth features</li>
            <li>Try clearing your browser cache and reloading the page</li>
          </ol>
        </div>
      </main>
    </div>
  )
}
