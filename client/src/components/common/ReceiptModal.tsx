import React from "react";
import { X, Printer, ShieldCheck, CheckCircle2, Download, QrCode } from "lucide-react";

export interface ReceiptData {
  receiptNumber: string;
  groupName: string;
  memberName: string;
  memberEmail?: string;
  cycleNumber: number;
  amountETB: number;
  channel: string;
  transactionRef: string;
  timestamp: string;
  treasurerName: string;
}

interface ReceiptModalProps {
  receipt: ReceiptData | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose }) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Receipt Header Banner */}
        <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-bl-full pointer-events-none"></div>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center font-bold text-white shadow-md text-lg">
                ዕ
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">EthioEqub Digital Receipt</h3>
                <p className="text-xs text-teal-400 font-serif">የኢትዮ ዕቁብ ሕጋዊ ኤሌክትሮኒክ የክፍያ ማረጋገጫ</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div>
              <span className="text-slate-400 text-[10px] block uppercase tracking-wider">Receipt Serial</span>
              <span className="font-mono font-bold text-teal-300">{receipt.receiptNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[10px] block uppercase tracking-wider">Status</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Reconciled & Audited
              </span>
            </div>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="p-6 space-y-4 text-slate-700 text-xs">
          {/* Amount Paid Callout */}
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200/80 text-center">
            <div className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider">
              Total Amount Contributed
            </div>
            <div className="text-2xl font-bold font-mono text-teal-950 mt-0.5">
              ETB {receipt.amountETB.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-teal-700 font-mono mt-0.5">
              ({(receipt.amountETB * 100).toLocaleString()} Minor Santim Units)
            </div>
          </div>

          {/* Details Table */}
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 space-y-2">
            <div className="flex justify-between items-center pt-1 text-xs">
              <span className="text-slate-500">Equb Group:</span>
              <span className="font-semibold text-slate-900">{receipt.groupName}</span>
            </div>
            <div className="flex justify-between items-center pt-2 text-xs">
              <span className="text-slate-500">Member Name:</span>
              <span className="font-semibold text-slate-900">{receipt.memberName}</span>
            </div>
            <div className="flex justify-between items-center pt-2 text-xs">
              <span className="text-slate-500">Cycle Number:</span>
              <span className="font-semibold text-slate-900">Cycle #{receipt.cycleNumber}</span>
            </div>
            <div className="flex justify-between items-center pt-2 text-xs">
              <span className="text-slate-500">Payment Channel:</span>
              <span className="font-semibold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded text-[11px]">
                {receipt.channel}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 text-xs">
              <span className="text-slate-500">Transaction Reference:</span>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {receipt.transactionRef}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 text-xs">
              <span className="text-slate-500">Verification Timestamp:</span>
              <span className="text-slate-700 font-mono">{receipt.timestamp}</span>
            </div>
          </div>

          {/* Verification & Sign-off Box */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/80 border border-slate-200 text-[11px]">
            <div className="flex items-center gap-2">
              <QrCode className="w-8 h-8 text-slate-700 shrink-0" />
              <div>
                <div className="font-semibold text-slate-800">Tamper-Evident SHA-256 Seal</div>
                <div className="text-[10px] text-slate-500">
                  Verified by Treasurer ({receipt.treasurerName})
                </div>
              </div>
            </div>
            <div className="text-right">
              <ShieldCheck className="w-5 h-5 text-emerald-600 inline-block" />
              <div className="text-[9px] text-emerald-700 font-semibold uppercase">Official Seal</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-200 transition"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
