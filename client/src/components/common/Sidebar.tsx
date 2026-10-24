import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  CheckCircle,
  FileSpreadsheet,
  History,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/groups", label: "Equb Groups", icon: Users },
    { to: "/contributions", label: "Record Payment", icon: CreditCard },
    { to: "/payouts", label: "Payout Approvals", icon: CheckCircle },
    { to: "/reports", label: "Reports & CSV", icon: FileSpreadsheet },
    { to: "/audit-logs", label: "Audit Trail", icon: History },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 md:min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-1">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Management
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-teal-50 text-teal-800 border border-teal-200/80 font-semibold shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <Icon className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="mt-8 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500">
        <div className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Ledger Active
        </div>
        <p className="text-[11px] leading-relaxed">
          Financial values strictly calculated in minor units. Dual-control governance enabled.
        </p>
      </div>
    </aside>
  );
};
