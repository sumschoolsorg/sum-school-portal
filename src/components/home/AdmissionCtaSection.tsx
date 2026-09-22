'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, PhoneCall, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { defaultHomepageContent, defaultSchoolSettings } from '@/lib/defaultData';
import { useLanguage } from '@/contexts/LanguageContext';

export function AdmissionCtaSection({
  content = defaultHomepageContent.admissionCta,
}: {
  content?: typeof defaultHomepageContent.admissionCta;
}) {
  const { t, getLocalized, language } = useLanguage();
  const isTa = language === 'ta';

  const title = getLocalized(content, 'title') || t('home.admissionCta.title', content.title);
  const description = getLocalized(content, 'description') || t('home.admissionCta.description', content.description);
  const buttonText = getLocalized(content, 'buttonText') || t('home.admissionCta.enquiryBtn', content.buttonText);

  return (
    <section className="section-padding bg-white dark:bg-slate-950 relative">
      <div className="container-main">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-8 sm:p-14 lg:p-20 overflow-hidden shadow-2xl">
          {/* Decorative background blurs */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isTa ? 'சேர்க்கை ஆரம்பம்: LKG முதல் 11-ஆம் வகுப்பு வரை' : 'Admissions Open for LKG – 11th Standard'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
              {title}
            </h2>

            <p className="mt-6 text-base sm:text-lg text-blue-100/90 leading-relaxed max-w-2xl">
              {description}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link href={content.buttonLink} className="w-full sm:w-auto">
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full sm:w-auto shadow-xl shadow-amber-500/30"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {buttonText}
                </Button>
              </Link>

              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10"
                  leftIcon={<PhoneCall className="w-4 h-4" />}
                >
                  {isTa ? 'பள்ளி அலுவலகத்தை அழைக்க' : 'Call School Office'}
                </Button>
              </Link>
            </div>

            <div className="mt-8 text-xs text-blue-200/80">
              {isTa ? 'உடனடித் தகவல்களுக்குப் பள்ளி அலுவலகத்தைத் தொடர்பு கொள்ளவும்: ' : 'Need immediate assistance? Contact office at '}
              <span className="font-semibold text-white">{defaultSchoolSettings.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
