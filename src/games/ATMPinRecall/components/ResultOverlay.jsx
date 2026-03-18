import { formatTime } from "../engine";

export default function ResultOverlay({
  score,
  analytics,
  gameOverReason,
  round,
  gameName,
}) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className={`px-8 py-12 text-center ${
            gameOverReason === "timeUp"
              ? "bg-slate-700"
              : "bg-slate-700"
          }`}>
            <div className="text-6xl mb-4">
              {gameOverReason === "timeUp" ? "⏰" : gameOverReason === "noLives" ? "💔" : "🎉"}
            </div>
            <h1 className="text-3xl font-bold mb-2 text-cyan-400">
              {gameOverReason === "timeUp"
                ? "Time's Up!"
                : gameOverReason === "noLives"
                ? "Out of Lives!"
                : "Game Over"}
            </h1>
            <p className="text-slate-400 text-sm">
              {gameOverReason === "timeUp"
                ? `You reached round ${round}`
                : `You completed ${round - 1} rounds`}
            </p>
          </div>

          {/* Stats */}
          <div className="px-8 py-8 space-y-6">
            {/* Final Score */}
            <div className="bg-slate-700 rounded-lg p-6 border border-slate-600 text-center">
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Final Score</p>
              <p className="text-5xl font-black text-cyan-400">{score}</p>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700 rounded-lg p-4 text-center border border-slate-600">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Rounds</p>
                <p className="text-2xl font-bold text-cyan-400">{analytics.totalRounds}</p>
              </div>

              <div className="bg-slate-700 rounded-lg p-4 text-center border border-slate-600">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Accuracy</p>
                <p className="text-2xl font-bold text-amber-400">{analytics.accuracy}%</p>
              </div>

              <div className="bg-slate-700 rounded-lg p-4 text-center border border-slate-600">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Correct</p>
                <p className="text-2xl font-bold text-green-400">✓ {analytics.correctRounds}</p>
              </div>

              <div className="bg-slate-700 rounded-lg p-4 text-center border border-slate-600">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Wrong</p>
                <p className="text-2xl font-bold text-red-400">✕ {analytics.wrongRounds}</p>
              </div>

              <div className="bg-slate-700 rounded-lg p-4 text-center border border-slate-600 col-span-2">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Avg Reaction Time</p>
                <p className="text-2xl font-bold text-blue-400">
                  {analytics.averageReactionTime}ms
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-slate-900 border-t border-slate-700">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-lg font-bold uppercase tracking-widest
                bg-cyan-500 hover:bg-cyan-600
                text-white shadow-lg
                transition-all duration-300 transform
                hover:scale-105 active:scale-95"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}