"use client"

import { createContext, useContext, type ReactNode } from "react"
import {
  type Auth,
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth"
import type { Firestore } from "firebase/firestore"
import type { Storage } from "firebase/storage"
import { useEffect, useState } from "react"
import { auth, db, storage } from "@/lib/firebase"

// Define the context type
interface FirebaseContextType {
  auth: Auth | null
  db: Firestore | null
  storage: Storage | null
  user: User | null
  loading: boolean
  error: Error | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

// Create the context
const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined)

// Create a provider component
export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [initialized, setInitialized] = useState(false)

  // Check if Firebase is initialized
  useEffect(() => {
    const checkFirebaseInit = async () => {
      try {
        // Wait a bit to ensure Firebase has time to initialize
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (!auth || !db || !storage) {
          console.warn("Firebase services are not initialized. Check your environment variables.")
          setError(new Error("Firebase services are not initialized. Check your environment variables."))
        } else {
          console.log("Firebase services are available in context")
        }

        setInitialized(true)
        setLoading(false)
      } catch (err) {
        console.error("Error checking Firebase initialization:", err)
        setError(err instanceof Error ? err : new Error("Unknown error during Firebase initialization"))
        setLoading(false)
      }
    }

    checkFirebaseInit()
  }, [])

  // Listen for auth state changes
  useEffect(() => {
    if (!initialized || !auth) return

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user)
        setLoading(false)
      },
      (error) => {
        console.error("Auth state change error:", error)
        setError(error)
        setLoading(false)
      },
    )

    // Cleanup subscription
    return () => unsubscribe()
  }, [initialized])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase auth is not initialized")

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    }
  }

  // Sign up function
  const signUp = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase auth is not initialized")

    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  // Sign out function
  const signOut = async () => {
    if (!auth) throw new Error("Firebase auth is not initialized")

    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  // Context value
  const value = {
    auth,
    db,
    storage,
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
  }

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
}

// Custom hook to use the Firebase context
export function useFirebase() {
  const context = useContext(FirebaseContext)
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider")
  }
  return context
}
