import React, { useState } from 'react';
import { Shield, Lock, FileCheck, Award, CheckCircle } from 'lucide-react';

interface LegalProps {
  initialTab?: 'privacy' | 'terms' | 'security' | 'data-policy';
  onNavigate: (path: string) => void;
}

export const Legal: React.FC<LegalProps> = ({ initialTab = 'privacy', onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'security' | 'data-policy'>(initialTab);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'privacy'
              ? 'bg-[#3978D5] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'terms'
              ? 'bg-[#3978D5] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Terms of Academic Service
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'security'
              ? 'bg-[#3978D5] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Security & ISO 27001
        </button>
        <button
          onClick={() => setActiveTab('data-policy')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'data-policy'
              ? 'bg-[#3978D5] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Zero-Training AI Policy
        </button>
      </div>

      {/* Content Container */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-8 sm:p-12 shadow-sm space-y-8">
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
              Academic Privacy Policy
            </h1>
            <p className="text-xs text-slate-500">Effective Date: November 9, 2026 · Complies with FERPA & EU GDPR</p>

            <section className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Scope of Data Collection</h2>
              <p>
                ScholarShield collects user identification data solely for authentication, verification session management, and quota auditing. Document text processed during analysis is treated with the highest tier of confidentiality.
              </p>

              <h2 className="text-base font-bold text-slate-900 dark:text-white pt-2">2. FERPA & GDPR Student Records Protection</h2>
              <p>
                Under the Family Educational Rights and Privacy Act (FERPA) and General Data Protection Regulation (GDPR), student submissions processed through an institutional license remain under the exclusive ownership and control of the educational institution. ScholarShield acts as a verified Data Processor.
              </p>

              <h2 className="text-base font-bold text-slate-900 dark:text-white pt-2">3. Right to Permanent Erasure</h2>
              <p>
                Users and institutional administrators may at any time permanently delete documents, analysis logs, and metadata. Deleted records are cryptographically wiped within 24 hours.
              </p>
            </section>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
              Terms of Academic Service
            </h1>
            <p className="text-xs text-slate-500">Last Revised: November 2026</p>

            <section className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Nature of Similarity Reports</h2>
              <p>
                ScholarShield reports provide statistical similarity indices and probabilistic linguistic markers. A high similarity index does not inherently constitute plagiarism; faculty evaluation is strictly required to assess citation validity.
              </p>

              <h2 className="text-base font-bold text-slate-900 dark:text-white pt-2">2. AI Detection Advisory Limitations</h2>
              <p>
                AI-generated content indicators analyze stylometric burstiness and perplexity. Generative AI detection models cannot provide definitive legal or disciplinary proof. Institutions agree to use AI detection solely as an advisory diagnostic tool.
              </p>
            </section>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
              Infrastructure Security & ISO 27001
            </h1>
            <p className="text-xs text-slate-500">Enterprise Cloud Security Architecture</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <Lock className="w-5 h-5 text-[#3978D5]" />
                <h3 className="font-bold text-slate-900 dark:text-white text-xs">AES-256 Storage Encryption</h3>
                <p className="text-[11px] text-slate-500">Every uploaded paper is encrypted at rest with unique customer-managed keys.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <Award className="w-5 h-5 text-[#269B72]" />
                <h3 className="font-bold text-slate-900 dark:text-white text-xs">SOC 2 Type II Audited</h3>
                <p className="text-[11px] text-slate-500">Rigorous third-party audits verifying zero vulnerability exposure.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data-policy' && (
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#269B72] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Zero-Training Guarantee</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
              Strict Zero-Training AI Policy
            </h1>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                Unlike commercial generative AI tools that absorb user data into neural model weights, ScholarShield enforces a strict architectural isolation boundary:
              </p>

              <div className="p-4 border-l-2 border-[#3978D5] bg-blue-50/50 dark:bg-blue-950/20 text-slate-700 dark:text-slate-300 space-y-1">
                <p className="font-semibold text-slate-900 dark:text-white">Our Binding Commitment:</p>
                <p>
                  1. Your documents are NEVER used to train, tune, or evaluate large language models.
                  <br />
                  2. Student dissertations and research papers are NEVER sold or shared with external data brokers.
                  <br />
                  3. Institutional repositories are strictly siloed to each verified university tenant.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
