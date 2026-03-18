import { useState } from "react";
import { useATMPinGame } from "./hooks";
import PinDisplay from "./components/PinDisplay";
import Keypad from "./components/Keypad";
import GameSetup from "./components/GameSetup";
import CircularTimer from "./components/CircularTimer";
import ResultOverlay from "./components/ResultOverlay";

export default function ATMPinRecall() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameTime, setGameTime] = useState(0);

  const {
    round,
    phase,
    pin,
    userInput,
    score,
    lives,
    timeLeft,
    pinLength,
    isGameOver,
    gameOverReason,
    analytics,
    handleKeyPress,
    handleBackspace,
    handleClear,
  } = useATMPinGame(gameTime, gameStarted);

  const handleGameStart = (selectedTime) => {
    setGameTime(selectedTime);
    setGameStarted(true);
  };

  if (!gameStarted) {
    return <GameSetup onStart={handleGameStart} gameName="ATM PIN Recall" />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center p-4">
      {isGameOver && (
        <ResultOverlay
          score={score}
          analytics={analytics}
          gameOverReason={gameOverReason}
          round={round}
          gameName="ATM PIN Recall"
        />
      )}

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-2 text-cyan-400">🔐 ATM PIN</h1>
          <p className="text-sm text-slate-400">Memorize. Recall. Succeed.</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          <div className="bg-slate-800 rounded-lg p-3 text-center border border-slate-700">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Level</p>
            <p className="text-2xl font-bold text-cyan-400">{round}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 text-center border border-slate-700">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Score</p>
            <p className="text-2xl font-bold text-amber-400">{score}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 text-center border border-slate-700">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Lives</p>
            <p className="text-2xl font-bold text-red-400">{lives}❤️</p>
          </div>
        </div>

        {/* Timer */}
        <div className="mb-8">
          <CircularTimer timeLeft={timeLeft} maxTime={gameTime} />
        </div>

        {/* PIN Display */}
        <div className="mb-8">
          <PinDisplay phase={phase} pin={pin} userInput={userInput} pinLength={pinLength} />
        </div>

        {/* Phase Message */}
        <div className="mb-8 h-6 text-center">
          {phase === "memorize" && (
            <p className="text-sm font-medium text-amber-400 animate-pulse">👀 Memorize the PIN...</p>
          )}
          {phase === "input" && (
            <p className="text-sm font-medium text-cyan-400">🔑 Enter the PIN</p>
          )}
          {phase === "reveal" && (
            <p className="text-sm font-medium text-green-400">✓ Processing...</p>
          )}
        </div>

        {/* Keypad */}
        <Keypad
          phase={phase}
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onClear={handleClear}
          pinLength={pinLength}
          inputLength={userInput.length}
        />
      </div>
    </div>
  );
}