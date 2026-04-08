import GameCard from "./components/GameCard"
import AddPatientModal from "./components/AddPatientModal"
import { useEffect, useState } from "react"
import { useAuth } from "../../context/authContext"
import ActivePatientSelector from "../../components/ActivePatientSelector"
import { useNavigate } from "react-router-dom"

const GAMES = [
  { title: "Memory Tiles",    description: "Visual memory & recall",  gameId: "memory-tiles",    icon: "◈", accent: "#00e5ff", tag: "MEMORY"   },
  { title: "Quick Math",      description: "Speed arithmetic",        gameId: "math-game",       icon: "∑", accent: "#ff6b6b", tag: "FOCUS"    },
  { title: "Sequence Recall", description: "Pattern & order memory",  gameId: "sequence-recall", icon: "◎", accent: "#a78bfa", tag: "SEQUENCE" },
  { title: "ATM Pin Recall",  description: "Numeric memory training", gameId: "atm-pin-recall",  icon: "⬡", accent: "#34d399", tag: "RECALL"   },
   { title: "Color Tap",      description: "Color Maps",              gameId: "color-tap-game",  icon: "⬡", accent: "#ae33344", tag: "COLORS"   },
]

const PARTICLES = Array.from({ length: 14 }).map((_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2,
  duration: 8 + Math.random() * 16,
  delay: Math.random() * 10,
  opacity: 0.06 + Math.random() * 0.14,
}))

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [patients, setPatients] = useState([])
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { setTimeout(() => setMounted(true), 60) }, [])

  const handlePatientAdded = (newPatient) => {
    setPatients((prev) => [...prev, newPatient])
  }

  const doctorName = user?.email?.split("@")[0] ?? "Doctor"

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080c14",
      color: "#e8eaf0",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      position: "relative",
      overflowX: "hidden",
    }}>

      {/* ── Ambient background ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 60% at 20% 10%, #0d1f3c 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, #0a1628 0%, transparent 60%), #080c14",
        }} />
        <div style={{
          position: "absolute", top: "8%", left: "60%",
          width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle, #00e5ff08 0%, transparent 70%)",
          filter: "blur(40px)",
        }} />
        <div style={{
          position: "absolute", bottom: "15%", left: "5%",
          width: 240, height: 240, borderRadius: "50%",
          background: "radial-gradient(circle, #a78bfa0a 0%, transparent 70%)",
          filter: "blur(40px)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        {PARTICLES.map(p => (
          <div key={p.id} style={{
            position: "absolute",
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            borderRadius: "50%", background: "#00e5ff",
            opacity: p.opacity,
            animation: `floatPt ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }} />
        ))}
      </div>

      {/* ══════════════════════════════
          NAVBAR — logo left, doctor right
      ══════════════════════════════ */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(8,12,20,0.92)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}>
        <div style={{
          maxWidth: 640, margin: "0 auto", padding: "0 16px",
          height: 54, display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: "linear-gradient(135deg, #00e5ff22, #a78bfa22)",
              border: "1px solid rgba(0,229,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15,
            }}>⬡</div>
            <div>
              <div style={{ fontSize: "0.9rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1 }}>
                Happy Brain
              </div>
              <div style={{ fontSize: "0.52rem", letterSpacing: "0.16em", color: "#00e5ff66", textTransform: "uppercase",marginTop:'5px' }}>
                Cognitive Suite
              </div>
            </div>
          </div>

          {/* Doctor pill */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#e2e8f0", lineHeight: 1 }}>
                {doctorName}
              </div>
              <div style={{ fontSize: "0.52rem", color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Doctor
              </div>
            </div>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "linear-gradient(135deg, #00e5ff22, #a78bfa33)",
              border: "1px solid rgba(0,229,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.8rem", fontWeight: 800, color: "#00e5ff",
            }}>
              {doctorName[0].toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════
          ACTION BAR — directly below navbar
      ══════════════════════════════ */}
      <div style={{
        position: "sticky", top: 54, zIndex: 40,
        background: "rgba(8,12,20,0.88)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}>
        <div style={{
          maxWidth: 640, margin: "0 auto",
          padding: "10px 16px",
          display: "flex", gap: 8,
        }}>
          <ActionBtn icon="▦"  label="Analytics"   onClick={() => navigate("/dashboard")}  accent="#94a3b8" />
          <ActionBtn icon="◉"  label="Patients"     onClick={() => {}}                      accent="#a78bfa" />
          <ActionBtn icon="+"  label="Add Patient"  onClick={() => setIsModalOpen(true)}    accent="#00e5ff" highlight />
        </div>
      </div>

      {/* ── Main ── */}
      <main style={{
        maxWidth: 640, margin: "0 auto",
        padding: "24px 16px 96px",
        position: "relative", zIndex: 10,
      }}>

        {/* Active Patient Selector */}
        <div style={{
          marginBottom: 28,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.45s cubic-bezier(.4,0,.2,1)",
        }}>
          <ActivePatientSelector />
        </div>

        {/* Section heading */}
        <div style={{
          marginBottom: 18,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(14px)",
          transition: "all 0.5s cubic-bezier(.4,0,.2,1) 0.07s",
        }}>
          <div style={{
            fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em",
            color: "#00e5ff66", textTransform: "uppercase", marginBottom: 6,
          }}>
            — Select a module
          </div>
          <h2 style={{
            fontSize: "clamp(1.45rem, 5.5vw, 1.9rem)",
            fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.2,
            margin: 0, color: "#fff",
          }}>
            Choose Your{" "}
            <span style={{
              background: "linear-gradient(90deg, #00e5ff, #a78bfa)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Training Game
            </span>
          </h2>
        </div>

        {/* Games grid — 2 col mobile */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.55s cubic-bezier(.4,0,.2,1) 0.14s",
        }}>
          {GAMES.map((game) => (
            <GameCard
              key={game.gameId}
              title={game.title}
              description={game.description}
              gameId={game.gameId}
            />
          ))}
        </div>

        {/* Patients list */}
        {patients.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <div style={{
              fontSize: "0.62rem", letterSpacing: "0.18em", color: "#475569",
              textTransform: "uppercase", fontWeight: 700, marginBottom: 12,
            }}>
              Recently Added
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {patients.map((patient) => (
                <div key={patient.id} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 12, padding: "12px 14px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#e2e8f0" }}>{patient.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "#475569", marginTop: 2 }}>
                      ID {patient.patientId} · Age {patient.age}
                    </div>
                  </div>
                  <div style={{
                    fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em",
                    color: "#a78bfa88", textTransform: "uppercase",
                    background: "rgba(167,139,250,0.08)",
                    border: "1px solid rgba(167,139,250,0.15)",
                    borderRadius: 6, padding: "3px 7px",
                  }}>
                    {patient.condition}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <AddPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPatientAdded={handlePatientAdded}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes floatPt {
          from { transform: translateY(0px) translateX(0px); }
          to   { transform: translateY(-40px) translateX(16px); }
        }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}</style>
    </div>
  )
}

/* ── Action Button ── */
function ActionBtn({ icon, label, onClick, accent, highlight }) {
  const [pressed, setPressed] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setPressed(true)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => { setPressed(false); onClick?.() }}
      style={{
        flex: highlight ? "1.3" : "1",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
        padding: "9px 8px", borderRadius: 10,
        border: `1px solid ${pressed ? accent + "55" : highlight ? accent + "30" : "rgba(255,255,255,0.07)"}`,
        background: pressed
          ? `${accent}1a`
          : highlight ? `${accent}0d` : "rgba(255,255,255,0.03)",
        color: pressed ? accent : highlight ? accent + "cc" : "#64748b",
        fontSize: "0.73rem", fontWeight: 700,
        cursor: "pointer", letterSpacing: "0.01em",
        transition: "all 0.16s ease",
        whiteSpace: "nowrap",
        boxShadow: pressed && highlight ? `0 0 18px ${accent}20` : "none",
        transform: pressed ? "scale(0.97)" : "scale(1)",
      }}
    >
      <span style={{ fontSize: "0.78rem" }}>{icon}</span>
      {label}
    </button>
  )
}