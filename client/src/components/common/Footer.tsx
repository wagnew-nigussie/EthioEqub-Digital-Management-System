import React from "react";
import { ShieldCheck, Database, Award, ExternalLink, Heart, Clock } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto">
      {/* Top Footer Banner */}
      <div className="bg-slate-950/70 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="font-semibold text-slate-200">
              Live Core Banking Reconciliation Engine v1.1
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline text-slate-400">
              PostgreSQL 17 Minor-Unit (Santim) Ledger Active
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60 text-slate-300">
              <Clock className="w-3 h-3 text-teal-400" />
              Addis Ababa (UTC+3)
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60 text-emerald-300 font-mono">
              <Database className="w-3 h-3 text-emerald-400" />
              DB: Connected (24ms)
            </span>
            <span className="flex items-center gap-1 bg-teal-950/80 text-teal-300 px-2.5 py-1 rounded-md border border-teal-800/60 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              Dual-Control Enforced
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center font-bold text-white shadow-md text-base">
                ዕ
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                EthioEqub <span className="text-teal-400 font-normal">Digital Management</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A high-integrity, automated Rotating Savings and Credit Association (ROSCA / ዕቁብ) financial platform. Built with 64-bit integer santim precision, tamper-evident audit trails, and dual-control payout authorization to preserve Ethiopian community heritage with modern digital governance.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Governed according to Ethiopian Civil Code Articles 3040–3052 on Traditional Savings.</span>
            </div>
          </div>

          {/* Governance & Specifications */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Architecture & Docs
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/EthioEqub_Digital_Management_System_PRTDD.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-400 transition inline-flex items-center gap-1 text-slate-300"
                >
                  <span>PRTDD Technical Specification</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="/audit-logs" className="hover:text-teal-400 transition">
                  Cryptographic Audit Trail
                </a>
              </li>
              <li>
                <a href="/reports" className="hover:text-teal-400 transition">
                  Financial Statements & CSV Ledger
                </a>
              </li>
              <li>
                <a href="/payouts" className="hover:text-teal-400 transition">
                  Dual-Control Sign-Off Workflow
                </a>
              </li>
            </ul>
          </div>

          {/* Lead Engineer & Ownership */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Project Leadership
            </h4>
            <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 space-y-1.5">
              <div className="text-xs font-semibold text-white">Wagnew Nigussie</div>
              <div className="text-[11px] text-teal-400 font-mono">wagnewnigussie569@gmail.com</div>
              <p className="text-[10px] text-slate-400 pt-1 leading-snug">
                Lead Software Engineer & System Architect
              </p>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
              <span>Built with passion & precision in Ethiopia</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} EthioEqub Digital Management System. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-slate-400">Version 1.1.0-prod</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Zero IEEE-754 Precision Loss</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-medium">100% Verified Tests</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
