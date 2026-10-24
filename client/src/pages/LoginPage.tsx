import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, LogIn, ArrowRight } from "lucide-react";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed. Check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setError(null);
    setSubmitting(true);
    try {
      await login(demoEmail, "password123");
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Demo login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center font-bold text-white shadow-lg text-2xl">
            ዕ
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-extrabold text-slate-900 tracking-tight">
          EthioEqub Digital Management
        </h2>
        <p className="mt-1 text-center text-sm text-slate-600">
          Sign in to access your Equb group ledger and schedules
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="abebe@gmail.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition shadow-sm disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{submitting ? "Authenticating..." : "Sign In"}</span>
            </button>
          </form>

          {/* Demo Login Buttons */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center">
              Quick One-Click Demo Logins
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoLogin("abebe@gmail.com")}
                className="p-2 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 font-medium border border-teal-200/60 text-left transition"
              >
                <div className="font-semibold">Abebe Kebede</div>
                <div className="text-[10px] text-teal-600">Group Owner</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("tigist@gmail.com")}
                className="p-2 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-medium border border-emerald-200/60 text-left transition"
              >
                <div className="font-semibold">Tigist Haile</div>
                <div className="text-[10px] text-emerald-600">Treasurer</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("marta@gmail.com")}
                className="p-2 rounded-lg bg-sky-50 text-sky-800 hover:bg-sky-100 font-medium border border-sky-200/60 text-left transition"
              >
                <div className="font-semibold">Marta Bekele</div>
                <div className="text-[10px] text-sky-600">Equb Member</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("admin@ethioequb.com")}
                className="p-2 rounded-lg bg-indigo-50 text-indigo-800 hover:bg-indigo-100 font-medium border border-indigo-200/60 text-left transition"
              >
                <div className="font-semibold">Admin Account</div>
                <div className="text-[10px] text-indigo-600">Platform Admin</div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-teal-700 hover:text-teal-800">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
