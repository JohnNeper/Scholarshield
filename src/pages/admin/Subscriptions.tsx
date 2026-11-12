import React, { useState } from 'react';
import { useData } from '../../services/store/dataContext';
import { CreditCard, Edit3, Save, CheckCircle2 } from 'lucide-react';

interface SubscriptionsProps {
  onNavigate: (path: string) => void;
}

export const Subscriptions: React.FC<SubscriptionsProps> = ({ onNavigate }) => {
  const { plans } = useData();
  const [plansState, setPlansState] = useState(plans);
  const [saved, setSaved] = useState(false);

  const handlePriceChange = (id: string, newPrice: number) => {
    setPlansState((prev) =>
      prev.map((p) => (p.id === id ? { ...p, priceMonthly: newPrice } : p))
    );
  };

  const handleSaveAll = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            Subscription Tier & Quota Configurator
          </h1>
          <p className="text-xs text-slate-500">
            Dynamically adjust pricing tiers, monthly word allowances, and engine features.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Quotas</span>
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-[#269B72]" />
          <span>Pricing tier configurations and quota boundaries saved.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plansState.map((plan) => (
          <div
            key={plan.id}
            className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                {plan.name}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {plan.id}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Monthly Price ($)</label>
                <input
                  type="number"
                  value={plan.priceMonthly}
                  onChange={(e) => handlePriceChange(plan.id, Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Monthly Word Quota</label>
                <input
                  type="number"
                  defaultValue={plan.quotaWordsPerMonth}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Features Included:</span>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                {plan.features.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
