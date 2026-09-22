'use client';

import React from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'header' | 'topbar' | 'mobile' | 'minimal';
  className?: string;
}

export function LanguageSwitcher({ variant = 'header', className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
  };

  if (variant === 'topbar') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs transition ${className}`}
        role="group"
        aria-label="Language selection"
      >
        <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
        <div className="flex items-center gap-1 text-[11px] font-medium">
          <button
            type="button"
            onClick={() => handleSelect('en')}
            className={`px-1.5 py-0.5 rounded transition cursor-pointer ${
              language === 'en'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
            aria-pressed={language === 'en'}
            title="Switch to English"
          >
            EN
          </button>
          <span className="text-slate-600">|</span>
          <button
            type="button"
            onClick={() => handleSelect('ta')}
            className={`px-1.5 py-0.5 rounded transition cursor-pointer ${
              language === 'ta'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
            aria-pressed={language === 'ta'}
            title="தமிழுக்கு மாற்றவும்"
          >
            தமிழ்
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className={`p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 ${className}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>மொழி / Language</span>
          </div>
          <div className="inline-flex rounded-xl bg-white dark:bg-slate-900 p-1 shadow-xs border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => handleSelect('en')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                language === 'en'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              aria-pressed={language === 'en'}
            >
              {language === 'en' && <Check className="w-3 h-3" />}
              <span>English</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelect('ta')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                language === 'ta'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              aria-pressed={language === 'ta'}
            >
              {language === 'ta' && <Check className="w-3 h-3" />}
              <span>தமிழ்</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default 'header' segment pill
  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs ${className}`}
      role="group"
      aria-label="Website Language Switcher"
    >
      <div className="pl-2 pr-1 text-slate-400 dark:text-slate-500">
        <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
      </div>
      <button
        type="button"
        onClick={() => handleSelect('en')}
        className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer ${
          language === 'en'
            ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs scale-100'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        aria-pressed={language === 'en'}
        title="View in English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handleSelect('ta')}
        className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer ${
          language === 'ta'
            ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs scale-100'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        aria-pressed={language === 'ta'}
        title="தமிழில் பார்க்க"
      >
        தமிழ்
      </button>
    </div>
  );
}
