export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🧠</div>
        <p className="text-slate-600 text-lg">Loading...</p>
      </div>
    </div>
  );
}