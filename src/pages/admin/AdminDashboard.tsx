import React from 'react';
import { useData } from '../../services/store/dataContext';
import {
  Activity,
  Users2,
  Building,
  Cpu,
  TrendingUp,
  CreditCard,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  ListOrdered,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { jobs, auditLogs } = useData();

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-[#14243A] text-white border border-[#23334A] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              Cluster Operational · Zero Critical Alerts
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-white">
            Super Administrator Control Plane
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Live infrastructure telemetry, distributed analysis queues, and multi-tenant organization oversight.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/admin/engines')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all"
          >
            Engine Health Probes
          </button>
          <button
            onClick={() => onNavigate('/admin/audit-logs')}
            className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 rounded-xl hover:bg-slate-700"
          >
            Audit Trail
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Monthly Recurring Revenue</span>
            <CreditCard className="w-4 h-4 text-[#269B72]" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            $148,290
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400">+14.2% from previous month</p>
        </div>

        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Registered Users</span>
            <Users2 className="w-4 h-4 text-[#3978D5]" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            42,850
          </div>
          <p className="text-[11px] text-slate-400">3,420 active today</p>
        </div>

        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Accredited Institutions</span>
            <Building className="w-4 h-4 text-[#8B68D8]" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            468
          </div>
          <p className="text-[11px] text-slate-400">Campus enterprise tenants</p>
        </div>

        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Active Worker Jobs</span>
            <Cpu className="w-4 h-4 text-[#3978D5]" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {jobs.length + 8}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400">18ms median latency</p>
        </div>
      </div>

      {/* Main Split: Real-Time Engine Probes & Recent Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Engine Health & Throughput */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
              Verification Engine Clusters
            </h2>
            <button
              onClick={() => onNavigate('/admin/engines')}
              className="text-xs font-semibold text-[#3978D5] hover:underline"
            >
              Full Diagnostics →
            </button>
          </div>

          <div className="space-y-3">
            <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Plagiarism Core Engine (v1.4.2)
                  </h3>
                  <p className="text-[11px] text-slate-400">Winnowing N-gram matcher & cross-document alignments</p>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                  HEALTHY
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg">
                <div>
                  <span className="text-[10px] text-slate-400 block">Latency</span>
                  <span className="text-slate-900 dark:text-white font-semibold">18ms</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Corpus Size</span>
                  <span className="text-slate-900 dark:text-white font-semibold">128M docs</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Queue Load</span>
                  <span className="text-emerald-600 font-semibold">0.4%</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Stylometric AI Classifier (v2.1.0)
                  </h3>
                  <p className="text-[11px] text-slate-400">Sentence burstiness & lexical perplexity estimator</p>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                  HEALTHY
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg">
                <div>
                  <span className="text-[10px] text-slate-400 block">Latency</span>
                  <span className="text-slate-900 dark:text-white font-semibold">14ms</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Precision</span>
                  <span className="text-slate-900 dark:text-white font-semibold">Calibrated</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Queue Load</span>
                  <span className="text-emerald-600 font-semibold">0.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Security & Administrative Audit Logs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
              Recent Administrative Audit Trail
            </h2>
            <button
              onClick={() => onNavigate('/admin/audit-logs')}
              className="text-xs font-semibold text-[#3978D5] hover:underline"
            >
              View all logs →
            </button>
          </div>

          <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-5 space-y-3 shadow-sm">
            {auditLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {log.action}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  Actor: <span className="text-slate-700 dark:text-slate-300 font-medium">{log.actorEmail}</span> · Target: {log.target}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
