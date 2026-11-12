import React from 'react';
import { BarChart3, TrendingUp, ShieldCheck, Download, AlertCircle } from 'lucide-react';

interface AnalyticsProps {
  onNavigate: (path: string) => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({ onNavigate }) => {
  const departmentBreakdowns = [
    { name: 'Computer Science & AI', papers: 340, avgSimilarity: '12.4%', flagRate: '3.1%' },
    { name: 'Computational Biology', papers: 195, avgSimilarity: '15.8%', flagRate: '4.2%' },
    { name: 'Law & Digital Ethics', papers: 220, avgSimilarity: '18.1%', flagRate: '6.4%' },
    { name: 'Applied Physics', papers: 140, avgSimilarity: '9.2%', flagRate: '1.8%' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            Campus Integrity Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Cross-department similarity distributions, AI content prevalence, and cohort benchmarking.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50"
        >
          <Download className="w-4 h-4" />
          <span>Export Analytics PDF</span>
        </button>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-5 space-y-2">
          <span className="text-xs text-slate-400">Campus Average Similarity</span>
          <div className="text-3xl font-bold font-mono text-[#3978D5] tabular-nums">13.8%</div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400">Within acceptable academic norms</p>
        </div>

        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-5 space-y-2">
          <span className="text-xs text-slate-400">Average AI Preponderance</span>
          <div className="text-3xl font-bold font-mono text-[#8B68D8] tabular-nums">22.4%</div>
          <p className="text-[11px] text-slate-400">Consistent with modern research drafts</p>
        </div>

        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-5 space-y-2">
          <span className="text-xs text-slate-400">Faculty Review Rate</span>
          <div className="text-3xl font-bold font-mono text-[#269B72] tabular-nums">98.2%</div>
          <p className="text-[11px] text-slate-400">Flagged cases reviewed within 48h</p>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            Department-Level Integrity Breakdown
          </h3>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <tr>
              <th className="py-3 px-5 font-semibold">Faculty / Department</th>
              <th className="py-3 px-4 font-semibold">Papers Analyzed</th>
              <th className="py-3 px-4 font-semibold">Avg Similarity</th>
              <th className="py-3 px-4 font-semibold">Flag Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {departmentBreakdowns.map((d, i) => (
              <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-5 font-medium text-slate-900 dark:text-white">{d.name}</td>
                <td className="py-3 px-4 font-mono">{d.papers}</td>
                <td className="py-3 px-4 font-mono font-semibold text-[#3978D5]">{d.avgSimilarity}</td>
                <td className="py-3 px-4 font-mono">{d.flagRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
