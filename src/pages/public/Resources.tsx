import React from 'react';
import { BookOpen, FileText, Download, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ResourcesProps {
  onNavigate: (path: string) => void;
}

export const Resources: React.FC<ResourcesProps> = ({ onNavigate }) => {
  const articles = [
    {
      title: 'Distinguishing Verbatim Plagiarism from Statistical AI Indicators',
      category: 'Methodology Guide',
      date: 'November 2026',
      readTime: '6 min read',
      excerpt:
        'A comprehensive guide for academic ethics boards on interpreting similarity percentages vs. stylometric burstiness metrics without producing false accusations.',
    },
    {
      title: 'Best Practices for APA 7th & IEEE Citation Boundary Formatting',
      category: 'Citation Standards',
      date: 'October 2026',
      readTime: '4 min read',
      excerpt:
        'How to properly wrap blockquotes, multi-line attributions, and secondary references to ensure automatic exclusion in digital similarity scanners.',
    },
    {
      title: 'Institutional Data Sovereignty in Higher Education SaaS',
      category: 'Security Whitepaper',
      date: 'September 2026',
      readTime: '8 min read',
      excerpt:
        'Architectural breakdown of zero-training document isolation, client-side encryption, and FERPA/GDPR compliance for university campuses.',
    },
    {
      title: 'The Evolution of Plagiarism Detection: From N-grams to Semantic Embeddings',
      category: 'Technical Paper',
      date: 'August 2026',
      readTime: '10 min read',
      excerpt:
        'Technical comparison between Karp-Rabin winnowing fingerprints, cross-lingual sentence embeddings, and bi-encoder reranking algorithms.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white tracking-tight">
          Academic Integrity Resources & Whitepapers
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Peer-reviewed guides, methodological standards, and citation hygiene documentation for students, researchers, and university faculties.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((art, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 space-y-3 hover:border-[#3978D5]/40 transition-colors"
          >
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-[#3978D5]">{art.category}</span>
              <span>·</span>
              <span>{art.date}</span>
              <span>·</span>
              <span>{art.readTime}</span>
            </div>

            <h3 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
              {art.title}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {art.excerpt}
            </p>

            <div className="pt-2 flex items-center justify-between text-xs font-semibold text-[#3978D5]">
              <span className="cursor-pointer hover:underline">Read Full Academic Guide →</span>
              <Download className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
