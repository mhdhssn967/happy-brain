import { useEffect, useState, useRef } from "react";
import { getAssessmentLevel } from "../engine";
import { saveGameSession } from "../../../utils/firestoreUtils";
import { useActivePatient } from "../../../hooks/useActivePatient";

/**
 * ResultOverlay for Color Tap.
 *
 * Props
 * ─────
 * score            number
 * analytics        object  — standard analytics shape (same as Math Game)
 * cognitiveScore   number  — pre-calculated 0–100 score from engine
 * cognitiveFactors object  — { discrimination, speed, attention, progression }
 * gameOverReason   string  — "timeUp" | "noLives"
 * gameName         string
 * gameId           string
 * onClose          fn?
 */
export default function ResultOverlay({
  score,
  analytics,
  cognitiveScore,
  cognitiveFactors,
  gameOverReason,
  gameName,
  gameId,
  onClose,
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const { activePatient } = useActivePatient();
  const hasSaved = useRef(false);

  const accuracy         = analytics?.accuracy ?? 0;
  const totalRounds      = analytics?.totalAttempts ?? 0;
  const correctRounds    = analytics?.correctAttempts ?? 0;
  const wrongRounds      = analytics?.wrongAttempts ?? 0;
  const avgReactionTime  = analytics?.averageReactionTime ?? 0;
  const maxStreak        = analytics?.maxStreak ?? 0;
  const levelReached     = analytics?.levelReached ?? 1;

  const assessment = getAssessmentLevel(cognitiveScore);

  // Save on mount
  useEffect(() => {
    setShowDetails(true);
    if (hasSaved.current) return;

    const save = async () => {
      if (!activePatient || activePatient.isGuest) return;

      setIsSaving(true);
      setSaveError("");
      try {
        await saveGameSession({
          patientId:          activePatient.id,
          patientName:        activePatient.name,
          gameId,
          gameName,
          score,
          analytics,
          cognitiveScore,
          cognitiveAssessment: assessment.level,
          factors:             cognitiveFactors,
          gameOverReason,
          accuracy,
          completedAt:         new Date(),
        });
        hasSaved.current = true;
      } catch (err) {
        setSaveError("Failed to save results: " + err.message);
      } finally {
        setIsSaving(false);
      }
    };

    const t = setTimeout(save, 500);
    return () => clearTimeout(t);
  }, [activePatient]);

  const handlePlayAgain = () => {
    if (onClose) onClose();
    else window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className={`
          w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900
          rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden
          transform transition-all duration-500
          ${showDetails ? "scale-100 opacity-100" : "scale-90 opacity-0"}
        `}
        style={{ maxHeight: "85vh", overflowY: "scroll" }}
      >
        {/* Header */}
        <div className="px-6 py-8 text-center border-b border-slate-700/50 bg-gradient-to-br from-red-600/20 to-orange-600/20">
          <div className="text-5xl mb-3">⏰</div>
          <h1 className="text-3xl font-black text-white mb-1">Time's Up!</h1>
          <p className="text-slate-400 text-sm">{gameName}</p>
        </div>

        {/* Cognitive score */}
        <div className="px-6 py-6 border-b border-slate-700/50 text-center">
          <div className={`px-4 py-4 rounded-xl border border-slate-700/50 ${assessment.bg}`}>
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

        {/* Stats */}
        <div className="px-6 py-6 space-y-4 border-b border-slate-700/50">
          <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-700/50">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Final Score</p>
            <p className="text-4xl font-black text-cyan-400">{score}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Stat label="Accuracy"      value={`${accuracy}%`}       color="text-amber-400" />
            <Stat label="Attempts"      value={totalRounds}           color="text-blue-400" />
            <Stat label="Correct"       value={`✓ ${correctRounds}`} color="text-green-400" />
            <Stat label="Wrong"         value={`✕ ${wrongRounds}`}   color="text-red-400" />
            <Stat label="Max Streak"    value={`🔥 ${maxStreak}`}    color="text-orange-400" />
            <Stat label="Level Reached" value={levelReached}          color="text-purple-400" />
            {avgReactionTime > 0 && (
              <div className="col-span-2 bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700/50">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Avg Reaction Time</p>
                <p className="text-2xl font-bold text-green-400">{avgReactionTime}ms</p>
              </div>
            )}
          </div>
        </div>

        {/* Cognitive factors */}
        <div className="px-6 py-4 bg-slate-800/30 border-b border-slate-700/50">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">
            Cognitive Factors
          </p>
          <div className="space-y-2 text-xs">
            {cognitiveFactors &&
              Object.values(cognitiveFactors).map((f) => (
                <div
                  key={f.label}
                  className="flex justify-between items-center p-2 bg-slate-800/50 rounded border border-slate-700/30"
                >
                  <span className="text-slate-300">{f.label}</span>
                  <span className="font-bold text-cyan-400">
                    {f.score}/{f.max}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Save status */}
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
        {!isSaving && !saveError && !activePatient?.isGuest && hasSaved.current && (
          <div className="px-6 py-3 text-center text-xs text-green-400 border-b border-slate-700/50">
            ✓ Results saved for {activePatient?.name}
          </div>
        )}
        {activePatient?.isGuest && (
          <div className="px-6 py-3 text-center text-xs text-yellow-400 border-b border-slate-700/50">
            ⚠️ Guest mode — results not saved
          </div>
        )}

        {/* Actions */}
        <div className="px-6 py-4 bg-slate-900/50 flex gap-3 justify-center">
          <button
            onClick={handlePlayAgain}
            className="flex-1 py-3 rounded-lg font-bold uppercase tracking-widest
              bg-gradient-to-r from-indigo-600 to-purple-600
              hover:from-indigo-500 hover:to-purple-500
              text-white shadow-lg transition-all duration-300 transform
              hover:scale-105 active:scale-95 text-sm"
          >
            Play Again
          </button>
          <button
            onClick={() => window.history.back()}
            className="flex-1 py-3 rounded-lg font-bold uppercase tracking-widest
              bg-slate-700 hover:bg-slate-600 text-white transition-all text-sm"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700/50">
      <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}