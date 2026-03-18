import { getPinLength } from "./config";

export const generatePin = (length) => {
  let pin = "";
  for (let i = 0; i < length; i++) {
    pin += Math.floor(Math.random() * 10);
  }
  return pin;
};

export const validatePin = (userPin, correctPin) => {
  return userPin === correctPin;
};

export const getRoundDifficulty = (round) => {
  return {
    pinLength: getPinLength(round),
    displayTime: 4000, // Always 4 seconds to memorize
  };
};

export const formatTime = (ms) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const calculateScore = (isCorrect, reactionTime) => {
  if (!isCorrect) return -10;
  
  let baseScore = 50;
  if (reactionTime < 2000) baseScore += 20;  // Bonus for fast recall
  if (reactionTime < 1000) baseScore += 30;  // Extra bonus for very fast
  
  return baseScore;
};