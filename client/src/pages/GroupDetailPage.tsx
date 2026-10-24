import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import { formatETB } from "@ethioequb/shared";
import {
  Users,
  Calendar,
  CreditCard,
  Shield,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Clock,
  UserCheck,
} from "lucide-react";

export const GroupDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<any | null>(null);
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"members" | "cycles" | "contributions">("members");

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await apiRequest<{ group: any; stats: any }>(`/groups/${id}`);
        setGroup(res.group);
        setStats(res.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="p-8 text-center text-slate-500">
        Equb group not found.{" "}
        <Link to="/groups" className="text-teal-700 underline font-semibold">
          Return to groups
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/groups"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Groups
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{group.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  {group.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">{group.description}</p>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400 uppercase font-semibold">Periodic Pool</div>
              <div className="text-xl font-extrabold text-teal-800 mt-0.5">
                {formatETB(BigInt(group.contributionAmount) * BigInt(group.totalCycles))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-400">Contribution:</span>
              <div className="font-bold text-slate-900">{formatETB(BigInt(group.contributionAmount))}</div>
            </div>
            <div>
              <span className="text-slate-400">Frequency:</span>
              <div className="font-bold text-slate-900">{group.frequency}</div>
            </div>
            <div>
              <span className="text-slate-400">Total Rounds:</span>
              <div className="font-bold text-slate-900">{group.totalCycles} Cycles</div>
            </div>
            <div>
              <span className="text-slate-400">Payout Rule:</span>
              <div className="font-bold text-slate-900">{group.payoutRule}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("members")}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition ${
            activeTab === "members"
              ? "border-teal-700 text-teal-800 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="w-4 h-4" /> Members Roster ({group.memberships.length})
        </button>

        <button
          onClick={() => setActiveTab("cycles")}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition ${
            activeTab === "cycles"
              ? "border-teal-700 text-teal-800 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Calendar className="w-4 h-4" /> Cycles & Payout Rotation ({group.cycles.length})
        </button>

        <button
          onClick={() => setActiveTab("contributions")}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition ${
            activeTab === "contributions"
              ? "border-teal-700 text-teal-800 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <CreditCard className="w-4 h-4" /> Transactions Ledger
        </button>
      </div>

      {/* TAB CONTENT 1: MEMBERS */}
      {activeTab === "members" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Member Name</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Role in Group</th>
                <th className="px-5 py-3">Payout Position</th>
                <th className="px-5 py-3">Guarantor (Wasa)</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {group.memberships.map((m: any) => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3.5 font-medium text-slate-900">{m.user?.fullName}</td>
                  <td className="px-5 py-3.5 text-slate-600 font-mono text-[11px]">{m.user?.phone}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {m.roleInGroup}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-900">#{m.payoutPosition || "—"}</td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {m.guarantorName ? (
                      <span className="text-teal-700 font-medium">{m.guarantorName}</span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT 2: CYCLES */}
      {activeTab === "cycles" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Cycle</th>
                <th className="px-5 py-3">Due Date</th>
                <th className="px-5 py-3">Payout Date</th>
                <th className="px-5 py-3">Designated Beneficiary</th>
                <th className="px-5 py-3">Payout Status</th>
                <th className="px-5 py-3">Cycle Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {group.cycles.map((c: any) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3.5 font-bold text-slate-900">Round #{c.cycleNumber}</td>
                  <td className="px-5 py-3.5 text-slate-600">{new Date(c.dueDate).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5 text-slate-600">{new Date(c.payoutDate).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    {c.payout?.recipient?.user?.fullName || "Awaiting assignment"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        c.payout?.status === "DISBURSED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : c.payout?.status === "PENDING_SECOND_APPROVAL"
                          ? "bg-amber-50 text-amber-700 border-amber-300"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {c.payout?.status || "SCHEDULED"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        c.status === "CLOSED"
                          ? "bg-slate-100 text-slate-600 border-slate-200"
                          : c.status === "OPEN"
                          ? "bg-teal-50 text-teal-800 border-teal-200 animate-pulse"
                          : "bg-slate-50 text-slate-500 border-slate-200"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT 3: CONTRIBUTIONS */}
      {activeTab === "contributions" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Member</th>
                <th className="px-5 py-3">Round</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3">Reference Number</th>
                <th className="px-5 py-3">Recorded Date</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {group.cycles?.flatMap((c: any) =>
                c.contributions.map((ct: any) => ({ ...ct, cycleNum: c.cycleNumber }))
              ).length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No contributions recorded.
                  </td>
                </tr>
              ) : (
                group.cycles
                  ?.flatMap((c: any) =>
                    c.contributions.map((ct: any) => ({ ...ct, cycleNum: c.cycleNumber }))
                  )
                  ?.map((ct: any) => (
                    <tr key={ct.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-3.5 font-medium text-slate-900">
                        {group.memberships.find((m: any) => m.id === ct.membershipId)?.user?.fullName || "Member"}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 font-semibold">#{ct.cycleNum}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-900">
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
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {ct.status}
                        </span>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
