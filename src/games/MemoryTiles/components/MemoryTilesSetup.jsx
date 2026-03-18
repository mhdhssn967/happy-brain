import { useState } from "react";

export default function MemoryTilesSetup({ onStart }) {
  const [gameTime, setGameTime] = useState(60000); // 1 minute in ms
  const maxTime = 5 * 60 * 1000; // 5 minutes
  const minTime = 1 * 60 * 1000; // 1 minute

  const increaseTime = () => {
    setGameTime(prev => Math.min(prev + 30000, maxTime)); // +30 seconds
  };

  const decreaseTime = () => {
    setGameTime(prev => Math.max(prev - 30000, minTime)); // -30 seconds
  };

  const timeInMinutes = Math.floor(gameTime / 60000);
  const timeInSeconds = ((gameTime % 60000) / 1000);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white font-sans flex flex-col overflow-hidden p-4">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 text-center pt-8 pb-8">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
            MEMORY TILES
          </h1>
          <p className="text-sm text-slate-400">Game Setup</p>
        </div>

        {/* Setup Card */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-sm bg-slate-900/60 rounded-3xl border-2 border-slate-700 p-8 backdrop-blur-sm">
            {/* Title */}
            <h2 className="text-2xl font-black text-center mb-8 text-yellow-300">
              ⏱️ Choose Your Time
            </h2>

            {/* Time Display */}
            <div className="mb-8 p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-cyan-500/30 text-center">
              <p className="text-slate-400 text-sm mb-2">Game Duration</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-black text-cyan-400">{timeInMinutes}</span>
                <span className="text-2xl text-slate-400">:</span>
                <span className="text-3xl font-black text-cyan-400">{String(Math.floor(timeInSeconds)).padStart(2, '0')}</span>
              </div>
              <p className="text-xs text-slate-500 mt-3">Total game duration</p>
            </div>

            {/* Time Adjustment Controls */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={decreaseTime}
                disabled={gameTime <= minTime}
                className="flex-1 py-3 bg-red-600/50 hover:bg-red-600 disabled:bg-slate-700 disabled:opacity-50 border-2 border-red-500/50 rounded-xl font-black text-lg text-white transition-all active:scale-95"
              >
                − 30s
              </button>
              <button
                onClick={increaseTime}
                disabled={gameTime >= maxTime}
                className="flex-1 py-3 bg-emerald-600/50 hover:bg-emerald-600 disabled:bg-slate-700 disabled:opacity-50 border-2 border-emerald-500/50 rounded-xl font-black text-lg text-white transition-all active:scale-95"
              >
                + 30s
              </button>
            </div>

            {/* Info */}
            <div className="mb-8 p-4 bg-blue-900/30 border-2 border-blue-500/30 rounded-xl">
              <p className="text-sm text-blue-300 text-center">
                <span className="font-bold">Tip:</span> Longer time = more rounds to play!
              </p>
            </div>

            {/* Time Presets */}
            <div className="mb-8">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">Quick Select</p>
              <div className="grid grid-cols-3 gap-2">
                {[1, 3, 5].map(minutes => (
                  <button
                    key={minutes}
                    onClick={() => setGameTime(minutes * 60 * 1000)}
                    className={`py-2 rounded-lg font-bold transition-all ${
                      gameTime === minutes * 60 * 1000
                        ? "bg-cyan-600 border-2 border-cyan-400 text-white"
                        : "bg-slate-800 border-2 border-slate-700 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    {minutes}m
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={() => onStart(gameTime)}
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 border-2 border-cyan-500 rounded-xl font-black text-lg text-white transition-all active:scale-95 shadow-lg"
            >
              START GAME 🎮
            </button>

            {/* Min/Max Info */}
            <p className="text-xs text-slate-500 text-center mt-4">
              Minimum: 1 minute | Maximum: 5 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}