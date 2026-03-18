import { formatTime } from "../engine";

export default function ResultOverlay({ score, analytics, gameOverReason, round, wrong }) {
  const isWin = gameOverReason === "won";
  const accuracy = analytics.totalAttempts > 0 
    ? Math.round((analytics.correctAttempts / analytics.totalAttempts) * 100)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
          <div className={`
            px-8 py-12 text-center
            ${gameOverReason === "timeUp"
              ? 'bg-gradient-to-br from-red-600/20 to-orange-600/20'
              : 'bg-gradient-to-br from-green-600/20 to-emerald-600/20'
            }
          `}>
            <div className="text-6xl mb-4">
              {gameOverReason === "timeUp" ? "⏰" : "🎉"}
            </div>
            <h1 className={`
              text-3xl font-black mb-2
              ${gameOverReason === "timeUp"
                ? 'text-red-300'
                : 'text-green-300'
              }
            `}>
              {gameOverReason === "timeUp" ? "Time's Up!" : "Great Job!"}
            </h1>
            <p className="text-slate-400 text-sm">
              {gameOverReason === "timeUp"
                ? `You reached round ${round}`
                : `You completed ${round} rounds`
              }
            </p>
          </div>

          <div className="px-8 py-8 space-y-6">
            <div className="bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-xl p-6 border border-purple-500/20 text-center">
              <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Final Score</p>
              <p className="text-4xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {score}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-700/50">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Rounds</p>
                <p className="text-2xl font-black text-cyan-300">{analytics.levelsCompleted}</p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-700/50">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Accuracy</p>
                <p className="text-2xl font-black text-amber-300">{accuracy}%</p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-700/50">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Attempts</p>
                <p className="text-2xl font-black text-blue-300">{analytics.totalAttempts}</p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-700/50">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Avg Speed</p>
                <p className="text-2xl font-black text-green-300">
                  {analytics.averageReactionTime > 0 ? `${Math.round(analytics.averageReactionTime / 100) / 10}s` : '-'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-lg p-4 text-center border border-green-500/20">
                <div className="text-green-400 font-bold text-lg mb-1">✓</div>
                <p className="text-sm text-slate-400">Correct</p>
                <p className="text-xl font-black text-green-400">{analytics.correctAttempts}</p>
              </div>

              <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 rounded-lg p-4 text-center border border-red-500/20">
                <div className="text-red-400 font-bold text-lg mb-1">✕</div>
                <p className="text-sm text-slate-400">Wrong</p>
                <p className="text-xl font-black text-red-400">{analytics.wrongAttempts}</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-4 bg-slate-800/50 border-t border-slate-700/50 text-center">
            <p className="text-xs text-slate-500">
              Average Reaction Time: <span className="text-slate-300 font-bold">
                {analytics.averageReactionTime > 0 ? `${Math.round(analytics.averageReactionTime / 100) / 10}s` : '-'}
              </span>
            </p>
          </div>

          <div className="px-8 py-6 bg-gradient-to-t from-black/50 to-transparent">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-lg font-bold uppercase tracking-widest
                bg-gradient-to-r from-purple-600 to-cyan-600
                hover:from-purple-500 hover:to-cyan-500
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