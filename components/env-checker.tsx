"use client"

import { useState, useEffect } from "react"

export function EnvChecker() {
  const [envVars, setEnvVars] = useState<Record<string, boolean>>({})
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Check environment variables
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  }, [])

  if (!isClient) return null

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs z-50">
      <h4 className="font-bold mb-1">Environment Variables:</h4>
      <ul>
        {Object.entries(envVars).map(([key, isSet]) => (
          <li key={key} className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isSet ? "bg-green-500" : "bg-red-500"}`}></span>
            <span>
              {key}: {isSet ? "✓" : "✗"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
