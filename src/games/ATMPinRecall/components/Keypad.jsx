export default function Keypad({
  phase,
  onKeyPress,
  onBackspace,
  onClear,
  pinLength,
  inputLength,
}) {
  const isInputPhase = phase === "input";

  return (
    <div className="space-y-4">
      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <button
            key={digit}
            onClick={() => onKeyPress(String(digit))}
            disabled={!isInputPhase || inputLength >= pinLength}
            className={`py-4 rounded-lg font-bold text-xl transition-all transform ${
              isInputPhase && inputLength < pinLength
                ? "bg-cyan-600 hover:bg-cyan-500 hover:scale-105 active:scale-95 cursor-pointer"
                : "bg-slate-700 text-slate-500 cursor-not-allowed opacity-50"
            }`}
          >
            {digit}
          </button>
        ))}
      </div>

      {/* Bottom Row: 0, Backspace, Clear */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onKeyPress("0")}
          disabled={!isInputPhase || inputLength >= pinLength}
          className={`py-4 rounded-lg font-bold text-xl transition-all transform ${
            isInputPhase && inputLength < pinLength
              ? "bg-cyan-600 hover:bg-cyan-500 hover:scale-105 active:scale-95 cursor-pointer"
              : "bg-slate-700 text-slate-500 cursor-not-allowed opacity-50"
          }`}
        >
          0
        </button>

        <button
          onClick={onBackspace}
          disabled={!isInputPhase || inputLength === 0}
          className={`py-4 rounded-lg font-bold text-lg transition-all transform ${
            isInputPhase && inputLength > 0
              ? "bg-amber-600 hover:bg-amber-500 hover:scale-105 active:scale-95 cursor-pointer"
              : "bg-slate-700 text-slate-500 cursor-not-allowed opacity-50"
          }`}
        >
          ← DEL
        </button>

        <button
          onClick={onClear}
          disabled={!isInputPhase || inputLength === 0}
          className={`py-4 rounded-lg font-bold text-lg transition-all transform ${
            isInputPhase && inputLength > 0
              ? "bg-red-600 hover:bg-red-500 hover:scale-105 active:scale-95 cursor-pointer"
              : "bg-slate-700 text-slate-500 cursor-not-allowed opacity-50"
          }`}
        >
          CLR
        </button>
      </div>

      {/* Physical Keyboard Hint */}
      <p className="text-xs text-slate-500 text-center mt-6">
        💡 Tip: You can also use your keyboard number keys!
      </p>
    </div>
  );
}