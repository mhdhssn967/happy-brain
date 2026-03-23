export default function CircularTimer({ timeLeft, maxTime }) {
  // Calculate percentages
  const progressPercent = (timeLeft / maxTime) * 100
  
  // Determine color based on time remaining
  const getColor = () => {
    if (timeLeft > maxTime * 0.5) return "text-green-400" // > 50%
    if (timeLeft > maxTime * 0.25) return "text-yellow-400" // > 25%
    return "text-red-400" // <= 25%
  }

  // Format time display (minutes:seconds or just seconds)
  const formatTime = () => {
    const totalSeconds = Math.ceil(timeLeft)
    if (totalSeconds <= 0) return "0:00"
    
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }
    return `${seconds}s`
  }

  return (
    <div className="flex justify-center items-center">
      <div className="relative w-32 h-32">
        {/* Background circle */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          {/* Outer circle background */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgb(51, 65, 85)" strokeWidth="3" />
          
          {/* Progress arc */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={
              timeLeft > maxTime * 0.5
                ? "rgb(34, 197, 94)"
                : timeLeft > maxTime * 0.25
                ? "rgb(234, 179, 8)"
                : "rgb(239, 68, 68)"
            }
            strokeWidth="3"
            strokeDasharray={`${(progressPercent / 100) * 282.7} 282.7`}
            strokeDashoffset="0"
            strokeLinecap="round"
            style={{
              transition: "stroke-dasharray 0.1s linear, stroke 0.3s ease",
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
            }}
          />
        </svg>

        {/* Center text */}
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
  )
}