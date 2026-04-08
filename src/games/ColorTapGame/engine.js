/**
 * Color Tap Game Engine — Level-Based Rewrite
 *
 * Level design:
 *  - Each level: player must tap ALL circles matching the target colour
 *  - Clearing all target circles → next level
 *  - Each level adds more circles and increases speed
 *  - Circles bounce inside arena bounds (never escape)
 */

export const COLORS = [
  { name: "Red",    hex: "#ef4444" },
  { name: "Blue",   hex: "#3b82f6" },
  { name: "Green",  hex: "#22c55e" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Orange", hex: "#f97316" },
  { name: "Pink",   hex: "#ec4899" },
  { name: "Teal",   hex: "#14b8a6" },
];

/**
 * Total circle count for a level.
 *
 * Level:  1   2   3   4   5   6   7   8   9  10+
 * Count:  4   5   5   6   7   7   8   9  10  ...→16
 */
export const getCircleCount = (level) => {
  const counts = [4, 5, 5, 6, 7, 7, 8, 9, 10, 11];
  if (level <= counts.length) return counts[level - 1];
  return Math.min(11 + (level - counts.length), 16);
};

/**
 * Movement speed (pixels per frame) for a level.
 * Starts gentle, ramps up meaningfully each level.
 */
export const getSpeed = (level) =>
  0.5 + (level - 1) * 0.3;

/**
 * How many distinct colours can appear at this level.
 * Fewer colours at low levels = easier discrimination.
 */
export const getColorVariety = (level) => {
  if (level <= 2) return 3;
  if (level <= 4) return 4;
  if (level <= 6) return 5;
  if (level <= 9) return 6;
  return Math.min(level - 2, COLORS.length);
};

/**
 * How many circles will share the target colour (the ones to tap).
 *
 * Level:  1   2   3   4   5   6   7   8+
 * Targets:1   1   2   2   3   3   4   5
 *
 * Always at least 1, always leaves at least 1 distractor.
 */
export const getTargetCount = (level) => {
  const raw = Math.floor((level + 1) / 2); // 1,1,2,2,3,3,4,4,...
  const total = getCircleCount(level);
  // Keep at least 1 distractor so the level isn't trivially obvious
  return Math.min(raw, total - 1, 5);
};

/**
 * Pick a random colour from the pool available at this level.
 */
export const pickTargetColor = (level) => {
  const pool = COLORS.slice(0, getColorVariety(level));
  return pool[Math.floor(Math.random() * pool.length)];
};

/**
 * Generate a full set of circles for a level.
 *
 * Guarantees:
 *  - Exactly `targetCount` circles have the target colour.
 *  - Remaining circles use OTHER colours (no accidental extra targets).
 *  - All circles start inside arena bounds.
 *  - No two circles spawn on top of each other (simple rejection).
 */
export const generateCircles = (level, arenaWidth, arenaHeight, targetColor) => {
  // Safety: if targetColor wasn't provided yet, pick one automatically
  if (!targetColor) targetColor = pickTargetColor(level);

  const count       = getCircleCount(level);
  const speed       = getSpeed(level);
  const variety     = getColorVariety(level);
  const targetCount = getTargetCount(level);
  const r           = 28;

  // Colour pools
  const allPool   = COLORS.slice(0, variety);
  const otherPool = allPool.filter((c) => c.name !== targetColor.name);
  // Fallback: if there's only 1 colour in pool, other = all
  const distractorPool = otherPool.length > 0 ? otherPool : allPool;

  const circles = [];
  const maxAttempts = 200;

  const overlaps = (nx, ny) =>
    circles.some((c) => Math.hypot(c.x - nx, c.y - ny) < r * 2.2);

  const place = (color) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const x = r + Math.random() * (arenaWidth - r * 2);
      const y = r + Math.random() * (arenaHeight - r * 2);
      if (!overlaps(x, y)) {
        const angle = Math.random() * Math.PI * 2;
        const s = speed * (0.75 + Math.random() * 0.5);
        circles.push({
          id: circles.length,
          r,
          x,
          y,
          vx: Math.cos(angle) * s,
          vy: Math.sin(angle) * s,
          color,
        });
        return;
      }
    }
    // If we can't find non-overlapping spot just place anyway
    const x = r + Math.random() * (arenaWidth - r * 2);
    const y = r + Math.random() * (arenaHeight - r * 2);
    const angle = Math.random() * Math.PI * 2;
    const s = speed * (0.75 + Math.random() * 0.5);
    circles.push({ id: circles.length, r, x, y, vx: Math.cos(angle) * s, vy: Math.sin(angle) * s, color });
  };

  // Place target-coloured circles first
  for (let i = 0; i < targetCount; i++) {
    place(targetColor);
  }

  // Fill rest with distractors
  for (let i = targetCount; i < count; i++) {
    const color = distractorPool[Math.floor(Math.random() * distractorPool.length)];
    place(color);
  }

  return circles;
};

