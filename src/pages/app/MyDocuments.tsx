import React, { useState } from 'react';
import { useData } from '../../services/store/dataContext';
import {
  FileText,
  Search,
  LayoutGrid,
  List,
  PlusCircle,
  Trash2,
  Eye,
  Calendar,
  ArrowRight,
  Folder,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
} from 'lucide-react';
import { cleanGarbledPdfArtifacts } from '../../services/utils/documentDecoder';

interface MyDocumentsProps {
  onNavigate: (path: string) => void;
}

export const MyDocuments: React.FC<MyDocumentsProps> = ({ onNavigate }) => {
  const { documents, collections, deleteDocument, assignDocumentToCollection } = useData();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColFilter, setSelectedColFilter] = useState<string>('all');
  const [previewDocId, setPreviewDocId] = useState<string | null>(null);
  const [previewZoom, setPreviewZoom] = useState(100);
  const [previewSearch, setPreviewSearch] = useState('');

  const previewDoc = previewDocId ? documents.find((d) => d.id === previewDocId) : null;
  const previewDocCollection = previewDoc && previewDoc.collectionId ? collections.find((c) => c.id === previewDoc.collectionId) : null;
  const previewCleanContent = previewDoc ? cleanGarbledPdfArtifacts(previewDoc.content || '') : '';

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCollection =
      selectedColFilter === 'all'
        ? true
        : selectedColFilter === 'unassigned'
        ? !doc.collectionId
        : doc.collectionId === selectedColFilter;

    return matchesSearch && matchesCollection;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            Répertoire des Documents Académiques
          </h1>
          <p className="text-xs text-slate-500">
            Gérez vos thèses, essais, mémoires et articles de recherche avec suivi de conformité.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/app/collections')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-xl transition-all"
          >
            <Folder className="w-3.5 h-3.5 text-[#3978D5]" />
            <span>Voir les Collections ({collections.length})</span>
          </button>

          <button
            onClick={() => onNavigate('/app/analysis/new')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nouveau Document</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search, Collection Filter, and View Mode */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par titre, mot-clé ou tag..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            <select
              value={selectedColFilter}
              onChange={(e) => setSelectedColFilter(e.target.value)}
              className="text-xs px-2.5 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#3978D5]"
            >
              <option value="all">Toutes les collections</option>
              <option value="unassigned">Sans collection</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-end sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-[#14243A] text-[#3978D5] shadow-sm'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Vue Grille"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-white dark:bg-[#14243A] text-[#3978D5] shadow-sm'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Vue Liste"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Documents Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => {
            const docCollection = collections.find((c) => c.id === doc.collectionId);
            return (
              <div
                key={doc.id}
                className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#3978D5] flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Supprimer le document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white line-clamp-2">
                      {doc.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {doc.wordCount.toLocaleString()} mots · {(doc.fileSizeBytes / 1000000).toFixed(1)} MB
                    </p>
                  </div>

                  {docCollection && (
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: docCollection.color || '#3978D5' }}
                      />
                      <span className="truncate">{docCollection.title}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {doc.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setPreviewDocId(doc.id);
                      setPreviewZoom(100);
                      setPreviewSearch('');
                    }}
                    className="font-medium text-slate-700 dark:text-slate-200 hover:text-[#3978D5] flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#3978D5]" />
                    <span>Visualiser</span>
                  </button>
                  <button
                    onClick={() => onNavigate(`/app/analysis/${doc.id}/configure`)}
                    className="font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] px-3 py-1 rounded-lg shadow-2xs transition-colors flex items-center gap-1"
                  >
                    <span>Analyser</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="py-3 px-5 font-semibold">Document</th>
                  <th className="py-3 px-4 font-semibold">Collection</th>
                  <th className="py-3 px-4 font-semibold">Mots</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredDocs.map((doc) => {
                  const docCol = collections.find((c) => c.id === doc.collectionId);
                  return (
                    <tr
                      key={doc.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-5 font-semibold text-slate-900 dark:text-white">
                        <div>
                          <span>{doc.title}</span>
                          <p className="text-[10px] text-slate-400 font-mono font-normal">
                            {doc.filename}
                          </p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {docCol ? (
                          <span className="flex items-center gap-1.5 text-[11px] font-medium">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: docCol.color || '#3978D5' }}
                            />
                            <span>{docCol.title}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono">{doc.wordCount.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setPreviewDocId(doc.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title="Aperçu rapide du texte"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#3978D5]" />
                            <span>Visualiser</span>
                          </button>
                          <button
                            onClick={() => onNavigate(`/app/analysis/${doc.id}/configure`)}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-lg shadow-sm transition-all"
                          >
                            Analyser
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
      )}

      {/* Quick Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#14243A] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#3978D5]/10 text-[#3978D5] dark:bg-[#3978D5]/20">
                    Aperçu Document
                  </span>
                  {previewDocCollection && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: previewDocCollection.color || '#3978D5' }}
                      />
                      <span>{previewDocCollection.title}</span>
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-mono">
                    {previewDoc.wordCount.toLocaleString()} mots • {previewCleanContent.length.toLocaleString()} caractères
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                  {previewDoc.title}
                </h3>
                <p className="text-xs text-slate-500 font-mono truncate">
                  Fichier : {previewDoc.filename} • Déposé le {new Date(previewDoc.uploadedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onNavigate(`/app/documents/${previewDoc.id}`)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  title="Ouvrir dans la page dédiée avec plein écran"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Plein Écran</span>
                </button>
                <button
                  onClick={() => {
                    setPreviewDocId(null);
                    setPreviewSearch('');
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reading Toolbar */}
            <div className="px-4 py-2.5 bg-slate-100/70 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={previewSearch}
                  onChange={(e) => setPreviewSearch(e.target.value)}
                  placeholder="Rechercher dans ce texte..."
                  className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-medium">Taille police :</span>
                <button
                  onClick={() => setPreviewZoom((z) => Math.max(80, z - 10))}
                  disabled={previewZoom <= 80}
                  className="p-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40"
                  title="Diminuer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300 w-10 text-center">
                  {previewZoom}%
                </span>
                <button
                  onClick={() => setPreviewZoom((z) => Math.min(150, z + 10))}
                  disabled={previewZoom >= 150}
                  className="p-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40"
                  title="Agrandir"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Modal Body - Clean Scrollable Text */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-white dark:bg-[#14243A]">
              {previewCleanContent ? (
                <div
                  className="leading-relaxed text-slate-800 dark:text-slate-200 space-y-4 font-serif selection:bg-amber-200 selection:text-slate-900"
                  style={{ fontSize: `${(previewZoom / 100) * 15}px` }}
                >
                  {previewCleanContent.split(/\n\s*\n/).map((para, idx) => {
                    const trimmed = para.trim();
                    if (!trimmed) return null;
                    return (
                      <p key={idx} className="text-justify leading-relaxed">
                        {trimmed}
                      </p>
                    );
                  })}
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400">
                  <p className="text-sm">Aucun contenu textuel extrait disponible pour ce document.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Collection :</span>
                <select
                  value={previewDoc.collectionId || ''}
                  onChange={(e) => assignDocumentToCollection(previewDoc.id, e.target.value || undefined)}
                  className="text-xs px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                >
                  <option value="">Aucune collection</option>
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setPreviewDocId(null);
                    setPreviewSearch('');
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    const id = previewDoc.id;
                    setPreviewDocId(null);
                    onNavigate(`/app/analysis/${id}/configure`);
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all"
                >
                  <span>Lancer une analyse</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

