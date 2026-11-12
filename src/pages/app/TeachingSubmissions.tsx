import React, { useState } from 'react';
import { useAuth } from '../../services/store/authContext';
import { useData } from '../../services/store/dataContext';
import {
  FileCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Download,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  BookOpen,
  UserCheck,
  Flag,
} from 'lucide-react';
import { Submission } from '../../types';

interface TeachingSubmissionsProps {
  onNavigate: (path: string) => void;
}

export const TeachingSubmissions: React.FC<TeachingSubmissionsProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { submissions, assignments, updateSubmissionStatus } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [assignmentFilter, setAssignmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState('');

  const filtered = submissions.filter((sub) => {
    const matchesSearch =
      sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.documentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAsg = assignmentFilter === 'all' || sub.assignmentId === assignmentFilter;
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesAsg && matchesStatus;
  });

  const handleUpdateStatus = (subId: string, newStatus: Submission['status'], studentName: string) => {
    updateSubmissionStatus(subId, newStatus);
    const msg =
      newStatus === 'cleared'
        ? `Copie de ${studentName} validée et certifiée conforme !`
        : newStatus === 'flagged'
        ? `Copie de ${studentName} marquée en infraction / révision requise.`
        : `Statut mis à jour pour ${studentName}.`;
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* Header */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                Copies d'Étudiants & Évaluations de Cours
              </h1>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Espace enseignant : examinez les devoirs déposés par vos étudiants, vérifiez la conformité des taux de similarité et signalez ou certifiez les copies.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:bg-slate-50 transition-all shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Exporter le Procès-Verbal de Notes</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-[#269B72]" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom d'étudiant, titre de mémoire..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={assignmentFilter}
            onChange={(e) => setAssignmentFilter(e.target.value)}
            className="text-xs p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">Tous les Devoirs</option>
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">Tous les Statuts</option>
            <option value="analyzed">Analysé & Conforme</option>
            <option value="cleared">Validé par l'Enseignant</option>
            <option value="flagged">En Alerte de Fraude</option>
          </select>
        </div>
      </div>

      {/* Submissions List */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="py-3 px-5 font-semibold">Étudiant & Document</th>
                <th className="py-3 px-4 font-semibold">Devoir / Dropbox</th>
                <th className="py-3 px-4 font-semibold">Similarité</th>
                <th className="py-3 px-4 font-semibold">Indice IA</th>
                <th className="py-3 px-4 font-semibold">Date de Dépôt</th>
                <th className="py-3 px-4 font-semibold">Statut</th>
                <th className="py-3 px-4 font-semibold text-right">Actions Enseignant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((sub) => {
                const asg = assignments.find((a) => a.id === sub.assignmentId);
                const isOverThreshold = asg && sub.similarityScore > asg.similarityThresholdWarning;

                return (
                  <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="py-3.5 px-5">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{sub.studentName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{sub.studentEmail}</span>
                        <p className="text-[11px] text-[#3978D5] font-medium truncate max-w-xs pt-0.5">
                          {sub.documentTitle}
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800 dark:text-slate-200 block truncate max-w-xs">
                        {sub.assignmentTitle}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Seuil cours : ≤ {asg?.similarityThresholdWarning ?? 20}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span
                          className={`font-bold text-xs ${
                            isOverThreshold ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {sub.similarityScore}%
                        </span>
                        {isOverThreshold && (
                          <span title="Dépassement de seuil">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-purple-600 dark:text-purple-400">
                      {sub.aiScore}%
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4">
                      {sub.status === 'cleared' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Validé</span>
                        </span>
                      ) : sub.status === 'flagged' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
                          <AlertTriangle className="w-3 h-3" />
                          <span>En Alerte</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#3978D5] dark:bg-blue-950/60 dark:text-blue-300">
                          <span>Analysé</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(sub.id, 'cleared', sub.studentName)}
                          className="px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-colors"
                          title="Valider et certifier la copie"
                        >
                          Valider
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(sub.id, 'flagged', sub.studentName)}
                          className="px-2 py-1 text-[11px] font-semibold text-red-700 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 border border-red-200 dark:border-red-800 rounded-lg transition-colors"
                          title="Signaler un risque de fraude"
                        >
                          Signaler
                        </button>
                        <button
                          type="button"
                          onClick={() => onNavigate(`/app/reports`)}
                          className="p-1 text-slate-400 hover:text-[#3978D5] rounded-lg"
                          title="Ouvrir le rapport d'analyse"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
