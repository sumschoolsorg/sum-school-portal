'use client';

import React from 'react';
import Link from 'next/link';
import { Quote, ArrowRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { defaultHomepageContent } from '@/lib/defaultData';
import { useLanguage } from '@/contexts/LanguageContext';

export function PrincipalMessageSection({
  content = defaultHomepageContent.principalMessage,
}: {
  content?: typeof defaultHomepageContent.principalMessage;
}) {
  const { t, getLocalized } = useLanguage();

  const name = getLocalized(content, 'name') || t('home.principalMessage.name', content.name);
  const designation = getLocalized(content, 'designation') || t('home.principalMessage.role', content.designation);
  const message = getLocalized(content, 'message') || t('home.principalMessage.quote', content.message);

  return (
    <section className="section-padding bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="container-main">
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl border border-blue-800/40">
          {/* Decorative quote watermark */}
          <Quote className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Principal Photo & Details (Col 4) */}
            <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="relative mb-6">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden border-4 border-amber-400/40 shadow-2xl shadow-blue-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={content.photoUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-amber-500 text-slate-950 p-2 rounded-xl shadow-lg">
                  <Award className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                {name}
              </h3>
              <p className="text-sm font-semibold text-amber-300 mt-1">
                {designation}
              </p>
              <div className="text-xs text-slate-400 mt-1">
                {t('home.principalMessage.schoolTag', 'S.U.M. Higher Secondary & Primary School')}
              </div>
            </div>

            {/* Principal's Message (Col 8) */}
            <div className="lg:col-span-8 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/10">
                <Quote className="w-3.5 h-3.5" />
                <span>{t('home.principalMessage.badge', 'Message from the Headmaster')}</span>
              </div>

              <blockquote className="text-base sm:text-lg lg:text-xl font-normal text-slate-200 leading-relaxed italic mb-8">
                &ldquo;{message}&rdquo;
              </blockquote>

              <div className="flex flex-wrap items-center gap-4">
                <Link href="/about">
                  <Button
                    variant="accent"
                    size="sm"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    {t('home.principalMessage.readMoreBtn', 'Read Management & Trust Messages')}
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    {t('home.principalMessage.connectBtn', 'Connect With Leadership')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
