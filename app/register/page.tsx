import { RegisterFormSimple } from "@/components/auth/register-form-simple"
import { Logo } from "@/components/ui/logo"

export const metadata = {
  title: "Create Account | Thropic Games",
  description: "Join Thropic Games - Gaming for Good",
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-gray-950">
      <div className="w-full max-w-md px-4">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">Join Thropic Games</h1>
        </div>

        <RegisterFormSimple />

        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-24">
              <Logo />
            </div>
          </div>
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">Already have an account? </span>
            <a
              href="/login"
              className="font-medium text-[#fb6542] hover:text-[#e55a3a] dark:text-[#ffbb00] dark:hover:text-amber-400"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4">
        <p className="text-xs text-gray-400 dark:text-gray-600">Gaming for Good</p>
      </div>
    </div>
  )
}
