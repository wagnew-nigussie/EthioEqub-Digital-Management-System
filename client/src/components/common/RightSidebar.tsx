import React from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Smartphone,
  Building,
  FileDown,
  Sparkles,
  HelpCircle,
} from "lucide-react";

interface RightSidebarProps {
  onOpenReceiptModal?: () => void;
  onOpenQuickRecord?: (channel: "TELEBIRR" | "CBE_BIRR") => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ onOpenQuickRecord }) => {
  return (
    <aside className="w-full xl:w-80 space-y-6 shrink-0">
      {/* Active Pool Solvency Gauge */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-teal-100/60 to-transparent rounded-bl-full pointer-events-none"></div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Active Pool Solvency</h3>
          </div>
          <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">
            Cycle 3 of 4
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-slate-500 font-medium">Collected Volume:</span>
            <span className="font-bold text-slate-900 font-mono text-sm">30,000 / 40,000 ETB</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500 relative"
              style={{ width: "75%" }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>3 of 4 Members Paid</span>
            <span className="font-bold text-emerald-600">75% Solvency</span>
          </div>
        </div>

        {/* Next Payout Beneficiary Card */}
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Next Payout Beneficiary</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                MB
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Marta Bekele</div>
                <div className="text-[10px] text-amber-800 font-medium">Position #3 • 40,000 ETB</div>
              </div>
            </div>
            <span className="text-[10px] font-semibold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
              Queued
            </span>
          </div>

          {/* Dual-Control Status */}
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/60 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Approver 1 (Treasurer):</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Tigist Haile
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Approver 2 (Owner):</span>
              <span className="text-amber-700 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600 animate-spin" /> Pending Wagnew
              </span>
            </div>

            <Link
              to="/payouts"
              className="mt-2 w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <span>Review Dual Approval</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Transaction Launcher */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
          <span>Quick Payment Recording</span>
        </h3>
        <p className="text-xs text-slate-500 leading-snug">
          Instant manual reconciliation with verified transaction slips:
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            to="/contributions"
            onClick={() => onOpenQuickRecord?.("TELEBIRR")}
            className="p-3 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200/70 text-left transition group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <Smartphone className="w-4 h-4 text-orange-600" />
              <span className="text-[10px] font-bold text-orange-700">0% Fee</span>
            </div>
            <div className="font-bold text-xs text-slate-900 group-hover:text-orange-950">Telebirr</div>
            <div className="text-[10px] text-slate-500">Fast slip entry</div>
          </Link>

          <Link
            to="/contributions"
            onClick={() => onOpenQuickRecord?.("CBE_BIRR")}
            className="p-3 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200/70 text-left transition group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <Building className="w-4 h-4 text-purple-600" />
              <span className="text-[10px] font-bold text-purple-700">CBE Birr</span>
            </div>
            <div className="font-bold text-xs text-slate-900 group-hover:text-purple-950">CBE Slip</div>
            <div className="text-[10px] text-slate-500">Bank deposit ref</div>
          </Link>
        </div>

        <Link
          to="/reports"
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-xs font-medium text-slate-700 transition"
        >
          <div className="flex items-center gap-2">
            <FileDown className="w-4 h-4 text-teal-600" />
            <span>Download CSV Statement</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">v1.1</span>
        </Link>
      </div>

      {/* Live Financial Audit Activity Stream */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Audit Stream</span>
          </h3>
          <Link to="/audit-logs" className="text-[11px] text-teal-600 hover:text-teal-700 font-semibold">
            Full Log &rarr;
          </Link>
        </div>

        <div className="space-y-3 pt-1">
          <div className="flex items-start gap-2.5 text-xs">
            <div className="w-2 h-2 rounded-full bg-teal-500 mt-1 shrink-0"></div>
            <div>
              <p className="text-slate-800 font-medium leading-snug">
                Approver 1 signed Marta's Cycle 3 payout
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                <span>By Tigist Haile</span>
                <span>•</span>
                <span>12 mins ago</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0"></div>
            <div>
              <p className="text-slate-800 font-medium leading-snug">
                10,000 ETB collected via CBE Birr
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                <span className="font-mono text-slate-500">Ref: CBE-883019</span>
                <span>•</span>
                <span>1 hour ago</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0"></div>
            <div>
              <p className="text-slate-800 font-medium leading-snug">
                Weekly cycle schedule generated
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                <span>By Wagnew Nigussie</span>
                <span>•</span>
                <span>Yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Traditional Equb Mediation & Hotline */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 space-y-2 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
          <ShieldAlert className="w-4 h-4" />
          <span>Equb Mediation Committee</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Need impartial dispute settlement or bylaws arbitration under traditional Ethiopian Equb rules?
        </p>
        <div className="pt-1 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Direct Helpline:</span>
          <span className="font-mono font-semibold text-emerald-400">+251 91 100 0000</span>
        </div>
        <a
          href="mailto:wagnewnigussie569@gmail.com?subject=Equb%20Mediation%20Inquiry"
          className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Contact Wagnew Nigussie</span>
        </a>
      </div>
    </aside>
  );
};
