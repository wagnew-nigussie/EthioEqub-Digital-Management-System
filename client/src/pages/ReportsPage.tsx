import React, { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import { FileSpreadsheet, Download, RefreshCw, CheckCircle2 } from "lucide-react";

export const ReportsPage: React.FC = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [reconciliation, setReconciliation] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

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

  const loadReconciliation = async () => {
    if (!selectedGroupId) return;
    setLoading(true);
    try {
      const res = await apiRequest<{ reconciliation: any }>(
        `/groups/${selectedGroupId}/reports/reconciliation`
      );
      setReconciliation(res.reconciliation);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReconciliation();
  }, [selectedGroupId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-600" />
            <span>Financial Reports & Ledger Exports</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Downloadable CSV transaction statements and group balance sheets
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

      {/* Reconciliation Balance Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900 text-base">
              {reconciliation?.groupName || "Equb Reconciliation Summary"}
            </h2>
            <p className="text-xs text-slate-500">
              Total Cycles: {reconciliation?.totalCycles || 0} • Members:{" "}
              {reconciliation?.memberCount || 0}
            </p>
          </div>

          <button
            onClick={loadReconciliation}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 uppercase">Gross Collections</span>
            <div className="text-lg font-bold text-slate-900 mt-1">
              {reconciliation?.metrics?.totalCollectedFormatted || "0.00 ETB"}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 uppercase">Signed Adjustments</span>
            <div className="text-lg font-bold text-slate-900 mt-1">
              {reconciliation?.metrics?.totalAdjustmentsFormatted || "0.00 ETB"}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 uppercase">Disbursed Payouts</span>
            <div className="text-lg font-bold text-slate-900 mt-1">
              {reconciliation?.metrics?.totalDisbursedFormatted || "0.00 ETB"}
            </div>
          </div>

          <div className="p-4 bg-teal-50 rounded-xl border border-teal-200">
            <span className="text-xs font-semibold text-teal-700 uppercase">Current Pool Reserve</span>
            <div className="text-lg font-bold text-teal-800 mt-1">
              {reconciliation?.metrics?.poolReserveFormatted || "0.00 ETB"}
            </div>
          </div>
        </div>

        {/* Export Action Card */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            <div className="font-semibold text-slate-900">Sanitized CSV Transaction Ledger</div>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Contains all member payment rows, reference IDs, and dates with formula-injection defenses (AC-07).
            </p>
          </div>

          {selectedGroupId && (
            <a
              href={`/api/v1/groups/${selectedGroupId}/reports/ledger.csv`}
              download
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV Ledger</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
