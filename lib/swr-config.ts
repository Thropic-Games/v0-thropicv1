// Default SWR configuration
export const swrConfig = {
  revalidateOnFocus: false, // Don't revalidate when window focuses
  revalidateIfStale: true, // Revalidate if data is stale
  revalidateOnReconnect: true, // Revalidate when browser regains connection
  errorRetryCount: 3, // Retry failed requests 3 times
  dedupingInterval: 2000, // Deduplicate requests within 2 seconds
  focusThrottleInterval: 5000, // Throttle focus events to 5 seconds
}

// SWR fetcher function
export const fetcher = async (url: string) => {
  const res = await fetch(url)

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.")
    // Attach extra info to the error object.
    const info = await res.json()
    ;(error as any).info = info
    ;(error as any).status = res.status
    throw error
  }

  return res.json()
}
