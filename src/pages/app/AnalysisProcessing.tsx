import React, { useEffect } from 'react';
import { useData } from '../../services/store/dataContext';
import {
  Loader2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  FileText,
  Search,
  Cpu,
  FileCheck2,
} from 'lucide-react';
import { JobStatus } from '../../types';

interface AnalysisProcessingProps {
  jobId: string;
  onNavigate: (path: string) => void;
}

export const AnalysisProcessing: React.FC<AnalysisProcessingProps> = ({ jobId, onNavigate }) => {
  const { getJob } = useData();
  const job = getJob(jobId);

  useEffect(() => {
    if (job?.status === 'completed') {
      const timer = setTimeout(() => {
        onNavigate(`/app/analysis/${job.id}/results`);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [job?.status, job?.id, onNavigate]);

  if (!job) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-sm text-slate-500">Job session expired or not found.</p>
        <button
          onClick={() => onNavigate('/app/dashboard')}
          className="text-xs font-semibold text-[#3978D5] hover:underline"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const pipelineStages: { id: JobStatus; label: string; desc: string; icon: any }[] = [
    { id: 'extracting', label: '1. Text & Metadata Extraction', desc: 'Parsing raw PDF tokens and segmenting paragraphs', icon: FileText },
    { id: 'preprocessing', label: '2. Preprocessing & Normalization', desc: 'Filtering citation blocks and reference bibliography', icon: Search },
    { id: 'similarity_analysis', label: '3. N-gram Shingling Cross-Reference', desc: 'Matching against 120M+ research publications', icon: Shield },
    { id: 'ai_analysis', label: '4. Stylometric AI Evaluation', desc: 'Analyzing sentence burstiness and perplexity entropy', icon: Cpu },
    { id: 'report_generation', label: '5. Verifiable Report Packaging', desc: 'Generating SHA-256 integrity stamp and annotations', icon: FileCheck2 },
  ];

  const getStageState = (stageId: JobStatus, index: number) => {
    if (job.status === 'completed') return 'completed';
    const statusOrder: JobStatus[] = [
      'queued',
      'extracting',
      'preprocessing',
      'similarity_analysis',
      'ai_analysis',
      'report_generation',
      'completed',
    ];
    const currentIndex = statusOrder.indexOf(job.status);
    const stageIndex = statusOrder.indexOf(stageId);

    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#3978D5] border border-blue-100 dark:border-blue-900/60 mb-2">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
          Executing Academic Verification
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Analyzing <span className="font-semibold text-slate-900 dark:text-white">{job.documentTitle}</span>. You may safely leave this page; the report will be available in your library.
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-600 dark:text-slate-300 font-mono">
            {job.currentStepMessage}
          </span>
          <span className="font-mono text-[#3978D5] tabular-nums">
            {job.progressPercent}%
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-[#3978D5] h-full rounded-full transition-all duration-300"
            style={{ width: `${job.progressPercent}%` }}
          />
        </div>

        {/* Stage List */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          {pipelineStages.map((stage, i) => {
            const state = getStageState(stage.id, i);
            const Icon = stage.icon;

            return (
              <div
                key={stage.id}
                className="flex items-center justify-between p-3 rounded-xl transition-colors bg-slate-50/50 dark:bg-slate-900/30"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                      state === 'completed'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-[#269B72]'
                        : state === 'active'
                        ? 'bg-blue-100 dark:bg-blue-950/60 text-[#3978D5]'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${state === 'pending' ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {stage.label}
                    </p>
                    <p className="text-[11px] text-slate-400">{stage.desc}</p>
                  </div>
                </div>

                <div>
                  {state === 'completed' && <CheckCircle2 className="w-4 h-4 text-[#269B72]" />}
                  {state === 'active' && <Loader2 className="w-4 h-4 text-[#3978D5] animate-spin" />}
                  {state === 'pending' && <Clock className="w-4 h-4 text-slate-300 dark:text-slate-700" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leave Page Safe Notice & Navigation Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>Job ID: <span className="font-mono text-slate-700 dark:text-slate-300">{job.id}</span></p>
        <button
          onClick={() => onNavigate('/app/dashboard')}
          className="text-[#3978D5] hover:underline font-semibold"
        >
          Return to Dashboard (Runs in Background) →
        </button>
      </div>
    </div>
  );
};
