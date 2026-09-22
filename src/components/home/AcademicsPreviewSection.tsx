'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap, School } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { defaultAcademicsContent } from '@/lib/defaultData';
import { useLanguage } from '@/contexts/LanguageContext';

export function AcademicsPreviewSection({
  content = defaultAcademicsContent,
}: {
  content?: typeof defaultAcademicsContent;
}) {
  const { t, language } = useLanguage();
  const isTa = language === 'ta';

  const sections = [
    {
      title: t('home.academicsPreview.primaryTitle', 'Primary Education'),
      classes: isTa ? '1 முதல் 5 ஆம் வகுப்பு வரை' : 'Classes 1 to 5',
      description: t('home.academicsPreview.primaryDesc', content.primarySection.description),
      icon: <School className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      color: 'border-blue-500/30 hover:border-blue-500',
      tag: isTa ? 'தொடக்கக் கட்டம்' : 'Foundational Stage',
      imageUrl: content.primarySection.imageUrl,
    },
    {
      title: t('home.academicsPreview.secondaryTitle', 'Secondary Education'),
      classes: isTa ? '6 முதல் 10 ஆம் வகுப்பு வரை' : 'Classes 6 to 10 (SSLC)',
      description: t('home.academicsPreview.secondaryDesc', content.secondarySection.description),
      icon: <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      color: 'border-emerald-500/30 hover:border-emerald-500',
      tag: isTa ? 'உயர்நிலைக் கட்டம்' : 'Preparatory & Middle',
      imageUrl: content.secondarySection.imageUrl,
    },
    {
      title: t('home.academicsPreview.hscTitle', 'Higher Secondary'),
      classes: isTa ? '11 & 12 ஆம் வகுப்பு (+1 & +2)' : 'Classes 11 & 12 (+1 & +2)',
      description: t('home.academicsPreview.hscDesc', content.higherSecondarySection.description),
      icon: <GraduationCap className="w-6 h-6 text-amber-500 dark:text-amber-400" />,
      color: 'border-amber-500/30 hover:border-amber-500',
      tag: isTa ? 'மேல்நிலைக் கட்டம்' : 'Senior Secondary',
      imageUrl: content.higherSecondarySection.imageUrl,
    },
  ];

  return (
    <section className="section-padding bg-slate-50 dark:bg-slate-900/40 relative">
      <div className="container-main">
        <SectionHeading
          subtitle={t('home.academicsPreview.subtitle', 'Educational Streams')}
          title={t('home.academicsPreview.title', 'Structured Learning for Every Growth Stage')}
          description={t(
            'home.academicsPreview.description',
            'From foundational literacy and joyful primary discovery to rigorous board examination excellence in secondary and higher secondary streams.'
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((sec, idx) => (
            <div
              key={idx}
              className={`bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border-2 ${sec.color} transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col group`}
            >
              {/* Image Preview */}
              <div className="relative h-48 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sec.imageUrl}
                  alt={sec.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800 dark:text-slate-100 shadow-sm">
                  {sec.tag}
                </div>
                <div className="absolute bottom-3 left-4 text-white font-bold text-sm">
                  {sec.classes}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {sec.icon}
                  </div>
                  <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                    {sec.title}
                  </h3>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                  {sec.description}
                </p>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href="/academics"
                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
                  >
                    <span>{t('home.academicsPreview.exploreBtn', 'View Curriculum & Subjects')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
