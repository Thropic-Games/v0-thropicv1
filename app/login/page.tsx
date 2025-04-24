import { MagicLinkForm } from "@/components/auth/magic-link-form"
import { Logo } from "@/components/ui/logo"

export const metadata = {
  title: "Login | Thropic Games",
  description: "Sign in to Thropic Games - Gaming for Good",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-950 p-8 rounded-xl shadow-lg border border-amber-100 dark:border-amber-900/20">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-48 h-auto mb-4">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold text-[#fb6542] dark:text-[#ffbb00]">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Sign in to continue your journey of Gaming for Good
          </p>
        </div>

        <div className="py-4">
          <MagicLinkForm />
        </div>

        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            New to Thropic Games?{" "}
            <a
              href="/register"
              className="font-medium text-[#fb6542] hover:text-[#e55a3a] dark:text-[#ffbb00] dark:hover:text-amber-400 transition-colors"
            >
              Create an account
            </a>
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Thropic Games. All rights reserved.
        </p>
        <p className="text-xs text-[#fb6542] dark:text-[#ffbb00] mt-1">Gaming for Good</p>
      </div>
    </div>
  )
}
