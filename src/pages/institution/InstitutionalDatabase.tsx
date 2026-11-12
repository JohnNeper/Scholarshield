import React, { useState, useRef } from 'react';
import { useData } from '../../services/store/dataContext';
import { useTranslation } from '../../services/i18n/context';
import { SubjectDataBank, BankCorpusDocument } from '../../types';
import { decodeDocumentFile } from '../../services/utils/documentDecoder';
import {
  Database,
  Search,
  Plus,
  Upload,
  FileText,
  Trash2,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  Layers,
  Sparkles,
  BookOpen,
  Filter,
  FileCheck2,
  FolderArchive,
  Hash,
  Download,
  AlertCircle,
  Clock,
  ChevronRight,
  Eye,
  FileUp,
  X,
  FileCode,
  Check,
  Building2,
} from 'lucide-react';

interface InstitutionalDatabaseProps {
  onNavigate: (path: string) => void;
}

export const InstitutionalDatabase: React.FC<InstitutionalDatabaseProps> = ({ onNavigate }) => {
  const {
    subjectBanks,
    bankDocuments,
    departments,
    addSubjectBank,
    updateSubjectBank,
    deleteSubjectBank,
    toggleBankActive,
    addBankDocument,
    batchUploadBankDocuments,
    deleteBankDocument,
  } = useData();
  const { t, language } = useTranslation();

  // Navigation / Selection State
  const [selectedBankId, setSelectedBankId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isNewBankModalOpen, setIsNewBankModalOpen] = useState(false);
  const [isJsonImportModalOpen, setIsJsonImportModalOpen] = useState(false);
  const [inspectingDoc, setInspectingDoc] = useState<BankCorpusDocument | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Upload Form state
  const [uploadTargetBankId, setUploadTargetBankId] = useState(subjectBanks[0]?.id || 'bank-bio-gen');
  const [uploadDocType, setUploadDocType] = useState<BankCorpusDocument['documentType']>('thesis');
  const [uploadAcademicYear, setUploadAcademicYear] = useState('2025-2026');
  const [uploadAuthorsDefault, setUploadAuthorsDefault] = useState('');
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<
    Array<{
      title: string;
      authors: string;
      content: string;
      wordCount: number;
      fileName: string;
      fileSizeBytes: number;
      status: 'ready' | 'decoding' | 'error';
      errorMsg?: string;
    }>
  >([]);

  // Manual Direct Input tab in Upload Modal
  const [uploadMode, setUploadMode] = useState<'files' | 'manual' | 'json'>('files');
  const [manualTitle, setManualTitle] = useState('');
  const [manualAuthors, setManualAuthors] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [manualAbstract, setManualAbstract] = useState('');

  // JSON Import state
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // New Bank Form state
  const [newBankName, setNewBankName] = useState('');
  const [newBankCode, setNewBankCode] = useState('');
  const [newBankDescription, setNewBankDescription] = useState('');
  const [newBankCategory, setNewBankCategory] = useState('Sciences & Technologies');
  const [newBankDeptId, setNewBankDeptId] = useState(departments[0]?.id || '');
  const [newBankColor, setNewBankColor] = useState('#3978D5');
  const [newBankActive, setNewBankActive] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Copy hash helper
  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Filtered documents
  const filteredDocuments = bankDocuments.filter((doc) => {
    const matchesBank = selectedBankId === 'all' || doc.bankId === selectedBankId;
    const matchesType = typeFilter === 'all' || doc.documentType === typeFilter;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.originalFileName && doc.originalFileName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.sha256Fingerprint.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesBank && matchesType && matchesSearch;
  });

  // Analytics totals
  const totalBanks = subjectBanks.length;
  const activeBanksCount = subjectBanks.filter((b) => b.isActiveForPlagiarismCheck).length;
  const totalDocuments = bankDocuments.length;
  const totalWords = bankDocuments.reduce((acc, d) => acc + d.wordCount, 0);

  // Handle file selection and decoding
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingFiles(true);
    const newStaged: typeof stagedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const decoded = await decodeDocumentFile(file);
        // Clean title from filename
        const cleanTitle = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[_-]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());

        newStaged.push({
          title: cleanTitle,
          authors: uploadAuthorsDefault || 'Auteur Institutionnel',
          content: decoded.text,
          wordCount: decoded.wordCount,
          fileName: file.name,
          fileSizeBytes: file.size,
          status: 'ready',
        });
      } catch (err: any) {
        newStaged.push({
          title: file.name,
          authors: uploadAuthorsDefault || 'Inconnu',
          content: '',
          wordCount: 0,
          fileName: file.name,
          fileSizeBytes: file.size,
          status: 'error',
          errorMsg: err.message || 'Impossible de décoder ce fichier',
        });
      }
    }

    setStagedFiles((prev) => [...prev, ...newStaged]);
    setIsProcessingFiles(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveStagedFile = (index: number) => {
    setStagedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit batch files into the selected bank
  const handleCommitBatchUpload = () => {
    const valid = stagedFiles.filter((f) => f.status === 'ready' && f.content.trim().length > 0);
    if (valid.length === 0) return;

    batchUploadBankDocuments(
      uploadTargetBankId,
      valid.map((f) => ({
        title: f.title,
        authors: f.authors,
        academicYear: uploadAcademicYear,
        documentType: uploadDocType,
        content: f.content,
        originalFileName: f.fileName,
      }))
    );

    setStagedFiles([]);
    setIsUploadModalOpen(false);
  };

  // Submit single manual document
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim() || !manualContent.trim()) return;

    const bank = subjectBanks.find((b) => b.id === uploadTargetBankId);
    addBankDocument({
      bankId: uploadTargetBankId,
      subjectCode: bank?.subjectCode || 'SUBJ',
      title: manualTitle.trim(),
      authors: manualAuthors.trim() || 'Auteur du Campus',
      academicYear: uploadAcademicYear,
      documentType: uploadDocType,
      content: manualContent.trim(),
      abstract: manualAbstract.trim() || manualContent.slice(0, 200) + '...',
    });

    setManualTitle('');
    setManualAuthors('');
    setManualContent('');
    setManualAbstract('');
    setIsUploadModalOpen(false);
  };

  // Submit JSON Corpus
  const handleJsonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setJsonError(null);
    try {
      const parsed = JSON.parse(jsonText);
      const docsArray = Array.isArray(parsed) ? parsed : parsed.documents || parsed.papers;
      if (!Array.isArray(docsArray) || docsArray.length === 0) {
        throw new Error('Le format JSON doit être un tableau d objets document [{title, content, authors...}]');
      }

      batchUploadBankDocuments(
        uploadTargetBankId,
        docsArray.map((d: any) => ({
          title: d.title || d.name || 'Document sans titre',
          authors: d.authors || d.author || 'Auteur non renseigné',
          academicYear: d.academicYear || d.year || uploadAcademicYear,
          documentType: d.documentType || d.type || uploadDocType,
          content: d.content || d.text || d.abstract || '',
          originalFileName: d.fileName || 'import-corpus.json',
          abstract: d.abstract,
        }))
      );

      setJsonText('');
      setIsUploadModalOpen(false);
      setIsJsonImportModalOpen(false);
    } catch (err: any) {
      setJsonError(err.message || 'JSON invalide');
    }
  };

  // Create new Subject Data Bank
  const handleCreateBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankName.trim() || !newBankCode.trim()) return;

    const dept = departments.find((d) => d.id === newBankDeptId);

    const created = addSubjectBank({
      name: newBankName.trim(),
      subjectCode: newBankCode.trim().toUpperCase(),
      description: newBankDescription.trim(),
      category: newBankCategory.trim(),
      departmentId: newBankDeptId || undefined,
      departmentName: dept?.name || undefined,
      color: newBankColor,
      isActiveForPlagiarismCheck: newBankActive,
    });

    setNewBankName('');
    setNewBankCode('');
    setNewBankDescription('');
    setIsNewBankModalOpen(false);
    setSelectedBankId(created.id);
  };

  // Export Bank as JSON
  const handleExportBankJson = (bank: SubjectDataBank) => {
    const docs = bankDocuments.filter((d) => d.bankId === bank.id);
    const exportData = {
      bank,
      exportedAt: new Date().toISOString(),
      documents: docs,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Banque_Donnees_${bank.subjectCode}_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#14243A] via-[#1E3352] to-[#25456E] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider">
              <Database className="w-3.5 h-3.5" />
              {language === 'fr' ? 'Corpus Institutionnel & Banques de Données par Sujet' : 'Institutional Corpus & Subject Data Banks'}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight">
              {language === 'fr' ? 'Banques de Données Thématiques par Matière' : 'Subject Data Banks by Discipline'}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {language === 'fr'
                ? "Constituez et uploadez le fonds documentaire de votre université par discipline (thèses doctorales, mémoires de master, rapports de recherche, cours). Chaque document déposé est décodé, haché et injecté dans l'algorithme anti-plagiat du campus pour garantir une vérification exhaustive face aux sources internes."
                : 'Build and upload your university reference archive by discipline (doctoral dissertations, master theses, lab reports, course syllabi). Every deposited document is decoded, fingerprinted, and injected into the campus anti-plagiarism engine to ensure exhaustive checks against internal sources.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setUploadMode('files');
                setIsUploadModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#3978D5] hover:bg-[#2C65BD] text-white text-xs font-semibold shadow-sm flex items-center gap-2 transition-all hover:shadow"
            >
              <Upload className="w-4 h-4" />
              <span>{language === 'fr' ? 'Uploader des Documents' : 'Upload Documents'}</span>
            </button>

            <button
              onClick={() => setIsNewBankModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'fr' ? 'Nouveau Sujet / Matière' : 'New Subject / Topic'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#14243A] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {language === 'fr' ? 'Banques par Matière' : 'Subject Data Banks'}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-['Plus_Jakarta_Sans']">
              {totalBanks}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3" /> {activeBanksCount} {language === 'fr' ? "actives pour l'anti-plagiat" : 'active for anti-plagiarism'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#3978D5] flex items-center justify-center">
            <FolderArchive className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#14243A] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {language === 'fr' ? 'Documents Indexés' : 'Indexed Documents'}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-['Plus_Jakarta_Sans']">
              {totalDocuments}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {language === 'fr' ? 'Thèses, Mémoires & Articles' : 'Theses, Dissertations & Papers'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#14243A] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {language === 'fr' ? 'Volume de Texte Référencé' : 'Referenced Text Volume'}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-['Plus_Jakarta_Sans']">
              {(totalWords / 1000).toFixed(1)}k
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {totalWords.toLocaleString()} {language === 'fr' ? 'mots décodés' : 'decoded words'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#14243A] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {language === 'fr' ? 'Couverture Campus' : 'Campus Coverage'}
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-['Plus_Jakarta_Sans']">
              100%
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {language === 'fr' ? 'Miroir anti-auto-plagiat actif' : 'Active anti-self-plagiarism mirror'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Subject Banks Overview Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
              Banques de Données Disponibles ({subjectBanks.length} disciplines)
            </h2>
            <p className="text-xs text-slate-500">
              Cliquez sur une matière pour filtrer ses documents, ajouter des fichiers ou configurer son inclusion dans les audits.
            </p>
          </div>

          <button
            onClick={() => setSelectedBankId('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedBankId === 'all'
                ? 'bg-[#3978D5] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Afficher Tout le Fonds ({bankDocuments.length} docs)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectBanks.map((bank) => {
            const isSelected = selectedBankId === bank.id;
            const docsInThisBank = bankDocuments.filter((d) => d.bankId === bank.id);

            return (
              <div
                key={bank.id}
                onClick={() => setSelectedBankId(bank.id)}
                className={`cursor-pointer rounded-xl border p-5 transition-all text-left relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#3978D5] bg-blue-50/40 dark:bg-blue-950/20 shadow-sm ring-1 ring-[#3978D5]'
                    : 'bg-white dark:bg-[#14243A] border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: bank.color }}
                />

                <div className="space-y-2 mt-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider"
                      style={{
                        backgroundColor: `${bank.color}20`,
                        color: bank.color,
                      }}
                    >
                      {bank.subjectCode}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBankActive(bank.id);
                      }}
                      title="Activer/Désactiver cette banque dans les analyses anti-plagiat"
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                        bank.isActiveForPlagiarismCheck
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {bank.isActiveForPlagiarismCheck ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Actif Anti-Plagiat
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Inactif
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans'] leading-snug">
                    {bank.name}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {bank.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {docsInThisBank.length} documents
                    </span>
                    <span>•</span>
                    <span>{(bank.totalWords / 1000).toFixed(0)}k mots</span>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setUploadTargetBankId(bank.id);
                        setUploadMode('files');
                        setIsUploadModalOpen(true);
                      }}
                      title="Uploader directement dans cette banque"
                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-[#3978D5]"
                    >
                      <Upload className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleExportBankJson(bank)}
                      title="Exporter la banque au format JSON"
                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar for Documents */}
      <div className="bg-white dark:bg-[#14243A] rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titre de thèse, auteur, nom de fichier ou empreinte SHA-256..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3978D5]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Subject Bank Selector */}
            <select
              value={selectedBankId}
              onChange={(e) => setSelectedBankId(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#3978D5]"
            >
              <option value="all">Toutes les Banques ({bankDocuments.length})</option>
              {subjectBanks.map((b) => (
                <option key={b.id} value={b.id}>
                  [{b.subjectCode}] {b.name}
                </option>
              ))}
            </select>

            {/* Document Type Selector */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#3978D5]"
            >
              <option value="all">Tous les Formats</option>
              <option value="thesis">Thèse Doctorale</option>
              <option value="master_dissertation">Mémoire de Master</option>
              <option value="lab_publication">Publication Laboratoire</option>
              <option value="conference_paper">Communication Conférence</option>
              <option value="course_syllabus">Cours / Polycopié</option>
            </select>

            <button
              onClick={() => {
                setUploadMode('files');
                setIsUploadModalOpen(true);
              }}
              className="px-3 py-2 bg-[#3978D5] hover:bg-[#2C65BD] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              Ajouter Fichier(s)
            </button>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white dark:bg-[#14243A] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
              Fonds Documentaire Actif ({filteredDocuments.length} documents répertoriés)
            </h3>
            <p className="text-[11px] text-slate-500">
              Ces travaux sont comparés ligne par ligne lors des soumissions pour détecter les similitudes textuelles internes.
            </p>
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            {filteredDocuments.reduce((acc, d) => acc + d.wordCount, 0).toLocaleString()} mots dans la sélection
          </span>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Database className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Aucun document trouvé dans cette banque thématique
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Glissez-déposez des fichiers PDF, Word ou textes pour alimenter ce sujet et protéger vos futurs diplômés contre le plagiat.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 bg-[#3978D5] text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              Uploader les premiers documents
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-semibold">
                  <th className="py-3 px-4">Titre & Source</th>
                  <th className="py-3 px-4">Sujet / Matière</th>
                  <th className="py-3 px-4">Auteur(s) & Année</th>
                  <th className="py-3 px-4">Format</th>
                  <th className="py-3 px-4">Volume</th>
                  <th className="py-3 px-4">Empreinte SHA-256</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDocuments.map((doc) => {
                  const bank = subjectBanks.find((b) => b.id === doc.bankId);
                  return (
                    <tr
                      key={doc.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 max-w-xs">
                        <div className="space-y-0.5">
                          <button
                            onClick={() => setInspectingDoc(doc)}
                            className="font-bold text-slate-900 dark:text-white hover:text-[#3978D5] text-left line-clamp-1 cursor-pointer"
                          >
                            {doc.title}
                          </button>
                          {doc.originalFileName && (
                            <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                              <FileText className="w-3 h-3 shrink-0" />
                              <span className="truncate max-w-[200px]">{doc.originalFileName}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                          style={{
                            backgroundColor: `${bank?.color || '#3978D5'}20`,
                            color: bank?.color || '#3978D5',
                          }}
                        >
                          {doc.subjectCode}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-medium text-slate-800 dark:text-slate-200 block truncate max-w-[150px]">
                          {doc.authors}
                        </span>
                        <span className="text-[11px] text-slate-400 block font-mono">{doc.academicYear}</span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {doc.documentType === 'thesis' && 'Thèse Doctorale'}
                          {doc.documentType === 'master_dissertation' && 'Mémoire M2'}
                          {doc.documentType === 'lab_publication' && 'Publi Labo'}
                          {doc.documentType === 'conference_paper' && 'Conférence'}
                          {doc.documentType === 'course_syllabus' && 'Polycopié'}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-600 dark:text-slate-300">
                        <span className="block font-semibold">{doc.wordCount.toLocaleString()} mots</span>
                        <span className="text-[10px] text-slate-400">
                          {(doc.fileSizeBytes / 1024).toFixed(0)} KB
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-[160px]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] text-slate-500 truncate block">
                            {doc.sha256Fingerprint.slice(0, 12)}...
                          </span>
                          <button
                            onClick={() => handleCopyHash(doc.sha256Fingerprint)}
                            title="Copier le SHA-256"
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setInspectingDoc(doc)}
                            className="px-2 py-1 bg-blue-50 dark:bg-blue-950/40 text-[#3978D5] rounded hover:bg-blue-100 font-semibold text-[11px] flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> Lire
                          </button>

                          <button
                            onClick={() => deleteBankDocument(doc.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Supprimer de la banque de données"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL 1: Upload Modal (Batch Files / Manual / JSON) ================= */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#14243A] rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-[#3978D5] flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                    Alimenter la Banque de Données
                  </h2>
                  <p className="text-xs text-slate-500">
                    Importez des travaux pour enrichir le fonds documentaire de référence
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Selector Tabs */}
            <div className="flex rounded-lg bg-slate-100 dark:bg-slate-900 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setUploadMode('files')}
                className={`flex-1 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  uploadMode === 'files'
                    ? 'bg-white dark:bg-[#14243A] text-[#3978D5] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <FileUp className="w-3.5 h-3.5" />
                Upload Fichiers en Lot (PDF / Word)
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('manual')}
                className={`flex-1 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  uploadMode === 'manual'
                    ? 'bg-white dark:bg-[#14243A] text-[#3978D5] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Saisie Manuelle & Copier-Coller
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('json')}
                className={`flex-1 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  uploadMode === 'json'
                    ? 'bg-white dark:bg-[#14243A] text-[#3978D5] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                Import Corpus JSON
              </button>
            </div>

            {/* Target Bank and Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Matière / Banque Cible *
                </label>
                <select
                  value={uploadTargetBankId}
                  onChange={(e) => setUploadTargetBankId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#3978D5] focus:outline-none"
                >
                  {subjectBanks.map((b) => (
                    <option key={b.id} value={b.id}>
                      [{b.subjectCode}] {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nature du Document
                </label>
                <select
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#3978D5] focus:outline-none"
                >
                  <option value="thesis">Thèse Doctorale</option>
                  <option value="master_dissertation">Mémoire de Master</option>
                  <option value="lab_publication">Publication Laboratoire</option>
                  <option value="conference_paper">Communication Conférence</option>
                  <option value="course_syllabus">Support de Cours / Polycopié</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Année Académique
                </label>
                <input
                  type="text"
                  value={uploadAcademicYear}
                  onChange={(e) => setUploadAcademicYear(e.target.value)}
                  placeholder="2025-2026"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#3978D5] focus:outline-none"
                />
              </div>
            </div>

            {/* TAB 1: File Batch Upload */}
            {uploadMode === 'files' && (
              <div className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#3978D5] dark:hover:border-[#3978D5] rounded-2xl p-6 text-center cursor-pointer bg-slate-50/50 dark:bg-slate-900/30 transition-all"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.docx,.txt,.md,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-[#3978D5] flex items-center justify-center mx-auto mb-2 shadow-xs">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">
                    Glissez vos documents ou cliquez pour parcourir
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Supporte les fichiers <strong>PDF, DOCX, TXT, MD, CSV</strong>. Décodage du texte et extraction automatique.
                  </p>
                </div>

                {isProcessingFiles && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg flex items-center gap-2 text-xs text-[#3978D5]">
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Décodage des fichiers en cours... Extraction du texte intégral.</span>
                  </div>
                )}

                {/* Staged files list */}
                {stagedFiles.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Fichiers prêts pour indexation ({stagedFiles.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setStagedFiles([])}
                        className="text-rose-600 hover:underline"
                      >
                        Vider la liste
                      </button>
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-1.5 border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-50/50 dark:bg-slate-900/40">
                      {stagedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#14243A] border border-slate-200 dark:border-slate-800 text-xs"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="w-4 h-4 text-[#3978D5] shrink-0" />
                            <div className="truncate">
                              <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                                {file.title}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {file.fileName} • {file.wordCount.toLocaleString()} mots
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {file.status === 'ready' && (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                                Décodé
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveStagedFile(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                  >
                    Annuler
                  </button>

                  <button
                    type="button"
                    disabled={stagedFiles.length === 0}
                    onClick={handleCommitBatchUpload}
                    className="px-5 py-2 bg-[#3978D5] hover:bg-[#2C65BD] text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    Confirmer l'Indexation ({stagedFiles.length} fichiers)
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: Manual Direct Input */}
            {uploadMode === 'manual' && (
              <form onSubmit={handleManualSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Titre du Mémoire ou Document *
                  </label>
                  <input
                    type="text"
                    required
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    placeholder="Ex : Analyse des Mécanismes d'Attention en Bio-Informatique..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-[#3978D5] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Auteur(s) & Directeurs de Recherche
                  </label>
                  <input
                    type="text"
                    value={manualAuthors}
                    onChange={(e) => setManualAuthors(e.target.value)}
                    placeholder="Ex : Dr. Sarah K. Miller, Dir. Pr. Valérie Mercier"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-[#3978D5] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contenu Textuel Intégral *
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={manualContent}
                    onChange={(e) => setManualContent(e.target.value)}
                    placeholder="Collez ici le texte intégral du mémoire, de la thèse ou du chapitre de référence..."
                    className="w-full px-3 py-2 font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-[#3978D5] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#3978D5] hover:bg-[#2C65BD] text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter au Corpus
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: JSON Import */}
            {uploadMode === 'json' && (
              <form onSubmit={handleJsonSubmit} className="space-y-3">
                <p className="text-xs text-slate-500">
                  Collez un tableau JSON d'objets avec les clés <code>title</code>, <code>authors</code>, <code>content</code>.
                </p>

                <textarea
                  rows={8}
                  required
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder={`[
  {
    "title": "Thèse en Réseaux Neuronaux",
    "authors": "Marc Albrand",
    "academicYear": "2025-2026",
    "documentType": "thesis",
    "content": "Texte intégral..."
  }
]`}
                  className="w-full px-3 py-2 font-mono text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#3978D5] focus:outline-none"
                />

                {jsonError && (
                  <div className="p-2.5 rounded bg-rose-50 text-rose-700 text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{jsonError}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#3978D5] hover:bg-[#2C65BD] text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs"
                  >
                    <Upload className="w-4 h-4" />
                    Importer le Corpus JSON
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL 2: Create New Subject Bank ================= */}
      {isNewBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#14243A] rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center">
                  <FolderArchive className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                    Nouvelle Banque Thématique par Sujet
                  </h2>
                  <p className="text-xs text-slate-500">
                    Définissez une nouvelle discipline ou matière pour classifier les documents
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewBankModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBank} className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nom de la Matière / Sujet *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBankName}
                    onChange={(e) => setNewBankName(e.target.value)}
                    placeholder="Ex : Bio-Santé & Neuro-Ingénierie"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-[#3978D5] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Code Sujet *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBankCode}
                    onChange={(e) => setNewBankCode(e.target.value)}
                    placeholder="BIO-NEURO"
                    className="w-full px-3 py-2 uppercase font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-[#3978D5] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Département de Rattachement
                </label>
                <select
                  value={newBankDeptId}
                  onChange={(e) => setNewBankDeptId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-[#3978D5] focus:outline-none"
                >
                  <option value="">Faculté Générale (Tous Départements)</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description du Corpus & Périmètre
                </label>
                <textarea
                  rows={2}
                  value={newBankDescription}
                  onChange={(e) => setNewBankDescription(e.target.value)}
                  placeholder="Objectif de cette banque : thèses du laboratoire, mémoires étudiants, articles de référence..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-[#3978D5] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Catégorie
                  </label>
                  <input
                    type="text"
                    value={newBankCategory}
                    onChange={(e) => setNewBankCategory(e.target.value)}
                    placeholder="Sciences & Ingénierie"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-[#3978D5] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Couleur d'Affichage
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newBankColor}
                      onChange={(e) => setNewBankColor(e.target.value)}
                      className="w-9 h-9 p-0.5 rounded cursor-pointer border border-slate-300 dark:border-slate-700"
                    />
                    <span className="font-mono text-xs text-slate-500">{newBankColor}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl space-y-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newBankActive}
                    onChange={(e) => setNewBankActive(e.target.checked)}
                    className="w-4 h-4 text-[#3978D5] rounded border-slate-300 focus:ring-[#3978D5]"
                  />
                  <span>Activer immédiatement cette banque pour le contrôle anti-plagiat</span>
                </label>
                <p className="text-[11px] text-slate-500 pl-6">
                  Tous les futurs devoirs et articles soumis dans l'université seront comparés à ces documents.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewBankModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#3978D5] hover:bg-[#2C65BD] text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  Créer la Banque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: Inspect Document Detail ================= */}
      {inspectingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#14243A] rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 my-8">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-900/50 text-[#3978D5]">
                    {inspectingDoc.subjectCode}
                  </span>
                  <span className="text-xs text-slate-500">
                    Année Universitaire : {inspectingDoc.academicYear}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                  {inspectingDoc.title}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {inspectingDoc.authors}
                </p>
              </div>
              <button
                onClick={() => setInspectingDoc(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cryptographic Proof */}
            <div className="p-3 rounded-xl bg-slate-900 text-slate-200 space-y-1 text-xs">
              <div className="flex items-center justify-between text-[11px] font-mono text-blue-400">
                <span className="flex items-center gap-1 font-bold">
                  <Hash className="w-3.5 h-3.5" /> Condensat d'Antériorité SHA-256
                </span>
                <span className="text-slate-400">{inspectingDoc.wordCount.toLocaleString()} mots</span>
              </div>
              <p className="font-mono text-emerald-400 break-all text-[11px]">
                {inspectingDoc.sha256Fingerprint}
              </p>
            </div>

            {/* Content Reader */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Texte Intégral Décodé en Base Référencée :
              </span>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-h-72 overflow-y-auto text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {inspectingDoc.content}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => handleCopyHash(inspectingDoc.content)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                Copier le Texte
              </button>

              <button
                onClick={() => setInspectingDoc(null)}
                className="px-4 py-1.5 bg-[#3978D5] text-white rounded-lg text-xs font-semibold hover:bg-[#2C65BD]"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
