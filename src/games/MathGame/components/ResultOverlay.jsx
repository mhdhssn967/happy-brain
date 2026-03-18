import { useEffect, useState } from "react";

export default function ResultOverlay({ score, analytics, level }) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowDetails(true), 500);
  }, []);

  const accuracy = analytics.correctAttempts / (analytics.totalAttempts || 1) * 100;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`
        bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl 
        border border-white/10 max-w-2xl w-full
        transform transition-all duration-500
        ${showDetails ? "scale-100 opacity-100" : "scale-90 opacity-0"}
        shadow-2xl
      `}>
        {/* Header */}
        <div className="relative px-8 py-8 border-b border-white/10 text-center bg-gradient-to-r from-red-600/30 to-red-600/30">
          <div className="text-6xl mb-2">💔</div>
          
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-300 mb-2">
            GAME OVER
          </h1>
          <p className="text-slate-400 text-sm tracking-wider uppercase font-bold">
            Reached Level {level}
          </p>
        </div>

        {/* Main Score Section */}
        <div className="px-8 py-12 text-center">
          <div className="mb-8">
            <p className="text-slate-400 text-sm uppercase tracking-widest mb-2">Final Score</p>
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 animate-pulse">
              {score}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Accuracy */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-emerald-500/30">
              <p className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-2">Accuracy</p>
              <div className="text-3xl font-black text-emerald-400">{Math.round(accuracy)}%</div>
              <p className="text-slate-500 text-xs mt-1">{analytics.correctAttempts}/{analytics.totalAttempts} Correct</p>
            </div>

            {/* Level Reached */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-blue-500/30">
              <p className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-2">Level</p>
              <div className="text-3xl font-black text-blue-400">{level}</div>
              <p className="text-slate-500 text-xs mt-1">Levels Completed</p>
            </div>
          </div>

          {/* Advanced Analytics */}
          {analytics.reactionTimes.length > 0 && (
            <div className="bg-slate-800/50 rounded-xl p-4 border border-cyan-500/30 mb-8">
              <p className="text-cyan-400 text-sm font-bold uppercase tracking-wider mb-3">Performance</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-slate-400 text-xs mb-1">Avg Time</p>
                  <p className="text-cyan-300 font-bold">{analytics.averageReactionTime}ms</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Attempts</p>
                  <p className="text-cyan-300 font-bold">{analytics.totalAttempts}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Fastest</p>
                  <p className="text-cyan-300 font-bold">{Math.min(...analytics.reactionTimes)}ms</p>
                </div>
              </div>
            </div>
          )}

          {/* Motivation Message */}
          <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <p className="text-slate-300 text-sm font-semibold">
              {accuracy >= 70
                ? "💪 Good effort! Keep practicing to improve!"
                : "Keep trying! You'll get better with practice!"}
            </p>
          </div>

          {/* Detailed Breakdown */}
          <details className="text-left mb-8">
            <summary className="cursor-pointer px-4 py-2 bg-slate-800/50 rounded-lg border border-white/5 hover:border-white/20 transition-all font-bold text-slate-300 text-sm">
              📊 Detailed Analytics
            </summary>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <span>Total Attempts:</span>
                <span className="font-bold text-slate-200">{analytics.totalAttempts}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <span>Correct:</span>
                <span className="font-bold text-emerald-400">{analytics.correctAttempts}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <span>Wrong:</span>
                <span className="font-bold text-red-400">{analytics.wrongAttempts}</span>
              </div>
              {analytics.reactionTimes.length > 0 && (
                <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <span>Avg Reaction Time:</span>
                  <span className="font-bold text-blue-400">{analytics.averageReactionTime}ms</span>
                </div>
              )}
            </div>
          </details>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 border-t border-white/10 flex gap-4 justify-center">
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95"
          >
            Play Again
          </button>
          <button 
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}