import { usePatients } from "../hooks/usePatients"

export default function PatientListModal({
  isOpen,
  onClose,
  activePatientId,
  onSelectPatient,
  onSwitchToGuest,
  loading,
}) {
  const { patients, loading: patientsLoading } = usePatients()

  if (!isOpen) return null

  const isLoading = loading || patientsLoading

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Select Patient</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600 mb-2">No patients added yet</p>
              <p className="text-sm text-slate-500">
                Add a patient from the home page to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Guest Option */}
              <button
                onClick={() => {
                  onSwitchToGuest()
                  onClose()
                }}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  activePatientId === "guest"
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-lg">
                    👤
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-slate-900">Guest</p>
                    <p className="text-xs text-slate-600">ID: 0000</p>
                  </div>
                  {activePatientId === "guest" && (
                    <span className="text-green-600">✓</span>
                  )}
                </div>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-2 my-2">
                <div className="flex-1 h-px bg-slate-200"></div>
                <p className="text-xs text-slate-500 px-2">Your Patients</p>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              {/* Patient List */}
              {patients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => {
                    onSelectPatient(patient)
                  }}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    activePatientId === patient.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                      {patient.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-bold text-slate-900">{patient.name}</p>
                      <p className="text-xs text-slate-600">
                        ID: {patient.patientId} • Age: {patient.age}, {patient.gender}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {patient.condition}
                      </p>
                    </div>
                    {activePatientId === patient.id && (
                      <span className="text-green-600 font-bold">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}