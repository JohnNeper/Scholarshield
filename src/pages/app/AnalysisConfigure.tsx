import React, { useState, useRef } from 'react';
import { useData } from '../../services/store/dataContext';
import { useAuth } from '../../services/store/authContext';
import {
  Search,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  FileText,
  AlertCircle,
  FolderPlus,
  Plus,
  Trash2,
  FileCode,
  Globe,
  Database,
  Check,
  Upload,
} from 'lucide-react';
import { AnalysisType, CustomReferenceSource } from '../../types';
import { decodeDocumentFile } from '../../services/utils/documentDecoder';

interface AnalysisConfigureProps {
  documentId: string;
  onNavigate: (path: string) => void;
}

export const AnalysisConfigure: React.FC<AnalysisConfigureProps> = ({ documentId, onNavigate }) => {
  const { getDocument, startAnalysisJob, customSources, addCustomSource, deleteCustomSource } = useData();
  const { user } = useAuth();
  const doc = getDocument(documentId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [analysisType, setAnalysisType] = useState<AnalysisType>('both');
  const [corpusMode, setCorpusMode] = useState<'standard' | 'custom'>('standard');
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>(
    customSources.map((s) => s.id)
  );

  // New custom source creation modal/panel state
  const [showAddSource, setShowAddSource] = useState(false);
  const [newSourceTitle, setNewSourceTitle] = useState('');
  const [newSourceAuthors, setNewSourceAuthors] = useState('');
  const [newSourceContent, setNewSourceContent] = useState('');
  const [isDecodingSourceFile, setIsDecodingSourceFile] = useState(false);

  const [excludeCitations, setExcludeCitations] = useState(true);
  const [excludeBibliography, setExcludeBibliography] = useState(true);
  const [institutionalCorpus, setInstitutionalCorpus] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');

  if (!doc) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-sm text-slate-500">Document not found or expired.</p>
        <button
          onClick={() => onNavigate('/app/analysis/new')}
          className="text-xs font-semibold text-[#3978D5] hover:underline"
        >
          Return to Upload
        </button>
      </div>
    );
  }

  const handleSourceFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsDecodingSourceFile(true);
    try {
      const decoded = await decodeDocumentFile(file);
      setNewSourceTitle(file.name.replace(/\.[^/.]+$/, ''));
      setNewSourceContent(decoded.text);
      if (!newSourceAuthors) {
        setNewSourceAuthors('Uploaded Reference Document');
      }
    } catch (err: any) {
      setError(`Failed to decode reference file: ${err.message}`);
    } finally {
      setIsDecodingSourceFile(false);
    }
  };

  const handleSaveCustomSource = () => {
    const trimmedTitle = newSourceTitle.trim();
    const trimmedContent = newSourceContent.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError('Please provide both a title and text content for the reference source.');
      return;
    }

    const words = trimmedContent.split(/\s+/).filter(Boolean).length;
    const created = addCustomSource({
      title: trimmedTitle,
      content: trimmedContent,
      wordCount: words,
      authors: newSourceAuthors.trim() || 'Internal Reference Corpus',
      category: 'thesis',
    });

    // Auto-select the newly added source
    setSelectedSourceIds((prev) => [...prev, created.id]);

    // Reset form
    setNewSourceTitle('');
    setNewSourceAuthors('');
    setNewSourceContent('');
    setShowAddSource(false);
    setError('');
  };

  const toggleSourceSelection = (sourceId: string) => {
    setSelectedSourceIds((prev) =>
      prev.includes(sourceId) ? prev.filter((id) => id !== sourceId) : [...prev, sourceId]
    );
  };

  const selectAllSources = () => {
    setSelectedSourceIds(customSources.map((s) => s.id));
  };

  const deselectAllSources = () => {
    setSelectedSourceIds([]);
  };

  const handleStart = async () => {
    if (!agreeTerms) {
      setError('Please acknowledge the academic document processing terms.');
      return;
    }

    if (corpusMode === 'custom' && selectedSourceIds.length === 0) {
      setError('Please select at least one custom reference source for comparison.');
      return;
    }

    try {
      const activeCustomSources =
        corpusMode === 'custom'
          ? customSources.filter((s) => selectedSourceIds.includes(s.id))
          : undefined;

      const job = await startAnalysisJob(doc.id, analysisType, {
        excludeCitations,
        excludeBibliography,
        institutionalCorpus,
        customSources: activeCustomSources,
      });
      onNavigate(`/app/analysis/${job.id}/processing`);
    } catch (err: any) {
      setError(err.message || 'Failed to start analysis job.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
          Configure Verification Parameters
        </h1>
        <p className="text-xs text-slate-500">
          Target document: <span className="font-semibold text-slate-900 dark:text-white">{doc.title}</span> ({doc.wordCount.toLocaleString()} words)
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Analysis Engine Selection */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          1. Select Verification Engine Mode
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Option A: Plagiarism only */}
          <button
            type="button"
            onClick={() => setAnalysisType('plagiarism')}
            className={`text-left p-4 rounded-2xl border transition-all space-y-2 ${
              analysisType === 'plagiarism'
                ? 'border-[#3978D5] bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-[#3978D5]'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#14243A]'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-[#3978D5] flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Plagiarism Only</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                N-gram similarity cross-referencing against selected reference corpora.
              </p>
            </div>
          </button>

          {/* Option B: AI only */}
          <button
            type="button"
            onClick={() => setAnalysisType('ai')}
            className={`text-left p-4 rounded-2xl border transition-all space-y-2 ${
              analysisType === 'ai'
                ? 'border-[#8B68D8] bg-purple-50/50 dark:bg-purple-950/30 ring-1 ring-[#8B68D8]'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#14243A]'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/40 text-[#8B68D8] flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">AI Detection Only</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Linguistic burstiness, perplexity modeling, and stylistic uniformity flags.
              </p>
            </div>
          </button>

          {/* Option C: Complete Both */}
          <button
            type="button"
            onClick={() => setAnalysisType('both')}
            className={`text-left p-4 rounded-2xl border transition-all space-y-2 ${
              analysisType === 'both'
                ? 'border-[#269B72] bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-[#269B72]'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#14243A]'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-[#269B72] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Complete Analysis</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Both engines concurrently with dual independent reporting cards.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Reference Corpus Source: Standard vs Custom Multi-Source BYOD */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Reference Comparison Corpus
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select whether to compare against global publications or verify similarity against your own reference sources.
            </p>
          </div>
        </div>

        {/* Corpus Toggle Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setCorpusMode('standard')}
            className={`p-4 rounded-xl text-left border transition-all flex items-start gap-3 ${
              corpusMode === 'standard'
                ? 'border-[#3978D5] bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-[#3978D5]'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-[#3978D5] flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Global Academic Benchmark Corpus
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                120M+ open access papers, journals, repositories & university dissertations.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCorpusMode('custom')}
            className={`p-4 rounded-xl text-left border transition-all flex items-start gap-3 ${
              corpusMode === 'custom'
                ? 'border-[#269B72] bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-[#269B72]'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-[#269B72] flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  My Custom Reference Sources (BYOD)
                </p>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                  MULTI-SOURCE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Upload your own reference files and detect matching passages across all sources.
              </p>
            </div>
          </button>
        </div>

        {/* CUSTOM SOURCES MANAGEMENT PANEL (when Custom Corpus is active) */}
        {corpusMode === 'custom' && (
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Uploaded Reference Sources ({selectedSourceIds.length} of {customSources.length} active)
                </span>
                <p className="text-[11px] text-slate-500">
                  Select which custom files or past papers to test against this document.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAllSources}
                  className="text-[11px] text-[#3978D5] hover:underline"
                >
                  Select All
                </button>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <button
                  type="button"
                  onClick={deselectAllSources}
                  className="text-[11px] text-slate-500 hover:underline"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSource(!showAddSource)}
                  className="flex items-center gap-1 ml-2 px-3 py-1.5 text-xs font-semibold text-white bg-[#269B72] hover:bg-[#1E7D5B] rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload / Add Source</span>
                </button>
              </div>
            </div>

            {/* Inline Add / Upload Source Drawer */}
            {showAddSource && (
              <div className="p-4 bg-white dark:bg-[#14243A] border border-emerald-300 dark:border-emerald-800/80 rounded-xl space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FolderPlus className="w-3.5 h-3.5 text-[#269B72]" />
                    <span>Add New Reference Source to Your Corpus</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddSource(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                </div>

                {/* Upload File to Auto-Decode */}
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleSourceFileUpload}
                    accept=".pdf,.docx,.txt,.md"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isDecodingSourceFile}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#3978D5]" />
                    <span>Upload Reference File (PDF, DOCX, TXT)</span>
                  </button>

                  {isDecodingSourceFile && (
                    <span className="text-xs font-mono text-slate-500 animate-pulse">
                      Decoding document stream...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Source Title / Document Name
                    </label>
                    <input
                      type="text"
                      value={newSourceTitle}
                      onChange={(e) => setNewSourceTitle(e.target.value)}
                      placeholder="e.g. Lab Archive: Graph Attention Mechanisms (2024)"
                      className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#269B72]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Author or Origin Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={newSourceAuthors}
                      onChange={(e) => setNewSourceAuthors(e.target.value)}
                      placeholder="e.g. Dr. Vance Lab / Fall 2025 Submission"
                      className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#269B72]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Reference Content (Decoded or Pasted Text)
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">
                      {newSourceContent.trim() ? newSourceContent.trim().split(/\s+/).filter(Boolean).length : 0} words
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={newSourceContent}
                    onChange={(e) => setNewSourceContent(e.target.value)}
                    placeholder="Reference text against which similarities should be detected..."
                    className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#269B72]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddSource(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCustomSource}
                    disabled={!newSourceTitle.trim() || !newSourceContent.trim()}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-[#269B72] hover:bg-[#1E7D5B] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors"
                  >
                    Save & Include in Multi-Source Index
                  </button>
                </div>
              </div>
            )}

            {/* List of custom reference sources */}
            <div className="space-y-2">
              {customSources.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">
                  No custom reference documents added yet. Click "+ Upload / Add Source" to add reference papers.
                </p>
              ) : (
                customSources.map((source) => {
                  const isChecked = selectedSourceIds.includes(source.id);
                  return (
                    <div
                      key={source.id}
                      className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                        isChecked
                          ? 'bg-white dark:bg-[#14243A] border-[#269B72]/60 ring-1 ring-[#269B72]/40'
                          : 'bg-white/60 dark:bg-[#14243A]/60 border-slate-200 dark:border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSourceSelection(source.id)}
                          className="mt-1 rounded text-[#269B72] focus:ring-[#269B72]"
                        />
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {source.title}
                            </p>
                            <span className="text-[10px] font-mono text-slate-400 shrink-0">
                              {source.wordCount} words
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">
                            {source.authors || 'Internal Source'} · Added {new Date(source.addedAt).toLocaleDateString()}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono line-clamp-1 italic">
                            "{source.content.slice(0, 120)}..."
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteCustomSource(source.id)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors"
                        title="Remove source"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Advanced Exclusion Filters & Citation Handling */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          3. Academic Exclusion Filters
        </h3>

        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={excludeCitations}
              onChange={(e) => setExcludeCitations(e.target.checked)}
              className="mt-0.5 rounded text-[#3978D5] focus:ring-[#3978D5]"
            />
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                Exclude Quoted Passages & Direct Citations
              </p>
              <p className="text-[11px] text-slate-500">
                Ignores text enclosed in quotation marks ("...", «...») and blockquoted excerpts.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={excludeBibliography}
              onChange={(e) => setExcludeBibliography(e.target.checked)}
              className="mt-0.5 rounded text-[#3978D5] focus:ring-[#3978D5]"
            />
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                Exclude Bibliography & References Section
              </p>
              <p className="text-[11px] text-slate-500">
                Automatically detects Works Cited, References, and Bibliographie lists to prevent false matches.
              </p>
            </div>
          </label>

          {corpusMode === 'standard' && (
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={institutionalCorpus}
                onChange={(e) => setInstitutionalCorpus(e.target.checked)}
                className="mt-0.5 rounded text-[#3978D5] focus:ring-[#3978D5]"
              />
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Cross-Check Internal Institutional Dissertation Archive
                </p>
                <p className="text-[11px] text-slate-500">
                  Compares against authorized institutional student submissions within your accredited campus.
                </p>
              </div>
            </label>
          )}
        </div>
      </div>

      {/* Summary Box & Confirmation */}
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-500">Analysis Target:</span>
            <span className="font-mono font-semibold text-slate-900 dark:text-white ml-2">
              {corpusMode === 'custom'
                ? `Multi-Source BYOD (${selectedSourceIds.length} reference documents)`
                : 'Global Academic Corpus (120M+ Publications)'}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Credit Consumption:</span>
            <span className="font-mono font-semibold text-[#3978D5] ml-2">1 Credit</span>
            <span className="text-slate-400 text-[11px] ml-1">({user?.creditsRemaining ?? 45} available)</span>
          </div>
        </div>

        <div className="flex items-start gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <input
            type="checkbox"
            id="processingTerms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 rounded text-[#3978D5] focus:ring-[#3978D5]"
          />
          <label htmlFor="processingTerms" className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
            I confirm that this document is submitted for authorized academic verification, complies with university ethics guidelines, and will not be indexed in public AI training models.
          </label>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={() => onNavigate('/app/analysis/new')}
            className="text-xs text-slate-500 hover:text-slate-900"
          >
            Back to Upload
          </button>
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all"
          >
            <span>Start Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
