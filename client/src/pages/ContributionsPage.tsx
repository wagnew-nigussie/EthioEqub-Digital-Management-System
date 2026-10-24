import React, { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import { PaymentMethod, formatETB, toMajorUnits } from "@ethioequb/shared";
import { CreditCard, CheckCircle2, AlertCircle } from "lucide-react";

export const ContributionsPage: React.FC = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [groupDetails, setGroupDetails] = useState<any | null>(null);

  // Form State
  const [membershipId, setMembershipId] = useState("");
  const [cycleId, setCycleId] = useState("");
  const [amountETB, setAmountETB] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.TELEBIRR);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch groups on mount
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

  // Fetch group details when selected
  useEffect(() => {
    if (!selectedGroupId) return;
    const fetchDetails = async () => {
      try {
        const res = await apiRequest<{ group: any; stats: any }>(`/groups/${selectedGroupId}`);
        setGroupDetails(res.group);

        // Pre-fill amount
        const amount = toMajorUnits(BigInt(res.group.contributionAmount));
        setAmountETB(amount);

        // Select first active cycle
        const openCycle = res.group.cycles?.find((c: any) => c.status === "OPEN") || res.group.cycles?.[0];
        if (openCycle) setCycleId(openCycle.id);

        // Select first member
        if (res.group.memberships?.length > 0) {
          setMembershipId(res.group.memberships[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetails();
  }, [selectedGroupId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await apiRequest("/contributions", {
        method: "POST",
        body: JSON.stringify({
          membershipId,
          cycleId,
          amountETB: Number(amountETB),
          paymentMethod,
          referenceNumber: referenceNumber || null,
          note: note || undefined,
        }),
      });

      setSuccessMsg("Contribution successfully verified and recorded into ledger!");
      setReferenceNumber("");
      setNote("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to record contribution.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-teal-600" />
          <span>Record Member Contribution</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Fast-entry terminal for treasurers with instant reference verification
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        {successMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Equb Group Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Select Equb Group
            </label>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              {groups.map((g) => (
                <option key={g.group.id} value={g.group.id}>
                  {g.group.name} ({g.group.frequency})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cycle Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Target Cycle Round
              </label>
              <select
                value={cycleId}
                onChange={(e) => setCycleId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                {groupDetails?.cycles?.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    Cycle #{c.cycleNumber} ({c.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Member Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Contributing Member
              </label>
              <select
                value={membershipId}
                onChange={(e) => setMembershipId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                {groupDetails?.memberships?.map((m: any) => (
                  <option key={m.id} value={m.id}>
                    {m.user?.fullName} ({m.roleInGroup})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Payment Amount (ETB)
            </label>
            <input
              type="number"
              required
              min="1"
              step="any"
              value={amountETB}
              onChange={(e) => setAmountETB(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Agreed contribution: {groupDetails ? formatETB(BigInt(groupDetails.contributionAmount)) : "—"}
            </p>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Payment Channel
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { method: PaymentMethod.TELEBIRR, label: "Telebirr" },
                { method: PaymentMethod.CBE_BIRR, label: "CBE Birr" },
                { method: PaymentMethod.BANK_TRANSFER, label: "Bank Transfer" },
                { method: PaymentMethod.CASH, label: "Physical Cash" },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.method}
                  onClick={() => setPaymentMethod(opt.method)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                    paymentMethod === opt.method
                      ? "bg-teal-700 text-white border-teal-700 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reference Number Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Transaction Reference / Slip Number
            </label>
            <input
              type="text"
              required={paymentMethod !== PaymentMethod.CASH}
              placeholder={
                paymentMethod === PaymentMethod.TELEBIRR
                  ? "e.g. TB-9847291048"
                  : paymentMethod === PaymentMethod.CBE_BIRR
                  ? "e.g. CBE-44019284"
                  : "e.g. RCPT-0042"
              }
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Required for electronic payments. Duplicates within this group will be rejected.
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Optional Note
            </label>
            <input
              type="text"
              placeholder="e.g. Paid in-person at Bole retail branch"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 transition shadow-sm disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{loading ? "Verifying & Recording..." : "Confirm & Record into Ledger"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
