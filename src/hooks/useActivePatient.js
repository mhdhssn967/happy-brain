import { useEffect, useState } from "react"
import { db } from "../firebase.config"
import { doc, onSnapshot } from "firebase/firestore"
import { useAuth } from "../context/authContext"

export const useActivePatient = () => {
  const { user } = useAuth()
  const [activePatient, setActivePatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const hospitalId = user?.uid.substring(0, 8) || "default"

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      // Correct path: hospitals/{hospitalId}/activepatients/current
      const activePatientRef = doc(
        db,
        `hospitals/${hospitalId}/activepatients`,
        "current"
      )

      // Subscribe to real-time updates
      const unsubscribe = onSnapshot(
        activePatientRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setActivePatient(snapshot.data())
          } else {
            // Default to guest
            setActivePatient({
              name: "Guest",
              patientId: "0000",
              id: "guest",
              isGuest: true,
            })
          }
          setLoading(false)
        },
        (err) => {
          console.error("Error listening to active patient:", err)
          setError(err.message)
          setLoading(false)
        }
      )

      return () => unsubscribe()
    } catch (err) {
      console.error("Error setting up active patient listener:", err)
      setError(err.message)
      setLoading(false)
    }
  }, [user, hospitalId])

  return { activePatient, loading, error }
}