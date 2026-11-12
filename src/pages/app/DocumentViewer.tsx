import React, { useState } from 'react';
import { useData } from '../../services/store/dataContext';
import {
  FileText,
  Search,
  ZoomIn,
  ZoomOut,
  Download,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Share2,
} from 'lucide-react';

interface DocumentViewerProps {
  documentId: string;
  onNavigate: (path: string) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ documentId, onNavigate }) => {
  const { getDocument } = useData();
  const doc = getDocument(documentId);

  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  if (!doc) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-sm text-slate-500">Document not found.</p>
        <button
          onClick={() => onNavigate('/app/documents')}
          className="text-xs font-semibold text-[#3978D5] hover:underline"
        >
          Return to My Documents
        </button>
      </div>
    );
  }

  const paragraphs = doc.content.split('\n\n');
  const totalPages = Math.max(1, Math.ceil(paragraphs.length / 3));

  return (
    <div className="space-y-4 max-w-4xl mx-auto py-2">
      {/* Viewer Header */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/app/documents')}
            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white truncate max-w-sm">
              {doc.title}
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">
              {doc.filename} · {doc.wordCount.toLocaleString()} words · {(doc.fileSizeBytes / 1000000).toFixed(2)} MB
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 text-xs">
          {/* Zoom */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg font-mono">
            <button onClick={() => setZoom((z) => Math.max(80, z - 10))} className="p-1 text-slate-500">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center">{zoom}%</span>
            <button onClick={() => setZoom((z) => Math.min(130, z + 10))} className="p-1 text-slate-500">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg font-mono">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 text-slate-500 disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 text-slate-500 disabled:opacity-40"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Download Document"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reader Paper Sheet */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-8 sm:p-14 shadow-sm min-h-[600px]">
        <div
          style={{ fontSize: `${(zoom / 100) * 14}px` }}
          className="max-w-2xl mx-auto space-y-6 font-serif leading-relaxed text-slate-800 dark:text-slate-200"
        >
          <div className="pb-6 border-b border-slate-100 dark:border-slate-800 text-center space-y-2">
            <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
              {doc.title}
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Archived in Personal Library on {new Date(doc.uploadedAt).toLocaleDateString()}
            </p>
          </div>

          {paragraphs.map((p, idx) => (
            <p key={idx} className="leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
