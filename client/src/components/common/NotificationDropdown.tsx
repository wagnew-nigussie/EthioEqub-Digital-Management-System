import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCircle2, AlertCircle, Info, ExternalLink } from "lucide-react";

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const notifications = [
    {
      id: "notif-1",
      title: "Dual Payout Approval Required",
      message: "Cycle 3 Payout (40,000 ETB) for Marta Bekele awaits your signature as Approver 2 (Group Owner).",
      time: "10 mins ago",
      type: "URGENT",
      to: "/payouts",
      read: false,
    },
    {
      id: "notif-2",
      title: "CBE Birr Contribution Reconciled",
      message: "Chala Tadesse submitted 10,000 ETB for Cycle 3 (Ref: CBE-883019). Verified by Treasurer.",
      time: "1 hour ago",
      type: "SUCCESS",
      to: "/contributions",
      read: false,
    },
    {
      id: "notif-3",
      title: "Cycle 2 Payout Disbursed",
      message: "Tigist Haile received 40,000 ETB payout. Dual signatures recorded in tamper-evident ledger.",
      time: "Yesterday",
      type: "INFO",
      to: "/reports",
      read: true,
    },
    {
      id: "notif-4",
      title: "Bole Equb Bylaws Finalized",
      message: "PRTDD v1.1 rules enforced: 64-bit integer santim precision, immutable ledgers active.",
      time: "2 days ago",
      type: "INFO",
      to: "/audit-logs",
      read: true,
    },
  ];

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-teal-400 rounded-full border-2 border-slate-900 animate-ping"></span>
        )}
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-teal-400 rounded-full border-2 border-slate-900"></span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-teal-400" />
                <span className="font-semibold text-xs text-white">System Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded-full font-bold border border-teal-500/40">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] text-teal-400 hover:text-teal-300 transition"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  to={n.to}
                  onClick={() => setIsOpen(false)}
                  className={`p-3.5 block hover:bg-slate-50 transition text-left ${
                    !n.read ? "bg-teal-50/40" : ""
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {n.type === "URGENT" && (
                      <div className="p-1.5 rounded-lg bg-teal-100 text-teal-700 mt-0.5 shrink-0">
                        <AlertCircle className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {n.type === "SUCCESS" && (
                      <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 mt-0.5 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {n.type === "INFO" && (
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 mt-0.5 shrink-0">
                        <Info className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-baseline justify-between gap-1">
                        <div className="text-xs font-bold text-slate-900 truncate">{n.title}</div>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
              <Link
                to="/audit-logs"
                onClick={() => setIsOpen(false)}
                className="text-[11px] font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
              >
                <span>View Full Security Audit Log</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
