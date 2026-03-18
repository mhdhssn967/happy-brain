import { useEffect, useState, useRef } from "react";
import { generateMathProblem, isAnswerCorrect } from "./engine";
import * as config from "./config";
import { SoundManager } from "../../engine/SoundManager";

export const useMathGame = () => {
  const [level, setLevel] = useState(1);
  const [problem, setProblem] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.LIVES);
  const [isGameOver, setIsGameOver] = useState(false);
  const [operationType, setOperationType] = useState("addition");
  const [feedback, setFeedback] = useState(null); // "correct" | "wrong" | null
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);

  const [analytics, setAnalytics] = useState({
    totalAttempts: 0,
    correctAttempts: 0,
    wrongAttempts: 0,
    reactionTimes: [],
    averageReactionTime: 0,
    levelsCompleted: 0,
  });

  const problemStartRef = useRef(Date.now());
  const soundManager = SoundManager.getInstance();

  // Generate new problem when level changes
  useEffect(() => {
    generateNewProblem();
  }, [level]);

  const generateNewProblem = () => {
    const operation = config.getOperationType(level);
    setOperationType(operation);

    const newProblem = generateMathProblem(level, operation);
    setProblem(newProblem);
    setUserInput("");
    setFeedback(null);
    setShowCorrectAnimation(false);
    problemStartRef.current = Date.now();
  };

  const handleNumberClick = (num) => {
    if (isGameOver) return;

    const newInput = userInput + num;
    setUserInput(newInput);

    // Check answer as user types (instant validation)
    if (problem) {
      const expectedAnswer = String(problem.answer);
      
      // Check if the number of digits matches
      if (newInput.length <= expectedAnswer.length) {
        // Check if current input matches the start of the answer
        if (expectedAnswer.startsWith(newInput)) {
          // Still on track
          if (newInput === expectedAnswer) {
            // Correct! Answer is complete
            handleCorrect(newInput);
          }
        } else {
          // Wrong digit entered - instant fail
          handleWrong(newInput);
        }
      } else if (newInput.length > expectedAnswer.length) {
        // Too many digits - fail
        handleWrong(newInput);
      }
    }
  };

  const handleCorrect = (input) => {
    soundManager.playSound("correct");
    setScore(s => s + 10);
    setFeedback("correct");
    setShowCorrectAnimation(true);
    setConsecutiveCorrect(c => c + 1);

    const reactionTime = Date.now() - problemStartRef.current;

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

    // Auto-move to next level after animation
    setTimeout(() => {
      setLevel(l => l + 1);
    }, 1200);
  };

  const handleWrong = (input) => {
    soundManager.playSound("wrong");
    setScore(s => Math.max(0, s - 5));
    setFeedback("wrong");
    setConsecutiveCorrect(0);

    const reactionTime = Date.now() - problemStartRef.current;

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

    // Reset and show new problem after delay
    setTimeout(() => {
      if (lives - 1 > 0) {
        generateNewProblem();
      }
    }, 800);
  };

  const handleClear = () => {
    setUserInput("");
    setFeedback(null);
  };

  const handleBackspace = () => {
    setUserInput(userInput.slice(0, -1));
    setFeedback(null);
  };

  const calculateAverageReactionTime = (times) => {
    if (times.length === 0) return 0;
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  };

  return {
    level,
    problem,
    userInput,
    score,
    lives,
    isGameOver,
    operationType,
    feedback,
    showCorrectAnimation,
    consecutiveCorrect,
    handleNumberClick,
    handleClear,
    handleBackspace,
    analytics,
  };
};