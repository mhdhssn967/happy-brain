import { useState } from "react";
import { useMemoryGame } from "./hooks";
import Grid from "./components/Grid";
import { SoundManager } from "../../engine/SoundManager";
import Tile from "./components/Tile";
import ResultOverlay from "./components/ResultOverlay";
import CircularTimer from "./components/CircularTimer";
import GameSetup from "./components/GameSetup";

export default function MemoryTiles() {
  // Game state - when user clicks start, these get set
  const [gameStarted, setGameStarted] = useState(false);
  const [gameTime, setGameTime] = useState(0);

  // Pass BOTH parameters to the hook
  const { 
    tiles, 
    phase, 
    round, 
    score, 
    lives,
    timeLeft,
    size, 
    activeTiles, 
    handleClick, 
    isGameOver,
    gameOverReason,
    analytics,
  } = useMemoryGame(gameTime, gameStarted);

  const soundManager = SoundManager.getInstance();

  // Handle game start from GameSetup
  const handleGameStart = (selectedTime) => {
    setGameTime(selectedTime);
    setGameStarted(true);
  };

  // Show setup screen if game hasn't started
  if (!gameStarted) {
    return <GameSetup onStart={handleGameStart} />;
  }

  // Render lives as stars
  const renderLives = () => {
    const stars = [];
    for (let i = 0; i < 10; i++) {
      stars.push(
        <div
          key={i}
          className={`text-lg transition-all duration-300 ${
            i < lives ? "opacity-100" : "opacity-20"
          }`}
        >
          {i < lives ? "⭐" : "☆"}
        </div>
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans flex flex-col items-center p-4">
      {isGameOver && (
        <ResultOverlay 
          score={score} 
          analytics={analytics} 
          gameOverReason={gameOverReason} 
          round={round} 
        />
      )}

      <div className="w-full max-w-md flex flex-col items-center">
        {/* Header Section */}
        <div className="w-full flex flex-col gap-4 mb-8 mt-4">
          {/* Top Row: Round and Score */}
          <div className="w-full flex justify-between items-center bg-slate-800/50 rounded-2xl p-4 border border-white/5">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Level</p>
              <p className="text-2xl font-bold text-blue-400">{round}</p>
            </div>

            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Tiles</p>
              <p className="text-2xl font-bold text-cyan-400">{size}x{size}</p>
            </div>

            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Score</p>
              <p className="text-2xl font-bold text-amber-400">{score}</p>
            </div>
          </div>

          {/* Timer - Now using actual timeLeft from hook */}
          <CircularTimer timeLeft={timeLeft} maxTime={gameTime} />
        </div>

        {/* Guidance Text */}
        <div className="mb-6 h-8">
          <p className={`text-sm font-medium tracking-wide uppercase transition-all
            ${phase === 'memorize' ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`}>
            {phase === 'memorize' ? '👀 Watch Carefully' : 'Tap Now!'}
          </p>
        </div>

        {/* The Grid Container */}
        <div className="w-full aspect-square bg-slate-900/40 p-4 rounded-[2rem] border border-white/5 shadow-inner">
          <div 
            className="grid gap-3 h-full w-full"
            style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
          >
            {tiles.map(tile => (
              <Tile
                key={tile.id}
                tile={tile}
                phase={phase}
                isMemorizePhase={phase === "memorize"}
                isActive={activeTiles.includes(tile.id)}
                onClick={() => handleClick(tile.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}