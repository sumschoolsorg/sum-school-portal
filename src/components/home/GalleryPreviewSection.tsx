'use client';

import React from 'react';
import Link from 'next/link';
import { Image as ImageIcon, ArrowRight, Eye } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';

export function GalleryPreviewSection() {
  const { t, language } = useLanguage();
  const isTa = language === 'ta';

  const photos = [
    {
      title: isTa ? 'பள்ளி வளாக முதன்மை நுழைவாயில்' : 'School Campus Main Entrance',
      category: isTa ? 'வளாகக் கட்டமைப்பு' : 'Campus Architecture',
      url: '/images/hero-campus.jpg',
    },
    {
      title: isTa ? 'ஊடாடும் ஸ்மார்ட் வகுப்பறை' : 'Interactive Smart Classroom',
      category: isTa ? 'கல்வி வாழ்க்கை' : 'Academic Life',
      url: '/images/facility-smart-class.jpg',
    },
    {
      title: isTa ? 'அடல் டிங்கரிங் லேப் & ரோபாட்டிக்ஸ் மையம்' : 'Atal Tinkering Lab & Robotics Innovation',
      category: isTa ? 'STEM & ரோபாட்டிக்ஸ்' : 'STEM & Robotics',
      url: '/images/atl/atl-workshop-learning-6.jpeg',
    },
    {
      title: isTa ? 'ஆண்டு விளையாட்டு மற்றும் தடகளப் போட்டி' : 'Annual Sports & Athletics Meet',
      category: isTa ? 'விளையாட்டு' : 'Athletics',
      url: '/images/event-sports-day.jpg',
    },
    {
      title: isTa ? 'கலாச்சார விழா மற்றும் ஆண்டு விழா நிகழ்வு' : 'Cultural Festival Performance',
      category: isTa ? 'கலை & பண்பாடு' : 'Cultural Activities',
      url: '/images/event-annual-day.jpg',
    },
    {
      title: isTa ? 'மாநில ஹேக்கத்தான் 2026 — முதற்பரிசு ரூ. 10,000' : 'State Hackathon 2026 — 1st Prize ₹10,000',
      category: isTa ? 'மாணவர் சாதனை' : 'Student Achievement',
      url: '/images/atl/hackathon-2026-1.jpeg',
    },
  ];

  return (
    <section className="section-padding bg-white dark:bg-slate-950 relative">
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading
            align="left"
            subtitle={t('home.galleryPreview.subtitle', 'Visual Memories')}
            title={t('home.galleryPreview.title', 'Campus Moments & Student Life')}
            description={t(
              'home.galleryPreview.description',
              'A visual glimpse into our classrooms, laboratories, sports grounds, cultural festivals, and community celebrations.'
            )}
            className="mb-0"
          />

          <Link href="/gallery" className="shrink-0">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              {t('home.galleryPreview.viewGalleryBtn', 'Open Full Photo Gallery')}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((item, idx) => (
            <div
              key={idx}
              className="relative h-64 rounded-3xl overflow-hidden shadow-sm group border border-slate-200/60 dark:border-slate-800"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4 text-white transform group-hover:-translate-y-1 transition-transform">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                  {item.category}
                </span>
                <h4 className="text-base font-bold font-heading text-white">
                  {item.title}
                </h4>
              </div>

              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
