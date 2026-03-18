import { useState } from "react";

export default function SequenceCard({ item, isFlipped, state, onTap, canTap }) {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleClick = () => {
    if (canTap) {
      onTap(item.id);
    }
  };

  return (
    <div 
      className="relative w-full h-full cursor-pointer group"
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Order number circle - top right - Only show when not flipped and not in wrong/correct state */}
      {!isFlipped && state === undefined && (
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-400 border-2 border-yellow-600 rounded-full flex items-center justify-center font-black text-sm text-yellow-900 z-20">
          {item.position + 1}
        </div>
      )}

      {/* Card */}
      <div
        className={`
          relative w-full h-full rounded-xl border-4 border-slate-700 transition-all duration-300
          ${isFlipped ? "[transform:rotateY(180deg)]" : ""}
          ${isPressed && canTap ? "scale-95 shadow-inner" : ""}
        `}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : isPressed && canTap ? "scale(0.95)" : "scale(1)",
        }}
      >
        {/* Front - Image */}
        <div
          className="absolute inset-0 rounded-xl bg-white border-4 border-slate-700 flex items-center justify-center overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={`/assets/images/sequence/${item.imageNum}.svg`}
            alt="sequence"
            className="w-4/5 h-4/5 object-contain"
          />
        </div>

        {/* Back - Card Back */}
        <div
          className="absolute inset-0 rounded-xl bg-slate-700 border-4 border-slate-600 flex items-center justify-center text-5xl font-black text-slate-500"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          ?
        </div>

        {/* Overlay - Green for correct */}
        {state === "correct" && (
          <div className="absolute inset-0 bg-emerald-500/60 rounded-xl flex items-center justify-center z-10 pointer-events-none animate-pulse">
          </div>
        )}

        {/* Overlay - Red for wrong with shake */}
        {state === "wrong" && (
          <div className="absolute inset-0 bg-red-500/60 rounded-xl flex items-center justify-center z-10 pointer-events-none animate-shake">
            <div className="text-5xl font-black text-white drop-shadow-lg">✗</div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotateZ(0deg); }
          25% { transform: translateX(-8px) rotateZ(-2deg); }
          75% { transform: translateX(8px) rotateZ(2deg); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}