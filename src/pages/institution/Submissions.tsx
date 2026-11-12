import React, { useState } from 'react';
import { useData } from '../../services/store/dataContext';
import {
  FileCheck,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface SubmissionsProps {
  onNavigate: (path: string) => void;
}

export const Submissions: React.FC<SubmissionsProps> = ({ onNavigate }) => {
  const { submissions, updateSubmissionStatus } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState('');

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.documentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            Student Submissions Review
          </h1>
          <p className="text-xs text-slate-500">
            Access student term papers, inspect similarity flags, and export cohort grade audits.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:bg-slate-50 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Cohort Summary</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, paper title, or assignment..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="all">All Verification Statuses</option>
          <option value="analyzed">Cleared / Analyzed</option>
          <option value="flagged">Flagged for Review</option>
          <option value="pending">Pending Engine</option>
        </select>
      </div>

      {/* Submissions Table */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="py-3 px-5 font-semibold">Student & Submission</th>
                <th className="py-3 px-4 font-semibold">Assignment Dropbox</th>
                <th className="py-3 px-4 font-semibold">Similarity</th>
                <th className="py-3 px-4 font-semibold">AI Indicator</th>
                <th className="py-3 px-4 font-semibold">Submitted</th>
                <th className="py-3 px-4 font-semibold">Integrity Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-5 font-medium text-slate-900 dark:text-white">
                    <p>{sub.studentName}</p>
                    <span className="text-[10px] text-slate-400 font-normal line-clamp-1">
                      {sub.documentTitle}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="line-clamp-1">{sub.assignmentTitle}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-mono font-bold tabular-nums ${
                        sub.similarityScore > 20
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-[#3978D5]'
                      }`}
                    >
                      {sub.similarityScore}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-mono font-bold tabular-nums ${
                        sub.aiScore > 50
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-[#8B68D8]'
                      }`}
                    >
                      {sub.aiScore}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono">
                    {new Date(sub.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                        sub.status === 'flagged'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          : sub.status === 'cleared'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : 'bg-blue-100 dark:bg-blue-950/60 text-[#3978D5]'
                      }`}
                    >
                      {sub.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          updateSubmissionStatus(sub.id, 'cleared');
                          setToastMessage(`Copie de ${sub.studentName} validée par l'administration.`);
                          setTimeout(() => setToastMessage(''), 2500);
                        }}
                        className="px-2 py-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded"
                        title="Valider la soumission"
                      >
                        Valider
                      </button>
                      <button
                        onClick={() => {
                          updateSubmissionStatus(sub.id, 'flagged');
                          setToastMessage(`Copie de ${sub.studentName} marquée en infraction.`);
                          setTimeout(() => setToastMessage(''), 2500);
                        }}
                        className="px-2 py-0.5 text-[11px] font-semibold text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded"
                        title="Marquer en alerte"
                      >
                        Alerte
                      </button>
                      <button
                        onClick={() => onNavigate('/app/analysis/job-bioinformatics-01/results')}
                        className="px-2 py-0.5 text-xs font-semibold text-[#3978D5] hover:underline"
                      >
                        Rapport →
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
