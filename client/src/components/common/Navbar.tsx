import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { NotificationDropdown } from "./NotificationDropdown";
import {
  LogOut,
  ShieldCheck,
  Search,
  Menu,
  X,
  CreditCard,
  Building,
  TrendingUp,
} from "lucide-react";

interface NavbarProps {
  onOpenSearch: () => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onToggleMobileMenu }) => {
  const { user, logout } = useAuth();
  const [ethiopianTime, setEthiopianTime] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setEthiopianTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Africa/Addis_Ababa",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top Mini-Ticker Bar */}
      <div className="bg-slate-950/90 border-b border-slate-800/60 px-4 sm:px-6 lg:px-8 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <strong className="text-white">Telebirr & CBE Birr</strong> Gateway: Reconciled
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-teal-400" />
              USD/ETB: 125.40 • EUR/ETB: 136.20
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-300 font-medium">
              Tikimt 2017 E.C. • Addis Ababa: <span className="font-mono text-teal-300">{ethiopianTime || "10:20 AM"}</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-mono text-[10px]">
              Santim Engine v1.1 (64-Bit)
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              onToggleMobileMenu?.();
            }}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center font-bold text-white shadow-md text-lg tracking-wider group-hover:scale-105 transition">
              ዕ
            </div>
            <div>
              <div className="font-bold text-lg leading-tight flex items-center gap-1.5 text-white">
                <span>EthioEqub</span>
                <span className="text-teal-400 font-medium text-xs px-2 py-0.5 bg-teal-950/80 rounded-full border border-teal-800/60 shadow-2xs">
                  ዕቁብ Digital
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Rotating Savings & Credit Governance</p>
            </div>
          </Link>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-teal-500/50 text-xs text-slate-400 hover:text-slate-300 transition shadow-inner group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-teal-400 transition" />
              <span>Search members, receipts, cycles, reference IDs...</span>
            </div>
            <kbd className="px-2 py-0.5 rounded bg-slate-700/80 text-[10px] text-slate-300 font-mono border border-slate-600/60">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right: Quick Tools, Notifications, User */}
        <div className="flex items-center space-x-3">
          {/* Quick Search on small screens */}
          <button
            onClick={onOpenSearch}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Search (Ctrl+K)"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <NotificationDropdown />

          {/* User Profile Capsule */}
          {user && (
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/70 shadow-2xs">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-xs font-bold text-white shadow-2xs">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900"></span>
                </div>

                <div className="text-left text-xs">
                  <div className="font-semibold text-white flex items-center gap-1">
                    <span>{user.fullName}</span>
                    {user.systemRole === "ADMIN" && (
                      <span title="Platform Administrator">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </span>
                    )}
                  </div>
                  <div className="text-teal-400 text-[10px] font-mono leading-none">
                    Group Owner • Bole Equb
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => logout()}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-rose-200 bg-slate-800 hover:bg-rose-950/60 rounded-xl border border-slate-700 hover:border-rose-800/60 transition shadow-2xs"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-t border-slate-800 p-4 space-y-3 animate-fadeIn">
          <div className="text-xs text-slate-400">Signed in as:</div>
          <div className="font-semibold text-white text-sm">{user?.fullName} ({user?.email})</div>
          <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
            <Link
              to="/contributions"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-teal-400 font-medium flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Record Slip</span>
            </Link>
            <Link
              to="/payouts"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 font-medium flex items-center gap-2"
            >
              <Building className="w-4 h-4" />
              <span>Approvals</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
