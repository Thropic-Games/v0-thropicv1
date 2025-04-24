"use client"

import { useState, useEffect } from "react"

export default function CleanupPage() {
  const [firebaseRefs, setFirebaseRefs] = useState<string[]>([])

  useEffect(() => {
    // Check for Firebase-related globals
    const possibleRefs = [
      "firebase",
      "initializeApp",
      "getAuth",
      "signInWithEmailAndPassword",
      "createUserWithEmailAndPassword",
      "signOut",
      "onAuthStateChanged",
      "getFirestore",
      "collection",
      "doc",
      "getDoc",
      "setDoc",
      "updateDoc",
      "deleteDoc",
      "query",
      "where",
      "orderBy",
      "limit",
      "startAfter",
      "endBefore",
      "getStorage",
      "ref",
      "uploadBytes",
      "getDownloadURL",
      "deleteObject",
    ]

    const foundRefs = possibleRefs.filter((ref) => typeof window !== "undefined" && (window as any)[ref] !== undefined)

    setFirebaseRefs(foundRefs)
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Firebase Cleanup Check</h1>

      {firebaseRefs.length > 0 ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p className="font-bold">Found Firebase References</p>
          <p>The following Firebase-related globals were found:</p>
          <ul className="list-disc pl-5">
            {firebaseRefs.map((ref) => (
              <li key={ref}>{ref}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
          <p className="font-bold">No Firebase References Found</p>
          <p>Your application appears to be free of Firebase references.</p>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Next Steps</h2>
        <ul className="list-disc pl-5">
          <li>Make sure all Firebase imports are removed from your code</li>
          <li>Check for any Firebase environment variables in your deployment settings</li>
          <li>Remove any Firebase-related dependencies from package.json</li>
          <li>Clear browser cache and local storage to remove any stored Firebase data</li>
        </ul>
      </div>
    </div>
  )
}
