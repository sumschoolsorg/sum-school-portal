'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Shield, Award, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { defaultAboutContent } from '@/lib/defaultData';
import { useLanguage } from '@/contexts/LanguageContext';

export function AboutSection({ content = defaultAboutContent }: { content?: typeof defaultAboutContent }) {
  const { t, isTamil } = useLanguage();

  const coreValues = isTamil
    ? [
        'கல்வி ஒழுக்கம் & அர்ப்பணிப்புடன் கூடிய கடின உழைப்பு',
        'ஒழுக்கம், அடக்கம் & ஆன்மிக நெறிமுறைகள்',
        'கலாச்சாரம், சமுதாய ஒற்றுமை & அனைவரையும் அரவணைக்கும் பண்பு',
        'அறிவியல் சிந்தனை, சுற்றுச்சூழல் பாதுகாப்பு & புதுமை',
      ]
    : content.coreValues.slice(0, 4);

  const introText = isTamil
    ? '1963-ஆம் ஆண்டு தொடங்கப்பட்ட சவரியப்ப உடையார் நினைவு மேல்நிலை & தொடக்கப்பள்ளி, கம்பம் பள்ளத்தாக்கு மற்றும் தேனி மாவட்ட கிராமப்புற மாணவ மாணவியருக்கு மிகச் சிறந்த கல்வி வாய்ப்புகளை வழங்கி வருகிறது.'
    : content.introduction;

  return (
    <section className="section-padding bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image with floating badges (Col 6) */}
          <div className="lg:col-span-6 relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/students-collab.jpg"
                alt="Students collaborating at S.U.M. School"
                className="w-full h-[400px] sm:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1">
                  {t('home.aboutPreview.imageCaptionTitle')}
                </div>
                <div className="text-lg font-bold font-heading">
                  {t('home.aboutPreview.imageCaptionSub')}
                </div>
              </div>
            </div>

            {/* Floating Achievement Badge */}
            <div className="absolute -bottom-6 -right-6 sm:bottom-8 sm:-right-8 z-20 bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-4 animate-float">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-extrabold font-heading text-slate-900 dark:text-white">
                  100%
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {t('home.aboutPreview.badgeSuccess')}
                </div>
              </div>
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -top-6 -left-6 sm:top-8 sm:-left-8 z-20 bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-2xl border border-slate-200/80 dark:border-slate-800 hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold font-heading text-slate-900 dark:text-white">
                  {t('home.aboutPreview.badgeGovt')}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t('home.aboutPreview.subBadgeGovt')}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Key Highlights (Col 6) */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <SectionHeading
              align="left"
              subtitle={t('home.aboutPreview.eyebrow')}
              title={t('home.aboutPreview.title')}
              description={introText}
              className="mb-6"
            />

            <div className="space-y-3.5 my-4 w-full">
              {coreValues.map((value, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-200">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 my-6 w-full pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 shadow-sm">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                <div className="font-heading font-bold text-slate-900 dark:text-white text-sm">
                  {isTamil ? 'தகுதிவாய்ந்த ஆசிரியர்கள்' : 'Qualified Educators'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isTamil ? 'அனுபவமிக்க துறை ஒருங்கிணைப்பாளர்கள்' : 'Experienced subject coordinators'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 shadow-sm">
                <BookOpen className="w-6 h-6 text-amber-500 dark:text-amber-400 mb-2" />
                <div className="font-heading font-bold text-slate-900 dark:text-white text-sm">
                  {isTamil ? 'சமச்சீர் பாடத்திட்டம்' : 'Smart Curriculum'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isTamil ? 'எதிர்கால வேலைவாய்ப்புக்கான வழிகாட்டுதல்' : 'Future-ready academic pathways'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Link href="/about">
                <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  {t('home.aboutPreview.learnMoreBtn')}
                </Button>
              </Link>
              <Link href="/faculty">
                <Button variant="outline">{t('nav.faculty')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
