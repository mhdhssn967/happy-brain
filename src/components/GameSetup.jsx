import { useState } from "react";
import { MIN_GAME_TIME, TIME_INCREMENT, DEFAULT_GAME_TIME } from "../config";
import { formatTime } from "../engine";

export default function GameSetup({ onStart }) {
  const [selectedTime, setSelectedTime] = useState(DEFAULT_GAME_TIME);

  const handleAddTime = () => {
    setSelectedTime(prev => prev + TIME_INCREMENT);
  };

  const handleRemoveTime = () => {
    setSelectedTime(prev => Math.max(MIN_GAME_TIME, prev - TIME_INCREMENT));
  };

  const handleStart = () => {
    onStart(selectedTime);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-black text-slate-100 font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="text-6xl font-black bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              🧠
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
            Memory Tiles
          </h1>
          
          <p className="text-slate-400 text-sm leading-relaxed">
            Match the pattern as it gets increasingly difficult. Watch, memorize, and tap the correct tiles before time runs out!
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl p-6 border border-purple-500/20 backdrop-blur-sm mb-10 shadow-xl">
          <h2 className="text-sm font-bold uppercase tracking-widest text-purple-300 mb-4">How to Play</h2>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-0.5">1.</span>
              <span>Watch the tiles light up during the memory phase</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-0.5">2.</span>
              <span>Tap the tiles in the order you memorized them</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-0.5">3.</span>
              <span>Complete all rounds before time expires</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-0.5">4.</span>
              <span>Earn more points for faster reactions!</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 rounded-2xl p-8 border border-cyan-500/20 backdrop-blur-sm shadow-2xl mb-8">
          <h2 className="text-center text-sm font-bold uppercase tracking-widest text-cyan-300 mb-8">
            Select Game Duration
          </h2>

          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-xl px-8 py-6 border border-cyan-400/30 text-center">
              <p className="text-5xl font-black text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text font-mono">
                {formatTime(selectedTime)}
              </p>
              <p className="text-xs uppercase tracking-widest text-slate-400 mt-2">remaining</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mb-8">
            <button
              onClick={handleRemoveTime}
              disabled={selectedTime <= MIN_GAME_TIME}
              className={`
                relative group
                w-14 h-14 rounded-full font-bold text-xl
                transition-all duration-300 transform
                ${selectedTime > MIN_GAME_TIME
                  ? 'bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-lg hover:shadow-red-500/50 hover:scale-110 cursor-pointer active:scale-95'
                  : 'bg-slate-700/50 text-slate-500 cursor-not-allowed opacity-50'
                }
              `}
            >
              <span className="text-slate-200">−</span>
            </button>

            <div className="flex-1 grid grid-cols-3 gap-2">
              {[
                { time: 30000, label: "30s" },
                { time: 300000, label: "5m" },
                { time: 600000, label: "10m" }
              ].map(({ time, label }) => (
                <button
                  key={label}
                  onClick={() => setSelectedTime(time)}
                  className={`
                    py-2 rounded-lg font-bold text-xs uppercase tracking-widest
                    transition-all duration-300 transform
                    ${selectedTime === time
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white scale-105 shadow-lg shadow-cyan-500/50'
                      : 'bg-slate-700/40 text-slate-300 hover:bg-slate-600/40 hover:text-slate-100'
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={handleAddTime}
              className={`
                relative group
                w-14 h-14 rounded-full font-bold text-xl
                transition-all duration-300 transform
                bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600
                shadow-lg hover:shadow-green-500/50 hover:scale-110 cursor-pointer active:scale-95
                text-slate-200
              `}
            >
              <span>+</span>
            </button>
          </div>

          <p className="text-center text-xs text-slate-400">
            Adjust time in 30-second increments
          </p>
        </div>

        <button
          onClick={handleStart}
          className={`
            w-full py-4 rounded-xl font-bold uppercase tracking-widest text-lg
            transition-all duration-300 transform
            bg-gradient-to-r from-purple-600 to-cyan-600
            hover:from-purple-500 hover:to-cyan-500
            text-white shadow-2xl
            hover:shadow-purple-500/50 hover:scale-105
            active:scale-95
            relative overflow-hidden
          `}
        >
          <span className="relative z-10">🎮 Start Game</span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </button>

        <p className="text-center text-xs text-slate-500 mt-6">
          Complete as many rounds as possible before time expires. Each round gets harder!
        </p>
      </div>
    </div>
  );
}