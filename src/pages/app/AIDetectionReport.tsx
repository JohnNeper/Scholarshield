import React, { useState } from 'react';
import { useData } from '../../services/store/dataContext';
import {
  Cpu,
  Download,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  BarChart2,
  Info,
} from 'lucide-react';

interface AIDetectionReportProps {
  jobId: string;
  onNavigate: (path: string) => void;
}

export const AIDetectionReport: React.FC<AIDetectionReportProps> = ({ jobId, onNavigate }) => {
  const { getJob, getDocument, thresholds } = useData();
  const job = getJob(jobId);
  const doc = job ? getDocument(job.documentId) : null;

  const [selectedFlagId, setSelectedFlagId] = useState<string | null>(
    job?.aiDetectionResult?.flaggedPassages[0]?.id || null
  );
  const [hoveredFlag, setHoveredFlag] = useState<any | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  if (!job || !job.aiDetectionResult) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-sm text-slate-500">AI detection data not available for this job.</p>
        <button
          onClick={() => onNavigate('/app/dashboard')}
          className="text-xs font-semibold text-[#3978D5] hover:underline"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const {
    overallAIProbability,
    analyzedWordCount,
    flaggedPassages,
    burstinessScore,
    perplexityEstimate,
    modelVersion,
    evaluationDisclaimer,
  } = job.aiDetectionResult;

  const selectedFlag =
    flaggedPassages.find((f) => f.id === selectedFlagId) || flaggedPassages[0];

  const isAICritical = overallAIProbability >= thresholds.aiCriticalThreshold;
  const isAIWarning = overallAIProbability >= thresholds.aiWarningThreshold;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate(`/app/analysis/${job.id}/results`)}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Back to Overview"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                AI-Generated Content Analysis: {job.documentTitle}
              </h1>
              {isAICritical ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                  Seuil IA critique dépassé (&gt; {thresholds.aiCriticalThreshold}%)
                </span>
              ) : isAIWarning ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                  Assistance IA Dépassée (&gt; {thresholds.aiWarningThreshold}%)
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Toléré (≤ {thresholds.aiWarningThreshold}%)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Evaluated via {modelVersion} · {analyzedWordCount.toLocaleString()} words evaluated · Seuil d'acceptabilité institutionnel: max {thresholds.aiWarningThreshold}%
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export AI Audit</span>
        </button>
      </div>

      {/* KPI Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Overall Probability */}
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Overall AI Probability</span>
            <Cpu className="w-4 h-4 text-[#8B68D8]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-[#8B68D8] tabular-nums">
              {overallAIProbability}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              (Seuil toléré: ≤ {thresholds.aiWarningThreshold}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {isAICritical
              ? 'Dépassement du seuil critique institutionnel'
              : isAIWarning
              ? 'Assistance IA modérée au-delà du seuil d\'alerte'
              : 'Conforme aux normes institutionnelles de rédaction humaine'}
          </p>
        </div>

        {/* Metric 2: Burstiness Score */}
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Burstiness (Variance)</span>
            <BarChart2 className="w-4 h-4 text-[#3978D5]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
            {burstinessScore}%
          </div>
          <p className="text-[11px] text-slate-400">
            Higher burstiness indicates dynamic human sentence rhythm.
          </p>
        </div>

        {/* Metric 3: Perplexity / Predictability */}
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Lexical Perplexity</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
            {perplexityEstimate}%
          </div>
          <p className="text-[11px] text-slate-400">
            Evaluates word unpredictability and idiosyncratic diction.
          </p>
        </div>
      </div>

      {/* Main Split: Highlighted Document & Flag Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document Viewer with Purple Highlights (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Evaluated Document Passage Map
            </span>
            <span className="text-[11px] text-[#8B68D8] font-mono font-medium">
              {flaggedPassages.length} Flagged Sentences
            </span>
          </div>

          <div className="space-y-4 text-xs font-serif leading-relaxed text-slate-800 dark:text-slate-200">
            {doc?.content.split(/\r?\n+/).filter(Boolean).map((paragraph, pIdx) => {
              const flagsInPara = flaggedPassages.filter((fp) =>
                paragraph.includes(fp.text) || (fp.text.length > 25 && paragraph.includes(fp.text.slice(0, 30)))
              );

              if (flagsInPara.length === 0) {
                return (
                  <p key={pIdx} className="leading-relaxed">
                    {paragraph}
                  </p>
                );
              }

              let remaining = paragraph;
              const segments: React.ReactNode[] = [];
              let keyCounter = 0;

              while (remaining.length > 0) {
                let earliestFlag: typeof flaggedPassages[0] | null = null;
                let earliestIdx = -1;
                let matchLength = 0;

                for (const f of flagsInPara) {
                  let idx = remaining.indexOf(f.text);
                  let len = f.text.length;

                  if (idx === -1 && f.text.length > 25) {
                    const prefix = f.text.slice(0, 30);
                    idx = remaining.indexOf(prefix);
                    len = prefix.length;
                  }

                  if (idx !== -1 && (earliestIdx === -1 || idx < earliestIdx)) {
                    earliestIdx = idx;
                    earliestFlag = f;
                    matchLength = len;
                  }
                }

                if (!earliestFlag || earliestIdx === -1) {
                  segments.push(remaining);
                  break;
                }

                if (earliestIdx > 0) {
                  segments.push(remaining.slice(0, earliestIdx));
                }

                const isSelected = earliestFlag.id === selectedFlagId;
                const flagObj = earliestFlag;
                const matchedText = remaining.slice(earliestIdx, earliestIdx + matchLength);

                segments.push(
                  <mark
                    key={`ai-${keyCounter++}`}
                    onClick={() => setSelectedFlagId(flagObj.id)}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
                      setHoveredFlag(flagObj);
                    }}
                    onMouseLeave={() => setHoveredFlag(null)}
                    className={`cursor-pointer px-1 py-0.5 rounded transition-all bg-purple-100 dark:bg-purple-950/70 text-purple-950 dark:text-purple-200 border-b-2 border-[#8B68D8] hover:bg-purple-200 dark:hover:bg-purple-900/80 inline ${
                      isSelected ? 'ring-2 ring-[#8B68D8] shadow-sm font-semibold' : ''
                    }`}
                  >
                    {matchedText}
                  </mark>
                );

                remaining = remaining.slice(earliestIdx + matchLength);
              }

              return (
                <p key={pIdx} className="leading-relaxed">
                  {segments}
                </p>
              );
            })}
          </div>
        </div>

        {/* Flagged Passage Inspector (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Linguistic Inspection
              </span>
              {selectedFlag && (
                <span className="text-xs font-mono font-bold text-[#8B68D8]">
                  {selectedFlag.aiProbability}% Probability
                </span>
              )}
            </div>

            {selectedFlag ? (
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    Flagged Academic Text:
                  </span>
                  <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 text-purple-950 dark:text-purple-200 font-serif leading-relaxed">
                    "{selectedFlag.text}"
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    Detected Stylometric Markers:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFlag.linguisticSignals.map((sig, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        {sig}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                  <span className="font-semibold block text-slate-900 dark:text-white">
                    Statistical Analysis:
                  </span>
                  <p>{selectedFlag.explanation}</p>
                </div>

                <div className="text-[11px] text-slate-400">
                  <span>Confidence Level: </span>
                  <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">
                    {selectedFlag.confidence}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-xs py-8 text-center">
                Select any purple flagged text to inspect stylometric metrics.
              </p>
            )}
          </div>

          {/* Model Limitations & Ethics Box */}
          <div className="p-5 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl text-xs text-amber-900 dark:text-amber-300 space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Ethical Guidance on AI Detection</span>
            </div>
            <p className="text-[11px] text-amber-800/90 dark:text-amber-400 leading-relaxed">
              {evaluationDisclaimer}
            </p>
          </div>
        </div>
      </div>

      {/* Floating Interactive AI Marker Tooltip */}
      {hoveredFlag && tooltipPos && (
        <div
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y - 10}px`,
          }}
          className="fixed -translate-x-1/2 -translate-y-full z-50 pointer-events-none bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md text-white text-xs px-3.5 py-2.5 rounded-xl shadow-2xl border border-purple-800/60 max-w-sm space-y-1.5 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="font-bold text-[11px] text-[#8B68D8] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              Génération Synthétique Probable
            </span>
            <span className="font-mono text-[10px] bg-purple-950/80 px-1.5 py-0.5 rounded text-purple-200 font-bold border border-purple-700/60">
              {hoveredFlag.aiProbability}% Probabilité IA
            </span>
          </div>

          <div className="flex flex-wrap gap-1 pt-0.5">
            {hoveredFlag.linguisticSignals?.slice(0, 3).map((sig: string, i: number) => (
              <span key={i} className="px-1.5 py-0.5 text-[9px] bg-purple-900/60 text-purple-200 rounded font-mono">
                {sig}
              </span>
            ))}
          </div>

          <p className="text-[10px] text-slate-300 italic line-clamp-2 leading-relaxed bg-slate-800/60 p-1.5 rounded-lg border border-slate-700/50">
            "{hoveredFlag.text}"
          </p>

          <div className="flex items-center justify-between text-[9px] text-slate-400 pt-0.5">
            <span>Cliquez pour verrouiller l'analyse linguistique</span>
            <span className="text-[#8B68D8] font-semibold">Inspecter les signaux →</span>
          </div>
        </div>
      )}
    </div>
  );
};
