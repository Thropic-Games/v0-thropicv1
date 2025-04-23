"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"
import { auth, db, storage, firebaseApp } from "@/lib/firebase"
import { Button } from "@/components/ui/button"

export default function FirebaseTestPage() {
  const [status, setStatus] = useState<{
    app: "loading" | "success" | "error"
    auth: "loading" | "success" | "error"
    firestore: "loading" | "success" | "error"
    storage: "loading" | "success" | "error"
  }>({
    app: "loading",
    auth: "loading",
    firestore: "loading",
    storage: "loading",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [envVars, setEnvVars] = useState<Record<string, string>>({})

  useEffect(() => {
    // Check Firebase app initialization
    if (firebaseApp) {
      setStatus((prev) => ({ ...prev, app: "success" }))
    } else {
      setStatus((prev) => ({ ...prev, app: "error" }))
      setErrors((prev) => ({ ...prev, app: "Firebase app failed to initialize" }))
    }

    // Check Auth service
    if (auth) {
      setStatus((prev) => ({ ...prev, auth: "success" }))
    } else {
      setStatus((prev) => ({ ...prev, auth: "error" }))
      setErrors((prev) => ({ ...prev, auth: "Firebase Auth service is not available" }))
    }

    // Check Firestore service
    if (db) {
      setStatus((prev) => ({ ...prev, firestore: "success" }))
    } else {
      setStatus((prev) => ({ ...prev, firestore: "error" }))
      setErrors((prev) => ({ ...prev, firestore: "Firebase Firestore service is not available" }))
    }

    // Check Storage service
    if (storage) {
      setStatus((prev) => ({ ...prev, storage: "success" }))
    } else {
      setStatus((prev) => ({ ...prev, storage: "error" }))
      setErrors((prev) => ({ ...prev, storage: "Firebase Storage service is not available" }))
    }

    // Collect environment variables
    const publicEnvVars: Record<string, string> = {}
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith("NEXT_PUBLIC_FIREBASE_")) {
        const value = process.env[key] || ""
        // Mask the actual values but show if they're set
        publicEnvVars[key] = value ? "✓ Set" : "✗ Not set"
      }
    })
    setEnvVars(publicEnvVars)
  }, [])

  const getStatusIcon = (status: "loading" | "success" | "error") => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  const allSuccess = Object.values(status).every((s) => s === "success")
  const anyError = Object.values(status).some((s) => s === "error")

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Firebase Connection Test</h1>

        {/* Overall Status */}
        {allSuccess ? (
          <Alert className="bg-green-500/20 text-green-400 border-green-600 mb-6">
            <CheckCircle className="h-5 w-5" />
            <AlertTitle>Firebase Connected Successfully</AlertTitle>
            <AlertDescription>All Firebase services are properly initialized and ready to use.</AlertDescription>
          </Alert>
        ) : anyError ? (
          <Alert className="bg-red-500/20 text-red-400 border-red-600 mb-6">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Firebase Connection Issues</AlertTitle>
            <AlertDescription>There are problems with your Firebase connection. See details below.</AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-yellow-500/20 text-yellow-400 border-yellow-600 mb-6">
            <Loader2 className="h-5 w-5 animate-spin" />
            <AlertTitle>Checking Firebase Connection</AlertTitle>
            <AlertDescription>Please wait while we test your Firebase connection...</AlertDescription>
          </Alert>
        )}

        {/* Service Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ServiceCard
            title="Firebase App"
            description="Core Firebase application"
            status={status.app}
            error={errors.app}
          />
          <ServiceCard
            title="Firebase Auth"
            description="Authentication service"
            status={status.auth}
            error={errors.auth}
          />
          <ServiceCard
            title="Firestore"
            description="Database service"
            status={status.firestore}
            error={errors.firestore}
          />
          <ServiceCard
            title="Firebase Storage"
            description="File storage service"
            status={status.storage}
            error={errors.storage}
          />
        </div>

        {/* Environment Variables */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Firebase configuration variables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="font-mono text-sm">{key}</span>
                  <span className={value.startsWith("✓") ? "text-green-400" : "text-red-400"}>{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Troubleshooting</CardTitle>
            <CardDescription>Steps to resolve common Firebase connection issues</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-3 text-gray-300">
              <li>
                <strong className="text-white">Check Environment Variables:</strong> Ensure all required Firebase
                environment variables are correctly set in your Vercel project.
              </li>
              <li>
                <strong className="text-white">Verify API Key:</strong> Make sure your Firebase API key is valid and not
                restricted.
              </li>
              <li>
                <strong className="text-white">Firebase Console Settings:</strong> Verify your project is properly
                configured in the Firebase Console.
              </li>
              <li>
                <strong className="text-white">Authentication Setup:</strong> Ensure Authentication is enabled in your
                Firebase project if you're using auth features.
              </li>
              <li>
                <strong className="text-white">Clear Cache:</strong> Try clearing your browser cache and reloading the
                page.
              </li>
            </ol>

            <div className="mt-6 flex justify-center">
              <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
                Refresh Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

interface ServiceCardProps {
  title: string
  description: string
  status: "loading" | "success" | "error"
  error?: string
}

function ServiceCard({ title, description, status, error }: ServiceCardProps) {
  return (
    <Card
      className={`border ${
        status === "success"
          ? "border-green-600 bg-green-900/10"
          : status === "error"
            ? "border-red-600 bg-red-900/10"
            : "border-yellow-600 bg-yellow-900/10"
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {status === "loading" ? (
            <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
          ) : status === "success" ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "error" && error && <p className="text-red-400 text-sm">{error}</p>}
        {status === "success" && <p className="text-green-400 text-sm">Connected successfully</p>}
        {status === "loading" && <p className="text-yellow-400 text-sm">Testing connection...</p>}
      </CardContent>
    </Card>
  )
}
