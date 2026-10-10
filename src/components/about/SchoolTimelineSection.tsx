'use client';

import React, { useState, useEffect } from 'react';
import { timelineRepository } from '@/lib/repositories';
import { defaultTimelineEntries } from '@/lib/defaultData';
import { TimelineEntry } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Award, Sparkles, Building, Landmark, GraduationCap } from 'lucide-react';

export function SchoolTimelineSection() {
  const { getLocalized, language } = useLanguage();
  const isTa = language === 'ta';

  const [timeline, setTimeline] = useState<TimelineEntry[]>(defaultTimelineEntries);

  useEffect(() => {
    const loadTimeline = async () => {
      try {
        const data = await timelineRepository.getPublished();
        if (data && data.length > 0) {
          const published = data.filter((item) => item.status === 'published');
          setTimeline(published.length > 0 ? published : defaultTimelineEntries);
        }
      } catch (err) {
        console.warn('Error loading timeline entries:', err);
      }
    };
    loadTimeline();
  }, []);

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'founding':
        return <Landmark className="w-5 h-5 text-amber-500" />;
      case 'jubilee':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'infrastructure':
        return <Building className="w-5 h-5 text-blue-500" />;
      case 'academics':
        return <GraduationCap className="w-5 h-5 text-indigo-500" />;
      default:
        return <Award className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <section className="section-padding bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-900/60 relative overflow-hidden">
      <div className="container-main relative z-10">
        <SectionHeading
          subtitle={isTa ? 'வரலாற்றுப் பயணம்' : '60+ Years of Excellence'}
          title={isTa ? 'எஸ்.யு.எம். பள்ளி வரலாற்று மைல்கற்கள்' : 'Our Historic Journey (1963 – 2026)'}
          description={
            isTa
              ? '1963-ல் தொடங்கப்பட்ட எளிய கல்விப் பணி முதல் இன்றைய நவீன டிஜிட்டல் வளாகம் வரையிலான வளர்ச்சிப் பாதை.'
              : 'From humble rural beginnings in 1963 to a premier higher secondary institution with smart classes and state board laurels.'
          }
        />

        {/* Timeline Line & Milestones Container */}
        <div className="relative max-w-5xl mx-auto mt-12">
          {/* Vertical central spine line on desktop, left line on mobile */}
          <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-blue-600 via-indigo-500 to-amber-500 -translate-x-1/2 rounded-full opacity-30" />

          <div className="space-y-12">
            {timeline.map((entry, idx) => {
              const isEven = idx % 2 === 0;
              const title = getLocalized(entry, 'title');
              const desc = getLocalized(entry, 'description');

              return (
                <div
                  key={entry.id || idx}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? 'md:flex-row-reverse' : ''
                  } group`}
                >
                  {/* Spine Center Node Marker */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border-4 border-blue-600 dark:border-blue-500 shadow-xl flex items-center justify-center z-10 group-hover:scale-110 group-hover:border-amber-500 transition-all duration-300">
                    {getCategoryIcon(entry.category)}
                  </div>

                  {/* Spacer for other half on desktop */}
                  <div className="hidden md:block w-1/2" />

                  {/* Content Card */}
                  <div className={`ml-16 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                      {/* Year pill & category */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs sm:text-sm tracking-wider shadow-sm">
                          {entry.year}
                        </span>
                        {entry.category && (
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            {entry.category}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition">
                        {title}
                      </h3>

                      {/* Photo if available */}
                      {entry.imageUrl && (
                        <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={entry.imageUrl}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
