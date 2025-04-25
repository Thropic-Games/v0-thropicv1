"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle } from "lucide-react"

export default function EnvironmentDebugPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({})
  const [domainInfo, setDomainInfo] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Collect environment information
    const collectInfo = async () => {
      try {
        setIsLoading(true)

        // Collect public environment variables
        const publicEnvVars: Record<string, string> = {}

        // Check specific variables we're interested in
        publicEnvVars["NEXT_PUBLIC_SUPABASE_URL"] = process.env.NEXT_PUBLIC_SUPABASE_URL || "(not set)"
        publicEnvVars["NEXT_PUBLIC_SUPABASE_ANON_KEY"] = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ? "(set - " + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5) + "...)"
          : "(not set)"
        publicEnvVars["NEXT_PUBLIC_SITE_URL"] = process.env.NEXT_PUBLIC_SITE_URL || "(not set)"

        // Collect domain information
        const domain = {
          "Current URL": window.location.href,
          Hostname: window.location.hostname,
          Origin: window.location.origin,
          Protocol: window.location.protocol,
        }

        setEnvVars(publicEnvVars)
        setDomainInfo(domain)
      } catch (error) {
        console.error("Error collecting environment info:", error)
      } finally {
        setIsLoading(false)
      }
    }

    collectInfo()
  }, [])

  const hasSupabaseConfig = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Environment Configuration Debug</h1>

      {isLoading ? (
        <div>Loading environment information...</div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {hasSupabaseConfig ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                )}
                Supabase Configuration Status
              </CardTitle>
              <CardDescription>Checking if Supabase environment variables are properly configured</CardDescription>
            </CardHeader>
            <CardContent>
              {!hasSupabaseConfig && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Missing Supabase Configuration</AlertTitle>
                  <AlertDescription>
                    Supabase environment variables are missing or invalid. Please check your environment configuration.
                  </AlertDescription>
                </Alert>
              )}

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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Domain Information</CardTitle>
              <CardDescription>Details about the current domain and URL</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="px-4 py-2 text-left">Property</th>
                      <th className="px-4 py-2 text-left">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(domainInfo).map(([key, value]) => (
                      <tr key={key} className="border-t">
                        <td className="px-4 py-2 font-mono text-sm">{key}</td>
                        <td className="px-4 py-2 font-mono text-sm">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">1. Check Environment Variables in Vercel</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Go to your Vercel project settings and verify that the environment variables are correctly set for
                  your new domain.
                </p>
              </div>

              <div>
                <h3 className="font-medium">2. Redeploy Your Application</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sometimes a fresh deployment is needed after changing environment variables.
                </p>
              </div>

              <div>
                <h3 className="font-medium">3. Check Domain Configuration</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ensure your domain is properly configured in Vercel and DNS settings are correct.
                </p>
              </div>

              <div>
                <h3 className="font-medium">4. Clear Browser Cache</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Try clearing your browser cache or using incognito mode to ensure you're not seeing cached environment
                  variables.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
