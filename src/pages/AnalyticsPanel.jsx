import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"
import { fetchPatientSessions, calculateAggregateStats } from "../utils/firestoreUtils"
import { usePatients } from "../hooks/usePatients"

// ── Constants ───────────────────────────────────────────────────────────────
const GAME_META = {
  "memory-tiles":    { name: "Memory Tiles",    icon: "◈", color: "#2563eb" },
  "math-game":       { name: "Math Challenge",   icon: "∑", color: "#7c3aed" },
  "sequence-recall": { name: "Sequence Recall",  icon: "◎", color: "#059669" },
  "atm-pin-recall":  { name: "PIN Recall",       icon: "⊞", color: "#d97706" },
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function scoreColor(s) {
  if (s >= 85) return "#059669"
  if (s >= 70) return "#2563eb"
  if (s >= 55) return "#d97706"
  return "#dc2626"
}
function scoreBg(s) {
  if (s >= 85) return "#ecfdf5"
  if (s >= 70) return "#eff6ff"
  if (s >= 55) return "#fffbeb"
  return "#fef2f2"
}
function scoreLabel(s) {
  if (s >= 85) return "Excellent"
  if (s >= 70) return "Good"
  if (s >= 55) return "Fair"
  return "Needs Attention"
}
function avg(arr) {
  return arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0
}
function fmtDate(d) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}
function fmtTime(d) {
  if (!d) return "—"
  return new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
}

// ── Responsive Hook ──────────────────────────────────────────────────────────
function useBreakpoint() {
  const getBreakpoint = () => {
    const w = window.innerWidth
    if (w < 480) return "xs"
    if (w < 768) return "sm"
    if (w < 1024) return "md"
    return "lg"
  }
  const [bp, setBp] = useState(getBreakpoint)
  useEffect(() => {
    const handler = () => setBp(getBreakpoint())
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])
  return bp
}

// ── Trend Line ───────────────────────────────────────────────────────────────
function TrendLine({ sessions }) {
  const data = [...sessions].reverse().slice(0, 14)
  if (data.length < 2) return (
    <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontSize: 12, color: "#94a3b8" }}>Not enough data for trend</span>
    </div>
  )
  const W = 400, H = 80, pad = 10
  const vals = data.map(s => s.cognitiveScore)
  const mn = Math.min(...vals), mx = Math.max(...vals)
  const range = mx - mn || 1
  const pts = data.map((s, i) => [
    pad + (i / (data.length - 1)) * (W - pad * 2),
    H - pad - ((s.cognitiveScore - mn) / range) * (H - pad * 2),
  ])
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ")
  const area = path + ` L${pts[pts.length - 1][0]},${H} L${pts[0][0]},${H} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H, display: "block" }}>
      <defs>
        <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#tg)" />
      <path d={path} fill="none" stroke="#2563eb" strokeWidth={2} strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={3.5} fill={scoreColor(vals[i])} stroke="#fff" strokeWidth={1.5} />
      ))}
    </svg>
  )
}

// ── Gauge ────────────────────────────────────────────────────────────────────
function Gauge({ value, size = 110 }) {
  const r = (size - 18) / 2
  const circ = 2 * Math.PI * r
  const arc = circ * 0.75
  const dash = (value / 100) * arc
  const color = scoreColor(value)
  return (
    <svg width={size} height={size * 0.82} viewBox={`0 0 ${size} ${size * 0.82}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={10}
        strokeDasharray={`${arc} ${circ}`} strokeLinecap="round"
        transform={`rotate(135 ${size/2} ${size/2})`} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={10}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(135 ${size/2} ${size/2})`}
        style={{ transition: "stroke-dasharray 1s ease" }} />
      <text x={size/2} y={size/2-2} textAnchor="middle" fill={color}
        fontSize={size*0.2} fontWeight="700" fontFamily="'DM Mono',monospace">{value}</text>
      <text x={size/2} y={size/2+size*0.14} textAnchor="middle" fill="#94a3b8"
        fontSize={size*0.09} fontFamily="'DM Sans',sans-serif">/ 100</text>
    </svg>
  )
}

// ── Factor Bar ───────────────────────────────────────────────────────────────
function FactorBar({ label, value, max, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: "#64748b" }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: "'DM Mono',monospace" }}>{value}/{max}</span>
      </div>
      <div style={{ height: 5, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${(value / max) * 100}%`,
          background: color, borderRadius: 4, transition: "width 0.8s ease",
        }} />
      </div>
    </div>
  )
}

