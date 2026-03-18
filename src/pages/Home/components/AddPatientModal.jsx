import { useState } from "react"
import { db } from "../../../firebase.config"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"
import { useAuth } from "../../../context/authContext"

export default function AddPatientModal({ isOpen, onClose, onPatientAdded }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    condition: "",
    enrollmentDate: new Date().toISOString().split("T")[0],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const generatePatientId = () => {
    return Math.floor(1000 + Math.random() * 9000).toString()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!formData.name || !formData.age || !formData.gender || !formData.condition) {
        throw new Error("All fields are required")
      }

      if (isNaN(formData.age) || formData.age < 1 || formData.age > 150) {
        throw new Error("Please enter a valid age")
      }

      // Get hospital ID from user (you may need to adjust this based on your auth structure)
      const hospitalId = user.uid.substring(0, 8) || "default"

      // Generate 4-digit patient ID
      const patientId = generatePatientId()

      // Reference to patients collection
      const patientsRef = collection(
        db,
        `hospitals/${hospitalId}/patients`
      )

      // Add patient document
      const patientDocRef = await addDoc(patientsRef, {
        patientId: patientId,
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        condition: formData.condition,
        enrollmentDate: formData.enrollmentDate,
        createdAt: new Date().toISOString(),
        doctorId: user.uid,
        status: "active",
        sessions: [],
        totalScore: 0,
        lastActivityDate: null,
      })

      // Reset form
      setFormData({
        name: "",
        age: "",
        gender: "",
        condition: "",
        enrollmentDate: new Date().toISOString().split("T")[0],
      })

      // Notify parent component
      if (onPatientAdded) {
        onPatientAdded({
          id: patientDocRef.id,
          patientId: patientId,
          ...formData,
        })
      }

      // Close modal
      onClose()
    } catch (err) {
      setError(err.message || "Failed to add patient")
      console.error("Error adding patient:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Add New Patient</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Patient Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Patient Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Age and Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="65"
                min="1"
                max="150"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Medical Condition *
            </label>
            <input
              type="text"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Mild Cognitive Impairment"
              required
            />
          </div>

          {/* Enrollment Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Enrollment Date
            </label>
            <input
              type="date"
              name="enrollmentDate"
              value={formData.enrollmentDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold rounded-lg transition"
            >
              {loading ? "Adding..." : "Add Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}