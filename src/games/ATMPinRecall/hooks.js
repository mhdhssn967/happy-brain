import { useEffect, useState, useRef } from "react";
import { generatePin, validatePin, formatTime } from "./engine";
import { getPinLength } from "./config";
import * as config from "./config";

export const useATMPinGame = (gameTimeMs, gameStarted) => {
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState("memorize"); // memorize, input, reveal, gameover
  const [pin, setPin] = useState("");
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.STARTING_LIVES);
  const [timeLeft, setTimeLeft] = useState(gameTimeMs);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState("");

  const [analytics, setAnalytics] = useState({
    totalRounds: 0,
    correctRounds: 0,
    wrongRounds: 0,
    reactionTimes: [],
    averageReactionTime: 0,
    accuracy: 0,
    levelsCompleted: 0,
  });

  const roundStartTimeRef = useRef(Date.now());
  const firstInputTimeRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const reactionTimesRef = useRef([]);

  const pinLength = getPinLength(round);

  // Initialize game
  useEffect(() => {
    if (gameStarted && gameTimeMs > 0) {
      setTimeLeft(gameTimeMs);
      setLives(config.STARTING_LIVES);
      setScore(0);
      setRound(1);
      startRound();
    }
  }, [gameStarted, gameTimeMs]);

  // Timer countdown
  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 100;
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
    const newPin = generatePin(pinLength);
    setPin(newPin);
    setUserInput("");
    setPhase("memorize");

    roundStartTimeRef.current = Date.now();
    firstInputTimeRef.current = null;
    reactionTimesRef.current = [];

    // After 4 seconds, switch to input phase
    setTimeout(() => {
      setPhase("input");
    }, config.MEMORIZE_TIME);
  };

  const handleKeyPress = (digit) => {
    if (phase !== "input") return;
    if (userInput.length >= pinLength) return;
    if (timeLeft <= 0) return;

    if (firstInputTimeRef.current === null) {
      firstInputTimeRef.current = Date.now();
    }

    const newInput = userInput + digit;
    setUserInput(newInput);

    // Check if user has entered all digits
    if (newInput.length === pinLength) {
      submitPin(newInput);
    }
  };

  const handleBackspace = () => {
    if (phase !== "input") return;
    setUserInput(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (phase !== "input") return;
    setUserInput("");
    firstInputTimeRef.current = null;
  };

  const submitPin = (inputPin) => {
    const isCorrect = validatePin(inputPin, pin);
    const reactionTime = Date.now() - roundStartTimeRef.current;
    reactionTimesRef.current.push(reactionTime);

    setPhase("reveal");

    if (isCorrect) {
      setScore(s => s + 50);
      setAnalytics(prev => ({
        ...prev,
        totalRounds: prev.totalRounds + 1,
        correctRounds: prev.correctRounds + 1,
        reactionTimes: [...prev.reactionTimes, reactionTime],
        averageReactionTime: calculateAverage([...prev.reactionTimes, reactionTime]),
        accuracy: Math.round(((prev.correctRounds + 1) / (prev.totalRounds + 1)) * 100),
        levelsCompleted: round,
      }));

      setTimeout(() => {
        setRound(r => r + 1);
      }, config.REVEAL_TIME);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setScore(s => Math.max(0, s - 10));

      setAnalytics(prev => ({
        ...prev,
        totalRounds: prev.totalRounds + 1,
        wrongRounds: prev.wrongRounds + 1,
        reactionTimes: [...prev.reactionTimes, reactionTime],
        averageReactionTime: calculateAverage([...prev.reactionTimes, reactionTime]),
        accuracy: Math.round((prev.correctRounds / (prev.totalRounds + 1)) * 100),
        levelsCompleted: round - 1,
      }));

      if (newLives <= 0) {
        setTimeout(() => {
          setIsGameOver(true);
          setGameOverReason("noLives");
        }, config.REVEAL_TIME);
      } else {
        setTimeout(() => {
          startRound();
        }, config.REVEAL_TIME);
      }
    }
  };

  const calculateAverage = (times) => {
    if (times.length === 0) return 0;
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  };

  return {
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
  };
};