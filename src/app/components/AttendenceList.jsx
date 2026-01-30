"use client";
import { useEffect, useState } from "react";
import api from "../apis/axios";

export default function AttendanceList({ employeeId, isAdmin, onEdit }) {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const res = await api.get(`attendance/employee/${employeeId}/`);
      const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecords(sorted);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, [employeeId]);

  const updateStatus = async (recordId, newStatus) => {
    if (!isAdmin) return;
    try {
      await api.patch(`attendance/${recordId}/`, { status: newStatus });
      setRecords(prev => prev.map(r => r.id === recordId ? { ...r, status: newStatus } : r));
    } catch {
      alert("Status update failed.");
    }
  };

  const deleteRecord = async (recordId) => {
    if (!isAdmin || !window.confirm("Are you sure you want to delete this log?")) return;
    try {
      await api.delete(`attendance/${recordId}/delete/`);
      setRecords(prev => prev.filter(r => r.id !== recordId));
    } catch {
      alert("Delete failed.");
    }
  };

  const filteredRecords = records.filter(r => r.date.includes(searchTerm));

  if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Retrieving records...</div>;

  return (
    <div className="bg-white">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search date (YYYY-MM-DD)..." 
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm font-semibold text-slate-500">
          {filteredRecords.length} <span className="font-normal">Records found</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
              {isAdmin && <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecords.map((record) => (
              <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-700">
                    {new Date(record.date).toLocaleDateString('en-GB', { 
                      day: '2-digit', month: 'short', year: 'numeric', weekday: 'short' 
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    record.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {record.status}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button 
                          onClick={() => updateStatus(record.id, "Present")}
                          className={`px-2 py-1 text-xs font-bold rounded ${record.status === 'Present' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >P</button>
                        <button 
                          onClick={() => updateStatus(record.id, "Absent")}
                          className={`px-2 py-1 text-xs font-bold rounded ${record.status === 'Absent' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >A</button>
                      </div>
                      <button onClick={() => deleteRecord(record.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">🗑️</button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}