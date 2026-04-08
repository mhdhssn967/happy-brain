import { useState, useEffect, useRef, useCallback } from "react";
import {
  generateCircles,
  tickCircles,
  pickTargetColor,
  analyzeCognition,
  getTargetCount,
} from "./engine";
import { POINTS_CORRECT, POINTS_WRONG } from "./config";
import { SoundManager } from "../../engine/SoundManager";

const emptyAnalytics = () => ({
  totalAttempts:       0,
  correctAttempts:     0,
  wrongAttempts:       0,
  reactionTimes:       [],
  averageReactionTime: 0,
  accuracy:            0,
  totalCorrect:        0,
  totalWrong:          0,
  streak:              0,
  maxStreak:           0,
  levelReached:        1,
  correctByLevel:      {},
  wrongByLevel:        {},
});

export const useColorTapGame = (gameTimeMs, gameStarted, arenaSize) => {
  const [level,              setLevel]              = useState(1);
  const [score,              setScore]              = useState(0);
  const [circles,            setCircles]            = useState([]);
  const [targetColor,        setTargetColor]        = useState(null);
  const [remainingTargets,   setRemainingTargets]   = useState(0); // targets still on board
  const [timeLeft,           setTimeLeft]           = useState(gameTimeMs / 1000);
  const [isGameOver,         setIsGameOver]         = useState(false);
  const [showWrongFlash,     setShowWrongFlash]     = useState(false);
  const [poppingIds,         setPoppingIds]         = useState([]);
  const [floats,             setFloats]             = useState([]);
  const [analytics,          setAnalytics]          = useState(emptyAnalytics());
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [levelTransition,    setLevelTransition]    = useState(false); // brief flash between levels

  const levelRef        = useRef(1);
  const scoreRef        = useRef(0);
  const analyticsRef    = useRef(emptyAnalytics());
  const problemStartRef = useRef(Date.now());
  const timerRef        = useRef(null);
  const animRef         = useRef(null);
  const circlesRef      = useRef([]);
  const targetRef       = useRef(null);
  const remainingRef    = useRef(0);      // remaining target circles (ref for animation loop)
  const isGameOverRef   = useRef(false);
  const transitionRef   = useRef(false);  // suppress taps during level transition
  const soundManager    = SoundManager.getInstance();

  useEffect(() => { circlesRef.current = circles; },      [circles]);
  useEffect(() => { targetRef.current  = targetColor; },  [targetColor]);

  /**
   * Spawn a fresh set of circles for a given level.
   * Returns the new target so callers can update refs immediately.
   */
  const spawn = useCallback((lvl, size) => {
    const { w, h } = size;
    const target     = pickTargetColor(lvl);
    const newCircles = generateCircles(lvl, w, h, target);
    const targetCnt  = getTargetCount(lvl);

    setCircles(newCircles);
    setTargetColor(target);
    setRemainingTargets(targetCnt);

    targetRef.current   = target;
    remainingRef.current = targetCnt;
    problemStartRef.current = Date.now();

    return target;
  }, []);

  // ─── Game start / restart ────────────────────────────────────────────────
  useEffect(() => {
    if (!gameStarted || !arenaSize.w || !arenaSize.h) return;

    levelRef.current      = 1;
    scoreRef.current      = 0;
    analyticsRef.current  = emptyAnalytics();
    isGameOverRef.current = false;
    transitionRef.current = false;

    setLevel(1);
    setScore(0);
    setAnalytics(emptyAnalytics());
    setIsGameOver(false);
    setConsecutiveCorrect(0);
    setTimeLeft(gameTimeMs / 1000);
    setLevelTransition(false);

    spawn(1, arenaSize);

    // Count-down timer (100 ms ticks)
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = parseFloat((prev - 0.1).toFixed(2));
        if (next <= 0) {
          clearInterval(timerRef.current);
          isGameOverRef.current = true;
          setIsGameOver(true);
          setAnalytics({ ...analyticsRef.current });
          return 0;
        }
        return next;
      });
    }, 100);

    // Animation loop — only moves circles, does not mutate game state
    const loop = () => {
      if (isGameOverRef.current) return;
      if (!transitionRef.current) {
        setCircles((prev) => tickCircles(prev, arenaSize.w, arenaSize.h));
      }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    return () => {
      clearInterval(timerRef.current);
      cancelAnimationFrame(animRef.current);
    };
  }, [gameStarted, gameTimeMs, arenaSize.w, arenaSize.h]);

  // ─── Tap handler ─────────────────────────────────────────────────────────
  const handleTap = useCallback((circle) => {
    if (isGameOverRef.current || transitionRef.current) return;

    const rt  = Date.now() - problemStartRef.current;
    const lvl = levelRef.current;
    const a   = analyticsRef.current;
    a.totalAttempts++;

    if (circle.color.name === targetRef.current?.name) {
      // ── CORRECT TAP ──────────────────────────────────────────
      soundManager.playSound("correct");

      const newScore      = scoreRef.current + POINTS_CORRECT;
      scoreRef.current    = newScore;
      setScore(newScore);

      a.correctAttempts++;
      a.totalCorrect++;
      a.reactionTimes.push(rt);
      a.averageReactionTime = Math.round(
        a.reactionTimes.reduce((s, v) => s + v, 0) / a.reactionTimes.length
      );
      a.streak++;
      if (a.streak > a.maxStreak) a.maxStreak = a.streak;
      a.accuracy = Math.round((a.correctAttempts / a.totalAttempts) * 100);
      a.correctByLevel[lvl] = (a.correctByLevel[lvl] || 0) + 1;

      // Pop animation + float label
      setPoppingIds((ids) => [...ids, circle.id]);
      setFloats((fs) => [...fs, { id: Date.now(), x: circle.x, y: circle.y }]);
      setTimeout(() => {
        setPoppingIds((ids) => ids.filter((id) => id !== circle.id));
      }, 350);

      setConsecutiveCorrect((c) => c + 1);

      // Decrease remaining target count
      const newRemaining = remainingRef.current - 1;
      remainingRef.current = newRemaining;
      setRemainingTargets(newRemaining);

      // Remove the tapped circle from board
      setCircles((prev) => prev.filter((c) => c.id !== circle.id));

      if (newRemaining <= 0) {
        // ── ALL TARGETS CLEARED → level up ─────────────────────
        transitionRef.current = true;
        setLevelTransition(true);

        setTimeout(() => {
          const newLevel        = lvl + 1;
          levelRef.current      = newLevel;
          a.levelReached        = newLevel;
          setLevel(newLevel);

          spawn(newLevel, arenaSize);

          transitionRef.current = false;
          setLevelTransition(false);
        }, 600); // brief pause so player notices level change
      }

    } else {
      // ── WRONG TAP ────────────────────────────────────────────
      soundManager.playSound("wrong");

      const newScore   = Math.max(0, scoreRef.current - POINTS_WRONG);
      scoreRef.current = newScore;
      setScore(newScore);

      a.wrongAttempts++;
      a.totalWrong++;
      a.streak = 0;
      a.accuracy = Math.round((a.correctAttempts / a.totalAttempts) * 100);
      a.wrongByLevel[lvl] = (a.wrongByLevel[lvl] || 0) + 1;

      setConsecutiveCorrect(0);
      setShowWrongFlash(true);
      setTimeout(() => setShowWrongFlash(false), 350);
    }

    analyticsRef.current = { ...a };
  }, [arenaSize, spawn, soundManager]);

  const removeFloat = useCallback((id) => {
    setFloats((fs) => fs.filter((f) => f.id !== id));
  }, []);

  const cognitiveAnalysis = isGameOver ? analyzeCognition(analytics) : null;

  return {
    level,
    score,
    circles,
    targetColor,
    remainingTargets,
    timeLeft,
    isGameOver,
    showWrongFlash,
    poppingIds,
    floats,
    removeFloat,
    analytics,
    cognitiveAnalysis,
    consecutiveCorrect,
    levelTransition,
    handleTap,
  };
};