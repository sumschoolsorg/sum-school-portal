'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { en, TranslationDictionary } from '@/locales/en';
import { ta } from '@/locales/ta';

export type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  getLocalized: (item: unknown, fieldName: string, fallbackField?: string) => string;
  isTamil: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries: Record<Language, TranslationDictionary> = {
  en,
  ta,
};

// Helper: safe nested property lookup (e.g. "home.hero.title")
function getNestedValue(obj: unknown, path: string): string | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current === undefined || current === null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : undefined;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize language directly from localStorage / browser preference if available
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sum_school_lang') as Language;
        if (saved && (saved === 'en' || saved === 'ta')) return saved;
        if (navigator.language.startsWith('ta')) return 'ta';
      } catch {
        // ignore
      }
    }
    return 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sum_school_lang', lang);
      document.documentElement.lang = lang;
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev: Language) => (prev === 'en' ? 'ta' : 'en'));
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const dict = dictionaries[language] || dictionaries.en;
      const val = getNestedValue(dict, key);
      if (val !== undefined && val !== '') return val;
      const fallbackVal = getNestedValue(dictionaries.en, key);
      if (fallbackVal !== undefined && fallbackVal !== '') return fallbackVal;
      return fallback || key;
    },
    [language]
  );

  const getLocalized = useCallback(
    (item: unknown, fieldName: string, fallbackField?: string): string => {
      if (!item || typeof item !== 'object') return '';
      const rec = item as Record<string, unknown>;

      const taKey = `${fieldName}_ta`;
      const enKey = `${fieldName}_en`;

      if (language === 'ta') {
        // In Tamil: prefer _ta -> _en -> default field -> fallbackField
        if (rec[taKey] && typeof rec[taKey] === 'string' && (rec[taKey] as string).trim() !== '') {
          return rec[taKey] as string;
        }
        if (rec[enKey] && typeof rec[enKey] === 'string' && (rec[enKey] as string).trim() !== '') {
          return rec[enKey] as string;
        }
        if (rec[fieldName] && typeof rec[fieldName] === 'string') {
          return rec[fieldName] as string;
        }
        if (fallbackField && rec[fallbackField]) {
          return String(rec[fallbackField]);
        }
        return '';
      } else {
        // In English: prefer _en -> default field -> _ta -> fallbackField
        if (rec[enKey] && typeof rec[enKey] === 'string' && (rec[enKey] as string).trim() !== '') {
          return rec[enKey] as string;
        }
        if (rec[fieldName] && typeof rec[fieldName] === 'string') {
          return rec[fieldName] as string;
        }
        if (rec[taKey] && typeof rec[taKey] === 'string' && (rec[taKey] as string).trim() !== '') {
          return rec[taKey] as string;
        }
        if (fallbackField && rec[fallbackField]) {
          return String(rec[fallbackField]);
        }
        return '';
      }
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        getLocalized,
        isTamil: language === 'ta',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
