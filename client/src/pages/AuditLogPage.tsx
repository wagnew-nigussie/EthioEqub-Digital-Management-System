import React, { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import { History, Shield, Eye, X } from "lucide-react";

export const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await apiRequest<{ logs: any[] }>("/audit-logs?pageSize=50");
        setLogs(res.logs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <History className="w-5 h-5 text-teal-600" />
          <span>Immutable Audit Log Explorer</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tamper-evident, append-only record of all financial entries and state changes (NFR-007, BR-012)
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Timestamp (UTC)</th>
                <th className="px-5 py-3">Action</th>
                <th className="px-5 py-3">Entity Type</th>
                <th className="px-5 py-3">Actor</th>
                <th className="px-5 py-3">IP Address</th>
                <th className="px-5 py-3 text-right">State Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    Loading audit trail...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    No audit records recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-800 border border-slate-200 font-mono">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 font-medium">{log.entityType}</td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {log.actor?.fullName || log.actor?.email || "System"}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">
                      {log.ipAddress || "::1"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 transition border border-teal-200/60"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON State Diff Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Audit Snapshot #{selectedLog.id.substring(0, 8)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 uppercase font-semibold">Action:</span>
                <div className="font-semibold text-slate-800">{selectedLog.action}</div>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-semibold">Entity:</span>
                <div className="font-semibold text-slate-800">
                  {selectedLog.entityType} ({selectedLog.entityId})
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-600 uppercase mb-1">State Payload</div>
              <pre className="bg-slate-900 text-teal-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-64">
                {JSON.stringify(selectedLog.afterState || selectedLog.beforeState || {}, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
