import { useEffect, useState } from "react"
import { db } from "../firebase.config"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { useAuth } from "../context/authContext"

export const usePatients = () => {
  const { user } = useAuth()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      // Get hospital ID from user
      const hospitalId = user.uid.substring(0, 8) || "default"

      // Reference to patients collection
      const patientsRef = collection(db, `hospitals/${hospitalId}/patients`)

      // Query for patients by doctor
      const q = query(patientsRef, where("doctorId", "==", user.uid))

      // Subscribe to real-time updates
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const patientsData = []
          snapshot.forEach((doc) => {
            patientsData.push({
              id: doc.id,
              ...doc.data(),
            })
          })
          setPatients(patientsData)
          setLoading(false)
        },
        (err) => {
          console.error("Error fetching patients:", err)
          setError(err.message)
          setLoading(false)
        }
      )

      return () => unsubscribe()
    } catch (err) {
      console.error("Error setting up patients listener:", err)
      setError(err.message)
      setLoading(false)
    }
  }, [user])

  return { patients, loading, error }
}