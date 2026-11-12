import React from 'react';
import { useAuth } from '../../services/store/authContext';
import { useData } from '../../services/store/dataContext';
import { useTranslation } from '../../services/i18n/context';
import {
  FileText,
  PlusCircle,
  FileCheck2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Search,
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (path: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { documents, jobs } = useData();
  const { t } = useTranslation();

  const completedJobs = jobs.filter((j) => j.status === 'completed');
  const avgSimilarity =
    completedJobs.length > 0
      ? Math.round(
          completedJobs
            .filter((j) => j.plagiarismResult)
            .reduce((acc, curr) => acc + (curr.plagiarismResult?.similarityScore || 0), 0) /
            (completedJobs.filter((j) => j.plagiarismResult).length || 1)
        )
      : 0;

  const recentDocs = documents.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Top Welcome Strip & Quick CTA */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#3978D5] uppercase tracking-wider">
              {user?.institutionName ?? 'Academic Workspace'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            Welcome back, {user?.fullName ?? 'Scholar'}
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Your personal verification portal is active. You have{' '}
            <span className="font-semibold text-slate-900 dark:text-white font-mono">
              {user?.creditsRemaining} credits
            </span>{' '}
            remaining under the <span className="capitalize">{user?.plan}</span> plan.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/app/analysis/new')}
          className="flex items-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Analyze a New Document</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Documents Uploaded</span>
            <FileText className="w-4 h-4 text-[#3978D5]" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {documents.length}
          </div>
          <p className="text-[11px] text-slate-400">Total in your library</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Completed Analyses</span>
            <FileCheck2 className="w-4 h-4 text-[#269B72]" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {completedJobs.length}
          </div>
          <p className="text-[11px] text-slate-400">Verifiable dual reports</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Average Similarity</span>
            <TrendingUp className="w-4 h-4 text-[#3978D5]" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {avgSimilarity}%
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
            Within acceptable academic range
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Quota Balance</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {user?.creditsRemaining}
          </div>
          <p className="text-[11px] text-slate-400">Renews on Dec 1, 2026</p>
        </div>
      </div>

      {/* Main Content Split: Recent Analyses & Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Completed Analysis Reports */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
              Recent Verification Reports
            </h2>
            <button
              onClick={() => onNavigate('/app/reports')}
              className="text-xs font-semibold text-[#3978D5] hover:underline flex items-center gap-1"
            >
              <span>View all reports</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {completedJobs.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-xl p-4 sm:p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-sm">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {job.documentTitle}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="capitalize">{job.analysisType} analysis</span>
                    <span>·</span>
                    <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Scores Pill */}
                  <div className="flex items-center gap-2 text-xs">
                    {job.plagiarismResult && (
                      <span className="font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-[#3978D5] font-semibold border border-blue-200 dark:border-blue-900/60">
                        {job.plagiarismResult.similarityScore}% Sim
                      </span>
                    )}
                    {job.aiDetectionResult && (
                      <span className="font-mono px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-[#8B68D8] font-semibold border border-purple-200 dark:border-purple-900/60">
                        {job.aiDetectionResult.overallAIProbability}% AI
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onNavigate(`/app/analysis/${job.id}/results`)}
                    className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="View Results"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Upload Sandbox & Recent Docs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
              My Academic Documents
            </h2>
            <button
              onClick={() => onNavigate('/app/documents')}
              className="text-xs font-semibold text-[#3978D5] hover:underline"
            >
              Browse Library
            </button>
          </div>

          <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-5 space-y-3">
            {recentDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onNavigate(`/app/documents/${doc.id}`)}
                className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {doc.title}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {doc.wordCount.toLocaleString()} words · {(doc.fileSizeBytes / 1000000).toFixed(1)} MB
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            ))}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onNavigate('/app/analysis/new')}
                className="w-full py-2 text-xs font-semibold text-[#3978D5] hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Upload Document for Verification</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
