import React, { useState } from 'react';
import { useData } from '../../services/store/dataContext';
import { ScrollText, Search, Download, ShieldCheck } from 'lucide-react';

interface AuditLogsProps {
  onNavigate: (path: string) => void;
}

export const AuditLogs: React.FC<AuditLogsProps> = ({ onNavigate }) => {
  const { auditLogs } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.actorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            Security & Compliance Audit Trail
          </h1>
          <p className="text-xs text-slate-500">
            Immutable log of authentication events, document operations, and administrative permission changes.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Trail CSV</span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail by actor, action, or target..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <tr>
              <th className="py-3 px-5 font-semibold">Timestamp</th>
              <th className="py-3 px-4 font-semibold">Action Trigger</th>
              <th className="py-3 px-4 font-semibold">Actor Identity</th>
              <th className="py-3 px-4 font-semibold">Target Entity</th>
              <th className="py-3 px-4 font-semibold">IP Address</th>
              <th className="py-3 px-4 font-semibold text-right">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-5 text-slate-400">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{log.action}</td>
                <td className="py-3 px-4 font-sans">{log.actorEmail}</td>
                <td className="py-3 px-4 font-sans line-clamp-1">{log.target}</td>
                <td className="py-3 px-4 text-slate-400">{log.ipAddress}</td>
                <td className="py-3 px-4 text-right">
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-[#269B72] px-2 py-0.5 rounded font-bold">
                    {log.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
