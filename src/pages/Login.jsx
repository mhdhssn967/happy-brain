import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const navigate = useNavigate()
  const { user, login, register } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true })
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (isSignUp) {
        await register(email, password)
      } else {
        await login(email, password)
      }
      // Navigation happens via useEffect when user state updates
    } catch (err) {
      setError(err.message || "Authentication failed")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🧠</div>
            <h1 className="text-3xl font-bold text-slate-900">NeuroBloom</h1>
            <p className="text-slate-600 mt-2">Cognitive Rehabilitation</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 rounded-lg transition-all"
            >
              {isLoading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError("")
                  setEmail("")
                  setPassword("")
                }}
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 mb-3">Demo Credentials:</p>
            <div className="space-y-2 text-xs text-slate-600">
              <p><span className="font-semibold">Email:</span>oqulix@gmail.com</p>
              <p><span className="font-semibold">Password:</span>oqulix@123</p>
            </div>
            <p className="text-xs text-slate-400 mt-3">Or create a new account to test signup</p>
          </div>
        </div>
      </div>
    </div>
  )
}