import { useState } from "react";

const DEFAULT_GAME_TIME = 300000; // 5 minutes
const PRESET_TIMES = [
  { label: "30s", value: 30000 },
  { label: "1m", value: 60000 },
  { label: "2m", value: 120000 },
  { label: "5m", value: 300000 },
  { label: "10m", value: 600000 },
];

export default function GameSetup({ onStart, gameName = "Game" }) {
  const [selectedTime, setSelectedTime] = useState(DEFAULT_GAME_TIME);

  const handleStart = () => {
    onStart(selectedTime);
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-cyan-400">🔐 {gameName}</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            A digital memory game testing your ability to recall PIN codes under pressure.
          </p>
        </div>

        {/* How to Play */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-4">How to Play</h2>
          <ol className="space-y-2 text-xs text-slate-300">
            <li>1️⃣ A PIN will appear for 4 seconds</li>
            <li>2️⃣ Memorize the number carefully</li>
            <li>3️⃣ Enter the PIN using the keypad</li>
            <li>4️⃣ Difficulty increases every 4 rounds:</li>
            <li className="ml-4">• Rounds 1-4: 3 digits</li>
            <li className="ml-4">• Rounds 5-8: 4 digits</li>
            <li className="ml-4">• Rounds 9+: 5 digits (max)</li>
            <li>5️⃣ You have {PRESET_TIMES[3].label} to complete as many rounds as possible</li>
          </ol>
        </div>

        {/* Time Selection */}
        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 mb-8">
          <h2 className="text-center text-sm font-bold uppercase tracking-widest text-cyan-400 mb-8">
            Select Game Duration
          </h2>

          {/* Time Display */}
          <div className="text-center mb-8 p-6 bg-slate-900 rounded-lg border border-slate-700">
            <p className="text-5xl font-black font-mono text-cyan-400">
              {formatTime(selectedTime)}
            </p>
            <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest">Total Time</p>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {PRESET_TIMES.map(({ label, value }) => (
              <button
                key={label}
                onClick={() => setSelectedTime(value)}
                className={`py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
                  selectedTime === value
                    ? "bg-cyan-500 text-white shadow-lg"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Custom Time Adjustment */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setSelectedTime(prev => Math.max(10000, prev - 30000))}
              className="w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-lg transition-all"
            >
              −
            </button>
            <span className="text-xs text-slate-500 uppercase tracking-widest min-w-[80px] text-center">
              30s steps
            </span>
            <button
              onClick={() => setSelectedTime(prev => prev + 30000)}
              className="w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-lg transition-all"
            >
              +
            </button>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold uppercase tracking-widest rounded-lg transition-all shadow-lg hover:shadow-cyan-500/50 active:scale-95"
        >
          🎮 Start Game
        </button>

        <p className="text-center text-xs text-slate-500 mt-6">
          Choose your time limit and test your memory. Good luck!
        </p>
      </div>
    </div>
  );
}