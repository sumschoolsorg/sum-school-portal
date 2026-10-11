'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { defaultAnnouncements } from '@/lib/defaultData';
import { announcementRepository } from '@/lib/repositories';
import { Announcement } from '@/types';
import { Calendar, Search, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NewsPage() {
  const { t, getLocalized, language } = useLanguage();
  const isTa = language === 'ta';

  const [announcements, setAnnouncements] = useState<Announcement[]>(defaultAnnouncements);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    let isMounted = true;
    announcementRepository.getPublished().then((items) => {
      if (isMounted && items && items.length > 0) {
        const seen = new Set();
        const unique = items.filter((item) => {
          const key = item.id || item.title;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setAnnouncements(unique);
      }
    }).catch((err) => {
      console.warn('Failed to load announcements from repository:', err);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredAnnouncements = announcements.filter((ann) => {
    const title = getLocalized(ann, 'title');
    const desc = getLocalized(ann, 'description');
    const content = getLocalized(ann, 'content');
    const q = search.toLowerCase();

    const matchesSearch =
      title.toLowerCase().includes(q) ||
      desc.toLowerCase().includes(q) ||
      content.toLowerCase().includes(q) ||
      ann.title.toLowerCase().includes(q) ||
      ann.description.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === 'all' || ann.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: unknown) => {
    try {
      const d = (date as { toDate?: () => Date })?.toDate
        ? (date as { toDate: () => Date }).toDate()
        : date instanceof Date
        ? date
        : typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : new Date(String(date));
      if (isNaN(d.getTime())) return t('home.announcements.recentNotice', 'Official Notice');
      return d.toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return t('home.announcements.recentNotice', 'Official Notice');
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'admission':
        return <Badge variant="accent">{t('home.announcements.categories.admission', 'Admissions')}</Badge>;
      case 'exam':
        return <Badge variant="warning">{t('home.announcements.categories.exam', 'Examinations')}</Badge>;
      case 'holiday':
        return <Badge variant="info">{t('home.announcements.categories.holiday', 'Holiday')}</Badge>;
      case 'circular':
        return <Badge variant="primary">{t('home.announcements.categories.circular', 'Circular')}</Badge>;
      default:
        return <Badge variant="neutral">{t('home.announcements.categories.general', 'General Notice')}</Badge>;
    }
  };

  const categories = [
    { key: 'all', label: t('news.filterAll', 'All Circulars') },
    { key: 'admission', label: t('news.filterAdmission', 'Admissions') },
    { key: 'exam', label: t('news.filterExam', 'Examinations') },
    { key: 'holiday', label: t('news.filterHoliday', 'Holidays') },
    { key: 'circular', label: t('news.filterCircular', 'Official Circulars') },
    { key: 'general', label: t('news.filterGeneral', 'General Notices') },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
          <div className="container-main relative z-10 text-center">
            <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-300 mb-4 px-3 py-1 rounded-full bg-white/10 border border-white/20">
              {t('news.heroTag', 'Campus Bulletin & Circulars')}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight">
              {t('news.heroTitle', 'News & Announcements')}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              {t('news.heroDescription', 'Official updates regarding school examinations, circulars, admissions, holidays, and student events.')}
            </p>
          </div>
        </section>

        {/* Search & Category Filter */}
        <section className="section-padding bg-white dark:bg-slate-950">
          <div className="container-main">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={t('news.searchPlaceholder', 'Search circulars, notices, exam alerts...')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === cat.key
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Announcements Grid */}
            {filteredAnnouncements.length === 0 ? (
              <div className="py-16 text-center text-slate-500 dark:text-slate-400 text-sm">
                {t('news.noResults', 'No announcements match your search criteria.')}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAnnouncements.map((ann) => {
                  const title = getLocalized(ann, 'title');
                  const desc = getLocalized(ann, 'content') || getLocalized(ann, 'description');

                  return (
                    <div
                      key={ann.id}
                      className="bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                    >
                      {ann.imageUrl && (
                        <div className="h-48 w-full overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={ann.imageUrl}
                            alt={title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            {getCategoryBadge(ann.category)}
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{formatDate(ann.date)}</span>
                            </div>
                          </div>

                          <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-3">
                            {title}
                          </h3>

                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {desc}
                          </p>
                        </div>

                        {ann.attachmentUrl && (
                          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                            <a
                              href={ann.attachmentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              <FileText className="w-4 h-4" />
                              <span>{isTa ? 'சுற்றறிக்கை ஆவணத்தைப் பதிவிறக்குக' : 'Download Circular Document'}</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
