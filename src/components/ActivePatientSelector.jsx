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
  const [hovered, setHovered] = useState(false)

  const hospitalId = user?.uid.substring(0, 8) || "default"

  useEffect(() => {
    const fetchActivePatient = async () => {
      try {
        setLoading(true)
        const activePatientRef = doc(db, `hospitals/${hospitalId}/activepatients`, "current")
        const activePatientSnap = await getDoc(activePatientRef)
        if (activePatientSnap.exists()) {
          setActivePatient(activePatientSnap.data())
        } else {
          const guestPatient = { name: "Guest", patientId: "0000", id: "guest", isGuest: true }
          await setDoc(activePatientRef, guestPatient)
          setActivePatient(guestPatient)
        }
      } catch (err) {
        console.error("Error fetching active patient:", err)
        setError("Failed to load patient")
        setActivePatient({ name: "Guest", patientId: "0000", id: "guest", isGuest: true })
      } finally {
        setLoading(false)
      }
    }
    if (user) fetchActivePatient()
  }, [user, hospitalId])

  const handlePatientSelect = async (selectedPatient) => {
    try {
      setLoading(true)
      const activePatientRef = doc(db, `hospitals/${hospitalId}/activepatients`, "current")
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
      const activePatientRef = doc(db, `hospitals/${hospitalId}/activepatients`, "current")
      const guestPatient = {
        name: "Guest", patientId: "0000", id: "guest", isGuest: true,
        lastChanged: new Date().toISOString(), changedBy: user?.email,
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

  const initials = activePatient?.name?.charAt(0).toUpperCase() || "?"
  const isGuest = activePatient?.isGuest

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div style={{
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.025)",
        padding: "16px 18px",
        marginBottom: 32,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "rgba(255,255,255,0.06)",
            animation: "pulse 1.6s ease-in-out infinite",
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: 12, width: "40%", borderRadius: 6, background: "rgba(255,255,255,0.06)", marginBottom: 8, animation: "pulse 1.6s ease-in-out infinite" }} />
            <div style={{ height: 9, width: "25%", borderRadius: 6, background: "rgba(255,255,255,0.04)", animation: "pulse 1.6s ease-in-out infinite 0.2s" }} />
          </div>
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:1} }`}</style>
      </div>
    )
  }

  return (
    <>
      <div style={{ marginBottom: 32 }}>
        {/* Label row */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 10
        }}>
          <div style={{
            fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em",
            color: "#334155", textTransform: "uppercase",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ width: 14, height: 1, background: "#334155", display: "inline-block" }} />
            Active Patient
          </div>
          {!isGuest && (
            <div style={{
              fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.15em",
              color: "#22c55e", textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: 4,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%", background: "#22c55e",
                boxShadow: "0 0 6px #22c55e",
                animation: "glow 2s ease-in-out infinite",
                display: "inline-block",
              }} />
              Session Active
            </div>
          )}
        </div>

        {/* Main card */}
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width: "100%", textAlign: "left", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 16, padding: "14px 18px",
            borderRadius: 14,
            border: `1px solid ${hovered ? "rgba(0,229,255,0.2)" : isGuest ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.07)"}`,
            background: hovered
              ? "rgba(0,229,255,0.04)"
              : isGuest
              ? "rgba(251,191,36,0.04)"
              : "rgba(255,255,255,0.03)",
            transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
            transform: hovered ? "translateY(-1px)" : "none",
            boxShadow: hovered ? "0 8px 32px rgba(0,229,255,0.06)" : "none",
          }}
        >
          {/* Avatar */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 13,
              background: isGuest
                ? "linear-gradient(135deg, #78350f22, #92400e22)"
                : "linear-gradient(135deg, #0e766822, #06405222)",
              border: `1.5px solid ${isGuest ? "rgba(251,191,36,0.2)" : "rgba(0,229,255,0.18)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.1rem", fontWeight: 800,
              color: isGuest ? "#fbbf24" : "#00e5ff",
              letterSpacing: "-0.02em",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {initials}
            </div>
            {/* Online dot */}
            {!isGuest && (
              <div style={{
                position: "absolute", bottom: -1, right: -1,
                width: 10, height: 10, borderRadius: "50%",
                background: "#22c55e",
                border: "2px solid #080c14",
                boxShadow: "0 0 8px #22c55e88",
              }} />
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: "0.95rem", fontWeight: 800, color: "#f1f5f9",
              letterSpacing: "-0.02em", marginBottom: 3,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              {activePatient?.name || "Unknown"}
              {isGuest && (
                <span style={{
                  fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.15em",
                  color: "#fbbf24", textTransform: "uppercase",
                  padding: "2px 6px", borderRadius: 4,
                  border: "1px solid rgba(251,191,36,0.25)",
                  background: "rgba(251,191,36,0.08)",
                }}>
                  GUEST
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "0.72rem", color: "#475569", fontFamily: "monospace", letterSpacing: "0.04em" }}>
                #{activePatient?.patientId || "0000"}
              </span>
              {activePatient?.age && (
                <>
                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#334155", display: "inline-block" }} />
                  <span style={{ fontSize: "0.72rem", color: "#475569" }}>{activePatient.age}y</span>
                </>
              )}
              {activePatient?.condition && (
                <>
                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#334155", display: "inline-block" }} />
                  <span style={{ fontSize: "0.72rem", color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 120 }}>
                    {activePatient.condition}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Arrow */}
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            border: `1px solid ${hovered ? "rgba(0,229,255,0.2)" : "rgba(255,255,255,0.06)"}`,
            background: hovered ? "rgba(0,229,255,0.08)" : "rgba(255,255,255,0.03)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s ease",
            color: hovered ? "#00e5ff" : "#475569",
            fontSize: "0.75rem",
            transform: hovered ? "translateX(2px)" : "none",
          }}>
            ›
          </div>
        </button>

        {/* Guest warning */}
        {isGuest && (
          <div style={{
            marginTop: 8, padding: "9px 14px", borderRadius: 9,
            background: "rgba(251,191,36,0.05)",
            border: "1px solid rgba(251,191,36,0.12)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: "0.72rem" }}>⚠</span>
            <span style={{ fontSize: "0.72rem", color: "#92400e", lineHeight: 1.5 }}>
              Guest mode — progress won't be saved. Select a patient to begin tracking.
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            marginTop: 8, padding: "9px 14px", borderRadius: 9,
            background: "rgba(239,68,68,0.05)",
            border: "1px solid rgba(239,68,68,0.15)",
            fontSize: "0.72rem", color: "#fca5a5",
          }}>
            {error}
          </div>
        )}
      </div>

      <PatientListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activePatientId={activePatient?.id}
        onSelectPatient={handlePatientSelect}
        onSwitchToGuest={handleSwitchToGuest}
        loading={loading}
      />

      <style>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 4px #22c55e; }
          50%       { box-shadow: 0 0 10px #22c55e; }
        }
      `}</style>
    </>
  )
}