"use client"

// Initialize empty variables
let auth: any = null
let db: any = null
let storage: any = null
let firebaseApp: any = null

// Check if we're in the browser
if (typeof window !== "undefined") {
  // Check if Firebase environment variables are available
  const firebaseConfigAvailable =
    typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

  if (firebaseConfigAvailable) {
    console.log("Firebase config is available, initializing...")

    // Use dynamic imports for Firebase modules
    const initFirebase = async () => {
      try {
        // Import Firebase modules
        const { initializeApp } = await import("firebase/app")
        const { getAuth } = await import("firebase/auth")
        const { getFirestore } = await import("firebase/firestore")
        const { getStorage } = await import("firebase/storage")

        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
          measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
        }

        // Initialize Firebase
        firebaseApp = initializeApp(firebaseConfig)
        auth = getAuth(firebaseApp)
        db = getFirestore(firebaseApp)
        storage = getStorage(firebaseApp)
        console.log("Firebase initialized successfully")
      } catch (error) {
        console.error("Error initializing Firebase:", error)
      }
    }

    // Call the async function
    initFirebase().catch(console.error)
  } else {
    console.warn("Firebase initialization skipped due to missing environment variables")
  }
} else {
  console.log("Firebase initialization skipped (server-side rendering)")
}

export { auth, db, storage, firebaseApp }
