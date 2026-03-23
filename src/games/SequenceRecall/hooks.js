import { useEffect, useState, useRef } from "react"
import { generateSequence, shuffleSequence } from "./engine"
import * as config from "./config"
import { SoundManager } from "../../engine/SoundManager"

export const useSequenceGame = (gameTimeMs, gameStarted) => {
  const [level, setLevel] = useState(1)
  const [phase, setPhase] = useState("show") // show | flip | shuffle | play
  const [items, setItems] = useState([]) // Original order
  const [displayItems, setDisplayItems] = useState([]) // Current display order
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(gameTimeMs / 1000)
  const [isGameOver, setIsGameOver] = useState(false)
  const [cardFlipped, setCardFlipped] = useState({}) // Track which cards are flipped
  const [userSequence, setUserSequence] = useState([]) // Track user's taps
  const [memorizeTime, setMemorizeTime] = useState(8)
  const [memorizeProgress, setMemorizeProgress] = useState(100) // 0-100 for progress bar

  const [analytics, setAnalytics] = useState({
    totalRounds: 0,
    correctRounds: 0,
    wrongRounds: 0,
    totalAttempts: 0,
    correctAttempts: 0,
    wrongAttempts: 0,
    reactionTimes: [],
    averageReactionTime: 0,
    accuracy: 0,
  })

  const levelStartRef = useRef(Date.now())
  const soundManager = SoundManager.getInstance()
  const maxMemorizeTime = config.getMemorizeTime(level)
  const gameStartTimeRef = useRef(Date.now())
  const timerIntervalRef = useRef(null)

  // Initialize level only when game has started
  useEffect(() => {
    if (gameStarted) {
      startLevel()
    }
  }, [level, gameStarted])

  // Timer effect - countdown from gameTimeMs
  useEffect(() => {
    if (!gameStarted) return

    gameStartTimeRef.current = Date.now()
    setTimeLeft(Math.ceil(gameTimeMs / 1000))

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 0.1
        if (newTime <= 0) {
          clearInterval(timerIntervalRef.current)
          setIsGameOver(true)
          return 0
        }
        return newTime
      })
    }, 100)

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [gameStarted, gameTimeMs])

  // Memorize timer countdown
  useEffect(() => {
    if (phase !== "show") return

    const totalSeconds = Math.ceil(maxMemorizeTime / 1000)
    setMemorizeTime(totalSeconds)
    setMemorizeProgress(100)

    const interval = setInterval(() => {
      setMemorizeTime((prev) => {
        const newTime = prev - 1
        const progress = (newTime / totalSeconds) * 100
        setMemorizeProgress(Math.max(progress, 0))

        if (newTime <= 0) {
          clearInterval(interval)
          // Flip cards
          const flipped = {}
          items.forEach((item) => {
            flipped[item.id] = true
          })
          setCardFlipped(flipped)
          setPhase("flip")
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [phase, items, maxMemorizeTime])

  // Flip to shuffle phase
  useEffect(() => {
    if (phase !== "flip") return

    const timer = setTimeout(() => {
      setPhase("shuffle")
    }, 500)

    return () => clearTimeout(timer)
  }, [phase])

  // Shuffle animation and flip back
  useEffect(() => {
    if (phase !== "shuffle") return

    const timer = setTimeout(() => {
      // Shuffle display order
      const shuffled = shuffleSequence(items)
      setDisplayItems(shuffled)

      // Flip back
      const flipped = {}
      items.forEach((item) => {
        flipped[item.id] = false
      })
      setCardFlipped(flipped)
      setPhase("play")
    }, config.SHUFFLE_TIME)

    return () => clearTimeout(timer)
  }, [phase, items])

  const startLevel = () => {
    // Always 4 images
    const newItems = generateSequence(4, level)
    setItems(newItems)
    setDisplayItems(newItems) // Set display items immediately
    setPhase("show")
    setCardFlipped({})
    setUserSequence([])
    levelStartRef.current = Date.now()
  }

  const handleCardTap = (displayedItemId) => {
    if (phase !== "play") return
    if (userSequence.includes(displayedItemId)) return // Already tapped

    const reactionTime = Date.now() - levelStartRef.current
    const newSequence = [...userSequence, displayedItemId]
    setUserSequence(newSequence)

    // Find the card's original position
    const card = items.find((item) => item.id === displayedItemId)
    const expectedId = items[newSequence.length - 1]?.id
    const isCorrect = displayedItemId === expectedId

    // Mark card state
    setCardFlipped((prev) => ({
      ...prev,
      [displayedItemId]: isCorrect ? "correct" : "wrong",
    }))

    if (isCorrect) {
      soundManager.playSound("correct")
      setScore((s) => s + 10)

      setAnalytics((prev) => {
        const newReactionTimes = [...prev.reactionTimes, reactionTime]
        const newCorrectAttempts = prev.correctAttempts + 1
        const newTotalAttempts = prev.totalAttempts + 1
        const newAccuracy = Math.round(
          (newCorrectAttempts / newTotalAttempts) * 100
        )

        return {
          ...prev,
          totalRounds: prev.totalRounds + 1,
          correctRounds: prev.correctRounds + 1,
          totalAttempts: newTotalAttempts,
          correctAttempts: newCorrectAttempts,
          reactionTimes: newReactionTimes,
          averageReactionTime: calculateAverageReactionTime(newReactionTimes),
          accuracy: newAccuracy,
        }
      })

      // Check if all 4 tapped
      if (newSequence.length === 4) {
        // Level complete! Show SweetAlert2
        import("sweetalert2").then((Swal) => {
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
            background: "#22C55E",
            color: "#ffffff",
            showConfirmButton: false,
            timer: 500,
            timerProgressBar: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showClass: {
              popup: "swal2-show",
            },
            hideClass: {
              popup: "swal2-hide",
            },
            customClass: {
              popup: "mobile-success-overlay",
            },
            backdrop: false,
            heightAuto: false,
            didClose: () => {
              setLevel((l) => l + 1)
            },
          })
        })
      }
    } else {
      soundManager.playSound("wrong")
      setScore((s) => Math.max(0, s - 5))

      setAnalytics((prev) => {
        const newReactionTimes = [...prev.reactionTimes, reactionTime]
        const newWrongAttempts = prev.wrongAttempts + 1
        const newTotalAttempts = prev.totalAttempts + 1
        const newCorrectAttempts = prev.correctAttempts
        const newAccuracy =
          newTotalAttempts > 0
            ? Math.round((newCorrectAttempts / newTotalAttempts) * 100)
            : 0

        return {
          ...prev,
          totalRounds: prev.totalRounds + 1,
          wrongRounds: prev.wrongRounds + 1,
          totalAttempts: newTotalAttempts,
          wrongAttempts: newWrongAttempts,
          reactionTimes: newReactionTimes,
          averageReactionTime: calculateAverageReactionTime(newReactionTimes),
          accuracy: newAccuracy,
        }
      })

      // Retry same level
      setTimeout(() => {
        startLevel()
      }, 800)
    }
  }

  const calculateAverageReactionTime = (times) => {
    if (times.length === 0) return 0
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length)
  }

  return {
    level,
    phase,
    items,
    displayItems,
    score,
    timeLeft,
    isGameOver,
    handleCardTap,
    analytics,
    cardFlipped,
    userSequence,
    memorizeTime,
    memorizeProgress,
    maxMemorizeTime,
  }
}