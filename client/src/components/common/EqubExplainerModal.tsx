import React from "react";
import { X, Users, PiggyBank, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

interface EqubExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EqubExplainerModal: React.FC<EqubExplainerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center font-bold text-white shadow-md text-2xl">
                ዕ
              </div>
              <div>
                <h3 className="font-extrabold text-lg sm:text-xl text-white">How EthioEqub Works</h3>
                <p className="text-xs text-teal-300 font-serif">ቀላል እና ግልጽ የዕቁብ አሰራር መመሪያ (Beginner Guide)</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700">
          {/* Welcome Callout */}
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-xs leading-relaxed text-teal-950 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sm font-bold text-teal-900 block mb-1">
                Welcome to Traditional Ethiopian Savings, Digitized!
              </strong>
              An <strong>Equb (ዕቁብ)</strong> is a traditional rotating savings circle where members pool their money regularly, and each member takes turns receiving the full lump-sum payout. This platform manages every step transparently and securely.
            </div>
          </div>

          {/* 3 Step Visual Guide */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              The 3-Step Equb Cycle
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <div className="font-bold text-xs text-slate-900">Members Contribute</div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Each member sends their agreed share (e.g. 10,000 ETB) via <strong>Telebirr</strong>, <strong>CBE Birr</strong>, or Bank.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                  2
                </div>
                <div className="font-bold text-xs text-slate-900">Pool is Collected</div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  The Treasurer verifies transaction references. 4 members × 10,000 ETB creates a <strong>40,000 ETB pool</strong>.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                  3
                </div>
                <div className="font-bold text-xs text-slate-900">Payout is Disbursed</div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  The scheduled recipient receives the full 40,000 ETB after <strong>Dual-Control Authorization</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Key Security Principles */}
          <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>How Your Money is Protected</span>
            </h4>

            <div className="space-y-2 text-[11px] text-slate-600">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Dual-Control Sign-Off:</strong> Like two keys to a bank vault, both the <em>Treasurer</em> (Approver 1) and the <em>Group Owner</em> (Approver 2) must independently sign before any money is paid out.
                </span>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Exact Santim Math:</strong> All finances are calculated in 64-bit integer minor units (Santim) so no fractions or cents are ever lost.
                </span>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Official Digital Receipts:</strong> Every single payment generates a printable electronic receipt with a unique serial number and cryptographic seal.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Governed by Ethiopian Traditional Equb Bylaws
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition shadow-sm"
          >
            Got It! Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
