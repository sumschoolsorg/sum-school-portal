'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  CheckCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Volume2,
  X,
  Sparkles,
} from 'lucide-react';
import { announcementRepository } from '@/lib/repositories';
import { defaultAnnouncements } from '@/lib/defaultData';
import { Announcement } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

export function LiveAnnouncementBar() {
  const { language } = useLanguage();
  const isTa = language === 'ta';

  const [announcements, setAnnouncements] = useState<Announcement[]>(defaultAnnouncements);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load real published announcements from repository
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await announcementRepository.getPublished();
        if (data && data.length > 0) {
          const published = data.filter((item) => item.status === 'published');
          if (published.length > 0) {
            setAnnouncements(published);
          }
        }
      } catch (err) {
        console.warn('Error loading live announcements:', err);
      }
    };
    loadData();
  }, []);

  const triggerNext = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
      setIsAnimating(false);
    }, 200);
  }, [announcements.length]);

  const triggerPrev = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
      setIsAnimating(false);
    }, 200);
  }, [announcements.length]);

  // Auto-cycling timer
  useEffect(() => {
    if (isPaused || announcements.length <= 1) return;

    timerRef.current = setInterval(() => {
      triggerNext();
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, announcements.length, triggerNext]);

  if (isDismissed || announcements.length === 0) return null;

  const current = announcements[currentIndex] || announcements[0];
  const title = isTa && current.title_ta ? current.title_ta : current.title;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-slate-900 border-b border-blue-900/60 text-white text-xs relative z-30 transition-all duration-300 shadow-md"
      role="region"
      aria-label="Live School Announcements"
    >
      <div className="container-main py-2.5 px-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Side: Live Badge + Status Indicators */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Live Pulsing Dot & Label */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-[11px] uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <Volume2 className="w-3 h-3 text-rose-400" />
            <span>{isTa ? 'நேரடி அறிவிப்பு' : 'Live School Announcement'}</span>
          </div>

          {/* Published Badge */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold text-[10px] uppercase tracking-wide">
            <CheckCircle className="w-2.5 h-2.5" />
            <span>{isTa ? 'வெளியிடப்பட்டது' : 'Published'}</span>
          </span>

          {/* Latest Update Pill */}
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-[10px] uppercase tracking-wide">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            <span>{isTa ? 'சமீபத்திய தகவல்' : 'Latest Update'}</span>
          </span>
        </div>

        {/* Center: Live Scrolling Announcement Title */}
        <div className="flex-1 min-w-0 text-center md:text-left px-2">
          <div
            className={`transition-all duration-200 ${
              isAnimating ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
            }`}
          >
            <span className="font-semibold text-slate-100 text-xs sm:text-[13px] tracking-normal leading-snug line-clamp-1 inline">
              {title}
            </span>
            {current.category && (
              <span className="ml-2 inline-block text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
                {current.category}
              </span>
            )}
          </div>
        </div>

        {/* Right Side: View More CTA + Carousel Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/news"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shadow-sm transition group"
          >
            <span>{isTa ? 'மேலும் பார்க்க' : 'View More'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
          </Link>

          {/* Previous / Next / Pause Controls */}
          {announcements.length > 1 && (
            <div className="flex items-center gap-0.5 border-l border-slate-700 pl-2">
              <button
                onClick={triggerPrev}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title={isTa ? 'முந்தைய அறிவிப்பு' : 'Previous Announcement'}
                aria-label="Previous Announcement"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title={isPaused ? 'Play Ticker' : 'Pause Ticker'}
                aria-label={isPaused ? 'Resume live ticker' : 'Pause live ticker'}
              >
                {isPaused ? <Play className="w-3 h-3 text-amber-400" /> : <Pause className="w-3 h-3" />}
              </button>

              <button
                onClick={triggerNext}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title={isTa ? 'அடுத்த அறிவிப்பு' : 'Next Announcement'}
                aria-label="Next Announcement"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Dismiss Button */}
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded text-slate-500 hover:text-slate-300 transition ml-1 cursor-pointer"
            title="Dismiss Announcement Bar"
            aria-label="Dismiss Announcement Bar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
