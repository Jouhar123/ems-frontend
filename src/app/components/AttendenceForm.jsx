"use client";
import { useState, useEffect } from "react";
import api from "../apis/axios";

export default function AttendanceForm({ employeeId, onSuccess, editData }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    status: "Present",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({ date: editData.date, status: editData.status });
    }
  }, [editData]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editData) {
        await api.patch(`attendance/${editData.id}/`, { status: form.status });
      } else {
        await api.post("attendance/", { 
          employee: employeeId, 
          date: form.date, 
          status: form.status 
        });
      }
      onSuccess();
    } catch (err) {
      const errorMsg = err.response?.data?.non_field_errors?.[0] || 
                       err.response?.data?.detail || 
                       "An error occurred.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="space-y-4">
      <div>
  <label className="block text-sm font-semibold text-slate-700 mb-2">Log Date</label>
  <input 
    type="date" 
    className={`w-full p-3 rounded-xl border outline-none transition-all ${
      editData 
        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
        : 'border-slate-300 focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-white'
    }`}
    value={form.date} 
    onChange={(e) => setForm({...form, date: e.target.value})} 
    disabled={!!editData} 
  />
  {editData && (
    <p className="mt-1 text-xs text-slate-400 italic font-medium">
      Date cannot be changed during update
    </p>
  )}
</div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Attendance Status</label>
          <select 
            className={`w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium ${
              form.status === 'Present' ? 'text-green-600' : 'text-red-600'
            }`}
            value={form.status} 
            onChange={(e) => setForm({...form, status: e.target.value})}
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? "Processing..." : (editData ? "Update Record" : "Save Log Entry")}
      </button>
    </form>
  );
}