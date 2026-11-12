import React, { useState } from 'react';
import { useAuth } from '../../services/store/authContext';
import { useData } from '../../services/store/dataContext';
import {
  ClipboardList,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UploadCloud,
  FileText,
  ChevronRight,
  ShieldCheck,
  Search,
  BookOpen,
} from 'lucide-react';

interface StudentAssignmentsProps {
  onNavigate: (path: string) => void;
}

export const StudentAssignments: React.FC<StudentAssignmentsProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { assignments, submissions, documents, addSubmission, startAnalysisJob } = useData();

  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [customPaperTitle, setCustomPaperTitle] = useState('');
  const [customPaperContent, setCustomPaperContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Find submissions made by current user
  const userSubmissions = submissions.filter(
    (s) => s.studentEmail.toLowerCase() === (user?.email?.toLowerCase() || '') || s.studentName === user?.fullName
  );

  const activeAssignment = assignments.find((a) => a.id === selectedAssignmentId);

  const handleOpenSubmitModal = (asgId: string) => {
    setSelectedAssignmentId(asgId);
    if (documents.length > 0) {
      setSelectedDocId(documents[0].id);
    }
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignment) return;

    setIsSubmitting(true);

    try {
      let docTitle = '';
      let targetDocId = selectedDocId;

      if (selectedDocId) {
        const found = documents.find((d) => d.id === selectedDocId);
        docTitle = found?.title || 'Devoir Académique';
      } else {
        docTitle = customPaperTitle || 'Mémoire de recherche';
        targetDocId = `doc-sub-${Date.now().toString(36)}`;
      }

      // Generate a simulated similarity and AI evaluation for student's submission
      const simScore = Math.floor(Math.random() * 16) + 4; // 4% - 20%
      const aiScore = Math.floor(Math.random() * 20) + 5; // 5% - 25%

      addSubmission({
        assignmentId: activeAssignment.id,
        assignmentTitle: activeAssignment.title,
        studentId: user?.id || 'usr-student-01',
        studentName: user?.fullName || 'Claire Dubois',
        studentEmail: user?.email || 'claire.dubois@sorbonne-universite.fr',
        documentId: targetDocId,
        documentTitle: docTitle,
        similarityScore: simScore,
        aiScore: aiScore,
        status: simScore > activeAssignment.similarityThresholdWarning ? 'flagged' : 'analyzed',
      });

      setIsSubmitting(false);
      setSubmissionSuccess(true);
      setTimeout(() => {
        setSubmissionSuccess(false);
        setSelectedAssignmentId(null);
      }, 2000);
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#3978D5]" />
              <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                Devoirs & Mémoires de Cours
              </h1>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Consultez les sujets déposés par vos enseignants, les dates limites et les seuils de similarité exigés. Vous pouvez soumettre vos travaux directement pour une vérification institutionnelle.
            </p>
          </div>

          <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl text-center sm:text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Vos Devoirs Rendus</span>
            <span className="text-xl font-bold font-mono text-[#3978D5]">
              {userSubmissions.length} / {assignments.length}
            </span>
          </div>
        </div>
      </div>

      {submissionSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-[#269B72] shrink-0" />
          <div>
            <span className="font-bold block">Votre devoir a été déposé avec succès !</span>
            <span className="text-[11px] opacity-80">
              Le rapport d'intégrité a été transmis à votre enseignant avec le certificat de conformité.
            </span>
          </div>
        </div>
      )}

      {/* List of Assignments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.map((asg) => {
          const submission = userSubmissions.find((s) => s.assignmentId === asg.id);
          const isSubmitted = !!submission;
          const isDueSoon = new Date(asg.dueDate).getTime() - Date.now() < 1000 * 60 * 60 * 24 * 7;

          return (
            <div
              key={asg.id}
              className={`bg-white dark:bg-[#14243A] border rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-sm transition-all ${
                isSubmitted
                  ? 'border-emerald-200 dark:border-emerald-900/50'
                  : 'border-[#E7EBF1] dark:border-[#23334A] hover:border-[#3978D5]/60'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-[#3978D5] border border-blue-200 dark:border-blue-900/50">
                    {asg.className}
                  </span>
                  {isSubmitted ? (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Rendu Validé</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>À Rendre</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                    {asg.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Échéance : {new Date(asg.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Requirements Box */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Limite de mots :</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      max {asg.maxWords.toLocaleString()} mots
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Seuil d'alerte exigé :</span>
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                      ≤ {asg.similarityThresholdWarning}% Similarité
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Formats acceptés :</span>
                    <span className="font-mono">{asg.acceptedFormats.join(', ')}</span>
                  </div>
                </div>

                {/* Submission Feedback if submitted */}
                {isSubmitted && submission && (
                  <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-xl space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-emerald-900 dark:text-emerald-200">Score de similarité :</span>
                      <span className="font-mono font-extrabold text-emerald-700 dark:text-emerald-300">
                        {submission.similarityScore}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Contenu IA détecté :</span>
                      <span className="font-mono font-semibold text-purple-600">{submission.aiScore}%</span>
                    </div>
                    <p className="text-[11px] text-slate-400 pt-1 truncate">
                      Document associé : {submission.documentTitle}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                {isSubmitted ? (
                  <button
                    type="button"
                    onClick={() => onNavigate('/app/reports')}
                    className="w-full py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Voir le Certificat d'Intégrité</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenSubmitModal(asg.id)}
                    className="w-full py-2 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Déposer / Soumettre mon Travail</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* SUBMISSION MODAL */}
      {selectedAssignmentId && activeAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                  Dépôt pour : {activeAssignment.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Classe : {activeAssignment.className} · Seuil : max {activeAssignment.similarityThresholdWarning}%
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAssignmentId(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sélectionner un document déjà analysé
                </label>
                {documents.length > 0 ? (
                  <select
                    value={selectedDocId}
                    onChange={(e) => setSelectedDocId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {documents.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title} ({d.wordCount.toLocaleString()} mots)
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-slate-400 italic">Aucun document préexistant. Renseignez ci-dessous.</p>
                )}
              </div>

              {!selectedDocId && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Titre du Mémoire ou Devoir
                  </label>
                  <input
                    type="text"
                    required
                    value={customPaperTitle}
                    onChange={(e) => setCustomPaperTitle(e.target.value)}
                    placeholder="ex. Analyse comparative des algorithmes génétiques"
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl flex items-center gap-2 text-xs text-blue-900 dark:text-blue-300">
                <ShieldCheck className="w-4 h-4 text-[#3978D5] shrink-0" />
                <span>
                  Ce dépôt sera audité en temps réel par les moteurs de détection multi-sources et transmis à votre enseignant.
                </span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedAssignmentId(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Traitement et Vérification...</span>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Confirmer le Dépôt Officiel</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
