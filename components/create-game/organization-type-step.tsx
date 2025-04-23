"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Building2, Users } from "lucide-react"
import type { OrganizationType } from "./create-game-form"

interface OrganizationTypeStepProps {
  onSelect: (type: OrganizationType) => void
}

export function OrganizationTypeStep({ onSelect }: OrganizationTypeStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Select Organization Type</h2>
      <p className="text-gray-400">
        Choose whether you're raising funds for a registered nonprofit or a local organization.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className="bg-gray-800 border-gray-700 hover:border-yellow-500 cursor-pointer transition-all"
          onClick={() => onSelect("nonprofit")}
        >
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Building2 className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Federally Registered Nonprofit</h3>
            <p className="text-gray-400 text-sm">
              501(c)(3) organizations with tax-deductible donations. We'll handle tax receipts automatically.
            </p>
          </CardContent>
        </Card>

        <Card
          className="bg-gray-800 border-gray-700 hover:border-yellow-500 cursor-pointer transition-all"
          onClick={() => onSelect("local")}
        >
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Users className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Local Organization</h3>
            <p className="text-gray-400 text-sm">
              Sports teams, schools, churches, and other community groups. You'll need to set up payment processing.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
