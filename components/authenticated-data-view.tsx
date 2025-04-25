"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AuthenticatedDataViewProps {
  tableName: string
  title?: string
  description?: string
}

export function AuthenticatedDataView({
  tableName,
  title = "Protected Data",
  description = "This content is only visible to authenticated users",
}: AuthenticatedDataViewProps) {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  // Step 1: Load and track the Supabase session
  useEffect(() => {
    // Function to get the current session
    const getSession = async () => {
      try {
        setSessionLoading(true)
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error fetching session:", error)
          setError("Failed to authenticate")
        } else {
          setSession(data.session)
        }
      } catch (err) {
        console.error("Exception fetching session:", err)
        setError("Authentication service unavailable")
      } finally {
        setSessionLoading(false)
      }
    }

    // Get initial session
    getSession()

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event)
      setSession(session)
      setSessionLoading(false)
    })

    // Cleanup subscription
    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  // Step 2: Fetch data from the specified table when authenticated
  useEffect(() => {
    // Only fetch data if we have a session and we know session loading is complete
    if (session && !sessionLoading) {
      const fetchData = async () => {
        try {
          setLoading(true)

          // Fetch data from the specified table
          const { data, error } = await supabase.from(tableName).select("*")

          if (error) {
            console.error(`Error fetching data from ${tableName}:`, error)
            setError(`Failed to load data: ${error.message}`)
          } else {
            setData(data || [])
            setError(null)
          }
        } catch (err) {
          console.error("Exception fetching data:", err)
          setError("Data service unavailable")
        } finally {
          setLoading(false)
        }
      }

      fetchData()
    } else if (!sessionLoading) {
      // If session loading is complete and we don't have a session, we're not authenticated
      setLoading(false)
    }
  }, [session, sessionLoading, tableName])

  // Show loading spinner while checking session
  if (sessionLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
          <p className="mt-4 text-sm text-gray-500">Checking authentication...</p>
        </CardContent>
      </Card>
    )
  }

  // Show login message if not authenticated
  if (!session) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>Please log in to view this content.</AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button asChild>
              <Link href="/login">Log In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
          <p className="mt-4 text-sm text-gray-500">Loading data...</p>
        </CardContent>
      </Card>
    )
  }

  // Show error message if there was an error
  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  // Show data if everything is successful
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-center text-gray-500">No data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  {Object.keys(data[0]).map((key) => (
                    <th key={key} className="px-4 py-2 text-left text-sm font-medium">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className="border-b">
                    {Object.values(row).map((value: any, j) => (
                      <td key={j} className="px-4 py-2 text-sm">
                        {typeof value === "object" ? JSON.stringify(value) : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
