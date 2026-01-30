"use client";
import Link from "next/link"; // FIXED: Changed from react-router-dom
import api from "../apis/axios";

export default function EmployeeList({ employees, onDelete, onEdit }) {
  
  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this employee?")) {
      return;
    }

    try {
      await api.delete(`employees/${id}/`);
      onDelete(); 
      console.log("Employee deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      const errorMsg = err.response?.data?.detail || "Could not delete employee. They might have linked attendance records.";
      alert(errorMsg);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Name & Contact</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Department</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-right">Management</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold uppercase">
                      {emp.full_name ? emp.full_name.charAt(0) : "?"}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{emp.full_name}</div>
                      <div className="text-xs text-slate-500">{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">
                    {emp.department}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {/* FIXED: href instead of to */}
                  <Link 
                    href={`/attendance/${emp.id}`} 
                    className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    Attendance
                  </Link>
                  <button 
                    onClick={() => onEdit(emp)} 
                    className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => remove(emp.id)} 
                    className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-6 py-20 text-center text-slate-400">
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p>No employees found in the directory.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}