/**
 * Reusable Timer Component
 * Can be used across all games for displaying countdown/timer
 * Features: Circular progress, glow effects, configurable size and colors
 */

export default function Timer({ 
  timeLeft, 
  totalTime, 
  size = "md",
  glowColor = "cyan",
  variant = "circular" // "circular" or "linear"
}) {
  // Size presets
  const sizes = {
    sm: { radius: 30, stroke: 3, textSize: "text-lg" },
    md: { radius: 50, stroke: 5, textSize: "text-2xl" },
    lg: { radius: 80, stroke: 8, textSize: "text-4xl" },
  };

  const sizeConfig = sizes[size] || sizes.md;
  const { radius, stroke, textSize } = sizeConfig;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (timeLeft / totalTime) * circumference;

  // Color variants
  const glowColors = {
    cyan: "rgba(34,211,238,0.4)",
    green: "rgba(34,197,94,0.4)",
    amber: "rgba(251,146,60,0.4)",
    red: "rgba(239,68,68,0.4)",
    purple: "rgba(168,85,247,0.4)",
  };

  const strokeColors = {
    cyan: "#22d3ee",
    green: "#22c55e",
    amber: "#fb923c",
    red: "#ef4444",
    purple: "#a855f7",
  };

  const glowColor_ = glowColors[glowColor] || glowColors.cyan;
  const strokeColor = strokeColors[glowColor] || strokeColors.cyan;

  // Show warning when time is low
  const isLowTime = timeLeft <= totalTime * 0.25;
  const warningClass = isLowTime ? "animate-pulse" : "";

  if (variant === "linear") {
    return (
      <div className="w-full space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">Time Remaining</span>
          <span className={`text-lg font-bold ${isLowTime ? "text-red-400" : "text-white"} ${warningClass}`}>
            {Math.ceil(timeLeft / 1000)}s
          </span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div
            className={`h-full transition-all duration-300 ${
              isLowTime 
                ? "bg-gradient-to-r from-red-500 to-red-400" 
                : "bg-gradient-to-r from-cyan-500 to-blue-500"
            }`}
            style={{ width: `${(timeLeft / totalTime) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center filter drop-shadow-[0_0_8px_${glowColor_}] ${warningClass}`}>
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="rgba(255,255,255,0.05)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={strokeColor}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          style={{ 
            strokeDashoffset, 
            transition: 'stroke-dashoffset 100ms linear',
            filter: `drop-shadow(0 0 6px ${strokeColor})`
          }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <span className={`absolute font-bold tracking-tighter text-white ${textSize} ${isLowTime ? "text-red-400" : ""}`}>
        {Math.ceil(timeLeft / 1000)}
      </span>
    </div>
  );
}