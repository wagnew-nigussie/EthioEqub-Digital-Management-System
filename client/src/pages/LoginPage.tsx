import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn, Eye, EyeOff, ShieldCheck, ArrowRight, UserCheck } from "lucide-react";

export const LoginPage: React.FC = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center font-bold text-white shadow-xl text-3xl tracking-wider">
            ዕ
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          EthioEqub Digital
        </h2>
        <p className="mt-1 text-center text-xs text-teal-300 font-medium">
          Rotating Savings & Credit Association (ROSCA / ዕቁብ) Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Active Session Notification if already logged in */}
        {user && (
          <div className="mb-4 p-4 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 text-xs shadow-lg animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" /> Currently Signed In
              </span>
              <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded-full text-slate-300">
                Active Session
              </span>
            </div>
            <div className="font-bold text-white text-sm">{user.fullName}</div>
            <div className="text-slate-400 font-mono text-[11px]">{user.email}</div>
            <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-700">
              <Link
                to="/"
                className="flex-1 py-2 text-center rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold transition"
              >
                Go to Dashboard &rarr;
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-rose-900/60 hover:text-rose-200 text-slate-300 font-medium transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Login Box */}
        <div className="bg-white py-8 px-6 shadow-2xl border border-slate-200/90 rounded-3xl sm:px-10">
          <div className="mb-6">
            <h3 className="font-bold text-lg text-slate-900">Sign in to your account</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Access your group financial ledger, cycles, and payouts
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold animate-fadeIn">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="wagnewnigussie569@gmail.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[10px] text-slate-400">Min 6 characters</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-teal-600" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 focus:ring-2 focus:ring-teal-500 transition shadow-md disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{submitting ? "Authenticating..." : "Sign In to EthioEqub"}</span>
            </button>
          </form>

          {/* Quick One-Click Demo Logins */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
              Quick One-Click Demo Logins
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoLogin("wagnewnigussie569@gmail.com")}
                className="p-2.5 rounded-xl bg-teal-50 text-teal-900 hover:bg-teal-100 font-medium border border-teal-200/80 text-left transition group shadow-2xs"
              >
                <div className="font-bold text-xs group-hover:text-teal-950">Wagnew Nigussie</div>
                <div className="text-[10px] text-teal-700 font-semibold">Group Owner</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("tigist@gmail.com")}
                className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 hover:bg-emerald-100 font-medium border border-emerald-200/80 text-left transition group shadow-2xs"
              >
                <div className="font-bold text-xs group-hover:text-emerald-950">Tigist Haile</div>
                <div className="text-[10px] text-emerald-700 font-semibold">Treasurer (Approver 1)</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("marta@gmail.com")}
                className="p-2.5 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 font-medium border border-amber-200/80 text-left transition group shadow-2xs"
              >
                <div className="font-bold text-xs group-hover:text-amber-950">Marta Bekele</div>
                <div className="text-[10px] text-amber-700 font-semibold">Cycle 3 Beneficiary</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("admin@ethioequb.com")}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-900 hover:bg-slate-200 font-medium border border-slate-300 text-left transition group shadow-2xs"
              >
                <div className="font-bold text-xs group-hover:text-slate-950">Platform Admin</div>
                <div className="text-[10px] text-slate-600 font-semibold">Audit Inspector</div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{" "}
            <Link to="/register" className="font-bold text-teal-700 hover:text-teal-800 underline">
              Register here
            </Link>
          </div>
        </div>

        {/* Security Assurance Badge */}
        <div className="mt-4 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>Protected with HttpOnly secure sessions & bcrypt password hashing</span>
        </div>
      </div>
    </div>
  );
};
