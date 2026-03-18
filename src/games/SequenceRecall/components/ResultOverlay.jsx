import { useEffect, useState } from "react";

export default function ResultOverlay({ score, analytics, level }) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowDetails(true), 500);
  }, []);

  const accuracy = analytics.correctAttempts / (analytics.totalAttempts || 1) * 100;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2">
      <div className={`
        bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl 
        border-4 border-slate-700 w-full max-w-sm h-5/6 max-h-96
        transform transition-all duration-500 flex flex-col
        ${showDetails ? "scale-100 opacity-100" : "scale-90 opacity-0"}
        shadow-2xl
      `}>
        {/* Header */}
        <div className="relative px-4 py-4 border-b-2 border-slate-700 rounded-tl-2xl rounded-tr-2xl text-center bg-slate-900 flex-shrink-0">
          {/* <div className="text-4xl mb-1">💔</div> */}
          <h1 className="text-2xl font-black text-white mb-1">GAME OVER</h1>
          <p className="text-slate-400 text-xs tracking-wider uppercase font-bold">Level {level}</p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {/* Score */}
          <div className="text-center bg-slate-800/50 rounded-lg p-3 border border-slate-700">
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Score</p>
            <div className="text-3xl font-black text-yellow-300">{score}</div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Accuracy */}
            <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
              <p className="text-emerald-400 text-xs font-bold uppercase mb-1">Accuracy</p>
              <div className="text-2xl font-black text-emerald-400">{Math.round(accuracy)}%</div>
            </div>

            {/* Attempts */}
            <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
              <p className="text-blue-400 text-xs font-bold uppercase mb-1">Attempts</p>
              <div className="text-2xl font-black text-blue-400">{analytics.totalAttempts}</div>
            </div>
          </div>

          {/* Reaction Time */}
          {analytics.reactionTimes.length > 0 && (
            <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
              <p className="text-cyan-400 text-xs font-bold uppercase mb-1">Avg Reaction</p>
              <div className="text-2xl font-black text-cyan-400">{analytics.averageReactionTime}ms</div>
            </div>
          )}

          {/* Expandable Details */}
          <details className="text-sm">
            <summary className="cursor-pointer px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-all font-bold text-slate-300 text-xs">
              📊 More Details
            </summary>
            <div className="mt-2 space-y-2 text-xs text-slate-400">
              <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded">
                <span>Correct:</span>
                <span className="font-bold text-emerald-400">{analytics.correctAttempts}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded">
                <span>Wrong:</span>
                <span className="font-bold text-red-400">{analytics.wrongAttempts}</span>
              </div>
              {analytics.reactionTimes.length > 0 && (
                <>
                  <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded">
                    <span>Fastest:</span>
                    <span className="font-bold text-blue-400">{Math.min(...analytics.reactionTimes)}ms</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded">
                    <span>Slowest:</span>
                    <span className="font-bold text-orange-400">{Math.max(...analytics.reactionTimes)}ms</span>
                  </div>
                </>
              )}
            </div>
          </details>
        </div>

        {/* Fixed Buttons at Bottom */}
        <div className="px-4 py-3 border-t-2 border-slate-700 flex gap-2 justify-center flex-shrink-0">
          <button 
            onClick={() => window.location.reload()}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition-all"
          >
            Play Again
          </button>
          <button 
            onClick={() => window.history.back()}
            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm rounded-lg transition-all"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}