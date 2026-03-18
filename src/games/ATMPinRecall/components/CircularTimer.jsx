import { useState, useEffect } from "react";

export default function CircularTimer({ timeLeft, maxTime = 60000 }) {
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    const percentage = (timeLeft / maxTime) * 100;
    setIsWarning(percentage <= 25 && percentage > 10);
    setIsCritical(percentage <= 10);
  }, [timeLeft, maxTime]);

  const radius = 60;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (timeLeft / maxTime) * circumference;
  
  const percentage = (timeLeft / maxTime) * 100;
  
  // Convert milliseconds to MM:SS format
  const totalSeconds = Math.ceil(timeLeft / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const displayTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  // Color based on time remaining
  const getStrokeColor = () => {
    if (isCritical) return "#ff2563";     // Hot pink
    if (isWarning) return "#ffb800";      // Amber
    return "#fbbf24";                     // Yellow (for your game)
  };

  const getGlowColor = () => {
    if (isCritical) return "rgba(255, 37, 99, 0.5)";
    if (isWarning) return "rgba(255, 184, 0, 0.4)";
    return "rgba(251, 191, 36, 0.4)";
  };

  const strokeColor = getStrokeColor();
  const glowColor = getGlowColor();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Timer Container */}
      <div 
        className="relative flex items-center justify-center"
        style={{
          filter: `drop-shadow(0 0 20px ${glowColor})`,
          transition: 'filter 0.3s ease',
        }}
      >
        {/* Outer glow ring */}
        <div
          className="absolute rounded-full"
          style={{
            width: `${radius * 2.6}px`,
            height: `${radius * 2.6}px`,
            border: `1px solid ${strokeColor}`,
            opacity: isCritical ? 0.8 : 0.3,
            animation: isCritical ? 'pulse-glow 1s ease-in-out infinite' : 'none',
            boxShadow: `inset 0 0 15px ${glowColor}`,
          }}
        />

        {/* SVG Circle Progress */}
        <svg 
          height={radius * 2} 
          width={radius * 2} 
          className="transform -rotate-90"
          style={{ zIndex: 10 }}
        >
          {/* Background circle */}
          <circle
            stroke="rgba(255,255,255,0.08)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          
          {/* Progress circle */}
          <circle
            stroke={strokeColor}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            style={{ 
              strokeDashoffset,
              transition: 'stroke-dashoffset 0.1s linear, stroke 0.3s ease',
              filter: `drop-shadow(0 0 4px ${glowColor})`,
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Center content */}
        <div className="absolute flex flex-col items-center justify-center z-20">
          <div className="text-2xl font-bold tracking-tighter"
            style={{
              color: strokeColor,
              textShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}`,
              transition: 'color 0.3s ease, text-shadow 0.3s ease',
              fontFamily: 'Courier New, monospace',
              letterSpacing: '-0.02em',
              minWidth: '80px',
              textAlign: 'center',
            }}
          >
            {displayTime}
          </div>
          <div className="text-xs mt-1 tracking-widest uppercase opacity-50"
            style={{
              color: strokeColor,
              transition: 'color 0.3s ease',
              fontSize: '0.65rem',
              fontWeight: '600',
              letterSpacing: '0.05em',
            }}
          >
            {isCritical ? 'Critical' : isWarning ? 'Warning' : 'Time'}
          </div>
        </div>
      </div>

      {/* Percentage indicator */}
      <div className="text-xs tracking-widest opacity-40 uppercase">
        {Math.round(percentage)}%
      </div>

      {/* Animated styles */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.6;
            box-shadow: inset 0 0 15px ${glowColor}, 0 0 20px ${glowColor};
          }
          50% {
            opacity: 1;
            box-shadow: inset 0 0 25px ${glowColor}, 0 0 35px ${glowColor};
          }
        }
      `}</style>
    </div>
  );
}