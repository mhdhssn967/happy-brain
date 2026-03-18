import { createBrowserRouter, Navigate } from "react-router-dom"
import Home from "../pages/Home"
import GameLauncher from "../pages/GameLauncher"
import Login from "../pages/Login"
import AnalyticsPanel from "../pages/AnalyticsPanel"
import LoadingScreen from "../components/ui/LoadingScreen"
import { useAuth } from "../context/AuthContext"

// Protected Route Component
function ProtectedRoute({ element }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return element
}

// Public Route Component (redirects to home if already logged in)
function PublicRoute({ element }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return element
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <PublicRoute element={<Login />} />,
  },
  {
    path: "/",
    element: <ProtectedRoute element={<Home />} />,
  },
  {
    path: "/game/:gameId",
    element: <ProtectedRoute element={<GameLauncher />} />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute element={<AnalyticsPanel />} />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
])

export default router