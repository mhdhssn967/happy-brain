import { useState } from "react"
import { useMathGame } from "./hooks"
import ResultOverlay from "./components/ResultOverlay"
import GameSetup from "./components/GameSetup"
import CircularTimer from "./components/CircularTimer"
import { CheckIcon } from "lucide-react"

export default function MathGame() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameTime, setGameTime] = useState(0)

  const {
    level,
    problem,
    userInput,
    score,
    timeLeft,
    isGameOver,
    feedback,
    showCorrectAnimation,
    consecutiveCorrect,
    handleNumberClick,
    handleClear,
    handleBackspace,
    analytics,
  } = useMathGame(gameTime, gameStarted)

  const handleGameStart = (selectedTime) => {
    setGameTime(selectedTime)
    setGameStarted(true)
  }

  // Show setup screen if game hasn't started
  if (!gameStarted) {
    return <GameSetup onStart={handleGameStart} />
  }

  return (
    <div className="fixed inset-0 bg-[#0f172a] text-white flex flex-col p-4 select-none overflow-hidden font-sans">
      {isGameOver && (
        <ResultOverlay
          score={score}
          analytics={analytics}
          gameOverReason="timeUp"
          gameName="Quick Math"
          gameId="math-game"
        />
      )}

      {/* TOP BAR: Score & Level */}
      <div className="flex justify-between items-center bg-slate-800/50 rounded-2xl p-3 border-b-4 border-slate-900 shadow-xl">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
            Level
          </span>
          <span className="text-2xl font-black text-white italic">{level}</span>
        </div>

        {/* Streak Indicator */}
        <div
          className={`transition-all duration-500 ${
            consecutiveCorrect > 2 ? "scale-110" : "scale-100"
          }`}
        >
          {consecutiveCorrect > 0 && (
            <div className="bg-orange-500 px-3 py-1 rounded-full text-xs font-black animate-bounce shadow-[0_0_15px_rgba(249,115,22,0.5)]">
              🔥 {consecutiveCorrect}
            </div>
          )}
        </div>

        <div className="flex flex-col text-right">
          <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">
            Score
          </span>
          <span className="text-2xl font-black text-white italic">{score}</span>
        </div>
      </div>

      {/* TIMER */}
      <div className="flex justify-center mt-4 mb-4">
        <CircularTimer timeLeft={timeLeft} maxTime={gameTime / 1000} />
      </div>

      {/* PROBLEM AREA */}
      <div className="flex-1 flex flex-col justify-center items-center relative my-4">
        <div className="w-full aspect-video bg-slate-800 rounded-[2rem] border-4 border-slate-700 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

          <p className="text-slate-400 text-xs font-bold uppercase mb-2 tracking-tighter">
            Solve This
          </p>
          <h2 className="text-5xl md:text-6xl font-black text-yellow-300 drop-shadow-[0_4px_0_rgba(0,0,0,0.4)]">
            {problem?.problem}
          </h2>

          {/* Correct Feedback Overlay */}
          <div
            className={`absolute inset-0 bg-emerald-500 flex items-center justify-center transition-transform duration-300 ${
              showCorrectAnimation ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <span className="text-7xl">
              <CheckIcon />
            </span>
          </div>
        </div>

        {/* INPUT BOX */}
        <div
          className={`
          mt-[-25px] z-10 min-w-[140px] px-6 py-3 rounded-2xl border-4 shadow-2xl transition-all duration-200 flex justify-center
          ${
            feedback === "wrong"
              ? "bg-red-600 border-red-800 animate-shake"
              : "bg-indigo-600 border-indigo-800"
          }
        `}
        >
          <span className="text-4xl font-black text-white drop-shadow-md">
            {userInput || "?"}
          </span>
        </div>
        {feedback === "wrong" && (
          <p className="text-red-400 font-bold text-sm mt-2">Hint: {problem.answer}</p>
        )}
      </div>

      {/* KEYPAD */}
      <div className="grid grid-cols-3 gap-3 pb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "⌫"].map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (btn === "C") handleClear()
              else if (btn === "⌫") handleBackspace()
              else handleNumberClick(btn)
            }}
            disabled={isGameOver}
            className={`
              h-16 rounded-2xl font-black text-2xl transition-all active:scale-90 shadow-[0_4px_0_rgb(0,0,0,0.3)]
              ${
                typeof btn === "number"
                  ? "bg-white text-slate-900 active:bg-slate-200 disabled:opacity-50"
                  : "bg-slate-700 text-white disabled:opacity-50"
              }
            `}
          >
            {btn}
          </button>
        ))}
      </div>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-8px);
          }
          40% {
            transform: translateX(8px);
          }
          60% {
            transform: translateX(-8px);
          }
          80% {
            transform: translateX(8px);
          }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      `}</style>
    </div>
  )
}