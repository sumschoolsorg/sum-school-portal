'use client';

import React from 'react';
import Link from 'next/link';
import { Quote, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { defaultHomepageContent } from '@/lib/defaultData';
import { useLanguage } from '@/contexts/LanguageContext';

export function CorrespondentMessageSection({
  content = defaultHomepageContent.correspondentMessage,
}: {
  content?: typeof defaultHomepageContent.correspondentMessage;
}) {
  const { t, getLocalized } = useLanguage();

  const name =
    getLocalized(content, 'name') ||
    t('home.correspondentMessage.name', content?.name || 'MR. M.S. PRABHAKAR, M.A.');
  const designation =
    getLocalized(content, 'designation') ||
    t('home.correspondentMessage.role', content?.designation || 'MANAGER & CORRESPONDENT');
  const schoolTag =
    getLocalized(content, 'schoolTag') ||
    t(
      'home.correspondentMessage.schoolTag',
      content?.schoolTag || 'S.U.M. Higher Secondary & Primary School, Rayappanpatti'
    );
  const message =
    getLocalized(content, 'message') ||
    t('home.correspondentMessage.quote', content?.message || '');

  // Split message into paragraphs for clean typography
  const paragraphs = message
    ? message.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
    : [];

  return (
    <section className="section-padding bg-slate-50 dark:bg-slate-900/60 relative overflow-hidden pb-6 sm:pb-8">
      <div className="container-main">
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-blue-950 text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl border border-amber-500/30">
          {/* Decorative quote watermark */}
          <Quote className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Correspondent Photo & Details (Col 4) */}
            <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="relative mb-6">
                <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden border-4 border-amber-400/60 shadow-2xl shadow-sky-950 bg-slate-900 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={content?.photoUrl || '/images/correspondent-photo.jpg'}
                    alt={name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 p-2.5 rounded-xl shadow-lg ring-2 ring-amber-300/40">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-wide">
                {name}
              </h3>
              <p className="text-sm font-bold text-amber-300 tracking-wider mt-1 uppercase">
                {designation}
              </p>
              <div className="text-xs text-slate-300 mt-1 font-medium">
                {schoolTag}
              </div>
            </div>

            {/* Correspondent's Message (Col 8) */}
            <div className="lg:col-span-8 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-5 border border-amber-400/30 shadow-sm">
                <Quote className="w-3.5 h-3.5" />
                <span>
                  {t('home.correspondentMessage.badge', 'Message from the Manager & Correspondent')}
                </span>
              </div>

              <blockquote className="text-base sm:text-lg text-slate-200 leading-relaxed space-y-4 mb-6">
                {paragraphs.length > 0 ? (
                  paragraphs.map((p, idx) => (
                    <p
                      key={idx}
                      className={
                        idx === 0
                          ? 'text-white font-medium text-lg sm:text-xl not-italic'
                          : 'italic text-slate-200'
                      }
                    >
                      {idx === 0 ? p : `“${p}”`}
                    </p>
                  ))
                ) : (
                  <p className="italic">&ldquo;{message}&rdquo;</p>
                )}
              </blockquote>

              <div className="text-sm font-semibold text-amber-300/90 italic mb-8">
                — {name}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link href="/about">
                  <Button
                    variant="accent"
                    size="sm"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    {t('home.correspondentMessage.readMoreBtn', 'Read Management & Trust Profile')}
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    {t('home.correspondentMessage.connectBtn', 'Connect With Leadership')}
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
