'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { defaultFacilities } from '@/lib/defaultData';
import { facilityRepository } from '@/lib/repositories';
import { Facility } from '@/types';
import {
  MonitorPlay,
  FlaskConical,
  Laptop,
  BookOpen,
  Trophy,
  Bus,
  ShieldCheck,
  Droplets,
  Sparkles,
  Cpu,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FacilitiesPage() {
  const { t, getLocalized, language } = useLanguage();
  const isTa = language === 'ta';

  const [facilities, setFacilities] = useState<Facility[]>(defaultFacilities);

  useEffect(() => {
    let isMounted = true;
    facilityRepository.getPublished().then((items) => {
      if (isMounted && items && items.length > 0) {
        setFacilities(items);
      }
    }).catch((err) => {
      console.warn('Failed to load facilities from repository:', err);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-amber-500 dark:text-amber-400" />;
      case 'MonitorPlay':
        return <MonitorPlay className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      case 'FlaskConical':
        return <FlaskConical className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'Laptop':
        return <Laptop className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-amber-500 dark:text-amber-400" />;
      case 'Trophy':
        return <Trophy className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />;
      case 'Bus':
        return <Bus className="w-6 h-6 text-rose-600 dark:text-rose-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Page Hero */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
          <div className="container-main relative z-10 text-center">
            <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-300 mb-4 px-3 py-1 rounded-full bg-white/10 border border-white/20">
              {t('facilities.heroTag', 'Modern Campus Infrastructure')}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight">
              {t('facilities.heroTitle', 'School Facilities')}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              {t('facilities.heroDescription', 'Designed to foster an inspiring, hygienic, technologically enriched, and safe atmosphere for our scholars.')}
            </p>
          </div>
        </section>

        {/* Facilities Grid */}
        <section className="section-padding bg-white dark:bg-slate-950">
          <div className="container-main">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {facilities.map((fac) => {
                const title = getLocalized(fac, 'title');
                const description = getLocalized(fac, 'description');

                return (
                  <div
                    key={fac.id}
                    className="bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group"
                  >
                    <div className="relative h-56 w-full overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={fac.imageUrl}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md">
                        {getIcon(fac.icon)}
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 flex flex-col flex-1">
                      <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-2">
                        {title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                        {description}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Campus Safety & Hygiene Cards */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-2">
                    {isTa ? '24/7 வளாகப் பாதுகாப்பு & CCTV கண்காணிப்பு' : '24/7 Campus Security & CCTV'}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isTa
                      ? 'முழு வளாகத்திலும் 24 மணி நேர சிசிடிவி கண்காணிப்பு, பயிற்சி பெற்ற பாதுகாப்புக் காவலர்கள் மற்றும் பார்வையாளர் பதிவேடு மூலம் மாணவர்கள் பாதுகாப்பாகக் கண்காணிக்கப்படுகிறார்கள்.'
                      : 'Round-the-clock security personnel, automated perimeter surveillance, fire extinguisher installations, and strictly monitored visitor logs ensure maximum student safety.'}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-6">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-2">
                    {isTa ? 'சுத்திகரிக்கப்பட்ட RO குடிநீர் வசதி' : 'RO Purified Drinking Water'}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isTa
                      ? 'நவீன தொழில்முறை RO குடிநீர் சுத்திகரிப்பு அமைப்புகள் அனைத்து தளங்களிலும் நிறுவப்பட்டு மாணவர்களுக்குத் தூய்மையான மற்றும் பாதுகாப்பான குடிநீர் உறுதி செய்யப்படுகிறது.'
                      : 'Industrial-grade multi-stage Reverse Osmosis (RO) water purification units with continuous water testing ensure pure, hygienic drinking water across all school floors.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
