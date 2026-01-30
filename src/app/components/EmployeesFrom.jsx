"use client";
import { useState, useEffect } from "react";
import api from "../apis/axios";

export default function EmployeeForm({ editData, onSuccess }) {
  // Initialize form state
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);

  // This hook runs whenever editData changes (e.g., when the user clicks 'Edit')
  useEffect(() => {
    if (editData) {
      setForm({
        full_name: editData.full_name || "",
        email: editData.email || "",
        department: editData.department || "",
      });
    } else {
      // Reset form if we are creating a new employee
      setForm({ full_name: "", email: "", department: "" });
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editData) {
        // Update existing employee
        await api.put(`employees/${editData.id}/`, form);
      } else {
        // Create new employee
        await api.post("employees/", form);
      }
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.detail || "Error saving employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Full Name Field */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
        <input 
          type="text"
          value={form.full_name}
          onChange={(e) => setForm({...form, full_name: e.target.value})}
          className="w-full p-3 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900" 
          placeholder="e.g. John Doe"
          required
        />
      </div>

      {/* Email Address - Locked during Edit */}
  <div>
  <label className="block text-sm font-bold text-slate-700 mb-1">
    Email Address 
    {editData && <span className="ml-2 text-xs font-normal text-slate-400 italic">(Cannot be changed)</span>}
  </label>
  <input 
    type="email"
    value={form.email}
    onChange={(e) => setForm({...form, email: e.target.value})}
    disabled={!!editData} 
    className={`w-full p-3 rounded-lg border outline-none transition-all ${
      editData 
        ? "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed" 
        : "border-slate-300 focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-white placeholder:text-slate-400"
    }`}
    placeholder="john@company.com"
    required
  />
</div>

      {/* Department Field */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Department</label>
        <input 
          type="text"
          value={form.department}
          onChange={(e) => setForm({...form, department: e.target.value})}
          className="w-full p-3 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900" 
          placeholder="e.g. Engineering"
          required
        />
      </div>

      {/* Action Button */}
      <button 
        disabled={loading}
        className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-lg hover:bg-indigo-700 active:transform active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {loading ? "Saving Changes..." : editData ? "Update Employee" : "Create Employee"}
      </button>
    </form>
  );
}