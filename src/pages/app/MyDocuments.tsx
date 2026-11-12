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
} from 'lucide-react';

interface MyDocumentsProps {
  onNavigate: (path: string) => void;
}

export const MyDocuments: React.FC<MyDocumentsProps> = ({ onNavigate }) => {
  const { documents, collections, deleteDocument, assignDocumentToCollection } = useData();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColFilter, setSelectedColFilter] = useState<string>('all');

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
                    onClick={() => onNavigate(`/app/documents/${doc.id}`)}
                    className="font-medium text-slate-600 dark:text-slate-300 hover:text-[#3978D5] flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lire</span>
                  </button>
                  <button
                    onClick={() => onNavigate(`/app/analysis/${doc.id}/configure`)}
                    className="font-semibold text-[#3978D5] hover:underline flex items-center gap-1"
                  >
                    <span>Vérifier</span>
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
                            onClick={() => onNavigate(`/app/documents/${doc.id}`)}
                            className="p-1 text-slate-500 hover:text-slate-900"
                            title="Lire"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onNavigate(`/app/analysis/${doc.id}/configure`)}
                            className="text-[#3978D5] font-semibold hover:underline"
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
    </div>
  );
};
