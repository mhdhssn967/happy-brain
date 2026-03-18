export default function PinDisplay({ phase, pin, userInput, pinLength }) {
  return (
    <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
      <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">
        {phase === "memorize" ? `Remember this ${pinLength}-digit PIN` : "Enter the PIN"}
      </p>

      <div className="flex justify-center items-center gap-2 mb-4">
        {/* Show PIN during memorize, dots during input */}
        {phase === "memorize" ? (
          <div className="text-5xl font-black tracking-wider text-cyan-400 font-mono">
            {pin}
          </div>
        ) : (
          <div className="flex gap-3">
            {Array(pinLength)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold text-lg transition-all ${
                    i < userInput.length
                      ? "bg-cyan-500 border-cyan-400 text-slate-900"
                      : "bg-slate-700 border-slate-600"
                  }`}
                >
                  {i < userInput.length ? "●" : "○"}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center gap-1">
        {Array(pinLength)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${
                i < userInput.length ? "bg-cyan-400" : "bg-slate-700"
              }`}
            />
          ))}
      </div>
    </div>
  );
}