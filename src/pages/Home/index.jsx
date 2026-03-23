
import GameCard from "./components/GameCard"
import AddPatientModal from "./components/AddPatientModal"
import { useEffect, useState } from "react"
import { useAuth } from "../../context/authContext"
import ActivePatientSelector from "../../components/ActivePatientSelector"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const [floatingElements, setFloatingElements] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [patients, setPatients] = useState([])
  const { user } = useAuth()

  const games = [
    {
      title: "Memory Tiles",
      description: "Boost visual memory and recall skills.",
      gameId: "memory-tiles",
    },
    {
      title: "Quick Math",
      description: "Improve mathematical skills.",
      gameId: "math-game",
    },
    {
      title: "Sequence Recall",
      description: "Improve sequencing skills",
      gameId: "sequence-recall",
    },
    {
      title: "ATM Pin Recall",
      description: "Improve memory",
      gameId: "atm-pin-recall",
    },
  ]
  const navigate = useNavigate()
  // Generate floating game elements
  useEffect(() => {
    const elements = Array.from({ length: 4 }).map((_, i) => ({
      id: i,
      emoji: ["🧠", "🎯", "⚡", "✨"][i],
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 20 + Math.random() * 10,
    }))
    setFloatingElements(elements)
  }, [])

  const handlePatientAdded = (newPatient) => {
    setPatients((prev) => [...prev, newPatient])
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* Subtle Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50" />

        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-200/15 rounded-full blur-3xl" />
      </div>

      {/* Floating Game Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {floatingElements.map((el) => (
          <div
            key={el.id}
            className="absolute text-4xl opacity-5 animate-pulse"
            style={{
              left: `${el.left}%`,
              top: `${el.top}%`,
              animation: `drift ${el.duration}s ease-in-out ${el.delay}s infinite`,
            }}
          >
            {el.emoji}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-100 backdrop-blur-sm bg-white/80 sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🧠</span>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">NeuroBloom</h1>
                <p className="text-xs text-slate-500 mt-0.5">Cognitive Training</p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-col-reverse">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all active:scale-95"
              >
                <span>+</span>
                <span>Add Patient</span>
              </button>

              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{user?.email}</p>
                <p className="text-xs text-slate-500">Doctor</p>
              </div>
            </div>
          </div>
        </header>
        <button style={{width:'100%',marginTop:'10px'}}
          onClick={() => navigate("/dashboard")}
          className="px-4 p-4 py-2.5e bg-indigo-100 font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          📊 Analytics
        </button>
        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          {/* Active Patient Selector */}
          <ActivePatientSelector />

          {/* Hero */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-2">
              Cognitive Games
            </h2>
            <p className="text-lg text-slate-600">
              Start a game session for the selected patient.
            </p>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <GameCard
                key={game.gameId}
                title={game.title}
                description={game.description}
                gameId={game.gameId}
              />
            ))}
          </div>


          {/* Patients List (Optional - shows added patients) */}
          {patients.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Your Patients</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{patient.name}</p>
                        <p className="text-sm text-slate-600">ID: {patient.patientId}</p>
                        <p className="text-sm text-slate-600">Age: {patient.age}, {patient.gender}</p>
                        <p className="text-sm text-slate-600">Condition: {patient.condition}</p>
                      </div>
                      <span className="text-2xl">👤</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPatientAdded={handlePatientAdded}
      />

      <style jsx>{`
        @keyframes drift {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-30px) translateX(20px);
          }
          50% {
            transform: translateY(-60px) translateX(-20px);
          }
          75% {
            transform: translateY(-30px) translateX(20px);
          }
        }
      `}</style>
    </div>
  )
}