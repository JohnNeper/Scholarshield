import React from 'react';
import { useData } from '../../services/store/dataContext';
import { ListOrdered, RotateCcw, CheckCircle2, Clock } from 'lucide-react';

interface AnalysisJobsProps {
  onNavigate: (path: string) => void;
}

export const AnalysisJobs: React.FC<AnalysisJobsProps> = ({ onNavigate }) => {
  const { jobs } = useData();

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            Distributed Analysis Job Scheduler
          </h1>
          <p className="text-xs text-slate-500">
            Monitor real-time worker queues, execution timestamps, and job retry states.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <tr>
              <th className="py-3 px-5 font-semibold">Job ID</th>
              <th className="py-3 px-4 font-semibold">Target Document</th>
              <th className="py-3 px-4 font-semibold">Execution Mode</th>
              <th className="py-3 px-4 font-semibold">Current State</th>
              <th className="py-3 px-4 font-semibold">Progress</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-5 font-mono text-slate-400">{job.id}</td>
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-white line-clamp-1">
                  {job.documentTitle}
                </td>
                <td className="py-3 px-4 capitalize">{job.analysisType}</td>
                <td className="py-3 px-4">
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                      job.status === 'completed'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-[#269B72]'
                        : 'bg-blue-100 dark:bg-blue-950/60 text-[#3978D5]'
                    }`}
                  >
                    {job.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                  {job.progressPercent}%
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onNavigate(`/app/analysis/${job.id}/results`)}
                    className="text-[#3978D5] hover:underline font-semibold"
                  >
                    View Result
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
