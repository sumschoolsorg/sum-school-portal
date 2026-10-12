'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { defaultTestimonials } from '@/lib/defaultData';
import { Testimonial } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

export function TestimonialsSection({ testimonials = defaultTestimonials }: { testimonials?: Testimonial[] }) {
  const { t, getLocalized } = useLanguage();

  return (
    <section className="section-padding bg-slate-50 dark:bg-slate-900/40 relative">
      <div className="container-main">
        <SectionHeading
          subtitle={t('home.testimonials.subtitle', 'Voices of Gratitude')}
          title={t('home.testimonials.title', 'Words from Parents & Distinguished Alumni')}
          description={t(
            'home.testimonials.description',
            'Hear firsthand reflections on our educational values, nurturing mentorship, and supportive school environment.'
          )}
        />

        {testimonials.length === 0 && (
          <p role="status" className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            {t('home.testimonials.empty', 'No verified testimonials have been published yet.')}
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((test) => {
            const name = getLocalized(test, 'name');
            const role = getLocalized(test, 'role');
            const message = getLocalized(test, 'message');

            return (
              <div
                key={test.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between"
              >
                <div>
                  {/* Rating stars */}
                  <div className="flex items-center gap-1 mb-4 text-amber-400">
                    {Array.from({ length: test.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  <blockquote className="text-sm sm:text-base text-slate-700 dark:text-slate-300 italic leading-relaxed mb-6">
                    &ldquo;{message}&rdquo;
                  </blockquote>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={test.photoUrl}
                    alt={name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30"
                  />
                  <div>
                    <h4 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                      {name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {role}
                    </p>
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
