import { AuthStatusExample } from "@/components/auth-status-example"

export default function AuthTestPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Auth Context Test</h1>
      <AuthStatusExample />
    </div>
  )
}
