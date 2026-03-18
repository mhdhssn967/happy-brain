import { useEffect, useState, useRef } from "react";
import { generateSequence, shuffleSequence } from "./engine";
import * as config from "./config";
import { SoundManager } from "../../engine/SoundManager";

export const useSequenceGame = () => {
  const [level, setLevel] = useState(1);
  const [phase, setPhase] = useState("show"); // show | flip | shuffle | play
  const [items, setItems] = useState([]); // Original order
  const [displayItems, setDisplayItems] = useState([]); // Current display order
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.LIVES);
  const [isGameOver, setIsGameOver] = useState(false);
  const [cardFlipped, setCardFlipped] = useState({}); // Track which cards are flipped
  const [userSequence, setUserSequence] = useState([]); // Track user's taps
  const [memorizeTime, setMemorizeTime] = useState(8);
  const [memorizeProgress, setMemorizeProgress] = useState(100); // 0-100 for progress bar

  const [analytics, setAnalytics] = useState({
    totalAttempts: 0,
    correctAttempts: 0,
    wrongAttempts: 0,
    reactionTimes: [],
    averageReactionTime: 0,
    levelsCompleted: 0,
  });

  const levelStartRef = useRef(Date.now());
  const soundManager = SoundManager.getInstance();
  const maxMemorizeTime = config.getMemorizeTime(level);

  // Initialize level
  useEffect(() => {
    startLevel();
  }, [level]);

  // Memorize timer countdown
  useEffect(() => {
    if (phase !== "show") return;

    const totalSeconds = Math.ceil(maxMemorizeTime / 1000);
    setMemorizeTime(totalSeconds);
    setMemorizeProgress(100);

    const interval = setInterval(() => {
      setMemorizeTime(prev => {
        const newTime = prev - 1;
        const progress = (newTime / totalSeconds) * 100;
        setMemorizeProgress(Math.max(progress, 0));
        
        if (newTime <= 0) {
          clearInterval(interval);
          // Flip cards
          const flipped = {};
          items.forEach(item => {
            flipped[item.id] = true;
          });
          setCardFlipped(flipped);
          setPhase("flip");
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, items, maxMemorizeTime]);

  // Flip to shuffle phase
  useEffect(() => {
    if (phase !== "flip") return;

    const timer = setTimeout(() => {
      setPhase("shuffle");
    }, 500);

    return () => clearTimeout(timer);
  }, [phase]);

  // Shuffle animation and flip back
  useEffect(() => {
    if (phase !== "shuffle") return;

    const timer = setTimeout(() => {
      // Shuffle display order
      const shuffled = shuffleSequence(items);
      setDisplayItems(shuffled);

      // Flip back
      const flipped = {};
      items.forEach(item => {
        flipped[item.id] = false;
      });
      setCardFlipped(flipped);
      setPhase("play");
    }, config.SHUFFLE_TIME);

    return () => clearTimeout(timer);
  }, [phase, items]);

  const startLevel = () => {
    // Always 4 images
    const newItems = generateSequence(4, level);
    setItems(newItems);
    setDisplayItems(newItems);  // Set display items immediately
    setPhase("show");
    setCardFlipped({});
    setUserSequence([]);
    levelStartRef.current = Date.now();
  };

  const handleCardTap = (displayedItemId) => {
    if (phase !== "play") return;
    if (userSequence.includes(displayedItemId)) return; // Already tapped

    const reactionTime = Date.now() - levelStartRef.current;
    const newSequence = [...userSequence, displayedItemId];
    setUserSequence(newSequence);

    // Find the card's original position
    const card = items.find(item => item.id === displayedItemId);
    const expectedId = items[newSequence.length - 1]?.id;
    const isCorrect = displayedItemId === expectedId;

    // Mark card state
    setCardFlipped(prev => ({
      ...prev,
      [displayedItemId]: isCorrect ? "correct" : "wrong"
    }));

    if (isCorrect) {
      soundManager.playSound("correct");
      setScore(s => s + 10);

      setAnalytics(prev => ({
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
        correctAttempts: prev.correctAttempts + 1,
        reactionTimes: [...prev.reactionTimes, reactionTime],
        averageReactionTime: calculateAverageReactionTime([
          ...prev.reactionTimes,
          reactionTime,
        ]),
      }));

      // Check if all 4 tapped
      if (newSequence.length === 4) {
        // Level complete! Show SweetAlert2
       import('sweetalert2').then(Swal => {
  Swal.default.fire({
    html: `
      <div style="
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        height:100%;
      ">
        <div style="
          font-size:90px;
          color:white;
          font-weight:900;
        ">
          ✓
        </div>
        <div style="
          margin-top:10px;
          font-size:18px;
          font-weight:700;
          color:white;
        ">
        </div>
      </div>
    `,
    background: '#22C55E',
    color: '#ffffff',
    showConfirmButton: false,
    timer: 500,
    timerProgressBar: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showClass: {
      popup: 'swal2-show',
    },
    hideClass: {
      popup: 'swal2-hide',
    },
    customClass: {
      popup: 'mobile-success-overlay'
    },
    backdrop: false,
    heightAuto: false,
    didClose: () => {
      setLevel(l => l + 1);
    }
  });
});
      }
    } else {
      soundManager.playSound("wrong");
      setScore(s => Math.max(0, s - 5));

      setAnalytics(prev => ({
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
        wrongAttempts: prev.wrongAttempts + 1,
        reactionTimes: [...prev.reactionTimes, reactionTime],
        averageReactionTime: calculateAverageReactionTime([
          ...prev.reactionTimes,
          reactionTime,
        ]),
      }));

      setLives(currentLives => {
        const newLives = currentLives - 1;
        if (newLives <= 0) {
          setIsGameOver(true);
          setAnalytics(prev => ({
            ...prev,
            levelsCompleted: level,
          }));
        }
        return newLives;
      });

      // Retry same level
      setTimeout(() => {
        if (lives - 1 > 0) {
          startLevel();
        }
      }, 800);
    }
  };

  const calculateAverageReactionTime = (times) => {
    if (times.length === 0) return 0;
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  };

  return {
    level,
    phase,
    items,
    displayItems,
    score,
    lives,
    isGameOver,
    handleCardTap,
    analytics,
    cardFlipped,
    userSequence,
    memorizeTime,
    memorizeProgress,
    maxMemorizeTime,
  };
};