import { useState } from "react";
import { TIME_OPTIONS, DEFAULT_TIME } from "../config";

export default function GameSetup({ onStart, gameName = "Color Tap" }) {
  const [selectedTime, setSelectedTime] = useState(DEFAULT_TIME);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 to-indigo-950 text-white flex flex-col items-center justify-center p-4 font-sans">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black mb-4">🎨</h1>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
            {gameName}
          </h2>
          <p className="text-slate-400 text-sm">
            Tap the matching colour before time runs out
          </p>
        </div>

        {/* Duration picker */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4 text-center">
            Select Duration
          </p>
          <div className="grid grid-cols-3 gap-3">
            {TIME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedTime(opt.value)}
                className={`
                  py-4 rounded-xl font-bold text-sm transition-all transform
                  ${
                    selectedTime === opt.value
                      ? "bg-gradient-to-br from-indigo-500 to-purple-500 scale-105 shadow-lg shadow-indigo-500/50"
                      : "bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50"
                  }
                `}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div className="mb-10 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="font-bold text-purple-400">📝 Rules:</span>
            <br />
            A colour prompt appears at the top. Tap the matching circle in the
            arena. Circles move faster and multiply as you level up. Correct
            tap = +10 pts. Wrong tap = −3 pts.
          </p>
        </div>

        {/* Start */}
        <button
          onClick={() => onStart(selectedTime)}
          className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-lg
            bg-gradient-to-r from-indigo-600 to-purple-600
            hover:from-indigo-500 hover:to-purple-500
            text-white shadow-lg shadow-indigo-500/30
            transition-all transform hover:scale-105 active:scale-95"
        >
          Start Game
        </button>

        <p className="mt-6 text-center text-xs text-slate-500">
          Selected: {(selectedTime / 1000).toFixed(0)} seconds
        </p>
      </div>
    </div>
  );
}