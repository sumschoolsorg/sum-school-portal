'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Eye, Image as ImageIcon } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { galleryRepository } from '@/lib/repositories';
import { GalleryImage } from '@/types';

export function GalleryPreviewSection() {
  const { t, getLocalized } = useLanguage();
  const [photos, setPhotos] = useState<GalleryImage[]>([]);

  useEffect(() => {
    let isMounted = true;
    galleryRepository
      .getPublished()
      .then((items) => {
        if (isMounted) {
          setPhotos((items || []).slice(0, 6));
        }
      })
      .catch(() => {
        if (isMounted) setPhotos([]);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (photos.length === 0) {
    return null;
  }

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
          {photos.map((item, idx) => {
            const title = getLocalized(item, 'title', 'title_en') || item.title;
            return (
              <Link
                key={item.id || idx}
                href="/gallery"
                className="relative h-64 rounded-3xl overflow-hidden shadow-sm group border border-slate-200/60 dark:border-slate-800 block"
              >
                {item.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.imageUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-slate-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                <div className="absolute bottom-4 left-4 right-4 text-white transform group-hover:-translate-y-1 transition-transform">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                    {item.albumName || item.eventCategory || 'Gallery'}
                  </span>
                  <h4 className="text-base font-bold font-heading text-white line-clamp-1">
                    {title}
                  </h4>
                </div>

                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
