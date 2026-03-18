export default function Intro({ onStart }) {
  return (
    <div className="w-screen h-screen bg-slate-950 text-slate-100 flex flex-col px-6 py-8">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-wide">
          Sequence Recall
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Memory Card Game
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-8 text-sm leading-relaxed">

        {/* How to Play */}
        <section>
          <h2 className="text-base font-semibold text-slate-300 mb-3">
            How to Play
          </h2>
          <ul className="space-y-2 text-slate-400">
            <li>• Memorize the order of 4 cards.</li>
            <li>• Cards flip and shuffle.</li>
            <li>• Tap them in the same order.</li>
            <li>• Complete all correctly to level up.</li>
          </ul>
        </section>

        {/* Rules */}
        <section>
          <h2 className="text-base font-semibold text-slate-300 mb-3">
            Rules
          </h2>
          <ul className="space-y-2 text-slate-400">
            <li>• You have 10 lives.</li>
            <li>• Wrong tap loses 1 life.</li>
            <li>• Difficulty increases each level.</li>
            <li>• Memory time reduces over time.</li>
          </ul>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-base font-semibold text-slate-300 mb-3">
            Tips
          </h2>
          <ul className="space-y-2 text-slate-400">
            <li>• Focus on the order numbers.</li>
            <li>• Watch the shuffle carefully.</li>
            <li>• Stay calm and tap confidently.</li>
          </ul>
        </section>

      </div>

      {/* Start Button */}
      <div className="pt-6">
        <button
          onClick={onStart}
          className="w-full py-3 bg-white text-slate-900 font-semibold rounded-lg active:scale-95 transition"
        >
          Start Game
        </button>
      </div>

    </div>
  );
}