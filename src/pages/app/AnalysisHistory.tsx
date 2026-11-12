import React, { useState } from 'react';
import { useData } from '../../services/store/dataContext';
import { Clock, Search, RotateCcw, ArrowRight, CheckCircle2, Download, Database, RefreshCw, FileText, Cpu, SearchCheck } from 'lucide-react';

interface AnalysisHistoryProps {
  onNavigate: (path: string) => void;
}

export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ onNavigate }) => {
  const { jobs, exportDataAsJson, resetAllDataToDefault } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = jobs.filter((j) =>
    j.documentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReanalyze = async (documentId: string) => {
    onNavigate(`/app/analysis/${documentId}/configure`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            Historique & Audit des Analyses
          </h1>
          <p className="text-xs text-slate-500">
            Journal complet et permanent de toutes vos analyses de similarité et détections IA, synchronisé dans votre navigateur.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportDataAsJson}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-xl transition-all shadow-xs"
            title="Exporter tout l'historique et les documents au format JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#3978D5]" />
            <span>Exporter JSON</span>
          </button>
        </div>
      </div>

      {/* LocalStorage Sync Banner */}
      <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>Persistance locale active :</strong> {jobs.length} travaux d'analyse et rapports sauvegardés de manière persistante dans votre espace.
          </span>
        </div>
        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
          Auto-Sync localStorage
        </span>
      </div>

      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une analyse par titre de document ou identifiant..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="space-y-1 max-w-md">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {job.id}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(job.createdAt).toLocaleString()}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {job.documentTitle}
              </h3>
              <p className="text-xs text-slate-500">
                Mode: <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">{job.analysisType}</span> · Step: {job.currentStepMessage}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right text-xs space-y-0.5">
                {job.plagiarismResult && (
                  <p className="font-mono text-[#3978D5] font-semibold">
                    {job.plagiarismResult.similarityScore}% Similarity
                  </p>
                )}
                {job.aiDetectionResult && (
                  <p className="font-mono text-[#8B68D8] font-semibold">
                    {job.aiDetectionResult.overallAIProbability}% Probabilité IA
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleReanalyze(job.documentId)}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Relancer l'analyse"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {job.plagiarismResult && (
                  <button
                    onClick={() => onNavigate(`/app/analysis/${job.id}/similarity`)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#3978D5] bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 rounded-xl transition-all"
                    title="Voir le rapport de similarité avec les sources surlignées"
                  >
                    <SearchCheck className="w-3.5 h-3.5" />
                    <span>Plagiat</span>
                  </button>
                )}

                {job.aiDetectionResult && (
                  <button
                    onClick={() => onNavigate(`/app/analysis/${job.id}/ai`)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#8B68D8] bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 hover:bg-purple-100 rounded-xl transition-all"
                    title="Voir le rapport de détection d'intelligence artificielle"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Audit IA</span>
                  </button>
                )}

                <button
                  onClick={() => onNavigate(`/app/analysis/${job.id}/results`)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all"
                >
                  <span>Synthèse</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
