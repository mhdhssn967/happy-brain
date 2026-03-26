import { useState } from "react"
import { useNavigate } from "react-router-dom"

const GAME_META = {
  "memory-tiles":   { accent: "#00e5ff", tag: "MEMORY",   symbol: "◈" },
  "math-game":      { accent: "#ff6b6b", tag: "FOCUS",    symbol: "∑" },
  "sequence-recall":{ accent: "#a78bfa", tag: "SEQUENCE", symbol: "◎" },
  "atm-pin-recall": { accent: "#34d399", tag: "RECALL",   symbol: "⬡" },
}

export default function GameCard({ title, description, gameId }) {
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const meta = GAME_META[gameId] || { accent: "#00e5ff", tag: "GAME", symbol: "◈" }

  return (
    <div
      onClick={() => navigate(`/game/${gameId}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        cursor: "pointer",
        borderRadius: 18,
        overflow: "hidden",
        border: `1px solid ${hovered ? meta.accent + "35" : "rgba(255,255,255,0.07)"}`,
        background: "#0d1220",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.22s cubic-bezier(.4,0,.2,1)",
        transform: pressed
          ? "scale(0.97)"
          : hovered
          ? "translateY(-4px) scale(1.01)"
          : "none",
        boxShadow: hovered
          ? `0 20px 48px ${meta.accent}14, 0 4px 16px rgba(0,0,0,0.5)`
          : "0 2px 12px rgba(0,0,0,0.35)",
        position: "relative",
      }}
    >
      {/* ── Image area ── */}
      <div style={{
        position: "relative",
        width: "100%",
        paddingBottom: "62%",
        overflow: "hidden",
        background: "#0a1018",
        flexShrink: 0,
      }}>
        {!imgError ? (
          <img
            src={`/assets/images/games/${gameId}.png`}
            alt={title}
            onError={() => setImgError(true)}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s cubic-bezier(.4,0,.2,1), filter 0.3s ease",
              transform: hovered ? "scale(1.07)" : "scale(1)",
              filter: hovered ? "brightness(0.55)" : "brightness(0.75) saturate(0.9)",
            }}
          />
        ) : (
          /* Fallback when no image */
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: `radial-gradient(ellipse at center, ${meta.accent}12 0%, #0a1018 70%)`,
          }}>
            <span style={{
              fontSize: "3.5rem", color: meta.accent,
              opacity: 0.25,
              transition: "opacity 0.2s, transform 0.2s",
              transform: hovered ? "scale(1.1)" : "none",
            }}>
              {meta.symbol}
            </span>
          </div>
        )}

        {/* Top-left tag */}
        <div style={{
          position: "absolute", top: 12, left: 12,
          fontSize: "0.56rem", fontWeight: 800, letterSpacing: "0.18em",
          color: meta.accent,
          padding: "3px 8px", borderRadius: 5,
          background: `${meta.accent}18`,
          border: `1px solid ${meta.accent}30`,
          backdropFilter: "blur(8px)",
          transition: "opacity 0.2s",
        }}>
          {meta.tag}
        </div>

        {/* Hover overlay — "Play Now" */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.22s ease",
          pointerEvents: "none",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 22px", borderRadius: 40,
            background: "rgba(8,12,20,0.75)",
            border: `1.5px solid ${meta.accent}50`,
            backdropFilter: "blur(12px)",
            fontSize: "0.82rem", fontWeight: 800,
            color: meta.accent, letterSpacing: "0.06em",
            transform: hovered ? "translateY(0) scale(1)" : "translateY(6px) scale(0.96)",
            transition: "transform 0.22s cubic-bezier(.4,0,.2,1)",
          }}>
            <span style={{ fontSize: "0.7rem" }}>▶</span> PLAY NOW
          </div>
        </div>

        {/* Bottom gradient fade into card body */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: 48,
          background: "linear-gradient(to bottom, transparent, #0d1220)",
          pointerEvents: "none",
        }} />
      </div>

      {/* ── Card body ── */}
      <div style={{ padding: "14px 16px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{
          fontSize: "0.95rem", fontWeight: 800,
          color: hovered ? "#fff" : "#e2e8f0",
          letterSpacing: "-0.02em", lineHeight: 1.2,
          transition: "color 0.18s",
        }}>
          {title}
        </div>

        <div style={{
          fontSize: "0.73rem", color: "#475569",
          lineHeight: 1.55, flex: 1,
        }}>
          {description}
        </div>

        {/* Bottom row */}
        <div style={{
          marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            fontSize: "0.68rem", fontWeight: 700,
            color: meta.accent,
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateX(0)" : "translateX(-4px)",
            transition: "all 0.2s ease",
            letterSpacing: "0.05em",
          }}>
            Start session <span>→</span>
          </div>

          {/* Accent dot */}
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: meta.accent,
            opacity: hovered ? 1 : 0.2,
            boxShadow: hovered ? `0 0 8px ${meta.accent}` : "none",
            transition: "all 0.2s ease",
          }} />
        </div>
      </div>
    </div>
  )
}