/**
 * Move all circles one animation tick.
 * Boundaries are clamped so circles NEVER escape the arena.
 */
export const tickCircles = (circles, arenaWidth, arenaHeight) => {
  return circles.map((c) => {
    let { x, y, vx, vy, r } = c;

    x += vx;
    y += vy;

    // Left / right walls
    if (x - r < 0) {
      x = r;
      vx = Math.abs(vx);
    } else if (x + r > arenaWidth) {
      x = arenaWidth - r;
      vx = -Math.abs(vx);
    }

    // Top / bottom walls
    if (y - r < 0) {
      y = r;
      vy = Math.abs(vy);
    } else if (y + r > arenaHeight) {
      y = arenaHeight - r;
      vy = -Math.abs(vy);
    }

    return { ...c, x, y, vx, vy };
  });
};

/**
 * Calculate cognitive score from analytics (0–100)
 */
export const analyzeCognition = (analytics) => {
  const { correctAttempts, totalAttempts, reactionTimes, maxStreak, levelReached } = analytics;

  const accuracy = totalAttempts > 0
    ? Math.round((correctAttempts / totalAttempts) * 100)
    : 0;
  const avgRT = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;

  const discriminationScore =
    accuracy >= 90 ? 30 : accuracy >= 75 ? 25 : accuracy >= 60 ? 20 :
    accuracy >= 50 ? 15 : accuracy >= 40 ? 10 : 5;

  const speedScore =
    avgRT < 500 ? 30 : avgRT < 1000 ? 25 : avgRT < 2000 ? 20 :
    avgRT < 3000 ? 15 : avgRT < 5000 ? 10 : 5;

  const attentionScore =
    maxStreak >= 15 ? 20 : maxStreak >= 10 ? 15 : maxStreak >= 7 ? 12 :
    maxStreak >= 5 ? 8  : maxStreak >= 3  ? 5  : 2;

  const progressionScore =
    levelReached >= 10 ? 20 : levelReached >= 7 ? 15 : levelReached >= 5 ? 12 :
    levelReached >= 3  ? 8  : levelReached >= 2 ? 5  : 2;

  const total = Math.min(100, discriminationScore + speedScore + attentionScore + progressionScore);

  return {
    total,
    factors: {
      discrimination: { score: discriminationScore, max: 30, label: "Visual Discrimination" },
      speed:          { score: speedScore,          max: 30, label: "Processing Speed" },
      attention:      { score: attentionScore,      max: 20, label: "Sustained Attention" },
      progression:    { score: progressionScore,    max: 20, label: "Cognitive Progression" },
    },
    accuracy,
    avgRT,
  };
};

export const getAssessmentLevel = (score) => {
  if (score >= 85) return { level: "Excellent",        color: "text-green-400",  bg: "bg-green-500/10" };
  if (score >= 70) return { level: "Good",             color: "text-blue-400",   bg: "bg-blue-500/10" };
  if (score >= 55) return { level: "Fair",             color: "text-yellow-400", bg: "bg-yellow-500/10" };
  return             { level: "Needs Improvement", color: "text-red-400",    bg: "bg-red-500/10" };
};

/** Legacy stub — target presence is guaranteed at generateCircles time. */
export const ensureTargetPresent = (circles, _targetColor) => circles;