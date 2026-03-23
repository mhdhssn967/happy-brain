import { useState } from "react"

export default function GameSetup({ onStart, gameName = "Sequence Recall" }) {
  const [selectedTime, setSelectedTime] = useState(60000) // Default: 60 seconds in ms
  const timeOptions = [
    { label: "30s", value: 30000 },
    { label: "60s", value: 60000 },
    { label: "90s", value: 90000 },
    { label: "2m", value: 120000 },
    { label: "3m", value: 180000 },
    { label: "5m", value: 300000 },
  ]

  const handleStart = () => {
    onStart(selectedTime)
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 to-purple-950 text-white flex flex-col items-center justify-center p-4 font-sans">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md w-full">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4">🎴</h1>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
            {gameName}
          </h2>
          <p className="text-slate-400 text-sm">How much time do you need?</p>
        </div>

        {/* Time Selection */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4 text-center">
            Select Duration
          </p>

          <div className="grid grid-cols-3 gap-3">
            {timeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedTime(option.value)}
                className={`
                  py-4 rounded-xl font-bold text-sm transition-all transform
                  ${
                    selectedTime === option.value
                      ? "bg-gradient-to-br from-purple-500 to-blue-500 scale-105 shadow-lg shadow-purple-500/50"
                      : "bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50"
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-12 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="font-bold text-purple-400">📝 Rules:</span>
            <br />
            Memorize 4 cards, they shuffle, then tap them in the original order.
            Each correct = 10 points. Each wrong = -5 points.
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-lg
            bg-gradient-to-r from-purple-600 to-blue-600
            hover:from-purple-500 hover:to-blue-500
            text-white shadow-lg shadow-purple-500/30
            transition-all transform
            hover:scale-105 active:scale-95"
        >
          Start Game
        </button>

        {/* Info Footer */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>Selected: {(selectedTime / 1000).toFixed(0)} seconds</p>
        </div>
      </div>
    </div>
  )
}