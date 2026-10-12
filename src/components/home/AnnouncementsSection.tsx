'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { defaultAnnouncements } from '@/lib/defaultData';
import { Announcement } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

export function AnnouncementsSection({ announcements = defaultAnnouncements }: { announcements?: Announcement[] }) {
  const { t, getLocalized, language } = useLanguage();

  const uniqueAnnouncements = useMemo(() => {
    const map = new Map<string, Announcement>();
    (announcements || []).forEach((item) => {
      const key = item.id || item.title;
      if (!map.has(key)) map.set(key, item);
    });
    return Array.from(map.values());
  }, [announcements]);

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

  const formatDate = (date: unknown) => {
    try {
      const rawDate = date as { toDate?: () => Date } | Date | string | number | undefined;
      const d = rawDate && typeof rawDate === 'object' && 'toDate' in rawDate && typeof rawDate.toDate === 'function'
        ? rawDate.toDate()
        : (date instanceof Date ? date : new Date(date as string | number));
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

  return (
    <section className="section-padding bg-slate-50 dark:bg-slate-900/40 relative">
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading
            align="left"
            subtitle={t('home.announcements.subtitle', 'Campus Bulletin')}
            title={t('home.announcements.title', 'Latest Announcements & Circulars')}
            description={t(
              'home.announcements.description',
              'Stay informed with official circulars, examination schedules, event updates, and admission alerts.'
            )}
            className="mb-0"
          />

          <Link href="/news" className="shrink-0">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              {t('home.announcements.viewAllBtn', 'View All Notices')}
            </Button>
          </Link>
        </div>

        {uniqueAnnouncements.length === 0 && (
          <p role="status" className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            {t('home.announcements.empty', 'No announcements have been published yet.')}
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {uniqueAnnouncements.slice(0, 3).map((ann) => {
            const title = getLocalized(ann, 'title');
            const description = getLocalized(ann, 'description');

            return (
              <div
                key={ann.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {getCategoryBadge(ann.category)}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(ann.date)}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white line-clamp-2 mb-3">
                    {title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 transition"
                  >
                    <span>{t('home.announcements.readDetails', 'Read Notice Details')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
