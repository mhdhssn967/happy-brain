import { useEffect, useState, useRef } from "react";
import { generateTiles, pickRandomTiles } from "./engine";
import * as config from "./config";

export const useMemoryGame = (gameTimeMs, gameStarted) => {
  // Game State
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState("memorize");
  const [tiles, setTiles] = useState([]);
  const [activeTiles, setActiveTiles] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(10); // 10 lives (stars)
  const [timeLeft, setTimeLeft] = useState(gameTimeMs);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState("");

  // Analytics
  const [analytics, setAnalytics] = useState({
    totalAttempts: 0,
    correctAttempts: 0,
    wrongAttempts: 0,
    reactionTimes: [],
    averageReactionTime: 0,
    accuracyPerRound: [],
    tilesTappedPerRound: [],
    levelsCompleted: 0,
  });

  // References for tracking
  const roundStartTimeRef = useRef(Date.now());
  const roundTilesClickedRef = useRef(0);
  const roundCorrectClicksRef = useRef(0);
  const reactionTimesRef = useRef([]);
  const firstClickTimeRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const matchedTilesRef = useRef(new Set());

  // Calculate grid size based on round
  const getGridSize = (roundNum) => {
    if (roundNum <= 2) return 2;
    if (roundNum <= 8) return 3;
    if (roundNum <= 15) return 4;
    if (roundNum <= 20) return 5;
    if (roundNum <= 35) return 6;
    if (roundNum <= 45) return 7;
    if (roundNum <= 70) return 8;
    return 9;
  };

  // Calculate active tiles (gradually increase)
  const getActiveTileCount = (roundNum) => {
    const baseCount = Math.ceil(roundNum / 5);
    return Math.min(baseCount + 1, 15);
  };

  const size = getGridSize(round);
  const activeCount = getActiveTileCount(round);

  // Initialize game when it starts
  useEffect(() => {
    if (gameStarted && gameTimeMs > 0) {
      setTimeLeft(gameTimeMs);
      setLives(10);
      setScore(0);
      setRound(1);
      startRound();
    }
  }, [gameStarted, gameTimeMs]);

  // Timer countdown effect - ONLY runs when game is active
  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 100; // Decrement by 100ms
        if (newTime <= 0) {
          setIsGameOver(true);
          setGameOverReason("timeUp");
          return 0;
        }
        return newTime;
      });
    }, 100);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [gameStarted, isGameOver]);

  // Start new round
  useEffect(() => {
    if (round > 1 && !isGameOver && gameStarted) {
      startRound();
    }
  }, [round]);

  const startRound = () => {
    const newTiles = generateTiles(size);
    const selected = pickRandomTiles(newTiles, activeCount);

    setTiles(newTiles);
    setActiveTiles(selected);
    setPhase("memorize");
    matchedTilesRef.current = new Set();

    // Reset round tracking
    roundStartTimeRef.current = Date.now();
    roundTilesClickedRef.current = 0;
    roundCorrectClicksRef.current = 0;
    reactionTimesRef.current = [];
    firstClickTimeRef.current = null;

    // Start click phase after memorize time
    setTimeout(() => {
      setPhase("click");
    }, config.MEMORIZE_TIME);
  };

  const triggerReveal = () => {
    setPhase("reveal");

    // Calculate round accuracy
    const totalClicks = roundCorrectClicksRef.current;
    const accuracy = totalClicks > 0 ? (roundCorrectClicksRef.current / totalClicks) * 100 : 0;

    // Update analytics
    setAnalytics(prev => ({
      ...prev,
      accuracyPerRound: [...prev.accuracyPerRound, Math.round(accuracy)],
      tilesTappedPerRound: [...prev.tilesTappedPerRound, roundTilesClickedRef.current],
      reactionTimes: [...prev.reactionTimes, ...reactionTimesRef.current],
      averageReactionTime: calculateAverageReactionTime([
        ...prev.reactionTimes,
        ...reactionTimesRef.current
      ]),
      levelsCompleted: round,
    }));

    // Move to next round
    setTimeout(() => {
      setRound(r => r + 1);
    }, config.REVEAL_TIME);
  };

  const retryPattern = () => {
    const newTiles = generateTiles(size);
    const newSelected = pickRandomTiles(newTiles, activeCount);

    setTiles(newTiles);
    setActiveTiles(newSelected);
    setPhase("memorize");
    matchedTilesRef.current = new Set();

    // Reset tracking
    reactionTimesRef.current = [];
    firstClickTimeRef.current = null;
    roundTilesClickedRef.current = 0;
    roundCorrectClicksRef.current = 0;

    setTimeout(() => {
      setPhase("click");
    }, config.MEMORIZE_TIME);
  };

  const calculateAverageReactionTime = (times) => {
    if (times.length === 0) return 0;
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  };

  const handleClick = (id) => {
    if (phase !== "click" || tiles.find(t => t.id === id)?.status !== null) return;
    if (timeLeft <= 0) return;

    if (firstClickTimeRef.current === null) {
      firstClickTimeRef.current = Date.now();
    }

    const reactionTime = Date.now() - roundStartTimeRef.current;
    reactionTimesRef.current.push(reactionTime);

    const isCorrect = activeTiles.includes(id);
    roundTilesClickedRef.current++;

    if (isCorrect) {
      roundCorrectClicksRef.current++;
      matchedTilesRef.current.add(id);
      setScore(s => s + 10);

      setAnalytics(prev => ({
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
        correctAttempts: prev.correctAttempts + 1,
      }));

      setTiles(prev => prev.map(tile => 
        tile.id === id ? { ...tile, status: "correct" } : tile
      ));

      // Check if all tiles are matched
      setTimeout(() => {
        if (matchedTilesRef.current.size === activeTiles.length) {
          triggerReveal();
        }
      }, 100);
    } else {
      // Wrong tile - lose a life
      const newLives = lives - 1;
      setLives(newLives);
      setScore(s => Math.max(0, s - 5));

      setAnalytics(prev => ({
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
        wrongAttempts: prev.wrongAttempts + 1,
      }));

      setTiles(prev => prev.map(tile => 
        tile.id === id ? { ...tile, status: "wrong" } : tile
      ));

      // Check if game over (no lives left)
      if (newLives <= 0) {
        setTimeout(() => {
          setIsGameOver(true);
          setGameOverReason("noLives");
        }, config.WRONG_FEEDBACK_TIME);
      } else {
        // Retry the pattern
        setTimeout(() => {
          retryPattern();
        }, config.WRONG_FEEDBACK_TIME);
      }
    }
  };

  return {
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
  };
};