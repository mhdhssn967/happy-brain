import { useState } from "react"
import { useSequenceGame } from "./hooks"
import SequenceCard from "./components/Card"
import ResultOverlay from "./components/ResultOverlay"
import GameSetup from "./components/GameSetup"
import CircularTimer from "./components/CircularTimer"

export default function SequenceRecall() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameTime, setGameTime] = useState(0)

  // Initialize game hooks ALWAYS (not inside conditional)
  const {
    level,
    phase,
    items,
    displayItems,
    score,
    timeLeft,
    isGameOver,
    handleCardTap,
    analytics,
    cardFlipped,
    userSequence,
    memorizeTime,
    memorizeProgress,
    maxMemorizeTime,
  } = useSequenceGame(gameTime, gameStarted)

  const handleGameStart = (selectedTime) => {
    setGameTime(selectedTime)
    setGameStarted(true)
  }

  // Show setup if game hasn't started
  if (!gameStarted) {
    return <GameSetup onStart={handleGameStart} />
  }

  return (
    <div className="w-screen h-screen bg-slate-950 text-white font-sans flex flex-col overflow-hidden p-3 gap-3">
      {isGameOver && (
        <ResultOverlay
          score={score}
          analytics={analytics}
          gameOverReason="timeUp"
          gameName="Sequence Recall"
          gameId="sequence-recall"
        />
      )}

      {/* Header */}
      <div className="flex-shrink-0 flex justify-between items-center">
        <div className="bg-slate-900 border-4 border-slate-700 rounded-lg px-3 py-1">
          <p className="text-xs text-slate-400">LEVEL</p>
          <p className="text-2xl font-black">{level}</p>
        </div>

        <div className="flex-1 flex justify-center">
          <CircularTimer timeLeft={timeLeft} maxTime={gameTime / 1000} />
        </div>

        <div className="bg-slate-900 border-4 border-slate-700 rounded-lg px-3 py-1">
          <p className="text-xs text-slate-400">SCORE</p>
          <p className="text-2xl font-black">{score}</p>
        </div>
      </div>

      {/* Progress Bar - Show during memorize phase */}
      {phase === "show" && (
        <div className="flex-shrink-0">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-bold text-yellow-300">
              Remember: {memorizeTime}s
            </p>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 border-2 border-slate-700 overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-500 to-yellow-300 h-full transition-all duration-300"
              style={{ width: `${memorizeProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="flex-shrink-0 text-center">
        {phase === "show" && (
          <p className="text-sm font-bold text-yellow-300">👀 Remember the order...</p>
        )}
        {phase === "flip" && (
          <p className="text-sm font-bold text-slate-300">🎴 Flipping...</p>
        )}
        {phase === "shuffle" && (
          <p className="text-sm font-bold text-slate-300">🔄 Shuffling cards...</p>
        )}
        {phase === "play" && (
          <p className="text-sm font-bold text-yellow-300">
            🎯 Tap in original order! {userSequence.length}/4
          </p>
        )}
      </div>

      {/* Game Grid - Always 2x2 with animations */}
      <div className="flex-1 flex items-center justify-center min-h-0 p-4">
        <div className="w-full max-w-sm aspect-square">
          <div className="grid grid-cols-2 gap-4 h-full">
            {displayItems.map((item, idx) => (
              <div
                key={item.id}
                className={`
                  transition-all duration-500
                  ${phase === "shuffle" ? "animate-shuffle" : ""}
                `}
                style={{
                  animationDelay: `${idx * 0.1}s`,
                }}
              >
                <SequenceCard
                  item={item}
                  isFlipped={cardFlipped[item.id] === true}
                  state={cardFlipped[item.id]}
                  onTap={handleCardTap}
                  canTap={phase === "play"}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shuffle {
          0%,
          100% {
            transform: translateY(0) rotateZ(0deg) scale(1);
          }
          25% {
            transform: translateY(-20px) rotateZ(-5deg) scale(0.98);
          }
          50% {
            transform: translateY(20px) rotateZ(5deg) scale(0.98);
          }
          75% {
            transform: translateY(-10px) rotateZ(-2deg) scale(0.99);
          }
        }

        .animate-shuffle {
          animation: shuffle 1s ease-in-out forwards;
        }
      `}</style>
    </div>
  )
}