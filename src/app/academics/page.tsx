'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { defaultAcademicsContent } from '@/lib/defaultData';
import { academicsRepository } from '@/lib/repositories';
import { AcademicsContent } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import {
  CheckCircle,
  Sparkles,
  Layers,
  FileCheck2,
  Cpu,
  Award,
  Trophy,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Calculator,
  Briefcase,
  Languages,
  Laptop,
  Medal,
  FlaskConical,
} from 'lucide-react';

export default function AcademicsPage() {
  const { t, language, getLocalized } = useLanguage();
  const [content, setContent] = useState<AcademicsContent>(defaultAcademicsContent);

  useEffect(() => {
    let isMounted = true;
    academicsRepository.get().then((data) => {
      if (isMounted && data) {
        setContent(data);
      }
    }).catch((err) => {
      console.warn('Failed to load academics content from repository:', err);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const primary = content?.primarySection || defaultAcademicsContent.primarySection;
  const secondary = content?.secondarySection || defaultAcademicsContent.secondarySection;
  const higherSecondary = content?.higherSecondarySection || defaultAcademicsContent.higherSecondarySection;

  const primarySubjects =
    (language === 'ta' && primary?.subjects_ta
      ? primary.subjects_ta
      : primary?.subjects_en || primary?.subjects) || [];

  const secondarySubjects =
    (language === 'ta' && secondary?.subjects_ta
      ? secondary.subjects_ta
      : secondary?.subjects_en || secondary?.subjects) || [];

  const higherSecondarySubjects =
    (language === 'ta' && higherSecondary?.subjects_ta
      ? higherSecondary.subjects_ta
      : higherSecondary?.subjects_en || higherSecondary?.subjects) || [];

  const academicActivities =
    (language === 'ta' && content?.academicActivities_ta
      ? content.academicActivities_ta
      : content?.academicActivities_en || content?.academicActivities) || [];

  const coCurricularActivities =
    (language === 'ta' && content?.coCurricularActivities_ta
      ? content.coCurricularActivities_ta
      : content?.coCurricularActivities_en || content?.coCurricularActivities) || [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-1">
        <Breadcrumbs items={[{ label: t('header.academics', 'Academics') }]} />
        {/* Hero Banner */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
          <div className="container-main relative z-10 text-center">
            <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-300 mb-4 px-3 py-1 rounded-full bg-white/10 border border-white/20">
              {t('academics.heroTag', 'Curriculum & Pedagogical Standards')}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight">
              {t('academics.heroTitle', 'Academic Excellence')}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              {t('academics.heroDescription', 'Rigorous, supportive, and holistic education structured across foundational primary, secondary, and higher secondary streams.')}
            </p>
          </div>
        </section>

        {/* Section 1: Primary Education */}
        <section className="section-padding bg-white dark:bg-slate-950">
          <div className="container-main">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 order-2 lg:order-1 space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {t('academics.stage1Tag', 'Stage 1: Foundational Learning')}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-white">
                  {getLocalized(primary, 'title')}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {getLocalized(primary, 'description')}
                </p>

                <div className="pt-2">
                  <h4 className="text-sm font-bold font-heading text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                    {t('academics.curriculumSubjects', 'Curriculum Subjects & Disciplines:')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {primarySubjects.map((sub, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 order-1 lg:order-2">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 dark:border-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={primary.imageUrl || '/images/facility-library.jpg'}
                    alt={getLocalized(primary, 'title')}
                    className="w-full h-[380px] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Secondary Education */}
        <section className="section-padding bg-slate-50 dark:bg-slate-900/40">
          <div className="container-main">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={secondary.imageUrl || '/images/facility-science-lab.jpg'}
                    alt={getLocalized(secondary, 'title')}
                    className="w-full h-[400px] object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-6 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    {t('academics.stage2Tag', 'Stage 2: Secondary Wing (SSLC)')}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex items-center gap-1">
                    <Languages className="w-3.5 h-3.5" />
                    {language === 'ta' ? 'தமிழ் & ஆங்கில வழி (6 முதல் 10)' : 'Tamil & English Medium (6th to 10th)'}
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-white">
                  {getLocalized(secondary, 'title')}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {getLocalized(secondary, 'description')}
                </p>

                {/* Special Scholarship Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
                      <Medal className="w-4 h-4 text-amber-600" />
                      {language === 'ta' ? 'NMMS கல்வி உதவித்தொகை' : 'NMMS Scholarship Exam'}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      {language === 'ta'
                        ? '8-ஆம் வகுப்பு மாணவர்களுக்கு சிறப்புப் பிரிவுகள் மற்றும் மத்திய அரசு உதவித்தொகைக்கான பிரத்யேக பயிற்சி.'
                        : 'Dedicated special sections and intensive coaching for Class 8 students with annual scholarship grant.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
                    <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold text-xs uppercase tracking-wider">
                      <Award className="w-4 h-4 text-blue-600" />
                      {language === 'ta' ? 'ஊரகத் திறனாய்வுத் தேர்வு' : 'Rural Talent (TRUST) Exam'}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      {language === 'ta'
                        ? 'கிராமப்புற மாணவர்களின் திறனை ஊக்குவிக்க தமிழ்நாடு அரசின் TRUST தேர்வுக்கான மாதிரித் தேர்வுகள்.'
                        : 'Specialized training for Tamil Nadu Rural Students Talent Search (TRUST) Examination.'}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-bold font-heading text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                    {language === 'ta' ? 'அடிப்படைப் பாடங்கள் & சிறப்பம்சங்கள்:' : 'Core Academic Disciplines:'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {secondarySubjects.map((sub, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Higher Secondary Education (11th & 12th Groups) */}
        <section className="section-padding bg-white dark:bg-slate-950">
          <div className="container-main">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                  {t('academics.stage3Tag', 'Stage 3: Higher Secondary (+1 & +2 HSC)')}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5" />
                  {language === 'ta' ? 'அனைத்து குரூப்களும் தமிழ் & ஆங்கில வழியில்' : 'All Groups in Tamil & English Medium'}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
                {language === 'ta'
                  ? '11 & 12-ஆம் வகுப்பு பாடப்பிரிவுகள் (Groups)'
                  : '11th & 12th Standard Higher Secondary Groups'}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'ta'
                  ? 'மருத்துவம், பொறியியல், கணினி அறிவியல், ஆராய்ச்சி, தணிக்கையியல் (CA/Auditing) மற்றும் அரசுத் துறைப் பணிகளுக்கான தமிழ்நாடு அரசுப் பாடத்திட்டத்தின் 4 பிரதான குரூப்கள்.'
                  : 'State Board curriculum tailored for Medicine, Engineering, IT, Research, Chartered Accountancy (CA/Auditing), and Civil Services across 4 structured streams.'}
              </p>
            </div>

            {/* Structured 4 Groups Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              
              {/* Group I (A): Bio-Maths */}
              <div className="rounded-3xl p-6 bg-gradient-to-b from-blue-50/60 to-white dark:from-slate-900 dark:to-slate-950 border-2 border-blue-200 dark:border-blue-900/60 shadow-lg hover:shadow-xl transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold font-mono px-3 py-1 rounded-full bg-blue-600 text-white">
                      GROUP I (Option A)
                    </span>
                    <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                      {language === 'ta' ? 'தமிழ் & ஆங்கில வழி' : 'Tamil & English'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    {language === 'ta' ? 'பயோ-மேக்ஸ் (Bio-Maths)' : 'Bio-Mathematics'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    {language === 'ta'
                      ? 'மருத்துவம், பொறியியல், மற்றும் வேளாண் அறிவியல் வாய்ப்புகளுக்கான பிரிவு.'
                      : 'Premier pathway for Medical, Engineering, Biotechnology, and Agricultural Sciences.'}
                  </p>
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      {language === 'ta' ? 'பாடங்கள்:' : 'Subjects:'}
                    </div>
                    {['Mathematics (கணிதம்)', 'Physics (இயற்பியல்)', 'Chemistry (வேதியியல்)', 'Biology (உயிரியல்)'].map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                  {language === 'ta' ? '➔ NEET, JEE, TNEA, ICAR தேர்வுகள்' : '➔ NEET, JEE, TNEA, ICAR Ready'}
                </div>
              </div>

              {/* Group I (B): Computer Science */}
              <div className="rounded-3xl p-6 bg-gradient-to-b from-indigo-50/60 to-white dark:from-slate-900 dark:to-slate-950 border-2 border-indigo-200 dark:border-indigo-900/60 shadow-lg hover:shadow-xl transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold font-mono px-3 py-1 rounded-full bg-indigo-600 text-white">
                      GROUP I (Option B)
                    </span>
                    <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                      {language === 'ta' ? 'தமிழ் & ஆங்கில வழி' : 'Tamil & English'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Laptop className="w-5 h-5 text-indigo-600" />
                    {language === 'ta' ? 'கணினி அறிவியல் (Computer Science)' : 'Computer Science'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    {language === 'ta'
                      ? 'மென்பொருள் பொறியியல், AI, டேட்டா சயின்ஸ் மற்றும் தொழில்நுட்பப் படிப்புகள்.'
                      : 'Focused stream for Computer Engineering, AI, Data Science, and IT careers.'}
                  </p>
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      {language === 'ta' ? 'பாடங்கள்:' : 'Subjects:'}
                    </div>
                    {['Mathematics (கணிதம்)', 'Physics (இயற்பியல்)', 'Chemistry (வேதியியல்)', 'Computer Science (கணினி அறிவியல்)'].map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200">
                        <CheckCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                  {language === 'ta' ? '➔ B.E/B.Tech, BCA, B.Sc Computer Science' : '➔ B.E/B.Tech, BCA, IT & Software'}
                </div>
              </div>

              {/* Group II: Pure Science */}
              <div className="rounded-3xl p-6 bg-gradient-to-b from-emerald-50/60 to-white dark:from-slate-900 dark:to-slate-950 border-2 border-emerald-200 dark:border-emerald-900/60 shadow-lg hover:shadow-xl transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold font-mono px-3 py-1 rounded-full bg-emerald-600 text-white">
                      GROUP II
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                      {language === 'ta' ? 'தமிழ் & ஆங்கில வழி' : 'Tamil & English'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-emerald-600" />
                    {language === 'ta' ? 'தூய அறிவியல் (Pure Science)' : 'Pure Science'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    {language === 'ta'
                      ? 'தாவரவியல் மற்றும் விலங்கியலுடன் கூடிய முழுமையான மருத்துவ மற்றும் அறிவியல் ஆய்வுப் பிரிவு.'
                      : 'Specialized bio-stream for MBBS, BDS, Pharmacy, Nursing, and Biological Research.'}
                  </p>
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      {language === 'ta' ? 'பாடங்கள்:' : 'Subjects:'}
                    </div>
                    {['Physics (இயற்பியல்)', 'Chemistry (வேதியியல்)', 'Botany (தாவரவியல்)', 'Zoology (விலங்கியல்)'].map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {language === 'ta' ? '➔ மருத்துவப் படிப்புகள், மருந்தியல், நர்சிங்' : '➔ Medical, Allied Health, Research'}
                </div>
              </div>

              {/* Group III: Arts & Commerce Streams */}
              <div className="rounded-3xl p-6 bg-gradient-to-b from-amber-50/60 to-white dark:from-slate-900 dark:to-slate-950 border-2 border-amber-200 dark:border-amber-900/60 shadow-lg hover:shadow-xl transition flex flex-col justify-between md:col-span-2 lg:col-span-2">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold font-mono px-3 py-1 rounded-full bg-amber-600 text-white">
                      GROUP III (Options i, ii, iii)
                    </span>
                    <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                      {language === 'ta' ? 'தமிழ் & ஆங்கில வழி' : 'Tamil & English'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-600" />
                    {language === 'ta' ? 'வணிகவியல் மற்றும் கலைப் பிரிவுகள்' : 'Commerce & Humanities Streams'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    {language === 'ta'
                      ? 'சார்ட்டர்ட் அக்கவுண்டன்சி (CA), வங்கிப் பணிகள், வணிக மேலாண்மை மற்றும் சிவில் சர்வீசஸ்.'
                      : 'Versatile foundation for Chartered Accountancy (CA), Banking, Corporate Finance, and Law.'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold font-mono text-amber-700 dark:text-amber-400 uppercase">Option (i) History</span>
                      <ul className="mt-2 space-y-1 text-xs text-slate-700 dark:text-slate-300">
                        <li>• History (வரலாறு)</li>
                        <li>• Commerce (வணிகவியல்)</li>
                        <li>• Accountancy (கணக்குப்பதிவியல்)</li>
                        <li>• Economics (பொருளியல்)</li>
                      </ul>
                    </div>

                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold font-mono text-amber-700 dark:text-amber-400 uppercase">Option (ii) Comp. App.</span>
                      <ul className="mt-2 space-y-1 text-xs text-slate-700 dark:text-slate-300">
                        <li>• Computer Applications</li>
                        <li>• Commerce (வணிகவியல்)</li>
                        <li>• Accountancy (கணக்குப்பதிவியல்)</li>
                        <li>• Economics (பொருளியல்)</li>
                      </ul>
                    </div>

                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold font-mono text-amber-700 dark:text-amber-400 uppercase">Option (iii) Bus. Maths</span>
                      <ul className="mt-2 space-y-1 text-xs text-slate-700 dark:text-slate-300">
                        <li>• Business Maths (வணிகக் கணிதம்)</li>
                        <li>• Commerce (வணிகவியல்)</li>
                        <li>• Accountancy (கணக்குப்பதிவியல்)</li>
                        <li>• Economics (பொருளியல்)</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                  {language === 'ta' ? '➔ B.Com, BBA, CA, CMA, CS, வங்கித் தேர்வுகள், சட்டம் (Law)' : '➔ B.Com, BBA, CA, CMA, CS, Banking Exams & Law'}
                </div>
              </div>

              {/* Group IV: Vocational Stream */}
              <div className="rounded-3xl p-6 bg-gradient-to-b from-purple-50/60 to-white dark:from-slate-900 dark:to-slate-950 border-2 border-purple-200 dark:border-purple-900/60 shadow-lg hover:shadow-xl transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold font-mono px-3 py-1 rounded-full bg-purple-600 text-white">
                      GROUP IV
                    </span>
                    <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300">
                      {language === 'ta' ? 'தமிழ் & ஆங்கில வழி' : 'Tamil & English'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                    {language === 'ta' ? 'தொழிற்கல்வி — ஆடிட்டிங்' : 'Vocational Commerce & Auditing'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    {language === 'ta'
                      ? 'தணிக்கையியல் மற்றும் வேலைவாய்ப்புத் திறன்களுடன் கூடிய நேரடி தொழில் வழிகாட்டல் பிரிவு.'
                      : 'Career-focused vocational curriculum in Auditing, Taxation, and Corporate Employment Skills.'}
                  </p>
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      {language === 'ta' ? 'பாடங்கள்:' : 'Subjects:'}
                    </div>
                    {[
                      'Commerce (வணிகவியல்)',
                      'Auditing (தணிக்கையியல்)',
                      'Accountancy (கணக்குப்பதிவியல்)',
                      'Employment Skills (வேலைவாய்ப்புத் திறன்)',
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200">
                        <CheckCircle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                  {language === 'ta' ? '➔ ஆடிட்டிங் அசிஸ்டெண்ட், GST கணக்காளர், B.Com Corporate' : '➔ Auditing Executive, GST Accounting, B.Com'}
                </div>
              </div>

            </div>

            {/* Visual Classroom / Lab Image Card */}
            <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-slate-100 dark:border-slate-800 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={higherSecondary.imageUrl || '/images/facility-computer-lab.jpg'}
                alt={getLocalized(higherSecondary, 'title')}
                className="w-full h-[320px] sm:h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-6 sm:p-10">
                <div className="text-white">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-300">
                    S.U.M. HIGHER SECONDARY SCHOOL • ROYAPPANPATTI
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading mt-1">
                    {language === 'ta'
                      ? 'அனுபவமிக்க முதுகலை ஆசிரியர்கள் மற்றும் நவீன செய்முறை ஆய்வகங்கள்'
                      : 'Experienced Post-Graduate Faculty & Advanced Practical Laboratories'}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Atal Tinkering Lab & STEM Innovation */}
        <section className="section-padding bg-gradient-to-b from-blue-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f61a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          <div className="container-main relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/30 mb-4">
                <Cpu className="w-3.5 h-3.5" />
                {language === 'ta' ? 'அடல் டிங்கரிங் லேப் & தொழில்நுட்பப் புத்தாக்கம்' : 'Atal Tinkering Lab & STEM Innovation'}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight">
                {language === 'ta'
                  ? 'எதிர்காலக் கண்டுபிடிப்பாளர்களை உருவாக்கும் ரோபாட்டிக்ஸ் ஆய்வகம்'
                  : 'Fostering Future Technologists Through Hands-On Robotics'}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-blue-200 leading-relaxed">
                {language === 'ta'
                  ? 'எஸ்.யு.எம். பள்ளியின் அடல் டிங்கரிங் ஆய்வகம் (ATL), கிராமப்புற மாணவர்களிடையே செயற்கை நுண்ணறிவு, ரோபாட்டிக்ஸ், சென்சார்கள் மற்றும் மின்னணுவியல் திறன்களை வளர்த்து, மாநில அளவில் வரலாற்று வெற்றிகளை ஈட்டி வருகிறது.'
                  : 'S.U.M. School\'s Atal Tinkering Lab (ATL) immerses rural students in robotics, IoT, microcontrollers, and applied electronics — supported by expert technical mentoring from Propeller Technology.'}
              </p>
            </div>

            {/* Achievement Highlights Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Card 1: Hackathon 2026 */}
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:border-amber-400/40 transition duration-300 flex flex-col justify-between group">
                <div>
                  <div className="relative rounded-2xl overflow-hidden mb-5 aspect-[4/3]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/atl/hackathon-2026-1.jpeg"
                      alt="State Level Hackathon 2026 1st Prize"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                      <Trophy className="w-3.5 h-3.5" />
                      {language === 'ta' ? 'முதற்பரிசு (ரூ. 10,000)' : '1st Prize (₹10,000)'}
                    </div>
                  </div>
                  <span className="text-[11px] font-mono uppercase text-amber-300 font-bold tracking-wider">
                    {language === 'ta' ? 'மாநில அளவிலான ஹேக்கத்தான் 2026' : 'State Hackathon 2026'}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1 mb-2">
                    {language === 'ta'
                      ? 'நாடார் சரஸ்வதி பொறியியல் கல்லூரியில் வெற்றி'
                      : 'Nadar Saraswathy College of Engineering'}
                  </h3>
                  <p className="text-xs text-blue-200 leading-relaxed">
                    {language === 'ta'
                      ? 'கல்லூரி அளவிலான மாநில ஹேக்கத்தானில் பங்கேற்று, புரோபெல்லர் டெக்னாலஜி வழிகாட்டலில் இயங்கும் IoT முன்மாதிரியை உருவாக்கி முதற்பரிசும் ரூ. 10,000 ரொக்கப்பரிசும் பெற்றனர்.'
                      : 'Our student inventors built a functional IoT hardware prototype, outperforming competitors to secure First Prize and a ₹10,000 cash grant.'}
                  </p>
                </div>
              </div>

              {/* Card 2: Robotics League 2024 */}
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:border-blue-400/40 transition duration-300 flex flex-col justify-between group">
                <div>
                  <div className="relative rounded-2xl overflow-hidden mb-5 aspect-[4/3]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/atl/robotics-league-2024-1.jpeg"
                      alt="Tamil Nadu Robotics League 2024"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                      <Award className="w-3.5 h-3.5" />
                      {language === 'ta' ? 'இளம் கண்டுபிடிப்பாளர் விருது' : 'Young Innovators Award'}
                    </div>
                  </div>
                  <span className="text-[11px] font-mono uppercase text-blue-300 font-bold tracking-wider">
                    {language === 'ta' ? 'தமிழ்நாடு ரோபாட்டிக்ஸ் லீக் 2024' : 'TN Robotics League 2024'}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1 mb-2">
                    {language === 'ta' ? 'தேசியக் கல்லூரி, திருச்சி' : 'National College, Trichy'}
                  </h3>
                  <p className="text-xs text-blue-200 leading-relaxed">
                    {language === 'ta'
                      ? 'தமிழகத்தின் 100-க்கும் மேற்பட்ட பள்ளிகளுடன் போட்டியிட்டு தன்னாட்சி ரோபோக்களை இயக்கி இளம் கண்டுபிடிப்பாளர் விருதை வென்றனர்.'
                      : 'Recognized for outstanding robotics architecture and autonomous navigation algorithms among hundreds of competing schools across Tamil Nadu.'}
                  </p>
                </div>
              </div>

              {/* Card 3: Hands-On ATL Lab */}
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:border-emerald-400/40 transition duration-300 flex flex-col justify-between group">
                <div>
                  <div className="relative rounded-2xl overflow-hidden mb-5 aspect-[4/3]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/atl/atl-workshop-learning-6.jpeg"
                      alt="Hands-On ATL Workshops"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                      <Sparkles className="w-3.5 h-3.5" />
                      {language === 'ta' ? 'நேரடி ஆய்வகப் பயிற்சி' : 'Hands-On Mentorship'}
                    </div>
                  </div>
                  <span className="text-[11px] font-mono uppercase text-emerald-300 font-bold tracking-wider">
                    {language === 'ta' ? 'வளாக ஆய்வக வசதி' : 'Campus ATL Facility'}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1 mb-2">
                    {language === 'ta' ? 'அடல் டிங்கரிங் லேப் & புரோபெல்லர் டெக்' : 'ATL & Propeller Technology'}
                  </h3>
                  <p className="text-xs text-blue-200 leading-relaxed">
                    {language === 'ta'
                      ? 'ஆர்டுயினோ, சென்சார்கள், 3D வடிவமைப்பு மற்றும் புரோகிராமிங் பயிற்சிகள் மூலம் மாணவர்களின் கற்பனைத் திறன் செயல்திறனாக மாறுகிறது.'
                      : 'Structured experiential learning covering Arduino, sensor integration, electronic circuit design, and autonomous robotics programming.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Link to Gallery & Achievements */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-center">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/20"
              >
                <span>{language === 'ta' ? 'ரோபாட்டிக்ஸ் புகைப்படங்களைப் பார்க்க' : 'View Robotics & ATL Gallery'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/achievements"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition"
              >
                <span>{language === 'ta' ? 'அனைத்து மாணவர் சாதனைகள்' : 'All Student Achievements'}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Institutional Statistics & Class-Wise Enrolment Section */}
        <section className="section-padding bg-slate-100/70 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
          <div className="container-main">
            <SectionHeading
              subtitle={language === 'ta' ? 'அங்கீகரிக்கப்பட்ட துறைப் பதிவுகள்' : 'Verified Directory & Department Records'}
              title={language === 'ta' ? 'வகுப்பு வாரியான சேர்க்கை & வளாகக் கட்டமைப்பு' : 'Class-Wise Enrolment & Campus Infrastructure'}
              description={language === 'ta' ? 'ராயப்பன்பட்டியில் உள்ள தொடக்க மற்றும் மேல்நிலைப் பிரிவுகளின் அதிகாரப்பூர்வ விபரம்.' : 'Official institutional profile detailing both Primary and Higher Secondary units in Royappanpatti.'}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
              {/* Enrolment Table */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                      {language === 'ta' ? 'உயர்நிலை & மேல்நிலைப் பிரிவு (வகுப்புகள் 6–12)' : 'Secondary Enrolment (Classes 6–12)'}
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">
                      UDISE: 33250800109 • {language === 'ta' ? 'அரசு உதவிபெறும் பள்ளி' : 'Private Aided'}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {language === 'ta' ? '3,346 மாணவர்கள்' : '3,346 Students'}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                        <th className="py-2.5 font-semibold">{language === 'ta' ? 'வகுப்பு' : 'Class / Standard'}</th>
                        <th className="py-2.5 font-semibold text-right">{language === 'ta' ? 'மாணவர் எண்ணிக்கை' : 'Reported Enrolment'}</th>
                        <th className="py-2.5 font-semibold text-right">{language === 'ta' ? 'பிரிவு' : 'Stage'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      <tr>
                        <td className="py-2 font-medium">{language === 'ta' ? '6-ஆம் வகுப்பு' : 'Standard VI'}</td>
                        <td className="py-2 text-right font-bold text-slate-900 dark:text-white">398</td>
                        <td className="py-2 text-right text-xs text-slate-500">{language === 'ta' ? 'நடுநிலைப் பள்ளி' : 'Middle School'}</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">{language === 'ta' ? '7-ஆம் வகுப்பு' : 'Standard VII'}</td>
                        <td className="py-2 text-right font-bold text-slate-900 dark:text-white">378</td>
                        <td className="py-2 text-right text-xs text-slate-500">{language === 'ta' ? 'நடுநிலைப் பள்ளி' : 'Middle School'}</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">{language === 'ta' ? '8-ஆம் வகுப்பு' : 'Standard VIII'}</td>
                        <td className="py-2 text-right font-bold text-slate-900 dark:text-white">502</td>
                        <td className="py-2 text-right text-xs text-slate-500">{language === 'ta' ? 'நடுநிலைப் பள்ளி' : 'Middle School'}</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">{language === 'ta' ? '9-ஆம் வகுப்பு' : 'Standard IX'}</td>
                        <td className="py-2 text-right font-bold text-slate-900 dark:text-white">592</td>
                        <td className="py-2 text-right text-xs text-slate-500">{language === 'ta' ? 'உயர்நிலைப் பள்ளி' : 'Secondary'}</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">{language === 'ta' ? '10-ஆம் வகுப்பு (SSLC)' : 'Standard X (SSLC)'}</td>
                        <td className="py-2 text-right font-bold text-slate-900 dark:text-white">469</td>
                        <td className="py-2 text-right text-xs text-slate-500">{language === 'ta' ? 'அரசுப் பொதுத்தேர்வு' : 'State Board SSLC'}</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">{language === 'ta' ? '11-ஆம் வகுப்பு (+1)' : 'Standard XI (+1)'}</td>
                        <td className="py-2 text-right font-bold text-slate-900 dark:text-white">494</td>
                        <td className="py-2 text-right text-xs text-slate-500">{language === 'ta' ? 'மேல்நிலை முதலாமாண்டு' : 'HSC Stream'}</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">{language === 'ta' ? '12-ஆம் வகுப்பு (+2)' : 'Standard XII (+2)'}</td>
                        <td className="py-2 text-right font-bold text-slate-900 dark:text-white">513</td>
                        <td className="py-2 text-right text-xs text-slate-500">{language === 'ta' ? 'அரசுப் பொதுத்தேர்வு' : 'HSC Board Exam'}</td>
                      </tr>
                      <tr className="bg-slate-50 dark:bg-slate-900 font-bold">
                        <td className="py-2.5 text-blue-900 dark:text-blue-300">{language === 'ta' ? 'மொத்த மேல்நிலை மாணவர்கள்' : 'Total Secondary Scholars'}</td>
                        <td className="py-2.5 text-right text-blue-900 dark:text-blue-300">3,346</td>
                        <td className="py-2.5 text-right text-xs text-blue-700 dark:text-blue-400">{language === 'ta' ? '61 ஆசிரியர்கள்' : '61 Faculty'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 italic">
                  {language === 'ta'
                    ? '* தகவல் மூலம்: தமிழ்நாடு பள்ளிக்கல்வித்துறை & கல்வி அடைவுப் பதிவுகள். எஸ்.யு.எம். தொடக்கப்பள்ளி பிரத்யேக UDISE குறியீட்டில் கீழே விவரிக்கப்பட்டுள்ளது.'
                    : '* Source: Stack Schools & Tamil Nadu Educational Directory listings. Zero primary students in this secondary record because S.U.M. Primary School is recorded under its dedicated UDISE code below.'}
                </div>
              </div>

              {/* Primary Unit & Facilities Breakdown */}
              <div className="lg:col-span-5 space-y-4">
                {/* Primary Wing Card */}
                <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {language === 'ta' ? 'தொடக்கப்பள்ளிப் பிரிவு' : 'Primary School Wing'}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      UDISE: 33250800105
                    </span>
                  </div>
                  <h4 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                    {language === 'ta' ? 'எஸ்.யு.எம். தொடக்கப்பள்ளி, ராயப்பன்பட்டி' : 'S.U.M. Primary School, Royappanpatti'}
                  </h4>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <li>• {language === 'ta' ? 'வகுப்புகள்: 1 முதல் 5-ஆம் வகுப்பு வரை' : 'Classes: Standards 1 to 5'}</li>
                    <li>• {language === 'ta' ? 'பயிற்று மொழி: தமிழ் வழி (அடிப்படை ஆங்கிலப் பயிற்சியுடன்)' : 'Medium: Tamil Medium with foundational English'}</li>
                    <li>• {language === 'ta' ? 'நிர்வாகம்: அரசு உதவிபெறும் பள்ளி (தோற்றம் 1963)' : 'Management: Private Aided (Est. 1963)'}</li>
                    <li>• {language === 'ta' ? 'ஆசிரியர்கள்: 11 தகுதிவாய்ந்த ஆசிரியர்கள்' : 'Faculty: 11 Certified Primary Teachers'}</li>
                    <li>• {language === 'ta' ? 'வகுப்பறைகள்: 17 விசாலமான கற்றல் அறைகள்' : 'Classrooms: 17 Spacious Learning Rooms'}</li>
                    <li>• {language === 'ta' ? 'வசதிகள்: விளையாட்டு மைதானம், நூலகம், குடிநீர்' : 'Amenities: Playground, Library, Tap Water'}</li>
                  </ul>
                </div>

                {/* Audit & IT Infrastructure Card */}
                <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                  <h4 className="text-sm font-bold font-heading text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                    {language === 'ta' ? 'வளாக வசதிகள் ஆய்வு' : 'Campus Facilities Audit'}
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <div className="text-slate-400 text-[10px]">{language === 'ta' ? 'வகுப்பறைகள்' : 'Classrooms'}</div>
                      <div className="font-bold text-slate-900 dark:text-white mt-0.5">{language === 'ta' ? '85 மொத்தம் (68+17)' : '85 Total (68+17)'}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <div className="text-slate-400 text-[10px]">{language === 'ta' ? 'கணினிகள்' : 'Computers'}</div>
                      <div className="font-bold text-slate-900 dark:text-white mt-0.5">{language === 'ta' ? '40 டெஸ்க்டாப் + 5 லேப்டாப்' : '40 Desktops + 5 Laptops'}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <div className="text-slate-400 text-[10px]">{language === 'ta' ? 'ஸ்மார்ட் வகுப்பறை' : 'Smart Classroom'}</div>
                      <div className="font-bold text-slate-900 dark:text-white mt-0.5">{language === 'ta' ? 'டிஜிட்டல் பலகை இயங்குகிறது' : 'Digital Board Active'}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <div className="text-slate-400 text-[10px]">{language === 'ta' ? 'சுகாதார வசதிகள்' : 'Sanitation'}</div>
                      <div className="font-bold text-slate-900 dark:text-white mt-0.5">{language === 'ta' ? '63 மாணவர்கள் / 32 மாணவிகள்' : '63 Boys / 32 Girls'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Teaching Methodology & Examination System */}
        <section className="section-padding bg-slate-50 dark:bg-slate-900/40">
          <div className="container-main">
            <SectionHeading
              subtitle={t('academics.methodologySubtitle', 'Pedagogical Framework')}
              title={t('academics.methodologyTitle', 'Methodology & Evaluation System')}
              description={language === 'ta' ? 'கருத்துத் தெளிவு, தீவிர ஈடுபாடு மற்றும் வெளிப்படையான கல்வி மதிப்பீட்டை உறுதி செய்கிறது.' : 'Ensuring concept clarity, active engagement, and transparent academic assessment.'}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card variant="glass" className="p-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-3">
                  {language === 'ta' ? 'கற்பித்தல் முறைகள்' : 'Teaching Methodology'}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {getLocalized(content, 'teachingMethodology')}
                </p>
              </Card>

              <Card variant="glass" className="p-8">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-3">
                  {t('academics.examSystemTitle', 'Examination & Assessment')}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {getLocalized(content, 'examinationSystem')}
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Academic & Co-curricular Activities */}
        <section className="section-padding bg-white dark:bg-slate-950">
          <div className="container-main">
            <SectionHeading
              subtitle={language === 'ta' ? 'பாடப்புத்தகங்களைத் தாண்டிய ஆளுமை' : 'Enrichment Beyond Textbooks'}
              title={language === 'ta' ? 'கல்வி & கூடுதல் செயல்பாடுகள்' : 'Academic & Co-Curricular Programs'}
              description={language === 'ta' ? 'படைப்பாற்றல், பேச்சுத்திறன், உடற்திறன் மற்றும் அறிவியல் ஆர்வத்தை வளர்க்கும் செயல்பாடுகள்.' : 'Nurturing creative skills, public speaking, physical endurance, and technological curiosity.'}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800">
                <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  {language === 'ta' ? 'கல்வி சார்ந்த செயல்பாடுகள்' : 'Academic Activities'}
                </h3>
                <ul className="space-y-3">
                  {academicActivities.map((act, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800">
                <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  {t('academics.coCurricularTitle', 'Co-Curricular Clubs')}
                </h3>
                <ul className="space-y-3">
                  {coCurricularActivities.map((act, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
