import { db } from "../firebase.config"
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore"
import { getAuth } from "firebase/auth"

/**
 * Save a game session result to Firestore
 * @param {Object} sessionData - Game session data
 * @returns {Promise} - Promise resolving to session document ID
 */
export const saveGameSession = async (sessionData) => {
  try {
    const auth = getAuth()
    const user = auth.currentUser

    if (!user) {
      throw new Error("User not authenticated")
    }

    const hospitalId = user.uid.substring(0, 8) || "default"

    // Validate required fields
    if (!sessionData.patientId || !sessionData.gameId) {
      throw new Error("Missing required fields: patientId or gameId")
    }

    // Create session document structure
    const sessionDoc = {
      // Patient & Game Info
      patientId: sessionData.patientId,
      patientName: sessionData.patientName || "Unknown",
      gameId: sessionData.gameId,
      gameName: sessionData.gameName,
      doctorId: user.uid,

      // Performance Metrics
      score: sessionData.score || 0,
      accuracy: sessionData.accuracy || 0,
      gameOverReason: sessionData.gameOverReason || "unknown",

      // Raw Analytics
      analytics: {
        totalRounds: sessionData.analytics?.totalRounds || 0,
        correctRounds: sessionData.analytics?.correctRounds || 0,
        wrongRounds: sessionData.analytics?.wrongRounds || 0,
        totalAttempts: sessionData.analytics?.totalAttempts || 0,
        correctAttempts: sessionData.analytics?.correctAttempts || 0,
        wrongAttempts: sessionData.analytics?.wrongAttempts || 0,
        averageReactionTime: sessionData.analytics?.averageReactionTime || 0,
        reactionTimes: sessionData.analytics?.reactionTimes || [],
      },

      // Cognitive Assessment
      cognitiveScore: sessionData.cognitiveScore || 0,
      cognitiveAssessment: sessionData.cognitiveAssessment || "Unknown",
      factors: {
        accuracy: sessionData.factors?.accuracy || { score: 0, weight: 0.3 },
        speed: sessionData.factors?.speed || { score: 0, weight: 0.3 },
        consistency: sessionData.factors?.consistency || { score: 0, weight: 0.2 },
        endurance: sessionData.factors?.endurance || { score: 0, weight: 0.2 },
      },

      // Timestamps
      createdAt: Timestamp.now(),
      completedAt: sessionData.completedAt ? Timestamp.fromDate(new Date(sessionData.completedAt)) : Timestamp.now(),
      sessionDuration: sessionData.sessionDuration || 0, // in seconds
    }

    // Save to Firestore at: hospitals/{hospitalId}/patients/{patientId}/sessions/{sessionId}
    const sessionsRef = collection(
      db,
      `hospitals/${hospitalId}/patients/${sessionData.patientId}/sessions`
    )

    const docRef = await addDoc(sessionsRef, sessionDoc)

    console.log("Game session saved with ID:", docRef.id)
    return {
      success: true,
      sessionId: docRef.id,
      data: sessionDoc,
    }
  } catch (error) {
    console.error("Error saving game session:", error)
    throw error
  }
}

/**
 * Fetch all game sessions for a patient
 * @param {string} patientId - Patient ID
 * @returns {Promise<Array>} - Array of session documents
 */
export const fetchPatientSessions = async (patientId) => {
  try {
    const auth = getAuth()
    const user = auth.currentUser

    if (!user) {
      throw new Error("User not authenticated")
    }

    const hospitalId = user.uid.substring(0, 8) || "default"

    const sessionsRef = collection(
      db,
      `hospitals/${hospitalId}/patients/${patientId}/sessions`
    )

    // Query all sessions ordered by date (newest first)
    const q = query(sessionsRef, orderBy("createdAt", "desc"))

    const snapshot = await getDocs(q)
    const sessions = []

    snapshot.forEach((doc) => {
      sessions.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        completedAt: doc.data().completedAt?.toDate(),
      })
    })

    return sessions
  } catch (error) {
    console.error("Error fetching patient sessions:", error)
    throw error
  }
}

