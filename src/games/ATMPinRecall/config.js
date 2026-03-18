// Phase Timings (in milliseconds)
export const MEMORIZE_TIME = 4000;      // Show PIN for 4 seconds
export const REVEAL_TIME = 1500;         // Show correct/wrong feedback
export const WRONG_FEEDBACK_TIME = 800;  // Flash wrong message

// Default Game Times (in milliseconds)
export const MIN_GAME_TIME = 30000;
export const DEFAULT_GAME_TIME = 300000; // 5 minutes
export const MAX_GAME_TIME = 3600000;
export const TIME_INCREMENT = 30000;

// Difficulty progression
export const DIFFICULTY_PROGRESSION = {
  // Rounds 1-4: 3 digits
  // Rounds 5-8: 4 digits
  // Rounds 9+: 5 digits (max)
};

export const getPinLength = (round) => {
  if (round <= 4) return 3;
  if (round <= 8) return 4;
  return 5;
};

// Scoring
export const CORRECT_PIN_POINTS = 50;
export const WRONG_PIN_PENALTY = 10;
export const ROUND_BONUS_MULTIPLIER = 1.1;

// UI/UX
export const TIMER_WARNING_THRESHOLD = 0.25;
export const TIMER_CRITICAL_THRESHOLD = 0.10;

// Lives
export const STARTING_LIVES = 5;