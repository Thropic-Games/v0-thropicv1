"use client"

// Create a dummy auth object that logs warnings when used
const dummyAuth = new Proxy(
  {},
  {
    get: (target, prop) => {
      console.warn(
        `Firebase auth is no longer available. Please use Supabase auth instead. Attempted to access: ${String(prop)}`,
      )
      return () => Promise.reject(new Error("Firebase auth is no longer available. Please use Supabase auth instead."))
    },
  },
)

export const auth = dummyAuth
