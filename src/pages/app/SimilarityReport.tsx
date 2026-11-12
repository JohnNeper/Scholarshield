import React, { useState } from 'react';
import { useData } from '../../services/store/dataContext';
import {
  Search,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Filter,
  CheckCircle2,
  BookOpen,
  ArrowLeft,
  Download,
} from 'lucide-react';
import { MatchedPassage, SourceReference } from '../../types';

interface SimilarityReportProps {
  jobId: string;
  onNavigate: (path: string) => void;
}

export const SimilarityReport: React.FC<SimilarityReportProps> = ({ jobId, onNavigate }) => {
  const { getJob, getDocument, thresholds } = useData();
  const job = getJob(jobId);
  const doc = job ? getDocument(job.documentId) : null;

  const [selectedPassageId, setSelectedPassageId] = useState<string | null>(
    job?.plagiarismResult?.matchedPassages[0]?.id || null
  );
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredPassage, setHoveredPassage] = useState<MatchedPassage | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  if (!job || !job.plagiarismResult) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-sm text-slate-500">Similarity data not available for this job.</p>
        <button
          onClick={() => onNavigate('/app/dashboard')}
          className="text-xs font-semibold text-[#3978D5] hover:underline"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const { similarityScore, sources, matchedPassages } = job.plagiarismResult;

  const selectedPassage =
    matchedPassages.find((p) => p.id === selectedPassageId) || matchedPassages[0];

  const filteredPassages = selectedSourceId
    ? matchedPassages.filter((p) => p.sourceId === selectedSourceId)
    : matchedPassages;

  return (
    <div className="space-y-4 max-w-full">
      {/* Top Header Controls */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
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
              <h1 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white truncate max-w-md">
                Similarity Comparison: {job.documentTitle}
              </h1>
              {job.plagiarismResult.isCustomCorpus && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Custom Corpus (BYOD)
                </span>
              )}
              {similarityScore >= thresholds.similarityCriticalThreshold ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-300 dark:border-red-800">
                  Seuil critique dépassé (&gt; {thresholds.similarityCriticalThreshold}%)
                </span>
              ) : similarityScore >= thresholds.similarityWarningThreshold ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  Alerte Seuil (&gt; {thresholds.similarityWarningThreshold}%)
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Toléré (≤ {thresholds.similarityWarningThreshold}%)
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Overall Similarity Index:{' '}
              <span className="font-mono font-bold text-[#3978D5]">{similarityScore}%</span> · {sources.length} {job.plagiarismResult.isCustomCorpus ? 'Custom Reference Sources' : 'Sources'} Detected · Seuil Institutionnel: max {thresholds.similarityWarningThreshold}%
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-xs font-mono">
            <button
              onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
              className="p-1 text-slate-500 hover:text-slate-900"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
              className="p-1 text-slate-500 hover:text-slate-900"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Print / Save Report"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* THREE-PANEL WORKBENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-220px)] min-h-[580px]">
        {/* LEFT PANEL: Source List & Filters (3 Cols) */}
        <div className="lg:col-span-3 bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl flex flex-col overflow-hidden">
          <div className="p-3.5 border-b border-[#E7EBF1] dark:border-[#23334A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#3978D5]" />
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Sources ({sources.length})
              </span>
            </div>
            {selectedSourceId && (
              <button
                onClick={() => setSelectedSourceId(null)}
                className="text-[11px] text-[#3978D5] hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {sources.map((src, i) => {
              const isSelected = selectedSourceId === src.id;
              return (
                <div
                  key={src.id}
                  onClick={() => {
                    setSelectedSourceId(src.id);
                    const firstMatchingPassage = matchedPassages.find((p) => p.sourceId === src.id);
                    if (firstMatchingPassage) {
                      setSelectedPassageId(firstMatchingPassage.id);
                    }
                  }}
                  className={`p-3 rounded-xl cursor-pointer border transition-all text-xs space-y-1.5 ${
                    isSelected
                      ? 'border-[#3978D5] bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-[#3978D5]'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white line-clamp-2">
                      {i + 1}. {src.title}
                    </span>
                    <span className="font-mono font-bold text-[#3978D5] shrink-0 tabular-nums">
                      {src.similarityPercentage}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{src.authors} · {src.year}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span className="capitalize">{src.category.replace('_', ' ')}</span>
                    <span>{src.matchedWordsCount} mots correspondants</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER PANEL: Original Document Viewer with Interactive Highlights (6 Cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl flex flex-col overflow-hidden relative">
          <div className="p-3.5 border-b border-[#E7EBF1] dark:border-[#23334A] flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Lecteur du Document — {filteredPassages.length} Concordances Surlignées
            </span>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Verbatim (Identique)
              </span>
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Paraphrasé
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 sm:p-8 font-serif leading-relaxed text-slate-800 dark:text-slate-200">
            <div
              style={{ fontSize: `${(zoomLevel / 100) * 14}px` }}
              className="max-w-2xl mx-auto space-y-4"
            >
              {doc?.content.split(/\r?\n+/).filter(Boolean).map((paragraph, pIdx) => {
                // Find all matched passages that appear in this paragraph
                const matchesInPara = matchedPassages.filter((mp) => {
                  if (selectedSourceId && mp.sourceId !== selectedSourceId) {
                    return false;
                  }
                  return (
                    paragraph.includes(mp.documentText) ||
                    (mp.documentText.length > 25 && paragraph.includes(mp.documentText.slice(0, 30)))
                  );
                });

                if (matchesInPara.length === 0) {
                  return (
                    <p key={pIdx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  );
                }

                // Render with multi-mark segmentation
                let remaining = paragraph;
                const segments: React.ReactNode[] = [];
                let keyCounter = 0;

                while (remaining.length > 0) {
                  // Find the earliest match
                  let earliestMatch: MatchedPassage | null = null;
                  let earliestIdx = -1;
                  let matchLength = 0;

                  for (const m of matchesInPara) {
                    let idx = remaining.indexOf(m.documentText);
                    let len = m.documentText.length;

                    // Fallback to prefix if text was slightly wrapped
                    if (idx === -1 && m.documentText.length > 25) {
                      const prefix = m.documentText.slice(0, 30);
                      idx = remaining.indexOf(prefix);
                      len = prefix.length;
                    }

                    if (idx !== -1 && (earliestIdx === -1 || idx < earliestIdx)) {
                      earliestIdx = idx;
                      earliestMatch = m;
                      matchLength = len;
                    }
                  }

                  if (!earliestMatch || earliestIdx === -1) {
                    segments.push(remaining);
                    break;
                  }

                  if (earliestIdx > 0) {
                    segments.push(remaining.slice(0, earliestIdx));
                  }

                  const isCurrent = earliestMatch.id === selectedPassageId;
                  const matchColor =
                    earliestMatch.matchType === 'identical'
                      ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-950 dark:text-rose-100 border-b-2 border-rose-500 hover:bg-rose-200 dark:hover:bg-rose-900/80'
                      : 'bg-amber-100 dark:bg-amber-950/70 text-amber-950 dark:text-amber-100 border-b-2 border-amber-500 hover:bg-amber-200 dark:hover:bg-amber-900/80';

                  const currentMatch = earliestMatch;
                  const matchedTextToRender = remaining.slice(earliestIdx, earliestIdx + matchLength);

                  segments.push(
                    <mark
                      key={`m-${keyCounter++}`}
                      onClick={() => {
                        setSelectedPassageId(currentMatch.id);
                        setSelectedSourceId(currentMatch.sourceId);
                      }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
                        setHoveredPassage(currentMatch);
                      }}
                      onMouseLeave={() => setHoveredPassage(null)}
                      className={`cursor-pointer px-1 py-0.5 rounded transition-all inline ${matchColor} ${
                        isCurrent ? 'ring-2 ring-[#3978D5] shadow-md font-semibold' : ''
                      }`}
                    >
                      {matchedTextToRender}
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
        </div>

        {/* RIGHT PANEL: Selected Passage Inspector (3 Cols) */}
        <div className="lg:col-span-3 bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl flex flex-col overflow-hidden">
          <div className="p-3.5 border-b border-[#E7EBF1] dark:border-[#23334A] flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Match Details
            </span>
            <span className="font-mono text-xs font-bold text-[#3978D5]">
              {selectedPassage?.similarityScore ?? 0}% Match
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {selectedPassage ? (
              <>
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-slate-400">
                    Source Attribution:
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {selectedPassage.sourceTitle}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Match Type: <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">{selectedPassage.matchType}</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-slate-400">
                    Your Paper's Passage:
                  </span>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed font-serif">
                    "{selectedPassage.documentText}"
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-slate-400">
                    Published Reference Passage:
                  </span>
                  <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-blue-950 dark:text-blue-200 leading-relaxed font-serif">
                    {selectedPassage.sourceText}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                  <span className="font-semibold block text-slate-900 dark:text-white">
                    Algorithmic Explanation:
                  </span>
                  <p>{selectedPassage.explanation}</p>
                </div>

                <div className="pt-2">
                  {job.plagiarismResult?.isCustomCorpus ? (
                    <div className="w-full py-2 px-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center justify-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Verified Against Uploaded Reference Source</span>
                    </div>
                  ) : (
                    <a
                      href="https://doi.org"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-3 text-xs font-semibold text-[#3978D5] hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-[#3978D5]/30 rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Inspect External DOI / Journal Reference</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </>
            ) : (
              <p className="text-slate-400 text-center py-8">Select a highlighted passage in the center document to inspect.</p>
            )}
          </div>
        </div>
      </div>

      {/* Floating Interactive Match Tooltip */}
      {hoveredPassage && tooltipPos && (
        <div
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y - 10}px`,
          }}
          className="fixed -translate-x-1/2 -translate-y-full z-50 pointer-events-none bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md text-white text-xs px-3.5 py-2.5 rounded-xl shadow-2xl border border-slate-700/80 max-w-sm space-y-1.5 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="font-bold text-[11px] text-[#3978D5] flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${hoveredPassage.matchType === 'identical' ? 'bg-red-400' : 'bg-amber-400'}`}></span>
              {hoveredPassage.matchType === 'identical' ? 'Concordance Verbatim' : 'Paraphrase Sémantique'}
            </span>
            <span className="font-mono text-[10px] bg-blue-900/60 px-1.5 py-0.5 rounded text-blue-200 font-bold border border-blue-700/50">
              {hoveredPassage.similarityScore}% Similarité
            </span>
          </div>

          <p className="text-[11px] font-semibold text-slate-100 line-clamp-1">
            {hoveredPassage.sourceTitle}
          </p>

          <p className="text-[10px] text-slate-300 italic line-clamp-2 leading-relaxed bg-slate-800/60 p-1.5 rounded-lg border border-slate-700/50">
            {hoveredPassage.sourceText}
          </p>

          <div className="flex items-center justify-between text-[9px] text-slate-400 pt-0.5">
            <span>Cliquez pour verrouiller l'inspection</span>
            <span className="text-[#3978D5] font-semibold">Inspecter la source →</span>
          </div>
        </div>
      )}
    </div>
  );
};
