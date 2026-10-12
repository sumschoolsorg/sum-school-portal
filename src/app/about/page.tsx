'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { defaultAboutContent } from '@/lib/defaultData';
import { aboutRepository } from '@/lib/repositories';
import { AboutContent } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Target, Eye, Heart } from 'lucide-react';
import { SchoolTimelineSection } from '@/components/about/SchoolTimelineSection';

export default function AboutPage() {
  const { t, language, getLocalized } = useLanguage();
  const [content, setContent] = useState<AboutContent>(defaultAboutContent);

  useEffect(() => {
    let isMounted = true;
    aboutRepository.get().then((data) => {
      if (isMounted && data) {
        setContent(data);
      }
    }).catch((err) => {
      console.warn('Failed to load about content from repository:', err);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const coreValues =
    language === 'ta' && content.coreValues_ta && content.coreValues_ta.length > 0
      ? content.coreValues_ta
      : content.coreValues_en || content.coreValues;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Page Hero Banner */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="container-main relative z-10 text-center">
            <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-300 mb-4 px-3 py-1 rounded-full bg-white/10 border border-white/20">
              {t('about.heroTag', 'Institutional Heritage & Ethos')}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight">
              {t('about.heroTitle', 'About S.U.M. School')}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              {t('about.heroDescription', 'Nurturing generations of curious thinkers, ethical citizens, and future leaders through accessible excellence in primary and higher secondary education.')}
            </p>
          </div>
        </section>

        {/* Introduction & History */}
        <section className="section-padding bg-white dark:bg-slate-950">
          <div className="container-main">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <SectionHeading
                  align="left"
                  subtitle={t('about.heritageSubtitle', 'Our Heritage')}
                  title={t('about.heritageTitle', 'A Foundation Built on Vision & Service')}
                  description={getLocalized(content, 'introduction')}
                  className="mb-0"
                />
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {getLocalized(content, 'history')}
                </p>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {getLocalized(content, 'educationalPhilosophy')}
                </p>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 dark:border-slate-800 relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/about-school.jpg"
                    alt="S.U.M. School Campus & Heritage"
                    className="w-full h-[360px] object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-white p-1.5 shadow-xl border border-white/20 flex items-center justify-center flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/images/school-crest.png"
                          alt="S.U.M. School Crest"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                          {t('about.officialCrest', 'Official School Crest')}
                        </div>
                        <div className="text-sm font-bold leading-tight">
                          {language === 'ta'
                            ? 'சவரியப்ப உடையார் நினைவு மேல்நிலைப் பள்ளி'
                            : 'Savariyappa Udaiyar Memorial Hr. Sec. School'}
                        </div>
                        <div className="text-[11px] text-slate-300">
                          {t('about.crestSubtitle', 'Royappanpatti • Estd. 1963')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 60th Diamond Jubilee Commemorative Box with Founder */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-800/80 border border-amber-200 dark:border-amber-900/40 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 shadow-sm min-w-0">
                  <div className="w-16 h-16 shrink-0 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/diamond-jubilee-logo.png"
                      alt="Diamond Jubilee 60 Years (1963–2023)"
                      className="w-full h-full object-contain drop-shadow-md"
                    />
                  </div>
                  <div className="text-xs space-y-0.5 min-w-0 flex-1">
                    <div className="font-extrabold text-amber-950 dark:text-amber-300 text-sm">
                      {language === 'ta'
                        ? 'நிறுவனர் சவரியப்ப உடையார் & 60-ஆம் ஆண்டு வைர விழா (1963–2023)'
                        : 'Founder Savariyappa Udaiyar & 60 Years Diamond Jubilee'}
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed italic">
                      {language === 'ta'
                        ? '"எதிர்கால நம்பிக்கையான குடிமக்களை உருவாக்குதல்" — கம்பம் பள்ளத்தாக்கில் கல்வி விழிப்புணர்வும், விழுமியங்களும், கல்வி மேன்மையும் பரப்ப 1963-ல் நிறுவப்பட்டது.'
                        : '"Inspiring Generations of Promising Citizens" — Founded in 1963 to bring enlightenment, values, and academic excellence to the Cumbum Valley.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission Cards */}
        <section className="section-padding bg-slate-50 dark:bg-slate-900/40">
          <div className="container-main">
            <SectionHeading
              subtitle={t('about.visionSubtitle', 'Guiding Principles')}
              title={
                language === 'ta'
                  ? 'தொலைநோக்குப் பார்வை & செயல் திட்டம்'
                  : 'Vision & Institutional Mission'
              }
              description={
                language === 'ta'
                  ? 'கல்வி வளர்ச்சிக்கும் ஒழுக்க நெறிமுறைக்கும் எங்கள் வழிகாட்டும் திசைகாட்டி.'
                  : 'Our compass for educational advancement and moral instruction.'
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Vision */}
              <Card variant="glass" className="p-8 sm:p-10 border-blue-500/20 flex flex-col items-start">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-4">
                  {t('about.visionTitle', 'Our Vision')}
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {getLocalized(content, 'vision')}
                </p>
              </Card>

              {/* Mission */}
              <Card variant="glass" className="p-8 sm:p-10 border-amber-500/20 flex flex-col items-start">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-4">
                  {t('about.missionTitle', 'Our Mission')}
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {getLocalized(content, 'mission')}
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="section-padding bg-white dark:bg-slate-950">
          <div className="container-main">
            <SectionHeading
              subtitle={language === 'ta' ? 'எஸ்.யு.எம். நெறிமுறைகள்' : 'The S.U.M. Way'}
              title={t('about.coreValuesTitle', 'Our Core Institutional Values')}
              description={
                language === 'ta'
                  ? 'வகுப்பறை கலாச்சாரம், தினசரி நடத்தை மற்றும் மாணவர் நற்பண்புகளை வழிநடத்தும் ஒழுக்க விழுமியங்கள்.'
                  : 'The moral tenets that guide daily behavior, classroom culture, and student character.'
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.map((val, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-4 hover:-translate-y-1 transition-all"
                >
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                      {val}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {language === 'ta'
                        ? 'வழிகாட்டுதல் மற்றும் சமூக சேவை மூலம் பயிற்றுவிக்கப்படுகிறது.'
                        : 'Instilled through mentor programs and community service.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Historic School Journey Timeline */}
        <SchoolTimelineSection />

        {/* Management & Leadership */}
        <section className="section-padding bg-slate-50 dark:bg-slate-900/40">
          <div className="container-main">
            <SectionHeading
              subtitle={language === 'ta' ? 'பள்ளி நிர்வாகம் & தலைமை' : 'Governance & Leadership'}
              title={t('about.managementTitle', 'Management & Administrative Trust')}
              description={
                language === 'ta'
                  ? 'மாணவர்களின் நல்வாழ்வு மற்றும் கல்வி நவீனமயமாக்கலுக்கு அர்ப்பணிப்புடன் செயல்படும் அனுபவமிக்க வழிகாட்டிகள்.'
                  : 'Guided by experienced leaders committed to the advancement of student welfare and educational modernization.'
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {content.management.map((mem, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mem.photoUrl}
                    alt={getLocalized(mem, 'name')}
                    className="w-28 h-28 rounded-2xl object-cover border-2 border-blue-500/20 shrink-0 shadow-md"
                  />
                  <div>
                    <h4 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                      {getLocalized(mem, 'name')}
                    </h4>
                    <p className="text-xs font-semibold text-amber-500 mb-3">
                      {getLocalized(mem, 'designation')}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                      &ldquo;{getLocalized(mem, 'message')}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
