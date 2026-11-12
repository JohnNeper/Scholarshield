import React from 'react';
import { useData } from '../../services/store/dataContext';
import {
  Search,
  Cpu,
  Download,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Info,
  Calendar,
} from 'lucide-react';

interface ResultsOverviewProps {
  jobId: string;
  onNavigate: (path: string) => void;
}

export const ResultsOverview: React.FC<ResultsOverviewProps> = ({ jobId, onNavigate }) => {
  const { getJob, thresholds } = useData();
  const job = getJob(jobId);

  if (!job) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-sm text-slate-500">Report not found.</p>
        <button
          onClick={() => onNavigate('/app/dashboard')}
          className="text-xs font-semibold text-[#3978D5] hover:underline"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const simScore = job.plagiarismResult?.similarityScore ?? 0;
  const isSimCritical = simScore >= thresholds.similarityCriticalThreshold;
  const isSimWarning = simScore >= thresholds.similarityWarningThreshold;

  const aiScore = job.aiDetectionResult?.overallAIProbability ?? 0;
  const isAICritical = aiScore >= thresholds.aiCriticalThreshold;
  const isAIWarning = aiScore >= thresholds.aiWarningThreshold;

  const handleDownloadPDF = () => {
    // Generate clean print/download view
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Thresholds Information Banner */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-300 shadow-xs gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#3978D5]" />
          <span>
            Seuils institutionnels actifs :{' '}
            <strong className="text-slate-900 dark:text-white">Plagiat max {thresholds.similarityWarningThreshold}%</strong> (Critique: {thresholds.similarityCriticalThreshold}%) ·{' '}
            <strong className="text-slate-900 dark:text-white">IA max {thresholds.aiWarningThreshold}%</strong> (Critique: {thresholds.aiCriticalThreshold}%)
          </span>
        </div>
        <button
          onClick={() => onNavigate('/app/settings')}
          className="text-[11px] font-semibold text-[#3978D5] hover:underline flex items-center gap-1"
        >
          <span>Modifier les seuils d'acceptabilité</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[#3978D5]">
            <ShieldCheck className="w-4 h-4 text-[#269B72]" />
            <span>VERIFIED REPORT · {job.id}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            {job.documentTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(job.createdAt).toLocaleDateString()}</span>
            </span>
            <span>·</span>
            <span>Mode: {job.analysisType.toUpperCase()}</span>
            <span>·</span>
            <span>Status: Verified</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-xl transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* DUAL SEPARATE RESULT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* CARD 1 — SIMILARITY REPORT */}
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-sm hover:border-[#3978D5]/50 transition-colors">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#3978D5] flex items-center justify-center">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                    Textual Similarity Index
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    {job.plagiarismResult?.isCustomCorpus
                      ? 'Multi-Source Custom Reference Corpus (BYOD)'
                      : 'Academic Benchmark Corpus (120M+ journals)'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-3xl font-extrabold font-mono text-[#3978D5] tabular-nums block">
                  {job.plagiarismResult?.similarityScore ?? 0}%
                </span>
                {isSimCritical ? (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-300 dark:border-red-800">
                    Dépassement Critique (&gt; {thresholds.similarityCriticalThreshold}%)
                  </span>
                ) : isSimWarning ? (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    Alerte Seuil Plagiat (&gt; {thresholds.similarityWarningThreshold}%)
                  </span>
                ) : (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Conforme au seuil (≤ {thresholds.similarityWarningThreshold}%)
                  </span>
                )}
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-center text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">Matches</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {job.plagiarismResult?.matchedPassages.length ?? 0}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Sources</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {job.plagiarismResult?.sources.length ?? 0}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Coverage</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">100%</span>
              </div>
            </div>

            {/* Sources snippet */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Top Matched Academic Sources:
              </span>
              <div className="space-y-1.5 text-xs">
                {job.plagiarismResult?.sources.slice(0, 2).map((src) => (
                  <div
                    key={src.id}
                    className="p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between"
                  >
                    <div className="overflow-hidden mr-2">
                      <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{src.title}</p>
                      <p className="text-[10px] text-slate-400">{src.authors} ({src.year})</p>
                    </div>
                    <span className="font-mono font-bold text-[#3978D5] text-xs tabular-nums shrink-0">
                      {src.similarityPercentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate(`/app/analysis/${job.id}/similarity`)}
              className="w-full py-2.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <span>Open Side-by-Side Similarity Viewer</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CARD 2 — AI CONTENT ANALYSIS */}
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-sm hover:border-[#8B68D8]/50 transition-colors">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-[#8B68D8] flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                    AI Content Detection
                  </h2>
                  <p className="text-[11px] text-slate-400">Stylometric Engine v2.1.0</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-3xl font-extrabold font-mono text-[#8B68D8] tabular-nums block">
                  {job.aiDetectionResult?.overallAIProbability ?? 0}%
                </span>
                {isAICritical ? (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                    Seuil IA Critique (&gt; {thresholds.aiCriticalThreshold}%)
                  </span>
                ) : isAIWarning ? (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                    Assistance IA Dépassée (&gt; {thresholds.aiWarningThreshold}%)
                  </span>
                ) : (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Conforme au seuil (≤ {thresholds.aiWarningThreshold}%)
                  </span>
                )}
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-center text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">Flagged Passages</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {job.aiDetectionResult?.flaggedPassages.length ?? 0}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Burstiness</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {job.aiDetectionResult?.burstinessScore ?? 65}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Perplexity</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {job.aiDetectionResult?.perplexityEstimate ?? 70}%
                </span>
              </div>
            </div>

            {/* Linguistic indicator preview */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Primary Linguistic Signals:
              </span>
              <div className="space-y-1.5 text-xs">
                {job.aiDetectionResult?.flaggedPassages.slice(0, 2).map((flag) => (
                  <div
                    key={flag.id}
                    className="p-2.5 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-1"
                  >
                    <p className="text-slate-700 dark:text-slate-300 italic text-[11px] line-clamp-1">
                      "{flag.text}"
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#8B68D8] font-mono">
                      <span>{flag.linguisticSignals.join(' · ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate(`/app/analysis/${job.id}/ai-detection`)}
              className="w-full py-2.5 text-xs font-semibold text-white bg-[#8B68D8] hover:bg-[#7854C4] rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <span>Inspect AI Statistical Report</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Academic Integrity Notice */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        <Info className="w-5 h-5 text-[#3978D5] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-900 dark:text-white">
            Academic Context & Non-Accusatory Evaluation Principle:
          </p>
          <p>
            Textual similarity does not equate to plagiarism; properly cited quotes and common methodological phrasing require faculty evaluation. AI detection is an advisory statistical indicator of sentence uniformity and predictability, not definitive proof of machine generation.
          </p>
        </div>
      </div>
    </div>
  );
};
