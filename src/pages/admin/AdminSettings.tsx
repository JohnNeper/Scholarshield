import React, { useState } from 'react';
import { Sliders, Save, CheckCircle2, Shield, AlertTriangle } from 'lucide-react';

interface AdminSettingsProps {
  onNavigate: (path: string) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ onNavigate }) => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [rateLimitPerMinute, setRateLimitPerMinute] = useState('120');
  const [maxWorkerThreads, setMaxWorkerThreads] = useState('32');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
          System Core & Gateway Configuration
        </h1>
        <p className="text-xs text-slate-500">
          Global platform settings, API rate limiting thresholds, and distributed worker thread pools.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-[#269B72]" />
          <span>System configuration parameters committed to cluster.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-5">
          {/* Maintenance Mode */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Global Maintenance Mode</p>
              <p className="text-[11px] text-slate-500">Temporarily suspends new document submission queues while keeping read-only report access active.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3978D5]"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                API Gateway Rate Limit (Requests / minute / IP)
              </label>
              <input
                type="number"
                value={rateLimitPerMinute}
                onChange={(e) => setRateLimitPerMinute(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                Distributed Worker Thread Pool
              </label>
              <input
                type="number"
                value={maxWorkerThreads}
                onChange={(e) => setMaxWorkerThreads(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Commit System Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
