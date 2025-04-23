"use client"

import { useState, useEffect } from "react"
import { collection, query, getDocs, type DocumentData, type QueryConstraint } from "firebase/firestore"
import { useFirebase } from "@/contexts/firebase-context"

interface UseFirestoreDataOptions {
  collectionName: string
  constraints?: QueryConstraint[]
  dependencies?: any[]
}

export function useFirestoreData<T = DocumentData>({
  collectionName,
  constraints = [],
  dependencies = [],
}: UseFirestoreDataOptions) {
  const { db } = useFirebase()
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!db) {
      setError(new Error("Firestore is not initialized"))
      setLoading(false)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      try {
        const collectionRef = collection(db, collectionName)
        const q = query(collectionRef, ...constraints)
        const querySnapshot = await getDocs(q)

        const results: T[] = []
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() } as T)
        })

        setData(results)
        setError(null)
      } catch (err) {
        console.error("Error fetching Firestore data:", err)
        setError(err instanceof Error ? err : new Error("Unknown error fetching data"))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [db, collectionName, ...dependencies])

  return { data, loading, error }
}
