import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import { formatETB, GroupFrequency, PayoutRule } from "@ethioequb/shared";
import { Users, Plus, Calendar, ArrowRight, ShieldCheck, X } from "lucide-react";

export const GroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contributionAmountETB, setContributionAmountETB] = useState<number>(5000);
  const [frequency, setFrequency] = useState<GroupFrequency>(GroupFrequency.WEEKLY);
  const [totalCycles, setTotalCycles] = useState<number>(5);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [payoutRule, setPayoutRule] = useState<PayoutRule>(PayoutRule.JOIN_ORDER);
  const [requireGuarantor, setRequireGuarantor] = useState(false);
  const [allowSingleApproverIfSmall, setAllowSingleApproverIfSmall] = useState(true);

  const [formError, setFormError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchGroups = async () => {
    try {
      const res = await apiRequest<{ groups: any[] }>("/groups");
      setGroups(res.groups || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setFormError(null);

    try {
      await apiRequest("/groups", {
        method: "POST",
        body: JSON.stringify({
          name,
          description: description || undefined,
          contributionAmountETB: Number(contributionAmountETB),
          frequency,
          totalCycles: Number(totalCycles),
          startDate: new Date(startDate).toISOString(),
          payoutRule,
          requireGuarantor,
          allowSingleApproverIfSmall,
        }),
      });

      setShowModal(false);
      setName("");
      setDescription("");
      await fetchGroups();
    } catch (err: any) {
      setFormError(err.message || "Failed to create Equb group.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            <span>Equb Groups</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your rotating savings circles, schedules, and membership rosters
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Equb Group</span>
        </button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center py-12 text-slate-400">Loading your Equb circles...</div>
        ) : groups.length === 0 ? (
          <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
            You do not currently belong to any active Equb groups.
          </div>
        ) : (
          groups.map((item) => (
            <div
              key={item.group.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-teal-300 transition space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{item.group.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.group.description || "Traditional rotating savings group"}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  {item.roleInGroup}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-semibold">Contribution</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {formatETB(BigInt(item.group.contributionAmount))}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-semibold">Frequency</div>
                  <div className="font-semibold text-slate-800 mt-0.5">{item.group.frequency}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-semibold">Rounds</div>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {item.group.memberCount} / {item.group.totalCycles} Members
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-500">
                  Payout Position: <span className="font-bold text-slate-800">#{item.payoutPosition || "—"}</span>
                </span>
                <Link
                  to={`/groups/${item.group.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 transition"
                >
                  <span>Open Group Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Equb Group Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Initialize New Equb Group</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Equb Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Merkato Textile Traders Weekly Round"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Bylaws / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Payment due every Monday 5:00 PM via Telebirr or CBE."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Contribution (ETB)
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    step="100"
                    value={contributionAmountETB}
                    onChange={(e) => setContributionAmountETB(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as GroupFrequency)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value={GroupFrequency.WEEKLY}>Weekly</option>
                    <option value={GroupFrequency.MONTHLY}>Monthly</option>
                    <option value={GroupFrequency.DAILY}>Daily</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Members / Cycles
                  </label>
                  <input
                    type="number"
                    required
                    min="2"
                    max="100"
                    value={totalCycles}
                    onChange={(e) => setTotalCycles(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={requireGuarantor}
                    onChange={(e) => setRequireGuarantor(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Enforce Guarantor (Wasa / ዋስ) for early payout beneficiaries</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={allowSingleApproverIfSmall}
                    onChange={(e) => setAllowSingleApproverIfSmall(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Allow single approver payout disbursement if members &lt; 5</span>
                </label>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-800">
                Total Planned Pool: <span className="font-bold">{formatETB(BigInt(contributionAmountETB * 100 * totalCycles))}</span> per cycle payout.
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 transition shadow-sm disabled:opacity-50"
              >
                {creating ? "Generating Schedule & Group..." : "Confirm & Create Equb"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
