import { useState, useEffect } from "react"
import { db } from "../firebase.config"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { useAuth } from "../context/authContext"
import PatientListModal from "./PatientListModal"

export default function ActivePatientSelector() {
  const { user } = useAuth()
  const [activePatient, setActivePatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState("")

  const hospitalId = user?.uid.substring(0, 8) || "default"

  // Fetch active patient on component mount
  useEffect(() => {
    const fetchActivePatient = async () => {
      try {
        setLoading(true)
        // Correct path: hospitals/{hospitalId}/activepatients/current
        const activePatientRef = doc(
          db,
          `hospitals/${hospitalId}/activepatients`,
          "current"
        )
        const activePatientSnap = await getDoc(activePatientRef)

        if (activePatientSnap.exists()) {
          setActivePatient(activePatientSnap.data())
        } else {
          // Set default guest patient if doesn't exist
          const guestPatient = {
            name: "Guest",
            patientId: "0000",
            id: "guest",
            isGuest: true,
          }
          await setDoc(activePatientRef, guestPatient)
          setActivePatient(guestPatient)
        }
      } catch (err) {
        console.error("Error fetching active patient:", err)
        setError("Failed to load patient")
        // Set fallback
        setActivePatient({
          name: "Guest",
          patientId: "0000",
          id: "guest",
          isGuest: true,
        })
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchActivePatient()
    }
  }, [user, hospitalId])

  const handlePatientSelect = async (selectedPatient) => {
    try {
      setLoading(true)
      // Correct path: hospitals/{hospitalId}/activepatients/current
      const activePatientRef = doc(
        db,
        `hospitals/${hospitalId}/activepatients`,
        "current"
      )

      const patientData = {
        name: selectedPatient.name,
        patientId: selectedPatient.patientId,
        id: selectedPatient.id,
        age: selectedPatient.age || null,
        gender: selectedPatient.gender || null,
        condition: selectedPatient.condition || null,
        isGuest: false,
        lastChanged: new Date().toISOString(),
        changedBy: user?.email,
      }

      await setDoc(activePatientRef, patientData)
      setActivePatient(patientData)
      setIsModalOpen(false)
      setError("")
    } catch (err) {
      console.error("Error updating active patient:", err)
      setError("Failed to change patient")
    } finally {
      setLoading(false)
    }
  }

  const handleSwitchToGuest = async () => {
    try {
      setLoading(true)
      // Correct path: hospitals/{hospitalId}/activepatients/current
      const activePatientRef = doc(
        db,
        `hospitals/${hospitalId}/activepatients`,
        "current"
      )

      const guestPatient = {
        name: "Guest",
        patientId: "0000",
        id: "guest",
        isGuest: true,
        lastChanged: new Date().toISOString(),
        changedBy: user?.email,
      }

      await setDoc(activePatientRef, guestPatient)
      setActivePatient(guestPatient)
      setError("")
    } catch (err) {
      console.error("Error switching to guest:", err)
      setError("Failed to switch to guest")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-4 animate-pulse">
        <div className="h-16 bg-slate-200 rounded"></div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-3">
          Active Patient
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
          className="w-full text-left group"
        >
          <div className="flex items-center justify-between p-3 bg-white border-2 border-blue-200 hover:border-blue-400 rounded-lg transition-all cursor-pointer hover:shadow-md disabled:opacity-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">
                {activePatient?.name.charAt(0).toUpperCase()}
              </div>

              <div className="text-left">
                <p className="font-bold text-slate-900">
                  {activePatient?.name || "Unknown"}
                </p>
                <p className="text-xs text-slate-600">
                  ID: {activePatient?.patientId || "0000"}
                  {activePatient?.isGuest && (
                    <span className="ml-2 inline-block px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">
                      GUEST
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activePatient?.age && (
                <span className="text-sm text-slate-600 px-3 py-1 bg-slate-100 rounded">
                  {activePatient.age}y
                </span>
              )}
              <svg
                className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </button>

        {activePatient?.isGuest && (
          <p className="text-xs text-amber-700 mt-3 px-3 py-2 bg-amber-50 rounded">
            ⚠️ Currently in guest mode. Select a patient to start tracking their progress.
          </p>
        )}

        {error && (
          <p className="text-xs text-red-700 mt-3 px-3 py-2 bg-red-50 rounded">
            {error}
          </p>
        )}
      </div>

      {/* Patient List Modal */}
      <PatientListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activePatientId={activePatient?.id}
        onSelectPatient={handlePatientSelect}
        onSwitchToGuest={handleSwitchToGuest}
        loading={loading}
      />
    </>
  )
}