// ── Donut ────────────────────────────────────────────────────────────────────
function Donut({ correct, wrong }) {
  const total = correct + wrong || 1
  const r = 26, circ = 2 * Math.PI * r
  const cDash = (correct / total) * circ
  return (
    <svg width={68} height={68} viewBox="0 0 68 68">
      <circle cx={34} cy={34} r={r} fill="none" stroke="#fee2e2" strokeWidth={9} />
      <circle cx={34} cy={34} r={r} fill="none" stroke="#059669" strokeWidth={9}
        strokeDasharray={`${cDash} ${circ}`} transform="rotate(-90 34 34)" />
      <text x={34} y={38} textAnchor="middle" fill="#1e293b" fontSize={11}
        fontWeight="700" fontFamily="'DM Mono',monospace">
        {Math.round((correct / total) * 100)}%
      </text>
    </svg>
  )
}

// ── Spark Bars ───────────────────────────────────────────────────────────────
function SparkBars({ sessions, gameId }) {
  const filtered = sessions.filter(s => s.gameId === gameId).slice(0, 8).reverse()
  if (!filtered.length) return null
  const maxVal = Math.max(...filtered.map(s => s.cognitiveScore))
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 32 }}>
      {filtered.map((s, i) => (
        <div key={i} title={`${s.cognitiveScore}`} style={{
          width: 8, height: `${(s.cognitiveScore / maxVal) * 100}%`,
          background: scoreColor(s.cognitiveScore), borderRadius: 2, opacity: 0.7,
        }} />
      ))}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PATIENT LIST
