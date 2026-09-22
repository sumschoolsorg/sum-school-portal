'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { defaultEvents } from '@/lib/defaultData';
import { eventRepository } from '@/lib/repositories';
import { SchoolEvent } from '@/types';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

export function EventsSection({ events: initialEvents = defaultEvents }: { events?: SchoolEvent[] }) {
  const { t, getLocalized, language } = useLanguage();
  const [events, setEvents] = useState<SchoolEvent[]>(initialEvents);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const live = await eventRepository.getPublished();
        if (live && live.length > 0) {
          setEvents(live);
        }
      } catch {
        // Fallback to initial
      }
    };
    fetchEvents();
  }, []);

  const formatEventDate = (date: unknown) => {
    try {
      const rawDate = date as { toDate?: () => Date } | Date | string | number | undefined;
      const d = rawDate && typeof rawDate === 'object' && 'toDate' in rawDate && typeof rawDate.toDate === 'function'
        ? rawDate.toDate()
        : (date instanceof Date ? date : new Date(date as string | number));
      if (isNaN(d.getTime())) return { day: '15', month: 'OCT', full: 'Upcoming Event' };
      return {
        day: format(d, 'dd'),
        month: d.toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', { month: 'short' }),
        full: d.toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };
    } catch {
      return { day: '15', month: 'OCT', full: 'Upcoming Event' };
    }
  };

  return (
    <section className="section-padding bg-white dark:bg-slate-950 relative">
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading
            align="left"
            subtitle={t('home.events.subtitle', 'Campus Life & Celebrations')}
            title={t('home.events.title', 'Upcoming School Events')}
            description={t(
              'home.events.description',
              'Participate in our vibrant academic, athletic, and cultural calendar throughout the school year.'
            )}
            className="mb-0"
          />

          <Link href="/events" className="shrink-0">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              {t('home.events.viewCalendarBtn', 'Full Event Calendar')}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {events.slice(0, 2).map((ev) => {
            const dateObj = formatEventDate(ev.date);
            const title = getLocalized(ev, 'title');
            const description = getLocalized(ev, 'description');
            const venue = getLocalized(ev, 'venue');

            return (
              <div
                key={ev.id}
                className="bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row group"
              >
                {/* Event Image & Date Badge */}
                <div className="relative sm:w-52 h-48 sm:h-auto overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ev.imageUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white rounded-2xl p-2.5 text-center min-w-[56px] shadow-lg">
                    <div className="text-xl font-extrabold font-heading leading-none">
                      {dateObj.day}
                    </div>
                    <div className="text-[10px] font-bold tracking-wider uppercase">
                      {dateObj.month}
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-3">
                      {title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{ev.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span>{venue}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
