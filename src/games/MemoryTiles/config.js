/**
 * MemoryTiles Game Configuration
 * Adjust these values to customize gameplay difficulty, timing, and progression
 */

// ============================================
// GAME DIFFICULTY & PROGRESSION
// ============================================

export const TOTAL_ROUNDS = 20;

/**
 * Grid size progression by round
 * @param {number} round - Current round (1-indexed)
 * @returns {number} - Grid dimension (e.g., 2 = 2x2 grid)
 */
export const getGridSize = (round) => {
  // Progression: 2x2 → 3x3 → 4x4 → 4x4 → 4x4
  if (round <= 1) return 2;
  if (round <= 2) return 3;
  if (round <= 5) return 4;
  return 5;
};

/**
 * Number of tiles to memorize by round
 * @param {number} round - Current round
 * @returns {number} - Number of active tiles to show
 */
export const getActiveTileCount = (round) => {
  // Progression: 1 → 2 → 3 → 4 → 5
  // More challenging: can increase up to gridSize²
  return Math.min(round, 8);
};

// ============================================
// TIMING (milliseconds)
// ============================================

// How long to show the pattern during memorize phase
export const MEMORIZE_TIME = 2000;

// How long to show correct tiles during reveal phase
export const REVEAL_TIME = 1000;

// Total time user has to tap tiles during click phase
export const CLICK_TIME_LIMIT = 5000;

// ============================================
// SCORING
// ============================================

export const SCORE_CONFIG = {
  correctTile: 10,          // Points for tapping correct tile
  wrongTile: -5,            // Points deducted for wrong tile
  comboBonus: 2,            // Points multiplier per combo level
  perfectRound: 50,         // Bonus for 100% accuracy in a round
  timeBonus: (timeLeft) => {
    // Bonus based on time remaining (0-10 points)
    return Math.max(0, Math.floor(timeLeft / 500));
  },
};

// ============================================
// GAMIFICATION
// ============================================

export const GAMIFICATION = {
  comboThreshold: 3,        // Combo multiplier triggers after 3 consecutive correct
  streakThreshold: 5,       // Streak milestone
  perfectRoundCelebration: true,  // Show banner on perfect round
};

// ============================================
// DIFFICULTY PRESETS (for future modes)
// ============================================

export const DIFFICULTY_PRESETS = {
  easy: {
    memorizeTime: 3000,
    clickTimeLimit: 6000,
    gridProgression: [2, 2, 3, 3, 4],
    activeTileProgression: [1, 1, 2, 2, 3],
    scoring: {
      correct: 5,
      wrong: -2,
    },
  },
  normal: {
    memorizeTime: 2000,
    clickTimeLimit: 5000,
    gridProgression: [2, 3, 3, 4, 4],
    activeTileProgression: [1, 2, 3, 4, 5],
    scoring: {
      correct: 10,
      wrong: -5,
    },
  },
  hard: {
    memorizeTime: 1500,
    clickTimeLimit: 4000,
    gridProgression: [3, 3, 4, 4, 4],
    activeTileProgression: [2, 3, 5, 6, 8],
    scoring: {
      correct: 15,
      wrong: -10,
    },
  },
  extreme: {
    memorizeTime: 1000,
    clickTimeLimit: 3000,
    gridProgression: [4, 4, 4, 4, 4],
    activeTileProgression: [4, 6, 8, 10, 12],
    scoring: {
      correct: 20,
      wrong: -15,
    },
  },
};

// ============================================
// ANALYTICS THRESHOLDS
// ============================================

export const ANALYTICS = {
  goodReactionTime: 300,    // Under 300ms is considered "fast"
  excellentAccuracy: 90,    // 90%+ is excellent
  goodAccuracy: 70,         // 70%+ is good
  reactionTimeWeight: 0.3,  // How much reaction time affects overall score
  accuracyWeight: 0.7,      // How much accuracy affects overall score
};

// ============================================
// VISUAL & AUDIO SETTINGS
// ============================================

export const VISUAL_SETTINGS = {
  enableParticles: true,    // Show particle effects
  enableFloatingElements: true,
  animationDuration: 500,   // MS for animations
  glowIntensity: 0.4,       // 0 to 1
};

export const AUDIO_SETTINGS = {
  masterVolume: 0.7,
  soundEffects: 0.7,
  feedback: true,           // Play sound on every action
  comboSounds: true,        // Play escalating sounds on combo
};

// ============================================
// ACCESSIBILITY
// ============================================

export const ACCESSIBILITY = {
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  focusIndicators: true,
  colorBlindMode: "none",  // "deuteranopia" | "protanopia" | "tritanopia" | "achromatopsia"
};

// ============================================
// HELPER FUNCTION: Get active preset
// ============================================

export const getDifficultyConfig = (difficulty = "normal") => {
  const preset = DIFFICULTY_PRESETS[difficulty] || DIFFICULTY_PRESETS.normal;
  return {
    memorizeTime: preset.memorizeTime,
    clickTimeLimit: preset.clickTimeLimit,
    getGridSize: (round) => preset.gridProgression[round - 1] || 4,
    getActiveTileCount: (round) => preset.activeTileProgression[round - 1] || 5,
    scoring: preset.scoring,
  };
};

// ============================================
// Validation & Constraints
// ============================================

export const CONSTRAINTS = {
  minGridSize: 2,
  maxGridSize: 6,
  minRounds: 1,
  maxRounds: 20,
  minMemorizeTime: 500,     // At least 500ms
  maxMemorizeTime: 10000,   // At most 10 seconds
};