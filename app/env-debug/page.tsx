"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function EnvDebugPage() {
  const [envVars, setEnvVars] = useState<Record<string, boolean>>({})
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const vars = {
      // Supabase variables
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

      // Firebase variables
      NEXT_PUBLIC_FIREBASE_API_KEY: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      NEXT_PUBLIC_FIREBASE_APP_ID: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    }

    setEnvVars(vars)
  }, [])

  if (!isClient) {
    return <div>Loading environment variables...</div>
  }

  const missingVars = Object.entries(envVars).filter(([_, isSet]) => !isSet)
  const presentVars = Object.entries(envVars).filter(([_, isSet]) => isSet)

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Environment Variables Debug</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Available Variables
              <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 border-green-500/20">
                {presentVars.length}
              </Badge>
            </CardTitle>
            <CardDescription>Environment variables that are properly set</CardDescription>
          </CardHeader>
          <CardContent>
            {presentVars.length > 0 ? (
              <ul className="space-y-2">
                {presentVars.map(([key]) => (
                  <li key={key} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span>{key}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No environment variables are set.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Missing Variables
              <Badge variant="outline" className="ml-2 bg-red-500/10 text-red-500 border-red-500/20">
                {missingVars.length}
              </Badge>
            </CardTitle>
            <CardDescription>Environment variables that need to be set</CardDescription>
          </CardHeader>
          <CardContent>
            {missingVars.length > 0 ? (
              <ul className="space-y-2">
                {missingVars.map(([key]) => (
                  <li key={key} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>{key}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">All required environment variables are set.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How to Set Environment Variables</CardTitle>
          <CardDescription>Follow these steps to set up your environment variables</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">For Vercel Deployment:</h3>
              <ol className="list-decimal ml-5 mt-2 space-y-2">
                <li>Go to your Vercel project dashboard</li>
                <li>Click on "Settings" tab</li>
                <li>Select "Environment Variables" from the left sidebar</li>
                <li>Add each missing variable with its corresponding value</li>
                <li>Click "Save" and redeploy your application</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-medium">For Local Development:</h3>
              <ol className="list-decimal ml-5 mt-2 space-y-2">
                <li>
                  Create a <code>.env.local</code> file in your project root
                </li>
                <li>
                  Add each variable in the format: <code>VARIABLE_NAME=value</code>
                </li>
                <li>Restart your development server</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
