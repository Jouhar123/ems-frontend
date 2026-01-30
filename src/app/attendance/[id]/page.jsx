"use client";
import { useParams, useRouter } from "next/navigation"; // FIXED: Next.js hooks
import { useState, useEffect } from "react";
import api from "../../apis/axios";
import AttendanceForm from "../../components/AttendenceForm"; 
import AttendanceList from "../../components/AttendenceList";

export default function AttendancePage() {
  const params = useParams(); // In Next.js, this returns an object
  const id = params.id; 
  const router = useRouter(); // FIXED: useRouter instead of useNavigate
  
  const [hasData, setHasData] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`attendance/employee/${id}/`)
      .then(res => {
        setHasData(res.data.length > 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, refreshKey]);

  const handleSuccess = () => {
    setEditData(null);
    setShowForm(false);
    setRefreshKey(prev => prev + 1);
  };

  const handleEditClick = (record) => {
    setEditData(record);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Professional Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} // FIXED: router.back()
              className="p-2 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-200 shadow-sm"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Attendance Log</h1>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Employee ID: #{id}</p>
            </div>
          </div>
          
          {!showForm && hasData && (
            <button 
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all"
            >
              + Log Attendance
            </button>
          )}
        </header>

        <main>
          {showForm ? (
            <div className="animate-in zoom-in-95 duration-200 max-w-xl mx-auto">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800">
                    {editData ? "Update Attendance Record" : "Log New Attendance"}
                  </h2>
                  <button 
                    onClick={() => {setShowForm(false); setEditData(null);}} 
                    className="text-slate-400 hover:text-slate-600 text-2xl"
                  >
                    &times;
                  </button>
                </div>
                <AttendanceForm 
                  employeeId={id} 
                  onSuccess={handleSuccess} 
                  editData={editData} 
                />
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              {loading ? (
                <div className="bg-white p-20 rounded-2xl border border-slate-200 text-center text-slate-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  Loading records...
                </div>
              ) : hasData ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <AttendanceList 
                    key={refreshKey} 
                    employeeId={id} 
                    isAdmin={true} 
                    onEdit={handleEditClick} 
                  />
                </div>
              ) : (
                <div className="bg-white p-16 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                  <div className="text-5xl mb-4 text-slate-300">📅</div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">No Records Found</h2>
                  <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                    This employee doesnt have any attendance logs yet.
                  </p>
                  <button 
                    onClick={() => setShowForm(true)} 
                    className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
                  >
                    Create First Record
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}