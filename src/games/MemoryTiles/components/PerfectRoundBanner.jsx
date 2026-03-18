import { useEffect, useState } from "react";

export default function PerfectRoundBanner() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className={`
      fixed top-8 left-1/2 transform -translate-x-1/2 z-50
      transition-all duration-500 ${animate ? "scale-100 opacity-100" : "scale-0 opacity-0"}
    `}>
      <div className="relative">
        {/* Glow background */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full blur-xl opacity-50 animate-pulse" />
        
        {/* Main banner */}
        <div className="relative bg-gradient-to-r from-emerald-400 to-cyan-400 px-8 py-4 rounded-full shadow-2xl border-2 border-emerald-300">
          <div className="flex items-center gap-3 justify-center">
            <span className="text-2xl animate-bounce">✨</span>
            <div className="text-center">
              <div className="font-black text-emerald-900 text-lg tracking-wider">PERFECT!</div>
            </div>
            <span className="text-2xl animate-bounce" style={{ animationDelay: "0.2s" }}>✨</span>
          </div>
        </div>

        {/* Particle burst effect */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-emerald-300 rounded-full"
            style={{
              left: "50%",
              top: "50%",
              animation: `burst 1s ease-out forwards`,
              animationDelay: `${i * 30}ms`,
              "--tx": `${Math.cos((i / 12) * Math.PI * 2) * 60}px`,
              "--ty": `${Math.sin((i / 12) * Math.PI * 2) * 60}px`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes burst {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}