import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, TranslationKey } from './translations';
import { Language } from '../../types';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey | string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('scholarshield_language') || localStorage.getItem('veritas_language');
      if (saved === 'fr' || saved === 'en') return saved;
      return 'fr';
    } catch {
      return 'fr';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('scholarshield_language', lang);
    } catch {
      // storage unavailable
    }
  };

  const t = (key: TranslationKey | string, fallback?: string): string => {
    const dict = (translations as Record<string, Record<string, string>>)[language] || translations.fr;
    if (dict && dict[key]) {
      return dict[key];
    }
    const enDict = translations.en as Record<string, string>;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    const frDict = translations.fr as Record<string, string>;
    if (frDict && frDict[key]) {
      return frDict[key];
    }
    return fallback !== undefined ? fallback : key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
