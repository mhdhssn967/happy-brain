/**
 * Math Game Configuration
 */

export const LIVES = 10; // 10 lives total
export const MEMORIZE_TIME = 2000; // 2 seconds before showing answer input

// Get operation type based on level
export const getOperationType = (level) => {
  if (level <= 5) return "addition";      // Levels 1-5: Addition
  if (level <= 10) return "subtraction";  // Levels 6-10: Subtraction
  if (level <= 15) return "multiplication"; // Levels 11-15: Multiplication
  return "division";                      // Levels 16+: Division
};

// Get difficulty multiplier based on level
export const getDifficultyMultiplier = (level) => {
  return Math.min(Math.ceil(level / 5), 4); // 1x, 2x, 3x, 4x
};

// Get number range based on level and operation
export const getNumberRange = (level, operationType) => {
  const multiplier = getDifficultyMultiplier(level);
  
  switch (operationType) {
    case "addition":
      return { min: 1, max: 10 * multiplier };
    case "subtraction":
      return { min: 1, max: 20 * multiplier };
    case "multiplication":
      return { min: 1, max: 12 * multiplier };
    case "division":
      return { min: 1, max: 12 * multiplier };
    default:
      return { min: 1, max: 10 };
  }
};

export const SCORING = {
  correct: 10,
  wrong: -5,
};

export const SHOW_QUESTION_TIME = 2000; // Show problem for 2 seconds before hiding