import { useNavigate } from "react-router-dom"

export default function GameCard({ title, description, gameId }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/game/${gameId}`)}
      className="group cursor-pointer bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-slate-200 hover:border-cyan-400 hover:scale-105 active:scale-95 h-full flex flex-col"
    >
      {/* Image Cover */}
      <div className="relative h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden flex items-center justify-center">
        <img
          src={`/assets/images/games/${gameId}.png`}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full font-bold text-slate-800">
            Play Now
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-3 sm:p-3 lg:p-3 flex flex-col justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 group-hover:text-cyan-600 transition-colors line-clamp-2">
            {title}
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Action Indicator */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>Start</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          <div className="w-2 h-2 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </div>
  )
}