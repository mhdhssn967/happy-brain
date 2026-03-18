import { useEffect, useState } from "react";

export default function ComboIndicator({ combo }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, [combo]);

  return (
    <div className={`
      fixed bottom-20 left-1/2 transform -translate-x-1/2 pointer-events-none
      transition-all duration-300 ${show ? "scale-100 opacity-100" : "scale-0 opacity-0"}
    `}>
      <div className="relative">
        {/* Outer pulsing ring */}
        <div className="absolute inset-0 rounded-full bg-amber-400/30 animate-ping" 
          style={{ 
            width: "80px", 
            height: "80px",
            left: "-40px",
            top: "-40px"
          }} 
        />

        {/* Main combo display */}
        <div className="relative bg-gradient-to-br from-amber-400 to-amber-500 rounded-full w-20 h-20 flex items-center justify-center shadow-2xl border-2 border-amber-300 drop-shadow-lg">
          <div className="text-center">
            <div className="text-sm font-black text-amber-900">x{combo}</div>
            <div className="text-[10px] font-bold text-amber-900 tracking-wider">COMBO</div>
          </div>
        </div>

        {/* Floating stars around combo */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-xl animate-pulse"
            style={{
              left: `${50 + 35 * Math.cos((i / 3) * Math.PI * 2)}px`,
              top: `${50 + 35 * Math.sin((i / 3) * Math.PI * 2)}px`,
              animationDelay: `${i * 0.1}s`,
              animation: `orbit 2s linear infinite`,
            }}
          >
            ⭐
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(35px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(35px) rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
}