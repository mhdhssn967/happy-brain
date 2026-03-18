import { SoundManager } from "../../../engine/SoundManager";

export default function Tile({
  tile,
  isMemorizePhase,
  isActive,
  onClick,
  phase
}) {
  const soundManager = SoundManager.getInstance();

  // When tile should be face up
  const isFlipped =
    (isMemorizePhase && isActive) ||
    (phase === "reveal" && isActive) ||
    tile.status !== null;

  const handleClick = () => {
    if (phase !== "click" || tile.status !== null) return;

    const isCorrect = isActive;

    if (isCorrect) {
      soundManager.playSound("correct");
    } else {
      soundManager.playSound("wrong");
    }

    onClick(tile.id);
  };

  return (
    <div
      className="aspect-square cursor-pointer perspective"
      onClick={handleClick}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* FRONT (Hidden Side) */}
        <div
          className="
            absolute w-full h-full rounded-xl
            bg-slate-800 border-b-4 border-slate-950
            shadow-lg
            backface-hidden
          "
        />

        {/* BACK (Revealed Side) */}
        <div
          className={`
            absolute w-full h-full rounded-xl
            flex items-center justify-center border-b-4
            shadow-lg backface-hidden rotate-y-180
            transition-all duration-500
            ${isActive && isMemorizePhase
              ? "bg-yellow-400 border-yellow-600 glow-yellow"
              : ""}
            ${tile.status === "correct" || (phase === "reveal" && isActive)
              ? "bg-yellow-400 border-yellow-600 glow-yellow"
              : ""}
            ${tile.status === "wrong"
              ? "bg-red-500 border-red-700 glow-red"
              : ""}
          `}
        />
      </div>

      <style>{`
        .perspective {
          perspective: 1000px;
        }

        .transform-style {
          transform-style: preserve-3d;
        }

        .rotate-y-180 {
          transform: rotateY(180deg);
        }

        .backface-hidden {
          backface-visibility: hidden;
        }

        .glow-yellow {
          box-shadow: 0 0 20px rgba(250, 204, 21, 0.5),
                      inset 0 0 10px rgba(255, 255, 255, 0.1);
          animation: subtle-glow-yellow 2s ease-in-out infinite;
        }

        .glow-red {
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.5),
                      inset 0 0 10px rgba(255, 255, 255, 0.1);
          animation: subtle-glow-red 2s ease-in-out infinite;
        }

        @keyframes subtle-glow-yellow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(250, 204, 21, 0.5),
                        inset 0 0 10px rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(250, 204, 21, 0.7),
                        inset 0 0 15px rgba(255, 255, 255, 0.2);
          }
        }

        @keyframes subtle-glow-red {
          0%, 100% {
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.5),
                        inset 0 0 10px rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(239, 68, 68, 0.7),
                        inset 0 0 15px rgba(255, 255, 255, 0.2);
          }
        }
      `}</style>
    </div>
  );
}