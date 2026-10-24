import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { RightSidebar } from "./RightSidebar";
import { Footer } from "./Footer";
import { SearchModal } from "./SearchModal";
import { ReceiptModal } from "./ReceiptModal";
import { useUI } from "../../context/UIContext";
import { useAuth } from "../../context/AuthContext";
import { ShieldCheck, Sparkles } from "lucide-react";

export const Layout: React.FC = () => {
  const { isSearchOpen, openSearch, closeSearch, activeReceipt, closeReceipt } = useUI();
  const { user } = useAuth();
  const location = useLocation();

  // Show right action rail on dashboard and contributions
  const showRightRail = location.pathname === "/" || location.pathname === "/contributions";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Universal Top Navigation */}
      <Navbar onOpenSearch={openSearch} />

      {/* Main Multi-Column Workspace */}
      <div className="flex-1 w-full max-w-[1536px] mx-auto flex flex-col md:flex-row">
        {/* Left Navigation Sidebar */}
        <Sidebar />

        {/* Center Main Work Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
          {/* Subtle Top Greeting & Context Pill */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-slate-900">
                  Welcome, {user?.fullName || "Wagnew Nigussie"}
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/70">
                  <ShieldCheck className="w-3 h-3 text-teal-600" />
                  Group Owner
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Bole Commercial Merchants Weekly Equb • 4 Active Members • Cycle 3 Active
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Next Disbursement: <strong>40,000 ETB</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <Outlet />
            </div>

            {/* Right Action & Live Activity Rail (when applicable) */}
            {showRightRail && (
              <div className="hidden xl:block">
                <RightSidebar />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Global Enterprise Footer */}
      <Footer />

      {/* Global Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
      <ReceiptModal receipt={activeReceipt} onClose={closeReceipt} />
    </div>
  );
};
