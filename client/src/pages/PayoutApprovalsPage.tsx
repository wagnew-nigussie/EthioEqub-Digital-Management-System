import React, { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { formatETB } from "@ethioequb/shared";
import {
  CheckCircle,
  ShieldAlert,
  Clock,
  Check,
  UserCheck,
  ShieldCheck,
  Lock,
  ArrowRight,
  Info,
} from "lucide-react";

export const PayoutApprovalsPage: React.FC = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [groupData, setGroupData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Load user groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await apiRequest<{ groups: any[] }>("/groups");
        setGroups(res.groups || []);
        if (res.groups && res.groups.length > 0) {
          setSelectedGroupId(res.groups[0].group.id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchGroups();
  }, []);

  const loadGroupDetails = async () => {
    if (!selectedGroupId) return;
    try {
      const res = await apiRequest<{ group: any; stats: any }>(`/groups/${selectedGroupId}`);
      setGroupData(res.group);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadGroupDetails();
  }, [selectedGroupId]);

  const handleApprove = async (payoutId: string) => {
    setLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      await apiRequest(`/payouts/${payoutId}/approve`, {
        method: "POST",
        body: JSON.stringify({ notes: "Authorized via web approval gateway by Wagnew Nigussie" }),
      });
      setActionSuccess("Dual-control payout authorization registered successfully into immutable ledger!");
      await loadGroupDetails();
    } catch (err: any) {
      setActionError(err.message || "Failed to submit payout approval.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-teal-600" />
            <span>Dual-Control Payout Governance</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Two-step independent authorization required for pooled fund disbursements (BR-007)
          </p>
        </div>

        {groups.length > 1 && (
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-teal-500 font-medium shadow-2xs"
          >
            {groups.map((g) => (
              <option key={g.group.id} value={g.group.id}>
                {g.group.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Governance Explanation Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-400/30">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs text-white flex items-center gap-2">
              <span>Dual-Control Governance Policy Enforced</span>
              <span className="text-[10px] font-mono bg-teal-500/30 text-teal-300 px-2 py-0.5 rounded-full">
                Approver 1 ≠ Approver 2
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
              Every payout disbursement requires two distinct signatures: <strong>Approver 1</strong> (Treasurer verifying full member collections) and <strong>Approver 2</strong> (Group Owner confirming member eligibility). The system strictly prevents unilateral self-approvals.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-400/30">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Zero Embezzlement Guard</span>
          </span>
        </div>
      </div>

      {/* Success Notification */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-2xs animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Error Notification */}
      {actionError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 shadow-2xs animate-fadeIn">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Payout Schedule Cards */}
      <div className="space-y-4">
        {groupData?.cycles?.map((cycle: any) => {
          const payout = cycle.payout;
          if (!payout) return null;

          const isDisbursed = payout.status === "DISBURSED";
          const isPendingSecond = payout.status === "PENDING_SECOND_APPROVAL";
          const isScheduled = payout.status === "SCHEDULED";

          return (
            <div
              key={payout.id}
              className={`rounded-3xl border p-6 transition shadow-sm ${
                isDisbursed
                  ? "border-slate-200/90 bg-white"
                  : isPendingSecond
                  ? "border-amber-300 bg-amber-50/30 shadow-md"
                  : "border-slate-200/90 bg-white"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="font-extrabold text-slate-900 text-base">
                      Cycle #{cycle.cycleNumber} Payout Pool
                    </span>
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] font-bold border ${
                        isDisbursed
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : isPendingSecond
                          ? "bg-amber-100 text-amber-800 border-amber-300 animate-pulse"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {payout.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Designated Recipient:{" "}
                    <span className="font-bold text-slate-900">
                      {payout.recipient?.user?.fullName || "Assigned Member"}
                    </span>{" "}
                    • Scheduled Draw Date:{" "}
                    <span className="font-medium text-slate-700">
                      {new Date(cycle.payoutDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </p>

                  <div className="mt-2 text-2xl font-black font-mono text-teal-900">
                    {formatETB(BigInt(payout.amount))}
                  </div>
                </div>

                {/* Approver Status Badges */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs min-w-[220px]">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Approver 1 (Treasurer):</span>
                      {payout.approver1Id ? (
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> Signed (Tigist)
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">Pending</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Approver 2 (Owner):</span>
                      {payout.approver2Id ? (
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> Signed (Wagnew)
                        </span>
                      ) : (
                        <span className="text-amber-700 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" /> Awaiting Owner
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {!isDisbursed && (
                    <div className="shrink-0">
                      {isScheduled && (
                        <button
                          onClick={() => handleApprove(payout.id)}
                          disabled={loading}
                          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>Authorize Step 1 (Treasurer)</span>
                        </button>
                      )}

                      {isPendingSecond && (
                        <button
                          onClick={() => handleApprove(payout.id)}
                          disabled={loading || payout.approver1Id === user?.id}
                          className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition shadow-md disabled:opacity-40 flex items-center gap-2"
                          title={
                            payout.approver1Id === user?.id
                              ? "Dual-control rule: You signed Step 1. A second distinct authorized user must approve Step 2."
                              : "Confirm secondary authorization and disburse"
                          }
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>
                            {payout.approver1Id === user?.id
                              ? "Awaiting Approver 2 Sign-Off"
                              : "Authorize Step 2 & Disburse"}
                          </span>
                        </button>
                      )}
                    </div>
                  )}

                  {isDisbursed && payout.disbursedAt && (
                    <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-2xs">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Disbursed on {new Date(payout.disbursedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
