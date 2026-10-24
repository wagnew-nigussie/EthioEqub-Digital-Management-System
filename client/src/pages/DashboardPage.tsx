import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";
import { formatETB } from "@ethioequb/shared";
import {
  TrendingUp,
  CreditCard,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Download,
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-lg mx-auto mt-12 shadow-sm">
        <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
          ዕ
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Welcome to EthioEqub!</h3>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          You are not currently enrolled in any Equb group. Create a new rotating savings circle or ask your group organizer for an invitation.
        </p>
        <Link
          to="/groups"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 transition shadow-sm"
        >
          Create New Equb Group
        </Link>
      </div>
    );
  }

  const group = summary?.group;
  const stats = summary?.stats;
  const currentCycle = group?.cycles?.find((c: any) => c.status === "OPEN") || group?.cycles?.[0];

  return (
    <div className="space-y-6">
      {/* Top Banner & Group Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {group?.name || "Equb Dashboard"}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {group?.status || "ACTIVE"}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Frequency: <span className="font-semibold text-slate-700">{group?.frequency}</span> • Contribution:{" "}
            <span className="font-semibold text-slate-700">
              {group ? formatETB(BigInt(group.contributionAmount)) : "—"}
            </span>
          </p>
        </div>

        {/* Group Switcher if user belongs to multiple */}
        {groups.length > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500">Switch Equb:</label>
            <select
              value={selectedGroupId || ""}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            >
              {groups.map((g) => (
                <option key={g.group.id} value={g.group.id}>
                  {g.group.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* KPI Stat Cards (FR-017) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Collected</span>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            {stats ? formatETB(BigInt(stats.totalCollectedMinor)) : "0.00 ETB"}
          </div>
          <div className="text-[11px] text-teal-600 font-medium mt-1 flex items-center gap-1">
            <span>Verified ledger sum</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Disbursed Payouts</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            {stats ? formatETB(BigInt(stats.totalDisbursedMinor)) : "0.00 ETB"}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Paid to cycle recipients
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pool Reserve Balance</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-indigo-700">
            {stats ? formatETB(BigInt(stats.netPoolBalanceMinor)) : "0.00 ETB"}
          </div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">
            Awaiting next cycle disbursement
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Members</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            {stats?.memberCount || 0} / {stats?.totalCycles || 0}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Current Cycle: #{stats?.currentCycleNumber || 1}
          </div>
        </div>
      </div>

      {/* Cycle Highlight Card */}
      {currentCycle && (
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-400/30 mb-2">
                <Clock className="w-3.5 h-3.5" /> Current Operational Round
              </div>
              <h2 className="text-2xl font-bold">
                Cycle #{currentCycle.cycleNumber} of {group.totalCycles}
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Due Date: {new Date(currentCycle.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/contributions"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 transition shadow-sm"
              >
                <CreditCard className="w-4 h-4" /> Record Member Payment
              </Link>
              <Link
                to={`/groups/${group.id}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition border border-white/20"
              >
                <span>Full Schedule</span> <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recent Ledger Transactions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Recent Contribution Records</h3>
            <p className="text-xs text-slate-500">Live payments verified with transaction references</p>
          </div>
          <a
            href={`/api/v1/groups/${group?.id}/reports/ledger.csv`}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Member</th>
                <th className="px-5 py-3">Cycle</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
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
                    <tr key={ct.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-3.5 font-medium text-slate-900">
                        {ct.membership?.user?.fullName || "Member"}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 font-medium">#{ct.cycleNum}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-900">
                        {formatETB(BigInt(ct.amount))}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {ct.paymentMethod}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-slate-600">
                        {ct.referenceNumber || "—"}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {new Date(ct.recordedAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> {ct.status}
                        </span>
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
