import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function AnalyticsPanel() {
  const [selectedGame, setSelectedGame] = useState("all");

  // Dummy patient data
  const patientData = {
    name: "John Doe",
    age: 68,
    id: "P001",
    diagnosis: "Mild Cognitive Impairment (MCI)",
    enrollmentDate: "2024-01-15",
    therapyDuration: "8 weeks",
  };

  // Game performance data
  const gamePerformance = {
    "memory-tiles": {
      name: "Memory Tiles",
      sessions: 24,
      averageScore: 78,
      accuracy: 82,
      improvementRate: 15,
      avgReactionTime: 1200,
      trend: [45, 52, 58, 65, 71, 75, 78, 81, 79, 82],
    },
    "math-game": {
      name: "Quick Math",
      sessions: 18,
      averageScore: 72,
      accuracy: 76,
      improvementRate: 18,
      avgReactionTime: 2100,
      trend: [40, 48, 55, 61, 68, 70, 72, 74, 75, 76],
    },
    "sequence-recall": {
      name: "Sequence Recall",
      sessions: 20,
      averageScore: 75,
      accuracy: 79,
      improvementRate: 22,
      avgReactionTime: 1800,
      trend: [38, 45, 52, 58, 65, 70, 73, 75, 77, 79],
    },
    "atm-pin-recall": {
      name: "ATM PIN Recall",
      sessions: 22,
      averageScore: 80,
      accuracy: 85,
      improvementRate: 20,
      avgReactionTime: 950,
      trend: [50, 57, 63, 69, 74, 77, 79, 81, 82, 85],
    },
  };

  // Overall cognitive assessment
  const cognitiveAssessment = {
    memory: 78,
    attention: 74,
    processing: 76,
    executiveFunction: 72,
    sequencing: 79,
  };

  // Progress data
  const progressData = [
    { week: "Week 1", score: 45 },
    { week: "Week 2", score: 52 },
    { week: "Week 3", score: 58 },
    { week: "Week 4", score: 65 },
    { week: "Week 5", score: 71 },
    { week: "Week 6", score: 75 },
    { week: "Week 7", score: 79 },
    { week: "Week 8", score: 82 },
  ];

  const gamesArray = Object.entries(gamePerformance);
  const displayData = selectedGame === "all" ? gamesArray : [[selectedGame, gamePerformance[selectedGame]]];

  const getOverallAssessment = () => {
    const avgScore = Object.values(gamePerformance).reduce((sum, game) => sum + game.averageScore, 0) / Object.keys(gamePerformance).length;

    if (avgScore >= 85) return { level: "Excellent", color: "text-green-600", bgColor: "bg-green-50" };
    if (avgScore >= 75) return { level: "Good", color: "text-blue-600", bgColor: "bg-blue-50" };
    if (avgScore >= 65) return { level: "Fair", color: "text-yellow-600", bgColor: "bg-yellow-50" };
    return { level: "Needs Improvement", color: "text-red-600", bgColor: "bg-red-50" };
  };

  const assessment = getOverallAssessment();
  const avgScore = Object.values(gamePerformance).reduce((sum, game) => sum + game.averageScore, 0) / Object.keys(gamePerformance).length;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Patient Analytics Dashboard</h1>
          <p className="text-slate-600">Comprehensive cognitive assessment and progress tracking</p>
        </div>

        {/* Patient Info Card */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{patientData.name}</h2>
              <div className="space-y-3 text-slate-600">
                <p><span className="font-semibold">Patient ID:</span> {patientData.id}</p>
                <p><span className="font-semibold">Age:</span> {patientData.age} years</p>
                <p><span className="font-semibold">Diagnosis:</span> {patientData.diagnosis}</p>
              </div>
            </div>
            <div>
              <div className="space-y-3 text-slate-600">
                <p><span className="font-semibold">Enrollment Date:</span> {patientData.enrollmentDate}</p>
                <p><span className="font-semibold">Therapy Duration:</span> {patientData.therapyDuration}</p>
                <p><span className="font-semibold">Sessions Completed:</span> {Object.values(gamePerformance).reduce((sum, g) => sum + g.sessions, 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Assessment */}
        <div className={`rounded-2xl p-8 mb-8 shadow-sm border border-slate-100 ${assessment.bgColor}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-slate-600 text-sm font-semibold mb-2">OVERALL ASSESSMENT</p>
              <p className={`text-4xl font-bold ${assessment.color}`}>{assessment.level}</p>
            </div>
            <div>
              <p className="text-slate-600 text-sm font-semibold mb-2">AVERAGE SCORE</p>
              <p className={`text-4xl font-bold ${assessment.color}`}>{Math.round(avgScore)}/100</p>
            </div>
            <div>
              <p className="text-slate-600 text-sm font-semibold mb-2">AVERAGE IMPROVEMENT</p>
              <p className={`text-4xl font-bold ${assessment.color}`}>+{Math.round(Object.values(gamePerformance).reduce((sum, g) => sum + g.improvementRate, 0) / Object.keys(gamePerformance).length)}%</p>
            </div>
          </div>
        </div>

        {/* Cognitive Domains */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Cognitive Domains Assessment</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={[cognitiveAssessment]}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="name" stroke="#64748b" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              {Object.entries(cognitiveAssessment).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <span className="font-semibold text-slate-700 capitalize">{key}:</span>
                  <span className="text-slate-600">{value}/100</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Over Time */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Overall Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid stroke="#e2e8f0" />
                <XAxis dataKey="week" stroke="#64748b" style={{ fontSize: "12px" }} />
                <YAxis stroke="#64748b" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#fff" }} />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ fill: "#3b82f6", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Game Filter */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Filter by Game</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGame("all")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedGame === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Games
            </button>
            {Object.entries(gamePerformance).map(([key, game]) => (
              <button
                key={key}
                onClick={() => setSelectedGame(key)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedGame === key
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {game.name}
              </button>
            ))}
          </div>
        </div>

        {/* Game Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {displayData.map(([gameId, game]) => (
            <div key={gameId} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h4 className="font-bold text-slate-900 mb-4">{game.name}</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Sessions</span>
                  <span className="font-bold text-slate-900">{game.sessions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Avg Score</span>
                  <span className="font-bold text-blue-600">{game.averageScore}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Accuracy</span>
                  <span className="font-bold text-green-600">{game.accuracy}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Improvement</span>
                  <span className="font-bold text-purple-600">+{game.improvementRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Avg Reaction</span>
                  <span className="font-bold text-slate-900">{game.avgReactionTime}ms</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Charts */}
        {selectedGame === "all" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Comparison Chart */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Game Score Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gamesArray.map(([_, game]) => ({ name: game.name, score: game.averageScore }))}>
                  <CartesianGrid stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#64748b" domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#fff" }} />
                  <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Accuracy Comparison */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Accuracy by Game</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gamesArray.map(([_, game]) => ({ name: game.name, accuracy: game.accuracy }))}>
                  <CartesianGrid stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#64748b" domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#fff" }} />
                  <Bar dataKey="accuracy" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6">{gamePerformance[selectedGame].name} - Score Trend</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={gamePerformance[selectedGame].trend.map((score, idx) => ({ session: `Session ${idx + 1}`, score }))}>
                <CartesianGrid stroke="#e2e8f0" />
                <XAxis dataKey="session" stroke="#64748b" style={{ fontSize: "12px" }} />
                <YAxis stroke="#64748b" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#fff" }} />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ fill: "#3b82f6", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}