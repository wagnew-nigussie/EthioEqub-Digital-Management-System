import React, { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import { PaymentMethod, formatETB, toMajorUnits } from "@ethioequb/shared";
import { useUI } from "../context/UIContext";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Smartphone,
  Building,
  DollarSign,
  FileText,
  Sparkles,
  Download,
} from "lucide-react";

export const ContributionsPage: React.FC = () => {
  const { openReceipt } = useUI();
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [groupDetails, setGroupDetails] = useState<any | null>(null);

  // Form State
  const [membershipId, setMembershipId] = useState("");
  const [cycleId, setCycleId] = useState("");
  const [amountETB, setAmountETB] = useState<number>(10000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.TELEBIRR);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [lastRecordedReceipt, setLastRecordedReceipt] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchDetails = async () => {
    if (!selectedGroupId) return;
    try {
      const res = await apiRequest<{ group: any; stats: any }>(`/groups/${selectedGroupId}`);
      setGroupDetails(res.group);

      const amount = toMajorUnits(BigInt(res.group.contributionAmount));
      setAmountETB(amount);

      const openCycle = res.group.cycles?.find((c: any) => c.status === "OPEN") || res.group.cycles?.[2] || res.group.cycles?.[0];
      if (openCycle) setCycleId(openCycle.id);

      if (res.group.memberships?.length > 0) {
        setMembershipId(res.group.memberships[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [selectedGroupId]);

  const generateDemoRef = (channel: PaymentMethod) => {
    const random = Math.floor(100000 + Math.random() * 900000);
    if (channel === PaymentMethod.TELEBIRR) {
      setReferenceNumber(`TLB-${random}`);
    } else if (channel === PaymentMethod.CBE_BIRR) {
      setReferenceNumber(`CBE-${random}`);
    } else if (channel === PaymentMethod.BANK_TRANSFER) {
      setReferenceNumber(`FT-${random}`);
    } else {
      setReferenceNumber(`REC-${random}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await apiRequest<{ contribution: any }>("/contributions", {
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

      const member = groupDetails?.memberships?.find((m: any) => m.id === membershipId);
      const cycle = groupDetails?.cycles?.find((c: any) => c.id === cycleId);

      const receiptObj = {
        receiptNumber: `REC-${res.contribution.id.substring(0, 8).toUpperCase()}`,
        groupName: groupDetails?.name || "Bole Commercial Merchants Equb",
        memberName: member?.user?.fullName || "Member",
        cycleNumber: cycle?.cycleNumber || 3,
        amountETB: Number(amountETB),
        channel: paymentMethod,
        transactionRef: referenceNumber || "CASH-SLIP",
        timestamp: new Date().toLocaleString("en-US", { timeZone: "Africa/Addis_Ababa" }),
        treasurerName: "Tigist Haile",
      };

      setLastRecordedReceipt(receiptObj);
      setSuccessMsg("Contribution successfully verified and recorded into immutable ledger!");
      setReferenceNumber("");
      setNote("");
      await fetchDetails();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to record contribution.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-teal-600" />
            <span>Record Member Contribution Slip</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Instant manual ledger reconciliation against verified Telebirr, CBE Birr, or Bank deposit references
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

      {/* Success Notification with View Slip Button */}
      {successMsg && lastRecordedReceipt && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-emerald-950">Payment Successfully Reconciled!</div>
              <div className="text-[11px] text-emerald-700">
                Receipt Serial: <span className="font-mono font-bold">{lastRecordedReceipt.receiptNumber}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => openReceipt(lastRecordedReceipt)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <Receipt className="w-4 h-4" />
            <span>View & Print Official Slip</span>
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Target Cycle & Contributing Member */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Cycle Round
              </label>
              <select
                value={cycleId}
                onChange={(e) => setCycleId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                {groupDetails?.cycles?.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    Cycle #{c.cycleNumber} ({c.status}) — Due {new Date(c.dueDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contributing Member
              </label>
              <select
                value={membershipId}
                onChange={(e) => setMembershipId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                {groupDetails?.memberships?.map((m: any) => (
                  <option key={m.id} value={m.id}>
                    {m.user?.fullName} ({m.roleInGroup}) — {m.user?.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Method Selector Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Payment Channel
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Telebirr */}
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod(PaymentMethod.TELEBIRR);
                  generateDemoRef(PaymentMethod.TELEBIRR);
                }}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  paymentMethod === PaymentMethod.TELEBIRR
                    ? "bg-orange-50/80 border-orange-400 text-orange-950 font-bold shadow-2xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Smartphone className="w-4 h-4 text-orange-600" />
                  <span className="text-[9px] font-bold uppercase text-orange-700">Instant</span>
                </div>
                <div className="text-xs">Telebirr</div>
              </button>

              {/* CBE Birr */}
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod(PaymentMethod.CBE_BIRR);
                  generateDemoRef(PaymentMethod.CBE_BIRR);
                }}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  paymentMethod === PaymentMethod.CBE_BIRR
                    ? "bg-purple-50/80 border-purple-400 text-purple-950 font-bold shadow-2xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Building className="w-4 h-4 text-purple-600" />
                  <span className="text-[9px] font-bold uppercase text-purple-700">CBE Slip</span>
                </div>
                <div className="text-xs">CBE Birr</div>
              </button>

              {/* Bank Transfer */}
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod(PaymentMethod.BANK_TRANSFER);
                  generateDemoRef(PaymentMethod.BANK_TRANSFER);
                }}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  paymentMethod === PaymentMethod.BANK_TRANSFER
                    ? "bg-blue-50/80 border-blue-400 text-blue-950 font-bold shadow-2xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span className="text-[9px] font-bold uppercase text-blue-700">Bank Ref</span>
                </div>
                <div className="text-xs">Bank Transfer</div>
              </button>

              {/* Cash */}
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod(PaymentMethod.CASH);
                  generateDemoRef(PaymentMethod.CASH);
                }}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  paymentMethod === PaymentMethod.CASH
                    ? "bg-emerald-50/80 border-emerald-400 text-emerald-950 font-bold shadow-2xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span className="text-[9px] font-bold uppercase text-emerald-700">Receipt Book</span>
                </div>
                <div className="text-xs">Physical Cash</div>
              </button>
            </div>
          </div>

          {/* Amount & Reference Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Amount (ETB)
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  value={amountETB}
                  onChange={(e) => setAmountETB(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">ETB</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Minor unit conversion: {(amountETB * 100).toLocaleString()} Santim
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Transaction Reference
                </label>
                <button
                  type="button"
                  onClick={() => generateDemoRef(paymentMethod)}
                  className="text-[10px] text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> Auto-Generate Ref
                </button>
              </div>
              <input
                type="text"
                required
                placeholder="e.g. TLB-902910 or CBE-882019"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Auditor Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Verified against physical bank slip by Treasurer"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>{loading ? "Reconciling Ledger..." : "Record & Verify Contribution"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Verified Slips History */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Recently Reconciled Slips</h3>
            <p className="text-xs text-slate-500">Official electronic receipts registered for this Equb circle</p>
          </div>
          <a
            href={`/api/v1/groups/${selectedGroupId}/reports/ledger.csv`}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
          >
            <Download className="w-3.5 h-3.5" /> Download CSV
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
                <th className="px-5 py-3 text-right">Electronic Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {groupDetails?.cycles
                ?.flatMap((c: any) =>
                  c.contributions.map((ct: any) => ({ ...ct, cycleNum: c.cycleNumber }))
                )
                ?.slice(-6)
                ?.reverse()
                ?.map((ct: any) => (
                  <tr key={ct.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3.5 font-semibold text-slate-900">
                      {ct.membership?.user?.fullName || "Member"}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">Cycle #{ct.cycleNum}</td>
                    <td className="px-5 py-3.5 font-bold font-mono text-slate-900">
                      {formatETB(BigInt(ct.amount))}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {ct.paymentMethod}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-slate-600">
                      {ct.referenceNumber || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() =>
                          openReceipt({
                            receiptNumber: `REC-${ct.id.substring(0, 8).toUpperCase()}`,
                            groupName: groupDetails?.name || "Bole Commercial Merchants Equb",
                            memberName: ct.membership?.user?.fullName || "Member",
                            cycleNumber: ct.cycleNum || 3,
                            amountETB: Number(ct.amount) / 100,
                            channel: ct.paymentMethod,
                            transactionRef: ct.referenceNumber || "N/A",
                            timestamp: new Date(ct.recordedAt).toLocaleString("en-US", { timeZone: "Africa/Addis_Ababa" }),
                            treasurerName: "Tigist Haile",
                          })
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 transition"
                      >
                        <Receipt className="w-3 h-3" />
                        <span>Print Slip</span>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
