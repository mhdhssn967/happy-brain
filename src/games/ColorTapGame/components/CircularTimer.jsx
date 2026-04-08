/**
 * CircularTimer — identical API to the Math Game's CircularTimer.
 * Drop this in color-tap/components/ or import directly from the shared
 * math-game components folder if you prefer a single source of truth.
 */
export default function CircularTimer({ timeLeft, maxTime }) {
  const progressPercent = (timeLeft / maxTime) * 100;

  const getColor = () => {
    if (timeLeft > maxTime * 0.5) return "text-green-400";
    if (timeLeft > maxTime * 0.25) return "text-yellow-400";
    return "text-red-400";
  };

  const getStrokeColor = () => {
    if (timeLeft > maxTime * 0.5) return "rgb(34, 197, 94)";
    if (timeLeft > maxTime * 0.25) return "rgb(234, 179, 8)";
    return "rgb(239, 68, 68)";
  };

  const formatTime = () => {
    const totalSeconds = Math.ceil(timeLeft);
    if (totalSeconds <= 0) return "0:00";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes > 0) return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    return `${seconds}s`;
  };

  const circumference = 2 * Math.PI * 45; // r = 45

  return (
    <div className="flex justify-center items-center">
      <div className="relative w-32 h-32">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          {/* Track */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="rgb(51, 65, 85)"
            strokeWidth="3"
          />
          {/* Progress arc */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={getStrokeColor()}
            strokeWidth="3"
            strokeDasharray={`${(progressPercent / 100) * circumference} ${circumference}`}
            strokeLinecap="round"
            style={{
              transition: "stroke-dasharray 0.1s linear, stroke 0.3s ease",
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
            }}
          />
        </svg>

        {/* Centre text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">
              Time
            </p>
            <p className={`text-3xl font-black ${getColor()} transition-colors`}>
              {formatTime()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}