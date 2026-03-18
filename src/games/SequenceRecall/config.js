/**
 * Sequence Recall Game Configuration
 */

export const LIVES = 10;

// Get memorize time based on level - decreases every 4 rounds
export const getMemorizeTime = (level) => {
  const rounds = Math.floor((level - 1) / 4);
  const baseTime = 8000; // 8 seconds
  const decreasePerRound = 500; // 0.5 seconds
  const newTime = baseTime - (rounds * decreasePerRound);
  return Math.max(newTime, 2000); // Minimum 2 seconds
};

export const SHUFFLE_TIME = 1000;       // 1 second shuffle animation
export const FLIP_BACK_TIME = 500;      // 0.5 seconds to flip back

export const SCORING = {
  correct: 10,
  wrong: -5,
};