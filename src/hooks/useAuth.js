import { useEffect, useState } from "react"
import { auth } from "../firebase.config"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Monitor auth state changes
  useEffect(() => {
    setLoading(true)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null)
      setLoading(false)
    }, (err) => {
      console.error("Auth state error:", err)
      setError(err.message)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const register = async (email, password) => {
    try {
      setError(null)
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }
      const result = await createUserWithEmailAndPassword(auth, email, password)
      setUser(result.user)
      return result.user
    } catch (err) {
      const errorMessage = err.code === "auth/email-already-in-use"
        ? "Email already in use"
        : err.code === "auth/invalid-email"
        ? "Invalid email address"
        : err.code === "auth/weak-password"
        ? "Password too weak (min 6 chars)"
        : err.message || "Registration failed"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      const result = await signInWithEmailAndPassword(auth, email, password)
      setUser(result.user)
      return result.user
    } catch (err) {
      const errorMessage = err.code === "auth/user-not-found"
        ? "Email not found"
        : err.code === "auth/wrong-password"
        ? "Incorrect password"
        : err.code === "auth/invalid-email"
        ? "Invalid email address"
        : err.code === "auth/user-disabled"
        ? "Account has been disabled"
        : err.message || "Login failed"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
      setUser(null)
    } catch (err) {
      const errorMessage = err.message || "Logout failed"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
  }
}