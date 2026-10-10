'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Sparkles,
  Award,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  School,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { defaultHeroBanners, defaultHomepageContent } from '@/lib/defaultData';
import { heroBannerRepository } from '@/lib/repositories';
import { HeroBanner } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

export function HeroSection(props?: {
  content?: typeof defaultHomepageContent;
}) {
  void props;
  const [banners, setBanners] = useState<HeroBanner[]>(defaultHeroBanners);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  const { t, getLocalized, language } = useLanguage();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const list = await heroBannerRepository.getPublished();
        if (list && list.length > 0) {
          list.sort((a, b) => (a.order || 0) - (b.order || 0));
          setBanners(list);
        }
      } catch {
        // use defaultHeroBanners
      }
    };
    fetchBanners();
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Auto-play interval
  useEffect(() => {
    if (isPaused || prefersReducedMotion || banners.length <= 1) return;
    const interval = setInterval(handleNext, 6000);
    return () => clearInterval(interval);
  }, [isPaused, prefersReducedMotion, banners.length, handleNext]);

  const currentBanner = banners[currentIndex] || defaultHeroBanners[0];

  const bannerTitle = getLocalized(currentBanner, 'title', 'title_en') || t('home.hero.defaultTitle');
  const bannerSubtitle = getLocalized(currentBanner, 'subtitle', 'subtitle_en') || t('home.hero.defaultEyebrow');
  const bannerDescription = getLocalized(currentBanner, 'description', 'description_en') || t('home.hero.defaultDescription');
  const bannerCtaText = getLocalized(currentBanner, 'ctaText', 'ctaText_en') || t('home.hero.applyBtn');
  const bannerSecondaryCtaText = currentBanner.secondaryCtaText
    ? getLocalized(currentBanner, 'secondaryCtaText', 'secondaryCtaText_en')
    : null;

  const getAnimationClass = (style?: string) => {
    if (prefersReducedMotion) return 'transition-none';
    switch (style) {
      case 'slide':
        return 'animate-slide-in-right';
      case 'zoom':
        return 'animate-scale-in';
      case 'float':
        return 'animate-float';
      case 'fade':
      default:
        return 'animate-fade-in';
    }
  };

  return (
    <section
      className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950 text-white"
      aria-label="Hero carousel"
    >
      {/* Background Banner Image with Dynamic Transition */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          key={currentBanner.imageUrl}
          src={currentBanner.imageUrl}
          alt={bannerTitle}
          fill
          priority
          className={`object-cover object-center opacity-30 ${getAnimationClass(currentBanner.animationStyle)} duration-700`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 via-transparent to-slate-950/80" />
      </div>

      {/* Decorative ambient lighting */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Content Container */}
      <div className="container-main relative z-10 py-20 lg:py-28 flex flex-col items-center text-center">
        {/* Official Dual Logos Header Banner */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg group hover:bg-white/15 transition">
            <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/school-crest.png"
                alt="S.U.M. School Crest"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-white text-xs sm:text-sm font-bold tracking-wide">
              {t('about.officialCrest')}
            </span>
          </div>

          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/40 shadow-lg group hover:border-amber-400/60 transition">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/diamond-jubilee-logo.png"
              alt="Diamond Jubilee 60 Years (1963–2023)"
              className="h-8 w-auto object-contain drop-shadow-sm"
            />
            <div className="flex flex-col text-left">
              <span className="text-amber-300 text-[10px] font-extrabold uppercase tracking-wider leading-none">
                {t('common.diamondJubilee')} (1963–2023)
              </span>
              <span className="text-white text-[11px] font-medium leading-tight">
                {t('common.jubileeYears')}
              </span>
            </div>
          </div>
        </div>

        {/* Subtitle / Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide mb-6 shadow-glow">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{bannerSubtitle}</span>
        </div>

        {/* Dynamic Title */}
        <h1
          key={`title-${currentIndex}-${language}`}
          className={`max-w-4xl font-heading font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] text-white ${getAnimationClass(
            currentBanner.animationStyle
          )}`}
        >
          {bannerTitle}
        </h1>

        {/* Dynamic Description */}
        <p
          key={`desc-${currentIndex}-${language}`}
          className="mt-6 text-base sm:text-lg md:text-xl text-slate-300/90 max-w-2xl leading-relaxed font-sans font-normal"
        >
          {bannerDescription}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href={currentBanner.ctaLink || '/admissions'} className="w-full sm:w-auto">
            <Button
              variant="accent"
              size="lg"
              className="w-full sm:w-auto shadow-xl shadow-amber-500/20 font-bold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {bannerCtaText}
            </Button>
          </Link>

          {bannerSecondaryCtaText && (
            <Link href={currentBanner.secondaryCtaLink || '/about'} className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:border-white/60 font-semibold"
              >
                {bannerSecondaryCtaText}
              </Button>
            </Link>
          )}

          <Link href="/contact" className="w-full sm:w-auto">
            <Button
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto text-slate-300 hover:text-white hover:bg-white/10"
            >
              {t('common.contactUs')}
            </Button>
          </Link>
        </div>

        {/* Quick Verified Badges Bar */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full max-w-4xl pt-8 border-t border-white/10 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">{t('home.aboutPreview.eyebrow')}</div>
              <div className="text-sm font-bold text-white">1963</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/30 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">{t('nav.academics')}</div>
              <div className="text-sm font-bold text-white">1 – 12 (SSLC &amp; +2)</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">UDISE</div>
              <div className="text-sm font-bold text-white">33250800109</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/30 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">{t('common.affiliation')}</div>
              <div className="text-sm font-bold text-white">100% Pass</div>
            </div>
          </div>
        </div>

        {/* Carousel Navigation & Controls */}
        {banners.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-sm border border-white/20 cursor-pointer"
              aria-label={t('home.hero.previousSlide')}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? 'w-8 bg-amber-400'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={t('home.hero.slideNumber').replace('{current}', String(idx + 1)).replace('{total}', String(banners.length))}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-sm border border-white/20 cursor-pointer"
              aria-label={t('home.hero.nextSlide')}
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Pause / Play Toggle */}
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition backdrop-blur-sm border border-white/20 ml-2 cursor-pointer"
              title={isPaused ? t('home.hero.playAutoPlay') : t('home.hero.pauseAutoPlay')}
              aria-label={isPaused ? t('home.hero.playAutoPlay') : t('home.hero.pauseAutoPlay')}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
