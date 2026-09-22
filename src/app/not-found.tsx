'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Home, PhoneCall } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center py-24 px-6 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-7xl sm:text-8xl font-black font-heading bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent mb-4">
            404
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white mb-3">
            {t('notFound.title', 'Page Not Found')}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            {t('notFound.description', 'The page you are looking for might have been moved, updated, or is temporarily unavailable.')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/">
              <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
                {t('notFound.homeBtn', 'Back to Homepage')}
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" leftIcon={<PhoneCall className="w-4 h-4" />}>
                {t('notFound.contactBtn', 'Contact Campus Office')}
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
