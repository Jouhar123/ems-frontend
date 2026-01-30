"use client";
import { useEffect, useState } from "react";
import api from "../apis/axios";
import { useRouter } from "next/navigation";
import EmployeeList from "../components/EmployeesList";
import EmployeeForm from "../components/EmployeesFrom";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [view, setView] = useState("list"); // "list" or "form"
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get("employees/");
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
      // If unauthorized, send back to login
      if (err.response?.status === 401) router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddNew = () => {
    setEditData(null);
    setView("form");
  };

  const handleEdit = (employee) => {
    setEditData(employee);
    setView("form");
  };

  const handleFormSuccess = () => {
    setView("list");
    fetchEmployees();
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Workforce Management
            </h1>
            <p className="text-slate-500 text-sm">
              {view === "list" ? `Managing ${employees.length} Employees` : "Fill in the details below"}
            </p>
          </div>

          <button 
            onClick={view === "list" ? handleAddNew : () => setView("list")}
            className={`px-5 py-2.5 rounded-lg font-semibold transition-all shadow-sm ${
              view === "list" 
                ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            {view === "list" ? "+ Add New Employee" : "← Back to Directory"}
          </button>
        </div>

        {/* Content Area */}
        <div className="transition-all duration-300">
          {loading && view === "list" ? (
            <div className="flex justify-center items-center h-64 text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
              Loading staff directory...
            </div>
          ) : view === "list" ? (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <EmployeeList 
                employees={employees} 
                onEdit={handleEdit} 
                onDelete={fetchEmployees} 
              />
            </div>
          ) : (
            <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-200">
              <EmployeeForm 
                editData={editData} 
                onSuccess={handleFormSuccess} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}