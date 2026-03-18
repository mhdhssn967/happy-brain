import { formatTime } from "../engine";

export default function TimerDisplay({ timeLeft, totalTime, isWarning, isCritical }) {
  const percentage = (timeLeft / totalTime) * 100;

  return (
    <div className="w-full">
      <div className="relative flex justify-center mb-4">
        <div className={`absolute w-32 h-32 rounded-full blur-2xl -inset-2 animate-pulse ${
          isCritical ? 'bg-red-600/30' : isWarning ? 'bg-amber-600/30' : 'bg-cyan-600/30'
        }`} />

        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="55"
              fill="none"
              stroke="rgba(100, 116, 139, 0.2)"
              strokeWidth="8"
            />
            
            <circle
              cx="60"
              cy="60"
              r="55"
              fill="none"
              stroke={
                isCritical
                  ? "url(#criticalGradient)"
                  : isWarning
                  ? "url(#warningGradient)"
                  : "url(#normalGradient)"
              }
              strokeWidth="8"
              strokeDasharray={`${(percentage / 100) * 345.6} 345.6`}
              strokeLinecap="round"
              className="transition-all duration-100"
            />
            
            <defs>
              <linearGradient id="normalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#06b6d4", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#0ea5e9", stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="warningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#f59e0b", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#d97706", stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="criticalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#ef4444", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#dc2626", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>

          <div className="text-center">
            <p className={`text-4xl font-black font-mono transition-all duration-100 ${
              isCritical
                ? 'text-red-400 animate-pulse'
                : isWarning
                ? 'text-amber-400'
                : 'text-cyan-300'
            }`}>
              {formatTime(timeLeft)}
            </p>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mt-1">
              Time
            </p>
          </div>
        </div>
      </div>

      <div className="relative h-2 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/50">
        <div
          className={`h-full rounded-full transition-all duration-100 ${
            isCritical
              ? 'bg-gradient-to-r from-red-500 to-red-600'
              : isWarning
              ? 'bg-gradient-to-r from-amber-500 to-amber-600'
              : 'bg-gradient-to-r from-cyan-500 to-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-3 text-center">
        <p className={`text-xs uppercase tracking-widest font-bold transition-all ${
          isCritical
            ? 'text-red-400'
            : isWarning
            ? 'text-amber-400'
            : 'text-slate-400'
        }`}>
          {isCritical && "⚠️ CRITICAL TIME LOW"}
          {isWarning && !isCritical && "⏰ TIME RUNNING OUT"}
          {!isWarning && "Time Remaining"}
        </p>
      </div>
    </div>
  );
}