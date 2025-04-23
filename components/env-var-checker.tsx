"use client"

import { useState, useEffect } from "react"

export function EnvVarChecker() {
  const [envVars, setEnvVars] = useState<Record<string, boolean>>({})
  const [isClient, setIsClient] = useState(false)
  const [expanded, setExpanded] = useState(false)

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

  if (!isClient) return null

  const missingVars = Object.entries(envVars).filter(([_, isSet]) => !isSet).length
  const totalVars = Object.keys(envVars).length

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs z-50 max-w-xs">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold">
          Environment Variables: {totalVars - missingVars}/{totalVars}
        </h4>
        <button onClick={() => setExpanded(!expanded)} className="text-xs text-gray-400 hover:text-white">
          {expanded ? "Hide" : "Show"}
        </button>
      </div>

      {expanded && (
        <div className="max-h-60 overflow-y-auto">
          <div className="grid grid-cols-1 gap-1">
            {Object.entries(envVars).map(([key, isSet]) => (
              <div key={key} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isSet ? "bg-green-500" : "bg-red-500"}`}></span>
                <span className={isSet ? "text-green-400" : "text-red-400"}>{key}</span>
              </div>
            ))}
          </div>

          {missingVars > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <p className="text-yellow-400 font-medium">Missing {missingVars} environment variables!</p>
              <p className="mt-1 text-gray-300">These need to be set in your deployment environment.</p>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => document.body.removeChild(document.body.lastChild as Node)}
        className="absolute top-1 right-1 text-xs text-gray-400 hover:text-white"
      >
        ×
      </button>
    </div>
  )
}
