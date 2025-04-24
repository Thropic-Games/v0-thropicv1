"use client"

import { useState, useEffect } from "react"

export function EnvChecker() {
  const [missingSupabaseVars, setMissingSupabaseVars] = useState<string[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Only check for Supabase variables
    const requiredVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

    const missing = requiredVars.filter((varName) => !process.env[varName])
    setMissingSupabaseVars(missing)
  }, [])

  if (!isClient || missingSupabaseVars.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs z-50">
      <h4 className="font-bold mb-1">Missing Supabase Variables:</h4>
      <ul>
        {missingSupabaseVars.map((varName) => (
          <li key={varName} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>{varName}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
