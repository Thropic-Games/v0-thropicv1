"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function DebugPage() {
  const [isClient, setIsClient] = useState(false)
  const [envVars, setEnvVars] = useState<Record<string, boolean>>({})
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Check environment variables
    const vars = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_URL: !!process.env.SUPABASE_URL,
    }

    setEnvVars(vars)
  }, [])

  const testConnection = async () => {
    if (!isClient) return

    setIsLoading(true)
    try {
      // Try a simple query
      const { data, error } = await supabase.from("game").select("id, name").limit(1)

      if (error) throw error

      setTestResult({
        success: true,
        message: `Connection successful! Found ${data?.length || 0} games.`,
      })
    } catch (err) {
      console.error("Connection test failed:", err)
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isClient) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Database Debug Page</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Environment Variables</h2>
        <ul className="space-y-2">
          {Object.entries(envVars).map(([key, isSet]) => (
            <li key={key} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isSet ? "bg-green-500" : "bg-red-500"}`}></span>
              <span>
                {key}: {isSet ? "Available" : "Not Available"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Connection Test</h2>
        <button
          onClick={testConnection}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? "Testing..." : "Test Connection"}
        </button>

        {testResult && (
          <div className={`mt-4 p-4 rounded ${testResult.success ? "bg-green-100" : "bg-red-100"}`}>
            <p className={testResult.success ? "text-green-700" : "text-red-700"}>{testResult.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
