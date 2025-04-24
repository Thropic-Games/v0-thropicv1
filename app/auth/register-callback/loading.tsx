import { Loader2 } from "lucide-react"

export default function AuthRegisterCallbackLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-gray-950">
      <div className="w-full max-w-md p-8 space-y-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#fb6542] dark:text-[#ffbb00]" />
        <h2 className="text-xl font-medium text-gray-900 dark:text-white">Setting up your account...</h2>
        <p className="text-gray-600 dark:text-gray-400">Please wait while we complete your registration.</p>
      </div>
    </div>
  )
}
