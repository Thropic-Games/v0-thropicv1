import { getRecentDonations } from "@/actions/donations"
import { CyclingDonations } from "./cycling-donations"

interface ServerDonationsProps {
  limit?: number
  visibleCount?: number
  cycleInterval?: number
  showDebug?: boolean
}

export async function ServerDonations({
  limit = 10,
  visibleCount = 3,
  cycleInterval = 3000,
  showDebug = false,
}: ServerDonationsProps) {
  const { donations, source, error } = await getRecentDonations(limit)

  return (
    <div>
      {showDebug && (
        <div className="text-xs text-gray-400 mb-2">
          <p>Source: {source}</p>
          {error && <p className="text-red-500">Error: {error}</p>}
        </div>
      )}
      <CyclingDonations
        donations={donations}
        visibleCount={visibleCount}
        cycleInterval={cycleInterval}
        showDebug={showDebug}
      />
    </div>
  )
}
