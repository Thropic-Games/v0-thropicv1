import { AuthStatus } from "@/components/auth-status"
import { LoginForm } from "@/components/login-form"

export default function AuthDemo() {
  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Authentication Demo</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <LoginForm />
        </div>

        <div>
          <AuthStatus />
        </div>
      </div>
    </div>
  )
}
