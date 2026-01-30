"use client"
import { useState } from "react";
import api from "../apis/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter(); // Initialize Next.js router

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("signup/", form);
      // Use router.push for navigation
      router.push("/login"); 
    } catch (err) {
      const errorMsg = err.response?.data;
      setError(
        errorMsg?.username?.[0] || 
        errorMsg?.email?.[0] || 
        "Signup failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg border border-slate-100">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Join the Employee Management System
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Username
              </label>
              <input
                type="text"
                placeholder="johndoe123"
                className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-lg placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-lg placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-lg placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}