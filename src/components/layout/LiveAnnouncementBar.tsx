'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Volume2,
  X,
} from 'lucide-react';
import { announcementRepository } from '@/lib/repositories';
import { Announcement } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

export function LiveAnnouncementBar() {
  const { language } = useLanguage();
  const isTa = language === 'ta';

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load real published announcements from repository
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const data = await announcementRepository.getPublished();
        if (!isMounted) return;
        if (data && data.length > 0) {
          const published = data.filter((item) => item.status === 'published');
          if (published.length > 0) {
            const seen = new Set();
            const unique = published.filter((item) => {
              const key = item.id || item.title;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });
            setAnnouncements(unique);
          }
        }
      } catch (err) {
        console.warn('Error loading live announcements:', err);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
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
    }, 6000);

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
      <div className="container-main py-2 px-3 sm:px-4">
        {/*
          Responsive layout:
          - lg and above (>= 1024px): Sleek single-row layout
          - Mobile & Tablet / Split-screen (< 1024px): 2 clean rows
            Top: Live Badge + Controls
            Bottom: Full-width announcement text with no squishing or vertical line breaks
        */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 lg:gap-4">
          
          {/* Top Row on < lg / Left Section on lg+ */}
          <div className="flex items-center justify-between lg:justify-start gap-2.5 shrink-0">
            {/* Live Pulsing Dot & Badge */}
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-[10px] sm:text-[11px] uppercase tracking-wider shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-400 shrink-0" />
              <span className="hidden sm:inline">{isTa ? 'நேரடி அறிவிப்பு' : 'Live School Announcement'}</span>
              <span className="sm:hidden">{isTa ? 'அறிவிப்பு' : 'Live News'}</span>
            </div>

            {/* Mobile / Tablet Controls (< lg only) */}
            <div className="flex lg:hidden items-center gap-1 sm:gap-1.5 shrink-0">
              <Link
                href="/news"
                className="inline-flex items-center gap-0.5 sm:gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] shadow-xs transition"
              >
                <span>{isTa ? 'விவரம்' : 'View'}</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </Link>
              {announcements.length > 1 && (
                <div className="hidden min-[380px]:flex items-center gap-0.5">
                  <button
                    onClick={triggerPrev}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                    aria-label="Previous Announcement"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                    aria-label={isPaused ? 'Resume live ticker' : 'Pause live ticker'}
                  >
                    {isPaused ? <Play className="w-3 h-3 text-amber-400" /> : <Pause className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={triggerNext}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                    aria-label="Next Announcement"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {announcements.length > 1 && (
                <div className="flex min-[380px]:hidden items-center">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                    aria-label={isPaused ? 'Resume live ticker' : 'Pause live ticker'}
                  >
                    {isPaused ? <Play className="w-3 h-3 text-amber-400" /> : <Pause className="w-3 h-3" />}
                  </button>
                </div>
              )}
              <button
                onClick={() => setIsDismissed(true)}
                className="p-1 rounded text-slate-500 hover:text-slate-300 transition cursor-pointer"
                title="Dismiss Announcement Bar"
                aria-label="Dismiss Announcement Bar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Center: Live Scrolling Announcement Title (Full Width on < lg, Center on lg+) */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <Link
              href="/news"
              className={`flex items-center gap-2 group transition-all duration-200 overflow-hidden ${
                isAnimating ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
              }`}
            >
              <span className="truncate font-semibold text-slate-100 group-hover:text-amber-300 text-xs sm:text-[13px] tracking-normal leading-relaxed transition-colors">
                {title}
              </span>
              {current.category && (
                <span className="shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-950/80 border border-blue-700/60 text-blue-300">
                  {current.category}
                </span>
              )}
            </Link>
          </div>

          {/* Right Side: View More CTA + Controls (Desktop lg+ only) */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
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
    </div>
  );
}
