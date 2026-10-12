'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, MonitorPlay, FlaskConical, Laptop, BookOpen, Trophy, Bus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { defaultFacilities } from '@/lib/defaultData';
import { facilityRepository } from '@/lib/repositories';
import { Facility } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

export function FacilitiesPreviewSection({ facilities: initialFacilities = defaultFacilities }: { facilities?: Facility[] }) {
  const { t, getLocalized } = useLanguage();
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const live = await facilityRepository.getPublished();
        if (live && live.length > 0) {
          setFacilities(live);
        }
      } catch {
        // Fallback to initial
      }
    };
    fetchFacilities();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'MonitorPlay':
        return <MonitorPlay className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'FlaskConical':
        return <FlaskConical className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'Laptop':
        return <Laptop className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-amber-500 dark:text-amber-400" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />;
      case 'Bus':
        return <Bus className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      default:
        return <MonitorPlay className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <section className="section-padding bg-white dark:bg-slate-950 relative">
      <div className="container-main">
        <SectionHeading
          subtitle={t('home.facilitiesPreview.subtitle', 'Campus Infrastructure')}
          title={t('home.facilitiesPreview.title', 'Modern Facilities for Well-Rounded Development')}
          description={t(
            'home.facilitiesPreview.description',
            'We provide contemporary technological resources, safe athletic fields, scientific experimentation spaces, and comfortable learning zones.'
          )}
        />

        {facilities.length === 0 && (
          <p role="status" className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            {t('home.facilitiesPreview.empty', 'Verified facility information will appear here when published.')}
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.slice(0, 6).map((fac) => {
            const facTitle = getLocalized(fac, 'title');
            const facDesc = getLocalized(fac, 'description');

            return (
              <div
                key={fac.id}
                className="bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group"
              >
                {/* Facility Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fac.imageUrl}
                    alt={facTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 p-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md">
                    {getIcon(fac.icon)}
                  </div>
                </div>

                {/* Text info */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-2">
                    {facTitle}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                    {facDesc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/facilities">
            <Button variant="outline" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              {t('home.facilitiesPreview.viewAllBtn', 'Explore All Campus Facilities')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
