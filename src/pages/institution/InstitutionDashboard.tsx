import React from 'react';
import { useData } from '../../services/store/dataContext';
import { useAuth } from '../../services/store/authContext';
import {
  Users,
  GraduationCap,
  Layers,
  FileCheck,
  ClipboardList,
  BarChart3,
  TrendingUp,
  ArrowRight,
  Shield,
  Building2,
  BookCheck,
  Microscope,
  Database,
  Upload,
} from 'lucide-react';

interface InstitutionDashboardProps {
  onNavigate: (path: string) => void;
}

export const InstitutionDashboard: React.FC<InstitutionDashboardProps> = ({ onNavigate }) => {
  const { departments, classes, students, assignments, submissions, articles, subjectBanks, bankDocuments } = useData();
  const { user } = useAuth();

  const flaggedSubmissions = submissions.filter((s) => s.status === 'flagged');
  const totalCorpusWords = bankDocuments.reduce((acc, d) => acc + d.wordCount, 0);

  return (
    <div className="space-y-8">
      {/* Institutional Highlights Grid: Subject Data Banks & Pre-Publication Research */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card 1: Subject Data Banks & Institutional Corpus */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white flex flex-col justify-between gap-4 shadow-sm border border-indigo-800/40 relative overflow-hidden">
          <div className="space-y-1.5 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold">
              <Database className="w-3.5 h-3.5" />
              Banque de Données Académique par Sujet
            </div>
            <h3 className="text-base font-bold font-['Plus_Jakarta_Sans']">
              Corpus Interne & Thématiques ({subjectBanks.length} matières • {bankDocuments.length} thèses & docs)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Base de comparaison interne alimentée par vos laboratoires. Uploadez des mémoires et thèses en lot pour bloquer l'auto-plagiat et le recyclage textuel non crédité.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/10 relative z-10">
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              {(totalCorpusWords / 1000).toFixed(0)}k mots indexés
            </span>
            <button
              onClick={() => onNavigate('/institution/database')}
              className="px-3.5 py-2 bg-[#3978D5] hover:bg-[#2C65BD] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              Uploader des Documents →
            </button>
          </div>
        </div>

        {/* Card 2: Research Pre-Publication Protection */}
        <div className="bg-gradient-to-r from-blue-950 via-[#142A4A] to-slate-900 rounded-2xl p-6 text-white flex flex-col justify-between gap-4 shadow-sm border border-blue-800/40 relative overflow-hidden">
          <div className="space-y-1.5 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold">
              <Microscope className="w-3.5 h-3.5" />
              Protection Anti-Plagiat Académique & Recherche
            </div>
            <h3 className="text-base font-bold font-['Plus_Jakarta_Sans']">
              Articles Scientifiques Avant Publication ({articles.length} manuscrits sous visa)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Certification d'antériorité SHA-256, contrôle de recoupement interne campus et audit de conformité avec les revues internationales (Nature, IEEE, Springer, Elsevier).
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/10 relative z-10">
            <span className="text-xs font-mono text-blue-300 font-semibold">
              {articles.filter((a) => a.status === 'certified_ready').length} visas accordés
            </span>
            <button
              onClick={() => onNavigate('/institution/research-papers')}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 flex items-center gap-1.5 transition-all"
            >
              <BookCheck className="w-3.5 h-3.5" />
              Gérer les Visas →
            </button>
          </div>
        </div>
      </div>

      {/* Campus Banner */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#3978D5] uppercase tracking-wider">
              Campus Integrity Governance
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            {user?.institutionName ?? 'Higher Education Institution'}
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Centralized anti-plagiarism compliance, student submission dropboxes, and multi-department analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/institution/assignments')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all"
          >
            + Create Assignment
          </button>
          <button
            onClick={() => onNavigate('/institution/students')}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200"
          >
            Import Students
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-[#3978D5]" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {students.length * 85 + 240}
          </div>
          <p className="text-[11px] text-slate-400">Across 4 faculties</p>
        </div>

        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Academic Departments</span>
            <Layers className="w-4 h-4 text-[#8B68D8]" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {departments.length}
          </div>
          <p className="text-[11px] text-slate-400">Active campus divisions</p>
        </div>

        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Submissions Verified</span>
            <FileCheck className="w-4 h-4 text-[#269B72]" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {submissions.length + 142}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400">96.8% integrity rate</p>
        </div>

        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Flagged for Review</span>
            <Shield className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
            {flaggedSubmissions.length}
          </div>
          <p className="text-[11px] text-slate-400">Requires faculty decision</p>
        </div>
      </div>

      {/* Main Grid: Active Assignments & Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Active Course Assignments */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
              Active Assignment Dropboxes
            </h2>
            <button
              onClick={() => onNavigate('/institution/assignments')}
              className="text-xs font-semibold text-[#3978D5] hover:underline"
            >
              Manage all dropboxes →
            </button>
          </div>

          <div className="space-y-3">
            {assignments.map((asg) => (
              <div
                key={asg.id}
                className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-[#3978D5]">
                    {asg.className}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    {asg.title}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Due: {new Date(asg.dueDate).toLocaleDateString()} · Max {asg.maxWords.toLocaleString()} words · Alert threshold: {asg.similarityThresholdWarning}%
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-white block tabular-nums">
                    {asg.totalSubmissions} papers
                  </span>
                  <button
                    onClick={() => onNavigate('/institution/submissions')}
                    className="text-[11px] text-[#3978D5] hover:underline font-semibold"
                  >
                    View Submissions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Flagged Submissions Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
              Submissions Requiring Review
            </h2>
            <button
              onClick={() => onNavigate('/institution/submissions')}
              className="text-xs font-semibold text-[#3978D5] hover:underline"
            >
              Full Roster
            </button>
          </div>

          <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-5 space-y-3 shadow-sm">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/40 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{sub.studentName}</p>
                    <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{sub.documentTitle}</p>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      sub.status === 'flagged'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}
                  >
                    {sub.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[#3978D5] font-semibold">{sub.similarityScore}% Sim</span>
                    <span className="font-mono text-[#8B68D8] font-semibold">{sub.aiScore}% AI</span>
                  </div>
                  <button
                    onClick={() => onNavigate(`/app/analysis/job-bioinformatics-01/results`)}
                    className="text-[#3978D5] hover:underline font-semibold text-[11px]"
                  >
                    Open Report →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
