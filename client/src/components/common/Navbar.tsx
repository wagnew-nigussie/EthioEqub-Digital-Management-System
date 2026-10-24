import React from "react";
import { useAuth } from "../../context/AuthContext";
import { LogOut, User, ShieldCheck } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center font-bold text-white shadow-md text-lg tracking-wider">
            ዕ
          </div>
          <div>
            <div className="font-bold text-lg leading-tight flex items-center gap-1.5">
              <span>EthioEqub</span>
              <span className="text-teal-400 font-medium text-xs px-2 py-0.5 bg-teal-950/60 rounded-full border border-teal-800/60">
                ዕቁብ Digital
              </span>
            </div>
            <p className="text-xs text-slate-400">Rotating Savings & Credit System</p>
          </div>
        </div>

        {/* User Info & Actions */}
        {user && (
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center text-xs font-semibold">
                {user.fullName.charAt(0)}
              </div>
              <div className="text-left text-xs">
                <div className="font-medium text-slate-200">{user.fullName}</div>
                <div className="text-teal-400 font-mono text-[10px]">{user.email}</div>
              </div>
              {user.systemRole === "ADMIN" && (
                <span title="Platform Admin">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 ml-1" />
                </span>
              )}
            </div>

            <button
              onClick={() => logout()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 rounded-lg border border-slate-700 transition"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
