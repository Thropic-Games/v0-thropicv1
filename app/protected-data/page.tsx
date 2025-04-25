import { AuthenticatedDataView } from "@/components/authenticated-data-view"

export default function ProtectedDataPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Protected Data</h1>
      <AuthenticatedDataView
        tableName="my_table_name"
        title="My Protected Data"
        description="This data is only visible to authenticated users"
      />
    </div>
  )
}
