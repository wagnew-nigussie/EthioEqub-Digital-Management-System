import React, { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { formatETB } from "@ethioequb/shared";
import { CheckCircle, ShieldAlert, Clock, Check, UserCheck } from "lucide-react";

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
        body: JSON.stringify({ notes: "Authorized via web approval gateway" }),
      });
      setActionSuccess("Payout authorization registered successfully!");
      await loadGroupDetails();
    } catch (err: any) {
      setActionError(err.message || "Failed to submit payout approval.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
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
            className="text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 font-medium"
          >
            {groups.map((g) => (
              <option key={g.group.id} value={g.group.id}>
                {g.group.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
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
              className={`bg-white rounded-2xl border p-5 transition ${
                isDisbursed
                  ? "border-slate-200 bg-slate-50/40"
                  : isPendingSecond
                  ? "border-amber-300 bg-amber-50/20 shadow-sm"
                  : "border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-base">
                      Cycle #{cycle.cycleNumber} Payout
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isDisbursed
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : isPendingSecond
                          ? "bg-amber-50 text-amber-800 border-amber-300 animate-pulse"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {payout.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Beneficiary:{" "}
                    <span className="font-semibold text-slate-900">
                      {payout.recipient?.user?.fullName || "Assigned Member"}
                    </span>{" "}
                    • Scheduled Payout Date:{" "}
                    <span className="font-medium text-slate-700">
                      {new Date(cycle.payoutDate).toLocaleDateString()}
                    </span>
                  </p>

                  <div className="mt-2 text-lg font-extrabold text-teal-800">
                    {formatETB(BigInt(payout.amount))}
                  </div>
                </div>

                {/* Approver Status Badges */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Approver 1 (Treasurer):</span>
                      {payout.approver1Id ? (
                        <span className="font-semibold text-emerald-700 flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5" /> Approved
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">Pending</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Approver 2 (Owner):</span>
                      {payout.approver2Id ? (
                        <span className="font-semibold text-emerald-700 flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5" /> Approved
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">Pending</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {!isDisbursed && (
                    <div className="mt-2 sm:mt-0">
                      {isScheduled && (
                        <button
                          onClick={() => handleApprove(payout.id)}
                          disabled={loading}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 transition shadow-sm disabled:opacity-50"
                        >
                          Primary Approval (Step 1)
                        </button>
                      )}

                      {isPendingSecond && (
                        <button
                          onClick={() => handleApprove(payout.id)}
                          disabled={loading || payout.approver1Id === user?.id}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 transition shadow-sm disabled:opacity-40"
                          title={
                            payout.approver1Id === user?.id
                              ? "Dual-control rule: You signed Step 1. A second distinct authorized user must approve Step 2."
                              : "Confirm secondary authorization and disburse"
                          }
                        >
                          {payout.approver1Id === user?.id
                            ? "Awaiting Approver 2 Sign-Off"
                            : "Finalize Disbursement (Step 2)"}
                        </button>
                      )}
                    </div>
                  )}

                  {isDisbursed && payout.disbursedAt && (
                    <div className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-medium">
                      Disbursed on {new Date(payout.disbursedAt).toLocaleDateString()}
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
