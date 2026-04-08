import { useState, useRef, useEffect } from "react";
import { useColorTapGame } from "./hooks";
import GameSetup from "./components/GameSetup";
import CircularTimer from "./components/CircularTimer";
import ResultOverlay from "./components/ResultOverlay";

export default function ColorTapGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [arenaSize, setArenaSize] = useState({ w: 0, h: 0 });
  const arenaRef = useRef(null);

  // Measure arena once mounted
  useEffect(() => {
    if (!gameStarted) return;
    const measure = () => {
      if (arenaRef.current) {
        setArenaSize({
          w: arenaRef.current.clientWidth,
          h: arenaRef.current.clientHeight,
        });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [gameStarted]);

  const {
    level,
    score,
    circles,
    targetColor,
    timeLeft,
    isGameOver,
    showWrongFlash,
    poppingIds,
    floats,
    removeFloat,
    analytics,
    cognitiveAnalysis,
    consecutiveCorrect,
    handleTap,
  } = useColorTapGame(gameTime, gameStarted, arenaSize);

  const handleGameStart = (selectedTime) => {
    setGameTime(selectedTime);
    setGameStarted(true);
  };

  if (!gameStarted) {
    return <GameSetup onStart={handleGameStart} gameName="Color Tap" />;
  }

  return (
    <div className="fixed inset-0 bg-[#0f172a] text-white flex flex-col p-3 select-none overflow-hidden font-sans">
      {/* Result overlay */}
      {isGameOver && cognitiveAnalysis && (
        <ResultOverlay
          score={score}
          analytics={{
            ...analytics,
            accuracy: cognitiveAnalysis.accuracy,
            averageReactionTime: cognitiveAnalysis.avgRT,
          }}
          cognitiveScore={cognitiveAnalysis.total}
          cognitiveFactors={cognitiveAnalysis.factors}
          gameOverReason="timeUp"
          gameName="Color Tap"
          gameId="color-tap"
        />
      )}

      {/* Wrong-tap red flash */}
      {showWrongFlash && (
        <div className="fixed inset-0 bg-red-600/40 z-40 pointer-events-none" />
      )}

      {/* TOP BAR */}
      <div className="flex justify-between items-center bg-slate-800/50 rounded-2xl p-3 border-b-4 border-slate-900 shadow-xl mb-3">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Level</span>
          <span className="text-2xl font-black text-white italic">{level}</span>
        </div>

        {/* Streak badge */}
        <div className={`transition-all duration-500 ${consecutiveCorrect > 2 ? "scale-110" : "scale-100"}`}>
          {consecutiveCorrect > 0 && (
            <div className="bg-orange-500 px-3 py-1 rounded-full text-xs font-black animate-bounce shadow-[0_0_15px_rgba(249,115,22,0.5)]">
              🔥 {consecutiveCorrect}
            </div>
          )}
        </div>

        <div className="flex flex-col text-right">
          <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Score</span>
          <span className="text-2xl font-black text-white italic">{score}</span>
        </div>
      </div>

      {/* TIMER */}
      <div className="flex justify-center mb-3">
        <CircularTimer timeLeft={timeLeft} maxTime={gameTime / 1000} />
      </div>

      {/* PROMPT */}
      {targetColor && (
        <div className="bg-slate-800/50 rounded-2xl px-5 py-4 mb-3 flex items-center gap-4 border-2 border-slate-700 shadow-xl">
          <div className="flex-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Tap this colour
            </p>
            <p className="text-2xl font-black text-white">{targetColor.name}</p>
          </div>
          <div
            className="w-12 h-12 rounded-full flex-shrink-0 border-4 border-white/20 shadow-lg"
            style={{ background: targetColor.hex }}
          />
        </div>
      )}

      {/* ARENA */}
      <div
        ref={arenaRef}
        className="flex-1 bg-slate-800/30 rounded-3xl relative overflow-hidden border-2 border-slate-700"
        style={{ minHeight: 220 }}
      >
        {/* Floating circles */}
        {circles.map((circle) => {
          const isPopping = poppingIds.includes(circle.id);
          return (
            <button
              key={circle.id}
              onClick={() => handleTap(circle)}
              disabled={isGameOver}
              style={{
                position: "absolute",
                left: circle.x - circle.r,
                top: circle.y - circle.r,
                width: circle.r * 2,
                height: circle.r * 2,
                borderRadius: "50%",
                background: circle.color.hex,
                border: "3px solid rgba(255,255,255,0.25)",
                cursor: "pointer",
                transition: isPopping
                  ? "transform 0.3s ease, opacity 0.3s ease"
                  : "none",
                transform: isPopping ? "scale(1.5)" : "scale(1)",
                opacity: isPopping ? 0 : 1,
                boxShadow: `0 0 12px ${circle.color.hex}66`,
              }}
            />
          );
        })}

        {/* +1 float labels */}
        {floats.map((f) => (
          <FloatLabel
            key={f.id}
            x={f.x}
            y={f.y}
            onDone={() => removeFloat(f.id)}
          />
        ))}
      </div>
    </div>
  );
}

// Self-removing +1 float label
function FloatLabel({ x, y, onDone }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 20);
    const hide = setTimeout(() => { setVisible(false); onDone(); }, 800);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: visible ? y - 60 : y - 20,
        transform: "translateX(-50%)",
        opacity: visible ? 0 : 1,
        color: "#4ade80",
        fontWeight: 900,
        fontSize: 20,
        pointerEvents: "none",
        transition: "top 0.8s ease, opacity 0.8s ease",
        zIndex: 50,
      }}
    >
      +1
    </div>
  );
}