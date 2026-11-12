import React from 'react';
import { Navbar } from './Navbar';
import { Shield, Lock, Award } from 'lucide-react';
import { useTranslation } from '../../services/i18n/context';

interface PublicLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ currentPath, onNavigate, children }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] dark:bg-[#0C1420] text-[#1B2638] dark:text-[#E2E8F0] transition-colors">
      <Navbar currentPath={currentPath} onNavigate={onNavigate} />

      <main className="flex-1">{children}</main>

      {/* Global Academic Footer */}
      <footer className="bg-[#14243A] text-slate-400 border-t border-[#23334A] py-14 text-sm font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
            {/* Col 1: Wordmark & Statement */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2 text-white">
                <div className="w-7 h-7 rounded-lg bg-[#3978D5] flex items-center justify-center text-white">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold font-['Plus_Jakarta_Sans'] tracking-tight">
                  Scholar<span className="text-[#3978D5]">Shield</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Empowering universities, researchers, and students with transparent, verifiable plagiarism similarity detection and statistical AI-content analysis.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
                <Lock className="w-3.5 h-3.5 text-[#269B72]" />
                <span>FERPA & GDPR Compliant</span>
                <span aria-hidden="true">·</span>
                <Award className="w-3.5 h-3.5 text-[#3978D5]" />
                <span>ISO/IEC 27001 Certified</span>
              </div>
            </div>

            {/* Col 2: Product */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => onNavigate('/features')} className="hover:text-white transition-colors">
                    Plagiarism Verification
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/features')} className="hover:text-white transition-colors">
                    AI Content Detection
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/features')} className="hover:text-white transition-colors">
                    Institutional Repository
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/pricing')} className="hover:text-white transition-colors">
                    Subscription Plans
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Solutions */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Solutions</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => onNavigate('/solutions')} className="hover:text-white transition-colors">
                    Undergraduate Students
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/solutions')} className="hover:text-white transition-colors">
                    Doctoral & Post-Doc
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/solutions')} className="hover:text-white transition-colors">
                    Professors & Instructors
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/solutions')} className="hover:text-white transition-colors">
                    Universities & Colleges
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Trust & Compliance */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Legal & Security</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => onNavigate('/privacy')} className="hover:text-white transition-colors">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/terms')} className="hover:text-white transition-colors">
                    Terms of Academic Service
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/security')} className="hover:text-white transition-colors">
                    Security & Data Isolation
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/data-policy')} className="hover:text-white transition-colors">
                    Zero-Training AI Guarantee
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} ScholarShield Technologies Inc. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs">
              <span>English (US)</span>
              <span aria-hidden="true">·</span>
              <span>Français (FR)</span>
              <span aria-hidden="true">·</span>
              <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors">
                Contact Academic Support
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
