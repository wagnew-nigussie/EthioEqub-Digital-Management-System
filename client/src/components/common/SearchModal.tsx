import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Users,
  LayoutDashboard,
  CreditCard,
  CheckCircle,
  FileSpreadsheet,
  History,
  ArrowRight,
  Receipt,
} from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery("");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickNav = [
    { title: "Dashboard Overview", subtitle: "Financial metrics, progress & quick stats", to: "/", icon: LayoutDashboard },
    { title: "Bole Commercial Merchants Equb", subtitle: "Group details, member shares & roster", to: "/groups", icon: Users },
    { title: "Record Contribution", subtitle: "Reconcile Telebirr, CBE Birr & Bank slips", to: "/contributions", icon: CreditCard },
    { title: "Payout Approvals", subtitle: "Dual-control signoff workflow (Approver 1 & 2)", to: "/payouts", icon: CheckCircle },
    { title: "Financial Statements & CSV", subtitle: "Export immutable ledger records", to: "/reports", icon: FileSpreadsheet },
    { title: "Security Audit Trail", subtitle: "Cryptographic event logs & SHA-256 state diffs", to: "/audit-logs", icon: History },
  ];

  const demoMembers = [
    { name: "Wagnew Nigussie", role: "Group Owner / Lead", email: "wagnewnigussie569@gmail.com", to: "/groups" },
    { name: "Tigist Haile", role: "Group Treasurer", email: "tigist@gmail.com", to: "/contributions" },
    { name: "Chala Tadesse", role: "Member (Cycle 1, 2, 3 Paid)", email: "chala@gmail.com", to: "/contributions" },
    { name: "Marta Bekele", role: "Member (Next Beneficiary)", email: "marta@gmail.com", to: "/payouts" },
  ];

  const demoReceipts = [
    { ref: "TLB-492019", channel: "Telebirr", member: "Wagnew Nigussie", amount: "10,000 ETB", cycle: "Cycle 1" },
    { ref: "CBE-883019", channel: "CBE Birr", member: "Chala Tadesse", amount: "10,000 ETB", cycle: "Cycle 2" },
    { ref: "BNK-992011", channel: "Bank Transfer", member: "Tigist Haile", amount: "10,000 ETB", cycle: "Cycle 1" },
  ];

  const filteredNav = quickNav.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const filteredMembers = demoMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.email.toLowerCase().includes(query.toLowerCase()) ||
      m.role.toLowerCase().includes(query.toLowerCase())
  );

  const filteredReceipts = demoReceipts.filter(
    (r) =>
      r.ref.toLowerCase().includes(query.toLowerCase()) ||
      r.member.toLowerCase().includes(query.toLowerCase()) ||
      r.channel.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (to: string) => {
    navigate(to);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-5 h-5 text-teal-600 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search pages, members, Telebirr/CBE slips, reference IDs... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results / Quick Options */}
        <div className="p-4 overflow-y-auto space-y-5">
          {/* Quick Navigation Pages */}
          {filteredNav.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                System Navigation
              </div>
              <div className="space-y-1">
                {filteredNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.to}
                      onClick={() => handleSelect(item.to)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-teal-50/70 text-left transition group border border-transparent hover:border-teal-200/60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-teal-100/80 text-slate-600 group-hover:text-teal-700 transition">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900 group-hover:text-teal-900">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-500">{item.subtitle}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Members Matching */}
          {filteredMembers.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                Equb Members & Officers
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredMembers.map((m) => (
                  <button
                    key={m.email}
                    onClick={() => handleSelect(m.to)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200/80 hover:border-teal-300 hover:bg-teal-50/50 text-left transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {m.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-slate-900 truncate">{m.name}</div>
                      <div className="text-[10px] text-teal-700 font-medium truncate">{m.role}</div>
                      <div className="text-[10px] text-slate-400 truncate">{m.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Transaction Slips */}
          {filteredReceipts.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                Verified Slips & Receipts
              </div>
              <div className="space-y-1.5">
                {filteredReceipts.map((r) => (
                  <button
                    key={r.ref}
                    onClick={() => handleSelect("/contributions")}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-left transition text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Receipt className="w-4 h-4 text-teal-600 shrink-0" />
                      <div>
                        <span className="font-mono font-bold text-slate-900">{r.ref}</span>
                        <span className="text-slate-400 mx-1.5">•</span>
                        <span className="text-slate-600">{r.member}</span>
                        <span className="text-slate-400 mx-1.5">•</span>
                        <span className="font-semibold text-emerald-600">{r.amount}</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 font-medium">
                      {r.channel}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>Navigation: <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] text-slate-600 shadow-2xs">Enter</kbd></span>
            <span>Close: <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] text-slate-600 shadow-2xs">Esc</kbd></span>
          </div>
          <span className="text-teal-700 font-medium">EthioEqub Universal Lookup</span>
        </div>
      </div>
    </div>
  );
};