/**
 * Fetch sessions for a specific game
 * @param {string} patientId - Patient ID
 * @param {string} gameId - Game ID (e.g., "memory-tiles")
 * @returns {Promise<Array>} - Array of session documents for that game
 */
export const fetchGameSessions = async (patientId, gameId) => {
  try {
    const auth = getAuth()
    const user = auth.currentUser

    if (!user) {
      throw new Error("User not authenticated")
    }

    const hospitalId = user.uid.substring(0, 8) || "default"

    const sessionsRef = collection(
      db,
      `hospitals/${hospitalId}/patients/${patientId}/sessions`
    )

    // Query sessions for specific game
    const q = query(
      sessionsRef,
      where("gameId", "==", gameId),
      orderBy("createdAt", "desc")
    )

    const snapshot = await getDocs(q)
    const sessions = []

    snapshot.forEach((doc) => {
      sessions.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        completedAt: doc.data().completedAt?.toDate(),
      })
    })

    return sessions
  } catch (error) {
    console.error("Error fetching game sessions:", error)
    throw error
  }
}

/**
 * Fetch recent sessions (last N sessions)
 * @param {string} patientId - Patient ID
 * @param {number} count - Number of recent sessions to fetch (default: 10)
 * @returns {Promise<Array>} - Array of session documents
 */
export const fetchRecentSessions = async (patientId, count = 10) => {
  try {
    const auth = getAuth()
    const user = auth.currentUser

    if (!user) {
      throw new Error("User not authenticated")
    }

    const hospitalId = user.uid.substring(0, 8) || "default"

    const sessionsRef = collection(
      db,
      `hospitals/${hospitalId}/patients/${patientId}/sessions`
    )

    // Query last N sessions
    const q = query(
      sessionsRef,
      orderBy("createdAt", "desc"),
      limit(count)
    )

    const snapshot = await getDocs(q)
    const sessions = []

    snapshot.forEach((doc) => {
      sessions.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        completedAt: doc.data().completedAt?.toDate(),
      })
    })

    return sessions
  } catch (error) {
    console.error("Error fetching recent sessions:", error)
    throw error
  }
}

/**
 * Calculate aggregate statistics for a patient
 * @param {Array} sessions - Array of session documents
 * @returns {Object} - Aggregated statistics
 */
export const calculateAggregateStats = (sessions) => {
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      averageCognitiveScore: 0,
      averageAccuracy: 0,
      totalScore: 0,
      gameBreakdown: {},
    }
  }

  let totalCognitiveScore = 0
  let totalAccuracy = 0
  let totalScore = 0
  const gameStats = {}

  sessions.forEach((session) => {
    totalCognitiveScore += session.cognitiveScore || 0
    totalAccuracy += session.accuracy || 0
    totalScore += session.score || 0

    // Group by game
    if (!gameStats[session.gameId]) {
      gameStats[session.gameId] = {
        count: 0,
        totalScore: 0,
        totalCognitiveScore: 0,
        totalAccuracy: 0,
        name: session.gameName,
      }
    }

    gameStats[session.gameId].count += 1
    gameStats[session.gameId].totalScore += session.score || 0
    gameStats[session.gameId].totalCognitiveScore += session.cognitiveScore || 0
    gameStats[session.gameId].totalAccuracy += session.accuracy || 0
  })

  // Calculate averages
  const gameBreakdown = {}
  Object.keys(gameStats).forEach((gameId) => {
    const stats = gameStats[gameId]
    gameBreakdown[gameId] = {
      name: stats.name,
      sessions: stats.count,
      averageScore: Math.round(stats.totalScore / stats.count),
      averageCognitiveScore: Math.round(stats.totalCognitiveScore / stats.count),
      averageAccuracy: Math.round(stats.totalAccuracy / stats.count),
    }
  })

  return {
    totalSessions: sessions.length,
    averageCognitiveScore: Math.round(totalCognitiveScore / sessions.length),
    averageAccuracy: Math.round(totalAccuracy / sessions.length),
    totalScore: totalScore,
    gameBreakdown: gameBreakdown,
  }
}