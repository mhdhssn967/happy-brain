import { useState } from "react"
import { usePatients } from "../hooks/usePatients"

export default function PatientListModal({
  isOpen,
  onClose,
  activePatientId,
  onSelectPatient,
  onSwitchToGuest,
  loading,
}) {
  const { patients, loading: patientsLoading } = usePatients()
  const [hoveredId, setHoveredId] = useState(null)

  if (!isOpen) return null

  const isLoading = loading || patientsLoading

  return (
    <>
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 4px #22c55e; }
          50%       { box-shadow: 0 0 10px #22c55e; }
        }
        .patient-modal-scroll::-webkit-scrollbar { width: 4px; }
        .patient-modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .patient-modal-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
      `}</style>

      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          
        }}
      />

      {/* Modal */}
      <div
        style={{
          // position: "fixed",
          // top: "50%", left: "50%",
          // transform: "translate(-50%, -50%)",
          // zIndex: 9999,
          width: "100%",
          maxWidth: 440,
          maxHeight: "82vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 20,
          background: "linear-gradient(160deg, #0d1220 0%, #080c14 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,229,255,0.06) inset",
          animation: "modalFadeIn 0.25s cubic-bezier(.4,0,.2,1)",
          overflow: "hidden",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "22px 22px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          background: "rgba(0,229,255,0.025)",
        }}>
          <div>
            <div style={{
              fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.2em",
              color: "#334155", textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: 6,
              marginBottom: 6,
            }}>
              <span style={{ width: 14, height: 1, background: "#334155", display: "inline-block" }} />
              Patient Selection
            </div>
            <h2 style={{
              fontSize: "1.15rem", fontWeight: 800,
              color: "#f1f5f9", letterSpacing: "-0.03em", margin: 0,
            }}>
              Select Patient
            </h2>
          </div>

          <button
            onClick={onClose}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(0,229,255,0.1)"
              e.currentTarget.style.borderColor = "rgba(0,229,255,0.25)"
              e.currentTarget.style.color = "#00e5ff"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)"
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
              e.currentTarget.style.color = "#475569"
            }}
            style={{
              width: 34, height: 34, borderRadius: 9,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
              color: "#475569",
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s ease",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div
          className="patient-modal-scroll"
          style={{
            flex: 1, overflowY: "auto",
            padding: "16px 18px",
          }}
        >
          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{
                  height: 68, borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  animation: `pulse 1.6s ease-in-out infinite ${i * 0.15}s`,
                }} />
              ))}
            </div>
          ) : patients.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "40px 20px",
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.4rem", margin: "0 auto 14px",
              }}>
                👤
              </div>
              <p style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600, margin: "0 0 6px" }}>
                No patients added yet
              </p>
              <p style={{ color: "#334155", fontSize: "0.75rem", margin: 0, lineHeight: 1.6 }}>
                Add a patient from the home page to get started
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

              {/* Guest Option */}
              <PatientRow
                id="guest"
                isActive={activePatientId === "guest"}
                isHovered={hoveredId === "guest"}
                onHover={setHoveredId}
                onClick={() => { onSwitchToGuest(); onClose() }}
                isGuest
                avatar="👤"
                name="Guest"
                patientId="0000"
              />

              {/* Divider */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10, margin: "4px 0",
              }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
                <span style={{
                  fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.18em",
                  color: "#334155", textTransform: "uppercase",
                }}>
                  Your Patients
                </span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
              </div>

              {/* Patient List */}
              {patients.map((patient) => (
                <PatientRow
                  key={patient.id}
                  id={patient.id}
                  isActive={activePatientId === patient.id}
                  isHovered={hoveredId === patient.id}
                  onHover={setHoveredId}
                  onClick={() => onSelectPatient(patient)}
                  name={patient.name}
                  patientId={patient.patientId}
                  age={patient.age}
                  gender={patient.gender}
                  condition={patient.condition}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 18px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
          background: "rgba(0,0,0,0.2)",
        }}>
          <button
            onClick={onClose}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "rgba(0,229,255,0.2)"
              e.currentTarget.style.background = "rgba(0,229,255,0.04)"
              e.currentTarget.style.color = "#cbd5e1"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
              e.currentTarget.style.background = "rgba(255,255,255,0.03)"
              e.currentTarget.style.color = "#475569"
            }}
            style={{
              width: "100%", padding: "11px",
              borderRadius: 11,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              color: "#475569",
              fontSize: "0.82rem", fontWeight: 700,
              letterSpacing: "0.02em",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}

// ── Row sub-component ─────────────────────────────────────────────────────────
function PatientRow({ id, isActive, isHovered, onHover, onClick, isGuest, avatar, name, patientId, age, gender, condition }) {
  const initials = avatar || name?.charAt(0).toUpperCase() || "?"

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      style={{
        width: "100%", textAlign: "left",
        display: "flex", alignItems: "center", gap: 14,
        padding: "12px 14px",
        borderRadius: 12,
        border: `1px solid ${
          isActive
            ? "rgba(0,229,255,0.3)"
            : isHovered
            ? "rgba(0,229,255,0.15)"
            : isGuest
            ? "rgba(251,191,36,0.12)"
            : "rgba(255,255,255,0.06)"
        }`,
        background: isActive
          ? "rgba(0,229,255,0.07)"
          : isHovered
          ? "rgba(0,229,255,0.04)"
          : isGuest
          ? "rgba(251,191,36,0.03)"
          : "rgba(255,255,255,0.025)",
        cursor: "pointer",
        transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
        transform: isHovered ? "translateY(-1px)" : "none",
        boxShadow: isActive
          ? "0 0 0 1px rgba(0,229,255,0.15) inset"
          : isHovered
          ? "0 6px 20px rgba(0,0,0,0.3)"
          : "none",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Avatar */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 11,
          background: isGuest
            ? "linear-gradient(135deg, #78350f22, #92400e22)"
            : "linear-gradient(135deg, #0e766822, #06405222)",
          border: `1.5px solid ${isGuest ? "rgba(251,191,36,0.22)" : "rgba(0,229,255,0.18)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: isGuest ? "1rem" : "0.95rem",
          fontWeight: 800,
          color: isGuest ? "#fbbf24" : "#00e5ff",
          letterSpacing: "-0.02em",
        }}>
          {initials}
        </div>
        {/* Active dot */}
        {isActive && !isGuest && (
          <div style={{
            position: "absolute", bottom: -1, right: -1,
            width: 10, height: 10, borderRadius: "50%",
            background: "#22c55e",
            border: "2px solid #080c14",
            boxShadow: "0 0 8px #22c55e88",
            animation: "glow 2s ease-in-out infinite",
          }} />
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          marginBottom: 3,
        }}>
          <span style={{
            fontSize: "0.88rem", fontWeight: 800,
            color: "#f1f5f9", letterSpacing: "-0.02em",
          }}>
            {name}
          </span>
          {isGuest && (
            <span style={{
              fontSize: "0.52rem", fontWeight: 800, letterSpacing: "0.14em",
              color: "#fbbf24", textTransform: "uppercase",
              padding: "2px 5px", borderRadius: 4,
              border: "1px solid rgba(251,191,36,0.25)",
              background: "rgba(251,191,36,0.08)",
            }}>
              GUEST
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "0.7rem", color: "#475569", fontFamily: "monospace", letterSpacing: "0.04em" }}>
            #{patientId}
          </span>
          {age && (
            <>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#334155", display: "inline-block", flexShrink: 0 }} />
              <span style={{ fontSize: "0.7rem", color: "#475569" }}>{age}y{gender ? `, ${gender}` : ""}</span>
            </>
          )}
          {condition && (
            <>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#334155", display: "inline-block", flexShrink: 0 }} />
              <span style={{
                fontSize: "0.7rem", color: "#475569",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 110,
              }}>
                {condition}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Active check / arrow */}
      {isActive ? (
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: "rgba(34,197,94,0.12)",
          border: "1px solid rgba(34,197,94,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#22c55e", fontSize: "0.8rem", fontWeight: 800,
        }}>
          ✓
        </div>
      ) : (
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          border: `1px solid ${isHovered ? "rgba(0,229,255,0.2)" : "rgba(255,255,255,0.06)"}`,
          background: isHovered ? "rgba(0,229,255,0.08)" : "rgba(255,255,255,0.03)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: isHovered ? "#00e5ff" : "#334155",
          fontSize: "0.78rem",
          transition: "all 0.2s ease",
          transform: isHovered ? "translateX(2px)" : "none",
        }}>
          ›
        </div>
      )}
    </button>
  )
}