// ══════════════════════════════════════════════════════════════════════════════
function PatientList({ patients, loading, onSelect }) {
  const [search, setSearch] = useState("")
  const bp = useBreakpoint()
  const isMobile = bp === "xs" || bp === "sm"

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.patientId?.toLowerCase().includes(search.toLowerCase()) ||
    p.condition?.toLowerCase().includes(search.toLowerCase()) ||
    p.ward?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: isMobile ? "20px 16px" : "32px 40px", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: "#0f172a", margin: 0, marginBottom: 4 }}>
          Patient Registry
        </h2>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
          {loading ? "Loading…" : `${patients.length} patient${patients.length !== 1 ? "s" : ""} enrolled`}
        </p>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20 }}>
        <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "#94a3b8" }}>
          🔍
        </span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, ID, condition or ward…"
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "10px 14px 10px 40px",
            background: "#fff", border: "1px solid #e2e8f0",
            borderRadius: 10, color: "#1e293b", fontSize: 14,
            outline: "none", fontFamily: "'DM Sans',sans-serif",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        />
      </div>

      {/* Column headers — hidden on mobile */}
      {!isMobile && (
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 60px",
          padding: "0 16px 8px", gap: 12,
        }}>
          {["Patient", "Condition", "Ward", "Consultant", "Age"].map(h => (
            <span key={h} style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.06em" }}>
              {h.toUpperCase()}
            </span>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 48, color: "#94a3b8", fontSize: 14 }}>
          Loading patients…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 48, color: "#94a3b8", fontSize: 14 }}>
          {search ? "No patients match your search." : "No patients found."}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {filtered.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              style={{
                display: isMobile ? "flex" : "grid",
                ...(isMobile
                  ? { flexDirection: "column", gap: 8 }
                  : { gridTemplateColumns: "2fr 2fr 1fr 1fr 60px", gap: 12, alignItems: "center" }
                ),
                padding: isMobile ? "14px 16px" : "14px 16px",
                textAlign: "left",
                background: "#fff", border: "1px solid #e2e8f0",
                borderRadius: 10, cursor: "pointer",
                transition: "all 0.15s", fontFamily: "'DM Sans',sans-serif",
                animation: `fadeUp 0.25s ease both`,
                animationDelay: `${idx * 30}ms`,
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                width: "100%",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#2563eb"
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(37,99,235,0.1)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#e2e8f0"
                e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)"
              }}
            >
              {isMobile ? (
                <>
                  {/* Mobile card layout */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 14, marginBottom: 1 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Mono',monospace" }}>{p.patientId}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {p.ward && (
                        <div style={{
                          fontSize: 11, color: "#2563eb", background: "#eff6ff",
                          padding: "3px 8px", borderRadius: 5,
                          whiteSpace: "nowrap", fontWeight: 600,
                        }}>{p.ward}</div>
                      )}
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#334155", fontFamily: "'DM Mono',monospace" }}>
                        {p.age ? `${p.age}y` : "—"}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {p.condition && <div style={{ fontSize: 12, color: "#475569" }}>{p.condition}</div>}
                    {p.consultant && <div style={{ fontSize: 12, color: "#64748b" }}>· {p.consultant}</div>}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 14, marginBottom: 1 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Mono',monospace" }}>{p.patientId}</div>
                  </div>
                  <div style={{ fontSize: 13, color: "#475569" }}>{p.condition || "—"}</div>
                  <div style={{
                    fontSize: 11, color: "#2563eb", background: "#eff6ff",
                    padding: "3px 8px", borderRadius: 5, display: "inline-block",
                    whiteSpace: "nowrap", fontWeight: 600,
                  }}>{p.ward || "—"}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{p.consultant || "—"}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#334155", fontFamily: "'DM Mono',monospace" }}>
                    {p.age ? `${p.age}y` : "—"}
                  </div>
                </>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PATIENT DETAIL
// ══════════════════════════════════════════════════════════════════════════════
function PatientDetail({ patient, onBack }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [selectedSession, setSelectedSession] = useState(null)
  const bp = useBreakpoint()
  const isMobile = bp === "xs" || bp === "sm"
  const isTablet = bp === "md"

  useEffect(() => {
    setLoading(true)
    setSessions([])
    setStats(null)
    setSelectedSession(null)
    fetchPatientSessions(patient.id)
      .then(s => {
        setSessions(s)
        setStats(calculateAggregateStats(s))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [patient.id])

  const avgReaction = avg(sessions.map(s => s.analytics?.averageReactionTime || 0))
  const gameBreakdown = stats ? Object.entries(stats.gameBreakdown) : []

  const card = (extra = {}) => ({
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    ...extra,
  })

  const px = isMobile ? "16px" : "40px"

  return (
    <div style={{ padding: isMobile ? "20px 16px" : "32px 40px", maxWidth: 1060, margin: "0 auto" }}>

      {/* Patient info card */}
      <div style={{
        ...card({ padding: isMobile ? "16px" : "20px 24px", marginBottom: 20 }),
        display: "flex", flexWrap: "wrap", gap: isMobile ? 12 : 24, alignItems: "center",
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, flexShrink: 0,
          background: "linear-gradient(135deg,#2563eb,#0ea5e9)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 800, color: "#fff",
        }}>{patient.name?.[0] || "P"}</div>
        <div style={{ flex: 1, minWidth: 140 }}>
          <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>{patient.name}</div>
          <div style={{ fontSize: 13, color: "#64748b" }}>
            {patient.condition || "—"}{patient.consultant ? ` • ${patient.consultant}` : ""}
          </div>
        </div>
        <div style={{
          display: "flex", flexWrap: "wrap",
          gap: isMobile ? 12 : 16,
          width: isMobile ? "100%" : "auto",
          justifyContent: isMobile ? "space-between" : "flex-end",
        }}>
          {[
            { label: "Patient ID", value: patient.patientId },
            { label: "Age",        value: patient.age ? `${patient.age}y` : "—" },
            { label: "Gender",     value: patient.gender || "—" },
            { label: "Ward",       value: patient.ward || "—" },
            { label: "Sessions",   value: loading ? "…" : sessions.length },
          ].map(item => (
            <div key={item.label} style={{ textAlign: "center", minWidth: 60 }}>
              <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.05em", marginBottom: 2 }}>
                {item.label.toUpperCase()}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#334155", fontFamily: "'DM Mono',monospace" }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPIs */}
      {stats && (
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3,1fr)",
          gap: 14, marginBottom: 20,
        }}>
          {[
            { label: "Avg Cognitive Score", value: stats.averageCognitiveScore, suffix: "/100", color: scoreColor(stats.averageCognitiveScore), sub: scoreLabel(stats.averageCognitiveScore) },
            { label: "Avg Accuracy",        value: stats.averageAccuracy,        suffix: "%",    color: "#d97706", sub: "Across all modules" },
            { label: "Avg Reaction Time",   value: avgReaction,                  suffix: "ms",   color: "#0ea5e9", sub: "Response latency" },
          ].map(k => (
            <div key={k.label} style={card({ padding: "20px 24px" })}>
              <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.05em", marginBottom: 10 }}>
                {k.label.toUpperCase()}
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 3, marginBottom: 4 }}>
                <span style={{ fontSize: 34, fontWeight: 800, color: k.color, fontFamily: "'DM Mono',monospace", lineHeight: 1 }}>{k.value}</span>
                <span style={{ fontSize: 13, color: "#94a3b8", paddingBottom: 4 }}>{k.suffix}</span>
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>{k.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* Trend + Gauge */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 280px",
        gap: 14, marginBottom: 20,
      }}>
        <div style={card({ padding: 20 })}>
          <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.05em", marginBottom: 14 }}>
            COGNITIVE SCORE TREND
          </div>
          {loading
            ? <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 13 }}>Loading…</div>
            : <TrendLine sessions={sessions} />
          }
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 10, color: "#cbd5e1" }}>Oldest</span>
            <span style={{ fontSize: 10, color: "#cbd5e1" }}>Most Recent</span>
          </div>
        </div>
        <div style={{ ...card({ padding: 20 }), display: "flex", flexDirection: isMobile ? "row" : "column", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.05em", width: "100%" }}>
            COMPOSITE SCORE
          </div>
          {stats && <Gauge value={stats.averageCognitiveScore} size={isMobile ? 90 : 110} />}
          {stats && (
            <div style={{
              flex: 1,
              background: scoreBg(stats.averageCognitiveScore),
              borderRadius: 8, padding: "10px 14px",
              border: `1px solid ${scoreColor(stats.averageCognitiveScore)}30`,
              minWidth: isMobile ? 120 : "100%",
            }}>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>Clinical Rating</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: scoreColor(stats.averageCognitiveScore) }}>
                {scoreLabel(stats.averageCognitiveScore)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Game module breakdown */}
      {gameBreakdown.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.05em", marginBottom: 12 }}>
            PERFORMANCE BY MODULE
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 12 }}>
            {gameBreakdown.map(([gid, gs]) => {
              const meta = GAME_META[gid] || { name: gs.name, icon: "◉", color: "#64748b" }
              return (
                <div key={gid} style={{ ...card({ padding: 16 }), borderLeft: `3px solid ${meta.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 18, marginBottom: 4 }}>{meta.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{meta.name}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{gs.sessions} session{gs.sessions > 1 ? "s" : ""}</div>
                    </div>
                    <SparkBars sessions={sessions} gameId={gid} />
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 1 }}>COG. SCORE</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: scoreColor(gs.averageCognitiveScore), fontFamily: "'DM Mono',monospace" }}>
                        {gs.averageCognitiveScore}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 1 }}>ACCURACY</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#d97706", fontFamily: "'DM Mono',monospace" }}>
                        {gs.averageAccuracy}%
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Session table / cards */}
      <div style={card({ overflow: "hidden" })}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.05em" }}>SESSION HISTORY</div>
        </div>

        {/* Column headers — desktop only */}
        {!isMobile && (
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 1.2fr 90px 90px 100px 120px",
            padding: "10px 20px", borderBottom: "1px solid #f8fafc", gap: 12, background: "#fafafa",
          }}>
            {["Module", "Date & Time", "Score", "Accuracy", "Cog. Score", "Assessment"].map(h => (
              <span key={h} style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.05em" }}>{h.toUpperCase()}</span>
            ))}
          </div>
        )}

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading sessions…</div>
        ) : sessions.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No sessions recorded yet.</div>
        ) : (
          sessions.map(s => {
            const meta = GAME_META[s.gameId] || { name: s.gameName, icon: "◉", color: "#64748b" }
            const isOpen = selectedSession?.id === s.id

            return (
              <div key={s.id}>
                {/* Mobile session card */}
                {isMobile ? (
                  <div
                    onClick={() => setSelectedSession(isOpen ? null : s)}
                    style={{
                      padding: "14px 16px",
                      borderBottom: "1px solid #f8fafc",
                      cursor: "pointer",
                      background: isOpen ? "#f8faff" : "transparent",
                      transition: "background 0.12s",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{
                          width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                          background: meta.color + "15", border: `1px solid ${meta.color}30`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 13, color: meta.color,
                        }}>{meta.icon}</span>
                        <span style={{ fontSize: 13, color: "#334155", fontWeight: 500 }}>{meta.name}</span>
                      </div>
                      <div style={{
                        fontSize: 11, padding: "3px 8px", borderRadius: 5,
                        background: scoreBg(s.cognitiveScore), color: scoreColor(s.cognitiveScore), fontWeight: 600,
                      }}>{s.cognitiveAssessment}</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#475569" }}>{fmtDate(s.createdAt)} · {fmtTime(s.createdAt)}</div>
                      </div>
                      <div style={{ display: "flex", gap: 16 }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 10, color: "#94a3b8" }}>SCORE</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#334155", fontFamily: "'DM Mono',monospace" }}>{s.score}</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 10, color: "#94a3b8" }}>ACC</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#d97706", fontFamily: "'DM Mono',monospace" }}>{s.accuracy}%</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 10, color: "#94a3b8" }}>COG</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: scoreColor(s.cognitiveScore), fontFamily: "'DM Mono',monospace" }}>{s.cognitiveScore}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Desktop session row */
                  <div
                    onClick={() => setSelectedSession(isOpen ? null : s)}
                    style={{
                      display: "grid", gridTemplateColumns: "2fr 1.2fr 90px 90px 100px 120px",
                      padding: "13px 20px", borderBottom: "1px solid #f8fafc",
                      gap: 12, cursor: "pointer", alignItems: "center",
                      background: isOpen ? "#f8faff" : "transparent",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = "#fafafa" }}
                    onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = "transparent" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{
                        width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                        background: meta.color + "15", border: `1px solid ${meta.color}30`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, color: meta.color,
                      }}>{meta.icon}</span>
                      <span style={{ fontSize: 13, color: "#334155", fontWeight: 500 }}>{meta.name}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: "#475569" }}>{fmtDate(s.createdAt)}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Mono',monospace" }}>{fmtTime(s.createdAt)}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#334155", fontFamily: "'DM Mono',monospace" }}>{s.score}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#d97706", fontFamily: "'DM Mono',monospace" }}>{s.accuracy}%</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: scoreColor(s.cognitiveScore), fontFamily: "'DM Mono',monospace" }}>
                      {s.cognitiveScore}
                    </div>
                    <div style={{
                      fontSize: 11, padding: "3px 8px", borderRadius: 5, display: "inline-block",
                      background: scoreBg(s.cognitiveScore), color: scoreColor(s.cognitiveScore), fontWeight: 600,
                    }}>{s.cognitiveAssessment}</div>
                  </div>
                )}

                {/* Expanded session detail — shared for all sizes */}
                {isOpen && (
                  <div style={{
                    background: "#f8faff", borderBottom: "1px solid #e2e8f0",
                    padding: isMobile ? "16px" : "20px 24px",
                    animation: "fadeUp 0.2s ease",
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 16 }}>
                      {meta.icon} {meta.name} — Session Detail
                    </div>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(190px,1fr))",
                      gap: 16,
                    }}>
                      <div>
                        <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.05em", marginBottom: 10 }}>ROUND ACCURACY</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <Donut correct={s.analytics?.correctRounds || 0} wrong={s.analytics?.wrongRounds || 0} />
                          <div>
                            <div style={{ fontSize: 12, color: "#059669", marginBottom: 4 }}>✓ {s.analytics?.correctRounds || 0} correct</div>
                            <div style={{ fontSize: 12, color: "#dc2626", marginBottom: 4 }}>✗ {s.analytics?.wrongRounds || 0} wrong</div>
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>of {s.analytics?.totalRounds || 0} rounds</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.05em", marginBottom: 10 }}>COGNITIVE FACTORS</div>
                        <FactorBar label="Accuracy & Precision" value={s.factors?.accuracy?.score || 0}     max={30} color="#2563eb" />
                        <FactorBar label="Processing Speed"     value={s.factors?.speed?.score || 0}        max={30} color="#7c3aed" />
                        <FactorBar label="Consistency"          value={s.factors?.consistency?.score || 0}  max={20} color="#059669" />
                        <FactorBar label="Endurance"            value={s.factors?.endurance?.score || 0}    max={20} color="#d97706" />
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.05em", marginBottom: 10 }}>SESSION METRICS</div>
                        {[
                          { label: "Final Score",     value: s.score,                                        color: "#334155" },
                          { label: "Accuracy",        value: `${s.accuracy}%`,                               color: "#d97706" },
                          { label: "Avg Reaction",    value: `${s.analytics?.averageReactionTime || 0}ms`,   color: "#0ea5e9" },
                          { label: "Cognitive Score", value: `${s.cognitiveScore}/100`,                      color: scoreColor(s.cognitiveScore) },
                          { label: "Duration",        value: s.sessionDuration ? `${s.sessionDuration}s` : "—", color: "#64748b" },
                        ].map(m => (
                          <div key={m.label} style={{
                            display: "flex", justifyContent: "space-between",
                            padding: "7px 0", borderBottom: "1px solid #f1f5f9",
                          }}>
                            <span style={{ fontSize: 12, color: "#94a3b8" }}>{m.label}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: m.color, fontFamily: "'DM Mono',monospace" }}>{m.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function AnalyticsDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { patients, loading } = usePatients()
  const [selectedPatient, setSelectedPatient] = useState(null)
  const bp = useBreakpoint()
  const isMobile = bp === "xs" || bp === "sm"

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans',sans-serif" }}>
      {/* Header */}
      <header style={{
        background: "#fff", borderBottom: "1px solid #e2e8f0",
        padding: isMobile ? "0 16px" : "0 40px",
        height: 60, display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <button onClick={() => navigate("/")} style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 7,
              background: "linear-gradient(135deg,#2563eb,#0ea5e9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 900, color: "#fff",
            }}>N</div>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>NeuroTrack</span>
          </button>
          <span style={{ fontSize: 12, color: "#cbd5e1", flexShrink: 0 }}>•</span>
          <span style={{ fontSize: 13, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {selectedPatient
              ? <><span onClick={() => setSelectedPatient(null)} style={{ cursor: "pointer", color: "#94a3b8" }}>Analytics</span>{!isMobile && <> / {selectedPatient.name}</>}</>
              : "Analytics"
            }
          </span>
        </div>
        {!isMobile && (
          <span style={{ fontSize: 12, color: "#94a3b8", flexShrink: 0, marginLeft: 12 }}>{user?.email}</span>
        )}
      </header>

      {selectedPatient
        ? <PatientDetail patient={selectedPatient} onBack={() => setSelectedPatient(null)} />
        : <PatientList patients={patients} loading={loading} onSelect={setSelectedPatient} />
      }

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
        * { -webkit-font-smoothing: antialiased; box-sizing: border-box; }
        input:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.08) !important; }
        @media (max-width: 479px) {
          * { -webkit-tap-highlight-color: transparent; }
        }
      `}</style>
    </div>
  )
}