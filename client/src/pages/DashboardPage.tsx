import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { apiRequest } from "../services/api";
import { formatETB } from "@ethioequb/shared";
import {
  TrendingUp,
  CreditCard,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Download,
  Receipt,
  Sparkles,
  ArrowRight,
  Building,
  Smartphone,
  ShieldCheck,
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { openReceipt, openExplainer } = useUI();
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [summary, setSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await apiRequest<{ groups: any[] }>("/groups");
        setGroups(res.groups || []);
        if (res.groups && res.groups.length > 0) {
          setSelectedGroupId(res.groups[0].group.id);
        }
      } catch (err) {
        console.error("Failed to load user groups", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  // Fetch summary for selected group
  useEffect(() => {
    if (!selectedGroupId) return;
    const fetchSummary = async () => {
      try {
        const res = await apiRequest<{ group: any; stats: any }>(`/groups/${selectedGroupId}`);
        setSummary(res);
      } catch (err) {
        console.error("Failed to load group summary", err);
      }
    };
    fetchSummary();
  }, [selectedGroupId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-medium">Loading EthioEqub core ledger...</p>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center max-w-lg mx-auto mt-12 shadow-md">
        <div className="w-16 h-16 bg-gradient-to-tr from-teal-500 to-emerald-400 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-2xl shadow-md">
          ዕ
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Welcome to EthioEqub!</h3>
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          You are not currently enrolled in any Equb circle. Create a rotating savings group or ask an organizer for access.
        </p>
        <Link
          to="/groups"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 transition shadow-sm"
        >
          Create New Equb Group
        </Link>
      </div>
    );
  }

  const group = summary?.group;
  const stats = summary?.stats;
  const currentCycle = group?.cycles?.find((c: any) => c.status === "OPEN") || group?.cycles?.[2] || group?.cycles?.[0];

  const handleViewReceipt = (ct: any) => {
    openReceipt({
      receiptNumber: `REC-${ct.id.substring(0, 8).toUpperCase()}`,
      groupName: group?.name || "Bole Commercial Merchants Equb",
      memberName: ct.membership?.user?.fullName || "Member",
      cycleNumber: ct.cycleNum || 3,
      amountETB: Number(ct.amount) / 100,
      channel: ct.paymentMethod,
      transactionRef: ct.referenceNumber || "CBE-883019",
      timestamp: new Date(ct.recordedAt).toLocaleString("en-US", { timeZone: "Africa/Addis_Ababa" }),
      treasurerName: "Tigist Haile",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Equb Hub Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Active Cycle #{stats?.currentCycleNumber || 3} of {stats?.totalCycles || 4}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {group?.name || "Bole Commercial Merchants Equb"}
            </h1>

            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Standard weekly rotating savings group. 4 Verified merchant members. Fixed contribution of{" "}
              <strong className="text-teal-300 font-semibold">10,000.00 ETB</strong> per cycle for a total pooled payout of{" "}
              <strong className="text-emerald-300 font-semibold">40,000.00 ETB</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/contributions"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 hover:from-teal-300 hover:to-emerald-300 transition shadow-md"
            >
              <CreditCard className="w-4 h-4 text-slate-950" />
              <span>Record Payment</span>
            </Link>

            <Link
              to="/payouts"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition border border-white/20 backdrop-blur-sm"
            >
              <span>Dual Approvals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Friendly Round Explainer Banner for New Users */}
      <div className="p-4 rounded-3xl bg-white border border-teal-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200 shadow-2xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span>Current Round #3 Goal: Collect 40,000 ETB for Marta Bekele</span>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                3 of 4 Contributed
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Wagnew Nigussie, Tigist Haile, and Chala Tadesse have each paid their 10,000 ETB. Once Marta Bekele completes her payment, the full 40,000 ETB pool will be unlocked and disbursed to her following Dual-Control Sign-Off!
            </p>
          </div>
        </div>

        <button
          onClick={openExplainer}
          className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl border border-teal-200/80 transition shrink-0"
        >
          <span>How It Works (መመሪያ)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Financial Metric Cards (FR-017) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-teal-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Collected</span>
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl group-hover:scale-110 transition">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {stats ? formatETB(BigInt(stats.totalCollectedMinor)) : "0.00 ETB"}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Minor units (Santim) reconciled</span>
          </div>
        </div>

        {/* Disbursed Payouts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-teal-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Disbursed Payouts</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl group-hover:scale-110 transition">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {stats ? formatETB(BigInt(stats.totalDisbursedMinor)) : "0.00 ETB"}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            2 of 4 Cycles Fully Disbursed
          </div>
        </div>

        {/* Net Pool Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-teal-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pool Reserve Balance</span>
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl group-hover:scale-110 transition">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-teal-800">
            {stats ? formatETB(BigInt(stats.netPoolBalanceMinor)) : "0.00 ETB"}
          </div>
          <div className="text-[11px] text-teal-700 font-medium mt-1">
            Ready for Cycle #3 Payout
          </div>
        </div>

        {/* Members & Frequency */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-teal-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Roster & Shares</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl group-hover:scale-110 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {stats?.memberCount || 4} Members
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {group?.frequency || "WEEKLY"} Rotational Schedule
          </div>
        </div>
      </div>

      {/* Cycle 3 In-Depth Progress Visualizer */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>Cycle #{currentCycle?.cycleNumber || 3} Contribution Matrix</span>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                75% Solvency (30,000 / 40,000 ETB)
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live payment reconciliation for each member in the current round
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Paid (3)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Pending (1)
            </span>
          </div>
        </div>

        {/* Member Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Member 1: Wagnew Nigussie */}
          <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                WN
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Paid
              </span>
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900">Wagnew Nigussie</div>
              <div className="text-[10px] text-teal-700 font-medium">Group Owner • 10,000 ETB</div>
            </div>
            <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-1 border-t border-teal-100">
              <span>Telebirr</span>
              <span className="text-slate-700">TLB-492019</span>
            </div>
          </div>

          {/* Member 2: Tigist Haile */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                TH
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Paid
              </span>
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900">Tigist Haile</div>
              <div className="text-[10px] text-emerald-700 font-medium">Treasurer • 10,000 ETB</div>
            </div>
            <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-1 border-t border-emerald-100">
              <span>Bank Transfer</span>
              <span className="text-slate-700">BNK-992011</span>
            </div>
          </div>

          {/* Member 3: Chala Tadesse */}
          <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                CT
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Paid
              </span>
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900">Chala Tadesse</div>
              <div className="text-[10px] text-purple-700 font-medium">Member • 10,000 ETB</div>
            </div>
            <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-1 border-t border-purple-100">
              <span>CBE Birr</span>
              <span className="text-slate-700">CBE-883019</span>
            </div>
          </div>

          {/* Member 4: Marta Bekele */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                MB
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" /> Due Soon
              </span>
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900">Marta Bekele</div>
              <div className="text-[10px] text-amber-800 font-medium">Next Recipient • 10,000 ETB</div>
            </div>
            <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-amber-100">
              <span>Status:</span>
              <Link to="/contributions" className="text-teal-700 font-semibold hover:underline">
                Record Now &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Ledger Transactions with View Slip capability */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Verified Contribution Slips</h3>
            <p className="text-xs text-slate-500">Click any transaction to inspect or print its official electronic receipt</p>
          </div>
          <a
            href={`/api/v1/groups/${group?.id}/reports/ledger.csv`}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
          >
            <Download className="w-3.5 h-3.5" /> Export Ledger CSV
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Member</th>
                <th className="px-5 py-3">Cycle</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Channel</th>
                <th className="px-5 py-3">Reference Slip</th>
                <th className="px-5 py-3">Verification</th>
                <th className="px-5 py-3 text-right">Digital Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {group?.cycles?.flatMap((c: any) => c.contributions)?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No contributions recorded yet.
                  </td>
                </tr>
              ) : (
                group?.cycles
                  ?.flatMap((c: any) =>
                    c.contributions.map((ct: any) => ({ ...ct, cycleNum: c.cycleNumber }))
                  )
                  ?.slice(-8)
                  ?.reverse()
                  ?.map((ct: any) => (
                    <tr key={ct.id} className="hover:bg-slate-50/80 transition group">
                      <td className="px-5 py-3.5 font-semibold text-slate-900">
                        {ct.membership?.user?.fullName || "Member"}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 font-medium">#{ct.cycleNum}</td>
                      <td className="px-5 py-3.5 font-bold font-mono text-slate-900">
                        {formatETB(BigInt(ct.amount))}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {ct.paymentMethod}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-slate-600">
                        {ct.referenceNumber || "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Reconciled
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleViewReceipt(ct)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 transition"
                        >
                          <Receipt className="w-3 h-3" />
                          <span>View Slip</span>
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
