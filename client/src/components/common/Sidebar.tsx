import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  CheckCircle,
  FileSpreadsheet,
  History,
  Shield,
  Layers,
  ChevronRight,
  Lock,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const coreNav = [
    { to: "/", label: "Dashboard Overview", icon: LayoutDashboard, badge: null },
    { to: "/groups", label: "Equb Groups & Roster", icon: Users, badge: "1 Active" },
    { to: "/contributions", label: "Record Payment Slip", icon: CreditCard, badge: "Instant" },
    { to: "/payouts", label: "Payout Approvals", icon: CheckCircle, badge: "Dual Sign" },
  ];

  const complianceNav = [
    { to: "/reports", label: "Financial Reports & CSV", icon: FileSpreadsheet, badge: null },
    { to: "/audit-logs", label: "Security Audit Trail", icon: History, badge: "SHA-256" },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 md:min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0 shadow-2xs">
      <div className="space-y-6">
        {/* Active Group Card Pill */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-900 to-slate-900 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="flex items-center justify-between text-[10px] text-teal-300 uppercase tracking-wider font-semibold mb-1">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Active Equb Group
            </span>
            <Layers className="w-3.5 h-3.5 text-teal-400" />
          </div>

          <div className="font-bold text-xs leading-snug text-white">
            Bole Commercial Merchants Equb
          </div>

          <div className="mt-2 pt-2 border-t border-teal-800/60 flex items-center justify-between text-[11px] text-slate-300">
            <span>Pool: 40,000 ETB</span>
            <span className="font-semibold text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-700/60">
              Cycle 3 / 4
            </span>
          </div>
        </div>

        {/* Core Banking Navigation */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
            <span>Core Operations</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
          </div>
          <div className="space-y-1">
            {coreNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? "bg-teal-50 text-teal-900 border border-teal-200/90 font-bold shadow-2xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-teal-100/70 text-teal-800 font-semibold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Compliance & Audit Navigation */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
            <span>Audit & Compliance</span>
            <Shield className="w-3 h-3 text-slate-300" />
          </div>
          <div className="space-y-1">
            {complianceNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? "bg-teal-50 text-teal-900 border border-teal-200/90 font-bold shadow-2xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      {/* Financial Governance Footer Capsule */}
      <div className="mt-8 p-3 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200 text-slate-600 space-y-1.5 shadow-2xs">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Financial Security</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-snug">
          64-bit integer Santim math. Ledgers strictly immutable (Zero in-place deletions).
        </p>
        <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-200/80">
          <span>Dual Control</span>
          <span className="text-emerald-700 font-bold font-sans">Active</span>
        </div>
      </div>
    </aside>
  );
};
