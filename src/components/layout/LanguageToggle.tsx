import React from 'react';
import { useTranslation } from '../../services/i18n/context';

interface LanguageToggleProps {
  className?: string;
  variant?: 'pill' | 'minimal' | 'navbar';
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '', variant = 'pill' }) => {
  const { language, setLanguage } = useTranslation();

  if (variant === 'minimal') {
    return (
      <div className={`inline-flex items-center gap-1 text-xs ${className}`}>
        <button
          type="button"
          onClick={() => setLanguage('fr')}
          className={`px-1.5 py-0.5 rounded font-bold transition-all ${
            language === 'fr'
              ? 'bg-[#3978D5] text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Passer en Français"
        >
          FR
        </button>
        <span className="text-slate-600">/</span>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-1.5 py-0.5 rounded font-bold transition-all ${
            language === 'en'
              ? 'bg-[#3978D5] text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Switch to English"
        >
          EN
        </button>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800/90 text-xs shadow-xs ${className}`}
    >
      <button
        type="button"
        onClick={() => setLanguage('fr')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
          language === 'fr'
            ? 'bg-white dark:bg-[#14243A] text-[#3978D5] dark:text-blue-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        title="Afficher la plateforme en Français"
      >
        <span className="text-sm leading-none">🇫🇷</span>
        <span>Français</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
          language === 'en'
            ? 'bg-white dark:bg-[#14243A] text-[#3978D5] dark:text-blue-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        title="Display platform in English"
      >
        <span className="text-sm leading-none">🇬🇧</span>
        <span>English</span>
      </button>
    </div>
  );
};
