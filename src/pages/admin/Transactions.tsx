import React from 'react';
import { Receipt, Download, TrendingUp, CreditCard } from 'lucide-react';

interface TransactionsProps {
  onNavigate: (path: string) => void;
}

export const Transactions: React.FC<TransactionsProps> = ({ onNavigate }) => {
  const transactions = [
    { id: 'tx-901', date: '2026-11-09 16:40', client: 'Institut Polytechnique de Paris', amount: '$2,390.00', plan: 'Campus Enterprise Annual', status: 'Succeeded' },
    { id: 'tx-902', date: '2026-11-09 14:15', client: 'Dr. Marcus Vance', amount: '$39.00', plan: 'Researcher Monthly', status: 'Succeeded' },
    { id: 'tx-903', date: '2026-11-08 18:22', client: 'Claire Dubois', amount: '$12.00', plan: 'Student Pro Monthly', status: 'Succeeded' },
    { id: 'tx-904', date: '2026-11-08 11:05', client: 'University of Cambridge', amount: '$2,390.00', plan: 'Campus Enterprise Annual', status: 'Succeeded' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            Billing Ledger & Revenue Transactions
          </h1>
          <p className="text-xs text-slate-500">
            Audit Stripe payment events, recurring institutional renewals, and student credit top-ups.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50"
        >
          <Download className="w-4 h-4" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <tr>
              <th className="py-3 px-5 font-semibold">Transaction ID</th>
              <th className="py-3 px-4 font-semibold">Client / Organization</th>
              <th className="py-3 px-4 font-semibold">Plan Description</th>
              <th className="py-3 px-4 font-semibold">Amount</th>
              <th className="py-3 px-4 font-semibold">Timestamp</th>
              <th className="py-3 px-4 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-5 font-mono text-slate-400">{t.id}</td>
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{t.client}</td>
                <td className="py-3 px-4">{t.plan}</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">{t.amount}</td>
                <td className="py-3 px-4 font-mono text-slate-400">{t.date}</td>
                <td className="py-3 px-4 text-right">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                    {t.status.toUpperCase()}
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
