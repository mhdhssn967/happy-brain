import { useEffect, useState, useRef } from "react"
import { useActivePatient } from "../../../hooks/useActivePatient"
import { saveGameSession } from "../../../utils/firestoreUtils"

export default function ResultOverlay({
  score,
  analytics,
  gameOverReason,
  gameName,
  gameId,
  onClose,
}) {
  const [showDetails, setShowDetails] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const { activePatient } = useActivePatient()
  const hasSaved = useRef(false)

  // Calculate cognitive metrics
  const accuracy =
    analytics?.accuracy ??
    (analytics?.correctAttempts && analytics?.totalAttempts
      ? Math.round(
          (analytics.correctAttempts / analytics.totalAttempts) * 100
        )
      : 0)

  const totalRounds = analytics?.totalRounds ?? 0
  const correctRounds = analytics?.correctRounds ?? 0
  const wrongRounds = analytics?.wrongRounds ?? 0
  const avgReactionTime = analytics?.averageReactionTime ?? 0

  // Analyze cognitive abilities
  const analyzeCognitiveScore = () => {
    let cognitiveScore = 0
    const factors = {}

    // 1. Accuracy (0-30 points)
    if (accuracy >= 90) cognitiveScore += 30
    else if (accuracy >= 80) cognitiveScore += 25
    else if (accuracy >= 70) cognitiveScore += 20
    else if (accuracy >= 60) cognitiveScore += 15
    else if (accuracy >= 50) cognitiveScore += 10
    else cognitiveScore += 5
    factors.accuracy = { score: cognitiveScore, weight: 0.3 }

    // 2. Speed/Reaction Time (0-30 points)
    let speedScore = 0
    if (avgReactionTime < 500) speedScore = 30
    else if (avgReactionTime < 1000) speedScore = 25
    else if (avgReactionTime < 2000) speedScore = 20
    else if (avgReactionTime < 3000) speedScore = 15
    else if (avgReactionTime < 5000) speedScore = 10
    else speedScore = 5
    cognitiveScore += speedScore
    factors.speed = { score: speedScore, weight: 0.3 }

    // 3. Consistency (0-20 points)
    const consistency =
      correctRounds > 0
        ? (correctRounds / (correctRounds + wrongRounds)) * 100
        : 0
    let consistencyScore = 0
    if (consistency >= 80) consistencyScore = 20
    else if (consistency >= 70) consistencyScore = 15
    else if (consistency >= 60) consistencyScore = 10
    else if (consistency >= 50) consistencyScore = 5
    else consistencyScore = 2
    cognitiveScore += consistencyScore
    factors.consistency = { score: consistencyScore, weight: 0.2 }

    // 4. Endurance (0-20 points)
    let enduranceScore = 0
    if (totalRounds >= 30) enduranceScore = 20
    else if (totalRounds >= 20) enduranceScore = 15
    else if (totalRounds >= 10) enduranceScore = 10
    else if (totalRounds >= 5) enduranceScore = 5
    else enduranceScore = 2
    cognitiveScore += enduranceScore
    factors.endurance = { score: enduranceScore, weight: 0.2 }

    return { total: Math.min(100, cognitiveScore), factors }
  }

  const { total: cognitiveScore, factors } = analyzeCognitiveScore()

  // Assessment level
  const getAssessmentLevel = () => {
    if (cognitiveScore >= 85)
      return {
        level: "Excellent",
        color: "text-green-400",
        bg: "bg-green-500/10",
      }
    if (cognitiveScore >= 75)
      return { level: "Good", color: "text-blue-400", bg: "bg-blue-500/10" }
    if (cognitiveScore >= 65)
      return {
        level: "Fair",
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
      }
    return {
      level: "Needs Improvement",
      color: "text-red-400",
      bg: "bg-red-500/10",
    }
  }

  const assessment = getAssessmentLevel()

  // Save result to Firestore - ONLY ONCE
  useEffect(() => {
    // Show details immediately
    setShowDetails(true)

    // Prevent duplicate saves
    if (hasSaved.current) {
      console.log("Already saved, skipping...")
      return
    }

    const handleSaveResult = async () => {
      console.log("=== SAVE ATTEMPT ===")
      console.log("Active Patient:", activePatient)
      console.log("Game:", { gameId, gameName })
      console.log("Score:", score)
      console.log("Analytics:", analytics)

      if (!activePatient) {
        console.warn("No active patient - waiting...")
        return
      }

      if (activePatient.isGuest) {
        console.log("Guest mode - not saving")
        return
      }

      setIsSaving(true)
      setSaveError("")

      try {
        console.log("Attempting to save session...")
        console.log("Patient ID:", activePatient.id)
        console.log("Patient Name:", activePatient.name)

        const result = await saveGameSession({
          patientId: activePatient.id,
          patientName: activePatient.name,
          gameId: gameId,
          gameName: gameName,
          score: score,
          analytics: analytics,
          cognitiveScore: cognitiveScore,
          cognitiveAssessment: assessment.level,
          factors: factors,
          gameOverReason: gameOverReason,
          accuracy: accuracy,
          completedAt: new Date(),
        })

        console.log("✓ Save successful:", result)
        hasSaved.current = true
      } catch (error) {
        console.error("✗ Save failed:", error)
        console.error("Error message:", error.message)
        setSaveError("Failed to save results: " + error.message)
      } finally {
        setIsSaving(false)
      }
    }

    // Delay save by 500ms to show animation
    const timer = setTimeout(() => {
      handleSaveResult()
    }, 500)

    return () => clearTimeout(timer)
  }, [activePatient])

  const handlePlayAgain = () => {
    if (onClose) onClose()
    else window.location.reload()
  }

  const handleHome = () => {
    window.history.back()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className={`
          w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 
          rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden
          transform transition-all duration-500
          ${showDetails ? "scale-100 opacity-100" : "scale-90 opacity-0"}
        `} style={{maxHeight:'80vh',overflowY:'scroll'}}
      >
        {/* Header */}
        <div
          className={`px-6 py-8 text-center border-b border-slate-700/50 ${
            gameOverReason === "timeUp"
              ? "bg-gradient-to-br from-red-600/20 to-orange-600/20"
              : gameOverReason === "noLives"
              ? "bg-gradient-to-br from-red-600/20 to-red-600/20"
              : "bg-gradient-to-br from-green-600/20 to-emerald-600/20"
          }`}
        >
          <div className="text-5xl mb-3">
            {gameOverReason === "timeUp"
              ? "⏰"
              : gameOverReason === "noLives"
              ? "💔"
              : "🎉"}
          </div>
          <h1 className="text-3xl font-black text-white mb-1">
            {gameOverReason === "timeUp"
              ? "Time's Up!"
              : gameOverReason === "noLives"
              ? "Out of Lives!"
              : "Great Job!"}
          </h1>
          <p className="text-slate-400 text-sm">{gameName}</p>
        </div>

        {/* Cognitive Score & Assessment */}
        <div className="px-6 py-6 border-b border-slate-700/50 text-center">
          <div
            className={`px-4 py-4 rounded-xl border border-slate-700/50 ${assessment.bg}`}
          >
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">
              Cognitive Assessment
            </p>
            <p className={`text-4xl font-black mb-2 ${assessment.color}`}>
              {cognitiveScore}/100
            </p>
            <p className={`text-sm font-bold ${assessment.color}`}>
              {assessment.level}
            </p>
          </div>
        </div>

        {/* Main Stats */}
        <div className="px-6 py-6 space-y-4 border-b border-slate-700/50">
          {/* Score */}
          <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-700/50">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
              Final Score
            </p>
            <p className="text-4xl font-black text-cyan-400">{score}</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700/50">
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">
                Accuracy
              </p>
              <p className="text-2xl font-bold text-amber-400">{accuracy}%</p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700/50">
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">
                Rounds
              </p>
              <p className="text-2xl font-bold text-blue-400">{totalRounds}</p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700/50">
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">
                Correct
              </p>
              <p className="text-2xl font-bold text-green-400">✓ {correctRounds}</p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700/50">
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">
                Wrong
              </p>
              <p className="text-2xl font-bold text-red-400">✕ {wrongRounds}</p>
            </div>

            {avgReactionTime > 0 && (
              <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700/50 col-span-2">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">
                  Avg Reaction Time
                </p>
                <p className="text-2xl font-bold text-green-400">
                  {avgReactionTime}ms
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cognitive Factors Breakdown */}
        <div className="px-6 py-4 bg-slate-800/30 border-b border-slate-700/50">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">
            Cognitive Factors
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded border border-slate-700/30">
              <span className="text-slate-300">Accuracy & Precision</span>
              <span className="font-bold text-cyan-400">
                {factors.accuracy.score}/30
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded border border-slate-700/30">
              <span className="text-slate-300">Processing Speed</span>
              <span className="font-bold text-cyan-400">
                {factors.speed.score}/30
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded border border-slate-700/30">
              <span className="text-slate-300">Consistency</span>
              <span className="font-bold text-cyan-400">
                {factors.consistency.score}/20
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded border border-slate-700/30">
              <span className="text-slate-300">Endurance</span>
              <span className="font-bold text-cyan-400">
                {factors.endurance.score}/20
              </span>
            </div>
          </div>
        </div>

        {/* Save Status */}
        {isSaving && (
          <div className="px-6 py-3 text-center text-xs text-slate-400 border-b border-slate-700/50">
            📊 Saving results...
          </div>
        )}

        {saveError && (
          <div className="px-6 py-3 text-center text-xs text-red-400 border-b border-slate-700/50">
            ⚠️ {saveError}
          </div>
        )}

        {!isSaving && !saveError && !activePatient?.isGuest && (
          <div className="px-6 py-3 text-center text-xs text-green-400 border-b border-slate-700/50">
            ✓ Results saved for {activePatient?.name}
          </div>
        )}

        {activePatient?.isGuest && (
          <div className="px-6 py-3 text-center text-xs text-yellow-400 border-b border-slate-700/50">
            ⚠️ Guest mode - Results not saved
          </div>
        )}

        {/* Actions */}
        <div className="px-6 py-4 bg-slate-900/50 flex gap-3 justify-center">
          <button
            onClick={handlePlayAgain}
            className="flex-1 py-3 rounded-lg font-bold uppercase tracking-widest
              bg-gradient-to-r from-cyan-600 to-blue-600
              hover:from-cyan-500 hover:to-blue-500
              text-white shadow-lg
              transition-all duration-300 transform
              hover:scale-105 active:scale-95 text-sm"
          >
            Play Again
          </button>
          <button
            onClick={handleHome}
            className="flex-1 py-3 rounded-lg font-bold uppercase tracking-widest
              bg-slate-700 hover:bg-slate-600
              text-white transition-all text-sm"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}