"use client"

import { useSession } from "@/providers/session-provider"

export function AuthStatus() {
  const { authenticated, session, loading } = useSession()

  if (loading) {
    return <div>Loading authentication status...</div>
  }

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Authentication Status</h2>
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="font-medium mr-2">Status:</span>
          {authenticated ? (
            <span className="text-green-600 dark:text-green-400 font-medium">Authenticated</span>
          ) : (
            <span className="text-red-600 dark:text-red-400 font-medium">Not authenticated</span>
          )}
        </div>

        {authenticated && session && (
          <>
            <div>
              <span className="font-medium">User ID:</span> {session.user.id}
            </div>
            <div>
              <span className="font-medium">Email:</span> {session.user.email}
            </div>
            <div>
              <span className="font-medium">Last Sign In:</span>{" "}
              {new Date(session.user.last_sign_in_at || "").toLocaleString()}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
