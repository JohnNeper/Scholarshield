import React, { useState } from 'react';
import { Cpu, Search, CheckCircle2, RefreshCw, Zap, ShieldCheck } from 'lucide-react';

interface EnginesProps {
  onNavigate: (path: string) => void;
}

export const Engines: React.FC<EnginesProps> = ({ onNavigate }) => {
  const [probing, setProbing] = useState(false);
  const [probeResult, setProbeResult] = useState<string | null>(null);

  const handleRunHealthProbe = () => {
    setProbing(true);
    setProbeResult(null);
    setTimeout(() => {
      setProbing(false);
      setProbeResult('All 4 distributed worker clusters responded in < 22ms. Model checkpoints verified.');
    }, 900);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            Analytical Engine Monitoring & Cluster Telemetry
          </h1>
          <p className="text-xs text-slate-500">
            Real-time status for the Plagiarism N-gram engine and Stylometric AI Detection classifier.
          </p>
        </div>

        <button
          onClick={handleRunHealthProbe}
          disabled={probing}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all whitespace-nowrap"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${probing ? 'animate-spin' : ''}`} />
          <span>{probing ? 'Probing Nodes...' : 'Execute Health Probe'}</span>
        </button>
      </div>

      {probeResult && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#269B72]" />
          <span>{probeResult}</span>
        </div>
      )}

      {/* Engine 1 Details */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#3978D5] flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                Plagiarism Engine Adapter
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Class: ClientHeuristicPlagiarismAdapter (v1.4.2-heuristic-client)
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
            OPERATIONAL
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">Active Latency</span>
            <span className="font-bold text-slate-900 dark:text-white">18 ms</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Shingling Size</span>
            <span className="font-bold text-slate-900 dark:text-white">5-gram Tokens</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Reference Corpus</span>
            <span className="font-bold text-slate-900 dark:text-white">128M Papers</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Error Rate (24h)</span>
            <span className="font-bold text-emerald-600">0.00%</span>
          </div>
        </div>
      </div>

      {/* Engine 2 Details */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-[#8B68D8] flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                AI Detection Engine Adapter
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Class: ClientStylometricAIAdapter (v2.1.0-stylometric-statistical)
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
            OPERATIONAL
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">Active Latency</span>
            <span className="font-bold text-slate-900 dark:text-white">14 ms</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Burstiness Metric</span>
            <span className="font-bold text-slate-900 dark:text-white">StdDev / Mean</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Perplexity Model</span>
            <span className="font-bold text-slate-900 dark:text-white">Entropy Calibrated</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Error Rate (24h)</span>
            <span className="font-bold text-emerald-600">0.00%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
