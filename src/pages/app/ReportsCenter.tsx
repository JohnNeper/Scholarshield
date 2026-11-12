import React, { useState } from 'react';
import { useData } from '../../services/store/dataContext';
import {
  Search,
  Filter,
  FileCheck2,
  ArrowRight,
  Download,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { AnalysisType } from '../../types';

interface ReportsCenterProps {
  onNavigate: (path: string) => void;
}

export const ReportsCenter: React.FC<ReportsCenterProps> = ({ onNavigate }) => {
  const { jobs } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.documentTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || job.analysisType === typeFilter;
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            Academic Reports Center
          </h1>
          <p className="text-xs text-slate-500">
            Search and export verified similarity indices and AI content probability audits.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/app/analysis/new')}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all whitespace-nowrap"
        >
          + New Verification
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by document title or job ID..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Engine Modes</option>
            <option value="both">Complete Analysis</option>
            <option value="plagiarism">Plagiarism Only</option>
            <option value="ai">AI Detection Only</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="extracting">In Progress</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="py-3 px-5 font-semibold">Document Title</th>
                <th className="py-3 px-4 font-semibold">Analysis Type</th>
                <th className="py-3 px-4 font-semibold">Similarity Index</th>
                <th className="py-3 px-4 font-semibold">AI Indicator</th>
                <th className="py-3 px-4 font-semibold">Date Completed</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No matching verification reports found.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-5 font-medium text-slate-900 dark:text-white">
                      <p className="line-clamp-1">{job.documentTitle}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{job.id}</span>
                    </td>
                    <td className="py-3 px-4 capitalize">{job.analysisType}</td>
                    <td className="py-3 px-4">
                      {job.plagiarismResult ? (
                        <span className="font-mono font-bold text-[#3978D5] tabular-nums">
                          {job.plagiarismResult.similarityScore}%
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {job.aiDetectionResult ? (
                        <span className="font-mono font-bold text-[#8B68D8] tabular-nums">
                          {job.aiDetectionResult.overallAIProbability}%
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                          job.status === 'completed'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#269B72]'
                            : 'bg-blue-50 dark:bg-blue-950/60 text-[#3978D5]'
                        }`}
                      >
                        {job.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onNavigate(`/app/analysis/${job.id}/results`)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#3978D5] hover:underline"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
