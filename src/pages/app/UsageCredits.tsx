import React, { useState } from 'react';
import { useAuth } from '../../services/store/authContext';
import { CreditCard, Zap, CheckCircle2, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface UsageCreditsProps {
  onNavigate: (path: string) => void;
}

export const UsageCredits: React.FC<UsageCreditsProps> = ({ onNavigate }) => {
  const { user, updateUser } = useAuth();
  const [showTopUpSuccess, setShowTopUpSuccess] = useState(false);

  const handleTopUp = () => {
    updateUser({
      creditsRemaining: (user?.creditsRemaining || 45) + 50,
      creditsTotal: (user?.creditsTotal || 50) + 50,
    });
    setShowTopUpSuccess(true);
    setTimeout(() => setShowTopUpSuccess(false), 3000);
  };

  const usageHistory = [
    { date: '2026-11-08', doc: 'Neural Graph Attention Networks in Bioinformatics', type: 'Complete (Plag + AI)', consumed: 1 },
    { date: '2026-11-06', doc: 'Ethics of Autonomous Systems in Modern Healthcare', type: 'Plagiarism Only', consumed: 1 },
    { date: '2026-10-24', doc: 'Comparative Benchmark of Climate Modeling Algorithms', type: 'Complete (Plag + AI)', consumed: 1 },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-2">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
          Credits Quota & Usage Ledger
        </h1>
        <p className="text-xs text-slate-500">
          Track verification consumption, plan allowances, and account top-ups.
        </p>
      </div>

      {showTopUpSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-[#269B72]" />
          <span>Successfully topped up 50 credits to your academic account!</span>
        </div>
      )}

      {/* Main Quota Meter Card */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#3978D5] block">
              Active Subscription
            </span>
            <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white capitalize">
              {user?.plan ?? 'Student'} Pro Plan
            </h2>
            <p className="text-xs text-slate-500">Renews on December 1, 2026</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTopUp}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all"
            >
              + Top-up 50 Credits ($10)
            </button>
            <button
              onClick={() => onNavigate('/pricing')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Change Plan
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Credits Available</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {user?.creditsRemaining} of {user?.creditsTotal} Credits
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
            <div
              className="bg-[#3978D5] h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.round(((user?.creditsRemaining || 45) / (user?.creditsTotal || 50)) * 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-slate-400 block text-[11px]">Monthly Quota:</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">50,000 words</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Max Document Size:</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">32 MB</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Priority Queue:</span>
            <span className="font-bold text-[#269B72]">Enabled</span>
          </div>
        </div>
      </div>

      {/* Consumption Breakdown Table */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            Credit Consumption Log
          </h3>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <tr>
              <th className="py-3 px-5 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold">Document Title</th>
              <th className="py-3 px-4 font-semibold">Engine Execution</th>
              <th className="py-3 px-4 font-semibold text-right">Credits</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {usageHistory.map((item, i) => (
              <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-5 font-mono text-slate-400">{item.date}</td>
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{item.doc}</td>
                <td className="py-3 px-4">{item.type}</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                  -{item.consumed}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
