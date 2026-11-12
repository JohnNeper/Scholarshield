import React, { useState, useRef } from 'react';
import { useData, SAMPLE_DOCUMENTS } from '../../services/store/dataContext';
import { useAuth } from '../../services/store/authContext';
import {
  Upload,
  FileText,
  AlertCircle,
  X,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileCode,
  Edit3,
  Layers,
  Eye,
  RefreshCw,
  ExternalLink,
  Wand2,
} from 'lucide-react';
import { decodeDocumentFile, DecodedDocument, repairShiftedFontEncoding } from '../../services/utils/documentDecoder';

interface NewAnalysisProps {
  onNavigate: (path: string) => void;
}

export const NewAnalysis: React.FC<NewAnalysisProps> = ({ onNavigate }) => {
  const { addDocument, collections } = useData();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [selectedColId, setSelectedColId] = useState<string>('');
  const [previewTab, setPreviewTab] = useState<'visual' | 'text'>('visual');
  const [selectedFile, setSelectedFile] = useState<{
    title: string;
    filename: string;
    size: number;
    wordCount: number;
    mimeType: string;
    content: string;
    extractedFrom?: string;
    warning?: string;
    fileUrl?: string;
  } | null>(null);
  const [pastedTitle, setPastedTitle] = useState('My Academic Paper');
  const [pastedText, setPastedText] = useState('');
  const [isEditingPreview, setIsEditingPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setError(null);
    setIsDecoding(true);

    const validExtensions = ['.pdf', '.docx', '.txt', '.md'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      setError('Format non supporté. Veuillez déposer un document PDF, DOCX, TXT ou MD.');
      setIsDecoding(false);
      return;
    }

    if (file.size > 32 * 1024 * 1024) {
      setError('La taille du document dépasse le quota de 32 Mo. Veuillez compresser votre fichier.');
      setIsDecoding(false);
      return;
    }

    try {
      // Clean up previous blob URL if any
      if (selectedFile?.fileUrl) {
        URL.revokeObjectURL(selectedFile.fileUrl);
      }

      const fileUrl = URL.createObjectURL(file);
      const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type.includes('pdf');
      setPreviewTab(isPdf ? 'visual' : 'text');

      // Decode document binary/stream into human-readable text
      const decoded: DecodedDocument = await decodeDocumentFile(file);

      setSelectedFile({
        title: file.name.replace(/\.[^/.]+$/, ''),
        filename: file.name,
        size: file.size,
        wordCount: decoded.wordCount,
        mimeType: file.type || (isPdf ? 'application/pdf' : 'text/plain'),
        content: decoded.text,
        extractedFrom: decoded.extractedFrom,
        warning: decoded.warning,
        fileUrl,
      });
    } catch (err: any) {
      setError(`Erreur lors du décodage du document : ${err.message || 'Impossible de lire le contenu'}`);
    } finally {
      setIsDecoding(false);
    }
  };

  const handleRepairEncoding = () => {
    if (!selectedFile) return;
    const repaired = repairShiftedFontEncoding(selectedFile.content);
    const words = repaired.trim().split(/\s+/).filter(Boolean).length;
    setSelectedFile({
      ...selectedFile,
      content: repaired,
      wordCount: words,
      warning: undefined,
    });
  };

  const handleRepairPastedText = () => {
    if (!pastedText) return;
    const repaired = repairShiftedFontEncoding(pastedText);
    setPastedText(repaired);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleLoadSample = (index: number) => {
    const sample = SAMPLE_DOCUMENTS[index];
    if (!sample) return;
    setError(null);
    if (selectedFile?.fileUrl) {
      URL.revokeObjectURL(selectedFile.fileUrl);
    }
    setPreviewTab('text');
    setSelectedFile({
      title: sample.title,
      filename: sample.filename,
      size: sample.fileSizeBytes,
      wordCount: sample.wordCount,
      mimeType: sample.mimeType,
      content: sample.content,
      extractedFrom: 'txt',
    });
  };

  const handleProceed = () => {
    if (inputMode === 'paste') {
      const trimmed = pastedText.trim();
      if (!trimmed) {
        setError('Veuillez coller le contenu du document avant de continuer.');
        return;
      }
      const words = trimmed.split(/\s+/).filter(Boolean).length;
      const newDoc = addDocument({
        userId: user?.id ?? 'usr-student-01',
        title: pastedTitle.trim() || 'Document Académique sans titre',
        filename: `${(pastedTitle || 'document').toLowerCase().replace(/\s+/g, '_')}.txt`,
        fileSizeBytes: new Blob([trimmed]).size,
        wordCount: words,
        mimeType: 'text/plain',
        content: trimmed,
        collectionId: selectedColId || undefined,
        tags: ['Texte Direct', 'Manuscrit Académique'],
      });
      onNavigate(`/app/analysis/${newDoc.id}/configure`);
      return;
    }

    if (!selectedFile) return;

    const newDoc = addDocument({
      userId: user?.id ?? 'usr-student-01',
      title: selectedFile.title,
      filename: selectedFile.filename,
      fileSizeBytes: selectedFile.size,
      wordCount: selectedFile.wordCount,
      mimeType: selectedFile.mimeType,
      content: selectedFile.content,
      collectionId: selectedColId || undefined,
      tags: ['Document Déposé', selectedFile.extractedFrom ? `Format:${selectedFile.extractedFrom.toUpperCase()}` : 'Manuscrit Académique'],
    });

    onNavigate(`/app/analysis/${newDoc.id}/configure`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
          Upload Academic Document
        </h1>
        <p className="text-xs text-slate-500">
          Binary PDF and DOCX files are decoded directly in client memory into verified plain text before analysis.
        </p>
      </div>

      {/* Mode Switcher: Upload File vs Paste Text */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => {
            setInputMode('upload');
            setError(null);
          }}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            inputMode === 'upload'
              ? 'bg-[#3978D5] text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File (PDF, DOCX, TXT)</span>
        </button>

        <button
          onClick={() => {
            setInputMode('paste');
            setError(null);
          }}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            inputMode === 'paste'
              ? 'bg-[#3978D5] text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Paste Text Directly</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {inputMode === 'paste' ? (
        /* Direct Text Paste Form */
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={pastedTitle}
                onChange={(e) => setPastedTitle(e.target.value)}
                placeholder="e.g. Comparative Analysis of Distributed Consensus Protocols"
                className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#3978D5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assign to Collection (Optional)
              </label>
              <select
                value={selectedColId}
                onChange={(e) => setSelectedColId(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#3978D5]"
              >
                <option value="">No Collection (Unassigned)</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Academic Document Content
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                {pastedText.trim() ? pastedText.trim().split(/\s+/).filter(Boolean).length.toLocaleString() : 0} words
              </span>
            </div>
            <textarea
              rows={12}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste the full text of your essay, thesis chapter, or research draft here..."
              className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#3978D5]"
            />
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPastedText(SAMPLE_DOCUMENTS[0].content);
                  setPastedTitle(SAMPLE_DOCUMENTS[0].title);
                }}
                className="text-xs text-[#3978D5] hover:underline flex items-center gap-1 font-medium"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Charger l'exemple : Cadrage & BMC Cameroun</span>
              </button>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <button
                type="button"
                onClick={handleRepairPastedText}
                disabled={!pastedText.trim()}
                className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 disabled:opacity-40"
                title="Détecte et répare automatiquement les décalages de polices et encodages CMap non résolus"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Décoder / Réparer l'encodage</span>
              </button>
            </div>

            <button
              onClick={handleProceed}
              disabled={!pastedText.trim()}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm transition-all"
            >
              <span>Configurer les Paramètres d'Analyse</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : !selectedFile ? (
        /* Drag & Drop Upload Container */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) {
              processFile(file);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-[#3978D5] bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-[#14243A] hover:border-[#3978D5]/60'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt,.md"
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#3978D5] flex items-center justify-center mx-auto mb-4 border border-blue-100 dark:border-blue-900/60">
            <Upload className="w-6 h-6" />
          </div>

          <h3 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white mb-1">
            Déposez votre document académique ici
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            ou cliquez pour parcourir votre ordinateur (PDF, DOCX, TXT - Max 32 Mo)
          </p>

          <div className="inline-flex items-center gap-3 text-xs text-slate-400 font-mono bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <span>PDF (Extraction & CMap)</span>
            <span>·</span>
            <span>DOCX (Archives XML)</span>
            <span>·</span>
            <span>TXT (UTF-8)</span>
          </div>

          {isDecoding && (
            <div className="max-w-xs mx-auto mt-6 space-y-2">
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-[#3978D5] h-full rounded-full animate-pulse w-3/4" />
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                Décodage et extraction des flux textuels du document...
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Selected & Decoded File Card with Interactive Dual Preview */
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#3978D5] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                    {selectedFile.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Décodé ({selectedFile.extractedFrom?.toUpperCase() || 'CLEAN'})
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {selectedFile.filename} · {(selectedFile.size / 1000000).toFixed(2)} Mo · {selectedFile.wordCount.toLocaleString()} mots extraits
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (selectedFile.fileUrl) {
                  URL.revokeObjectURL(selectedFile.fileUrl);
                }
                setSelectedFile(null);
              }}
              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Supprimer ce document"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {selectedFile.warning && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl flex items-center justify-between gap-2 text-xs text-amber-800 dark:text-amber-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{selectedFile.warning}</span>
              </div>
              <button
                type="button"
                onClick={handleRepairEncoding}
                className="px-2.5 py-1 text-[11px] font-semibold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 rounded-lg hover:bg-amber-300 transition-colors shrink-0"
              >
                Réparer l'encodage
              </button>
            </div>
          )}

          {/* Collection Assignment */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Assigner à une Collection Académique (Optionnel) :
              </span>
              <span className="text-[11px] text-slate-400">
                Regroupez ce document dans un dossier thématique ou de mémoire
              </span>
            </div>
            <select
              value={selectedColId}
              onChange={(e) => setSelectedColId(e.target.value)}
              className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#3978D5]"
            >
              <option value="">Aucune collection (Non classé)</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Dual Preview Tabs (Visual PDF vs Decoded Text) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                {selectedFile.fileUrl && (
                  <button
                    type="button"
                    onClick={() => setPreviewTab('visual')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      previewTab === 'visual'
                        ? 'bg-[#3978D5] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Aperçu Visuel PDF</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setPreviewTab('text')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    previewTab === 'text'
                      ? 'bg-[#3978D5] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Texte Décodé & Analysable</span>
                </button>
              </div>

              {previewTab === 'text' ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRepairEncoding}
                    className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                    title="Recalculer les correspondances de glyphes CMap"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Réparer l'encodage</span>
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <button
                    onClick={() => setIsEditingPreview(!isEditingPreview)}
                    className="text-xs text-[#3978D5] hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isEditingPreview ? "Terminer l'édition" : 'Modifier le texte'}</span>
                  </button>
                </div>
              ) : selectedFile.fileUrl ? (
                <a
                  href={selectedFile.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#3978D5] hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Plein écran</span>
                </a>
              ) : null}
            </div>

            {/* Visual PDF Viewer Frame */}
            {previewTab === 'visual' && selectedFile.fileUrl ? (
              <div className="space-y-2">
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900/5 dark:bg-slate-900">
                  <iframe
                    src={selectedFile.fileUrl}
                    className="w-full h-[450px] bg-white dark:bg-slate-900"
                    title="Aperçu Visuel Document"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-1">
                  <span>Rendu natif du document original</span>
                  <span>{selectedFile.filename}</span>
                </div>
              </div>
            ) : (
              /* Decoded Text Viewer & Editor */
              <div className="space-y-2">
                {isEditingPreview ? (
                  <textarea
                    rows={10}
                    value={selectedFile.content}
                    onChange={(e) => {
                      const newText = e.target.value;
                      const words = newText.trim().split(/\s+/).filter(Boolean).length;
                      setSelectedFile((prev) =>
                        prev ? { ...prev, content: newText, wordCount: words } : null
                      );
                    }}
                    className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#3978D5]"
                  />
                ) : (
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700/60 max-h-60 overflow-y-auto space-y-1">
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                      {selectedFile.content}
                    </p>
                  </div>
                )}
                <p className="text-[11px] text-slate-400">
                  Ce texte constitue le corpus exact qui sera soumis aux moteurs d'analyse de similarité et de détection IA.
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => {
                if (selectedFile.fileUrl) {
                  URL.revokeObjectURL(selectedFile.fileUrl);
                }
                setSelectedFile(null);
              }}
              className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              Déposer un autre document
            </button>

            <button
              onClick={handleProceed}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all"
            >
              <span>Configurer les Paramètres d'Analyse</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Sample Document Auto-Loader Quick Select */}
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-[#8B68D8]" />
          <span>Documents académiques de référence pré-chargés :</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleLoadSample(0)}
            className="text-left p-3.5 bg-white dark:bg-[#14243A] border border-blue-200 dark:border-blue-900 hover:border-[#3978D5] rounded-xl transition-colors space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-[#3978D5]">
                Cameroun & Afrique
              </span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#3978D5]">
              ScholarShield — Cadrage & BMC
            </p>
            <p className="text-[11px] text-slate-500">Business Model Canvas & Cadrage Univ. Dschang, Bamenda</p>
          </button>

          <button
            onClick={() => handleLoadSample(1)}
            className="text-left p-3.5 bg-white dark:bg-[#14243A] border border-slate-200 dark:border-slate-700 hover:border-[#3978D5] rounded-xl transition-colors space-y-1"
          >
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-[#8B68D8]">
              Thèse Master
            </span>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              Génomique & Graph Neural Networks
            </p>
            <p className="text-[11px] text-slate-500">Master Thesis · 8 420 mots (Bioinformatique)</p>
          </button>

          <button
            onClick={() => handleLoadSample(2)}
            className="text-left p-3.5 bg-white dark:bg-[#14243A] border border-slate-200 dark:border-slate-700 hover:border-[#3978D5] rounded-xl transition-colors space-y-1"
          >
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              Essai Académique
            </span>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              Éthique des Systèmes Autonomes
            </p>
            <p className="text-[11px] text-slate-500">Essai · 3 150 mots (Droit médical & IA)</p>
          </button>
        </div>
      </div>
    </div>
  );
};
