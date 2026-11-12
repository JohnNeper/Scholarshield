import React, { useState } from 'react';
import { useData } from '../../services/store/dataContext';
import { useAuth } from '../../services/store/authContext';
import {
  Folder,
  Plus,
  FileText,
  ChevronRight,
  ArrowLeft,
  Search,
  Trash2,
  Edit3,
  Check,
  X,
  Sparkles,
  Layers,
  BookOpen,
  Calendar,
  ShieldCheck,
  Cpu,
  Upload,
} from 'lucide-react';
import { AcademicCollection, AcademicDocument } from '../../types';

interface CollectionsProps {
  onNavigate: (path: string) => void;
}

export const Collections: React.FC<CollectionsProps> = ({ onNavigate }) => {
  const {
    collections,
    documents,
    jobs,
    addCollection,
    updateCollection,
    deleteCollection,
    assignDocumentToCollection,
  } = useData();
  const { user } = useAuth();

  // State
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  // New collection form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('Thèse & Mémoire');
  const [newColor, setNewColor] = useState('#3978D5');
  const [formError, setFormError] = useState('');

  // Selected collection object
  const activeCollection = collections.find((c) => c.id === selectedCollectionId);
  const activeCollectionDocs = documents.filter((d) => d.collectionId === selectedCollectionId);

  // Editable description state for opened collection
  const [editDescValue, setEditDescValue] = useState('');

  // Filtered collections
  const filteredCollections = collections.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.category && c.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError('Veuillez indiquer un titre pour la collection.');
      return;
    }
    if (!newDescription.trim()) {
      setFormError('Veuillez saisir une description détaillée.');
      return;
    }

    const created = addCollection({
      userId: user?.id || 'usr-student-01',
      title: newTitle.trim(),
      description: newDescription.trim(),
      category: newCategory,
      color: newColor,
    });

    setNewTitle('');
    setNewDescription('');
    setShowCreateModal(false);
    setFormError('');
    setSelectedCollectionId(created.id);
  };

  const handleSaveDescription = () => {
    if (activeCollection && editDescValue.trim()) {
      updateCollection(activeCollection.id, { description: editDescValue.trim() });
      setIsEditingDescription(false);
    }
  };

  // Compute collection stats
  const getCollectionStats = (colId: string) => {
    const docs = documents.filter((d) => d.collectionId === colId);
    const totalWords = docs.reduce((sum, d) => sum + d.wordCount, 0);

    const docJobs = docs
      .map((d) => jobs.find((j) => j.id === d.lastAnalysisJobId))
      .filter(Boolean);

    const plagScores = docJobs
      .map((j) => j?.plagiarismResult?.similarityScore)
      .filter((s): s is number => typeof s === 'number');
    const avgPlag = plagScores.length > 0 ? Math.round(plagScores.reduce((a, b) => a + b, 0) / plagScores.length) : null;

    const aiScores = docJobs
      .map((j) => j?.aiDetectionResult?.overallAIProbability)
      .filter((s): s is number => typeof s === 'number');
    const avgAi = aiScores.length > 0 ? Math.round(aiScores.reduce((a, b) => a + b, 0) / aiScores.length) : null;

    return { docCount: docs.length, totalWords, avgPlag, avgAi };
  };

  // -------------------------------------------------------------
  // DETAIL VIEW: FULL OPENED COLLECTION
  // -------------------------------------------------------------
  if (activeCollection) {
    const stats = getCollectionStats(activeCollection.id);
    const unassignedDocs = documents.filter((d) => d.collectionId !== activeCollection.id);

    return (
      <div className="space-y-6 max-w-5xl mx-auto py-2">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedCollectionId(null);
              setIsEditingDescription(false);
            }}
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à toutes les collections</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm('Voulez-vous supprimer définitivement cette collection ? Les documents resteront disponibles.')) {
                  deleteCollection(activeCollection.id);
                  setSelectedCollectionId(null);
                }
              }}
              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Supprimer la collection</span>
            </button>
          </div>
        </div>

        {/* Collection Hero Header Card */}
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: activeCollection.color || '#3978D5' }}
                />
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {activeCollection.category || 'Dossier Académique'}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Créée le {new Date(activeCollection.createdAt).toLocaleDateString()}</span>
                </span>
              </div>

              <h1 className="text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                {activeCollection.title}
              </h1>

              {/* Description Section with Inline Editing */}
              {isEditingDescription ? (
                <div className="space-y-2 pt-2">
                  <textarea
                    rows={4}
                    value={editDescValue}
                    onChange={(e) => setEditDescValue(e.target.value)}
                    className="w-full text-xs font-serif p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#3978D5]"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveDescription}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Enregistrer la description</span>
                    </button>
                    <button
                      onClick={() => setIsEditingDescription(false)}
                      className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="group relative pt-1">
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-serif pr-8">
                    {activeCollection.description}
                  </p>
                  <button
                    onClick={() => {
                      setEditDescValue(activeCollection.description);
                      setIsEditingDescription(true);
                    }}
                    className="mt-2 text-xs text-[#3978D5] hover:underline flex items-center gap-1 font-sans"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Modifier la description</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowAddDocModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Associer un Document</span>
            </button>
          </div>

          {/* Metric Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
              <span className="text-[11px] text-slate-400 block">Documents Liés</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                {stats.docCount}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
              <span className="text-[11px] text-slate-400 block">Volume Total</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                {stats.totalWords.toLocaleString()} mots
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
              <span className="text-[11px] text-slate-400 block">Similarité Moyenne</span>
              <span className="text-lg font-bold font-mono text-[#3978D5]">
                {stats.avgPlag !== null ? `${stats.avgPlag}%` : '—'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
              <span className="text-[11px] text-slate-400 block">Probabilité IA Moyenne</span>
              <span className="text-lg font-bold font-mono text-[#8B68D8]">
                {stats.avgAi !== null ? `${stats.avgAi}%` : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Documents Table in this Collection */}
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#3978D5]" />
              <span>Documents inclus dans cette collection ({activeCollectionDocs.length})</span>
            </h2>

            <button
              onClick={() => onNavigate('/app/analysis/new')}
              className="text-xs text-[#3978D5] hover:underline flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Téléverser un nouveau document</span>
            </button>
          </div>

          {activeCollectionDocs.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
              <Folder className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs text-slate-500">
                Aucun document n'est encore rattaché à cette collection.
              </p>
              <button
                onClick={() => setShowAddDocModal(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl transition-colors"
              >
                Ajouter un document existant
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {activeCollectionDocs.map((doc) => {
                const job = jobs.find((j) => j.id === doc.lastAnalysisJobId);
                return (
                  <div
                    key={doc.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 p-3 rounded-xl transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {doc.title}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {doc.wordCount.toLocaleString()} mots
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {doc.filename} · Ajouté le {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {job ? (
                        <div className="flex items-center gap-2 text-xs">
                          {job.plagiarismResult && (
                            <button
                              onClick={() => onNavigate(`/app/analysis/${job.id}/similarity`)}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#3978D5] border border-blue-200 dark:border-blue-900 font-mono text-[11px] font-bold hover:bg-blue-100 transition-colors"
                              title="Inspecter le rapport de similarité"
                            >
                              Sim: {job.plagiarismResult.similarityScore}%
                            </button>
                          )}
                          {job.aiDetectionResult && (
                            <button
                              onClick={() => onNavigate(`/app/analysis/${job.id}/ai`)}
                              className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-[#8B68D8] border border-purple-200 dark:border-purple-900 font-mono text-[11px] font-bold hover:bg-purple-100 transition-colors"
                              title="Inspecter le rapport d'analyse IA"
                            >
                              IA: {job.aiDetectionResult.overallAIProbability}%
                            </button>
                          )}
                          <button
                            onClick={() => onNavigate(`/app/analysis/${job.id}/results`)}
                            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#3978D5] px-2 py-1"
                          >
                            Rapport
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onNavigate(`/app/analysis/${doc.id}/configure`)}
                          className="px-3 py-1 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-lg transition-colors"
                        >
                          Analyser
                        </button>
                      )}

                      <button
                        onClick={() => assignDocumentToCollection(doc.id, undefined)}
                        className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Retirer de la collection"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal: Add Document to this Collection */}
        {showAddDocModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#14243A] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Ajouter un document à la collection
                </h3>
                <button
                  onClick={() => setShowAddDocModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {unassignedDocs.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    Tous vos documents existants font déjà partie de cette collection.
                  </p>
                ) : (
                  unassignedDocs.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => {
                        assignDocumentToCollection(d.id, activeCollection.id);
                        setShowAddDocModal(false);
                      }}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#3978D5] cursor-pointer transition-all flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{d.title}</p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {d.wordCount.toLocaleString()} mots
                        </p>
                      </div>
                      <Plus className="w-4 h-4 text-[#3978D5]" />
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowAddDocModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // LIST VIEW: ALL COLLECTIONS
  // -------------------------------------------------------------
  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            Collections & Dossiers Académiques
          </h1>
          <p className="text-xs text-slate-500">
            Organisez vos chapitres de thèse, cours, revues de littérature et articles dans des dossiers structurés avec descriptions complètes.
          </p>
        </div>

        <button
          onClick={() => {
            setShowCreateModal(true);
            setFormError('');
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Collection</span>
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher par titre de collection, description ou thématique..."
          className="w-full text-xs pl-10 pr-4 py-2.5 bg-white dark:bg-[#14243A] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
        />
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCollections.map((col) => {
          const stats = getCollectionStats(col.id);
          return (
            <div
              key={col.id}
              onClick={() => setSelectedCollectionId(col.id)}
              className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 hover:border-[#3978D5] cursor-pointer transition-all shadow-sm flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: col.color || '#3978D5' }}
                  >
                    <Folder className="w-5 h-5 text-white" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {col.category || 'Dossier'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white group-hover:text-[#3978D5] transition-colors line-clamp-1">
                    {col.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-3 font-serif">
                    {col.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">{stats.docCount} document{stats.docCount > 1 ? 's' : ''}</span>
                <span className="text-[#3978D5] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Ouvrir</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Collection */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14243A] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                  Créer une Nouvelle Collection Académique
                </h3>
                <p className="text-xs text-slate-500">
                  Renseignez le titre et la description détaillée de votre dossier de recherche.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-700 dark:text-red-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateCollection} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Titre de la Collection *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ex. Thèse de Doctorat : Traitement du Langage Naturel & Éthique"
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#3978D5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description Détaillée *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Décrivez les objectifs, le cadre méthodologique, les chapitres concernés et les exigences d'intégrité associées à ce dossier..."
                  className="w-full text-xs font-serif p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#3978D5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#3978D5]"
                  >
                    <option value="Thèse & Mémoire">Thèse & Mémoire</option>
                    <option value="Article de Conférence">Article de Conférence</option>
                    <option value="Revue de Littérature">Revue de Littérature</option>
                    <option value="Devoir & Examen">Devoir & Examen</option>
                    <option value="Laboratoire & Recherche">Laboratoire & Recherche</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Couleur d'Identification
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    {['#3978D5', '#8B68D8', '#269B72', '#E06A3B', '#D9383A'].map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setNewColor(col)}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          newColor === col ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : ''
                        }`}
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-colors"
                >
                  Créer et Ouvrir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
