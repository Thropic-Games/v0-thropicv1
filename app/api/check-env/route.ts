import { NextResponse } from "next/server"

export async function GET() {
  // Only check Supabase environment variables
  const envStatus = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: !!process.env.NEXT_PUBLIC_SITE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  }

  const missingVars = Object.entries(envStatus)
    .filter(([_, isSet]) => !isSet)
    .map(([key]) => key)

  return NextResponse.json({
    status: missingVars.length === 0 ? "ok" : "missing",
    envStatus,
    missingVars,
  })
}
