'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Bell,
  Pause,
  Play,
  ChevronRight,
} from 'lucide-react';
import { announcementRepository } from '@/lib/repositories';
import { defaultAnnouncements } from '@/lib/defaultData';
import { Announcement } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

export function BottomAnnouncementTicker() {
  const { language } = useLanguage();
  const isTa = language === 'ta';

  const [announcements, setAnnouncements] = useState<Announcement[]>(defaultAnnouncements);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await announcementRepository.getPublished();
        if (data && data.length > 0) {
          const published = data.filter((item) => {
            if (item.status && item.status !== 'published') return false;
            // Expiry date check if exists
            if (item.expiryDate) {
              const exp = new Date(item.expiryDate).getTime();
              if (exp < Date.now()) return false;
            }
            return true;
          });
          if (published.length > 0) {
            setAnnouncements(published);
          }
        }
      } catch (err) {
        console.warn('Error loading bottom announcements:', err);
      }
    };
    loadData();
  }, []);

  // Duplicate list to achieve continuous seamless infinite scroll marquee
  const tickerItems = useMemo(() => {
    if (announcements.length === 0) return [];
    // Repeat at least 3 times so it loops endlessly
    return [...announcements, ...announcements, ...announcements];
  }, [announcements]);

  if (announcements.length === 0) return null;

  return (
    <aside
      aria-label={isTa ? 'பள்ளி சமீபத்திய அறிவிப்புகள்' : 'School Latest Announcements'}
      className="print:hidden w-full relative z-20 border-t border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
    >
      <div className="container-main py-2.5 px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
          {/* Clean White Title Badge */}
          <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="font-heading font-black text-xs uppercase tracking-wider whitespace-nowrap text-blue-900 dark:text-blue-100 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{isTa ? 'சமீபத்திய அறிவிப்புகள்' : 'Latest Announcements'}</span>
            </span>
          </div>

          {/* Continuous Horizontal Scrolling Ticker Track */}
          <div
            className="flex-1 overflow-hidden relative group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Fade edge masks */}
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />

            <div
              className={`flex items-center gap-8 whitespace-nowrap will-change-transform ${
                isPaused ? '[animation-play-state:paused]' : ''
              }`}
              style={{
                display: 'inline-flex',
                animation: 'sum-marquee 35s linear infinite',
              }}
            >
              {tickerItems.map((item, idx) => {
                const title = isTa && item.title_ta ? item.title_ta : item.title;
                const link = item.link || '/news';
                const isUrgent = item.priority === 'urgent' || item.priority === 'high';

                return (
                  <Link
                    key={`${item.id || idx}-${idx}`}
                    href={link}
                    className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium group/item cursor-pointer"
                  >
                    {isUrgent && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 uppercase tracking-wider">
                        {isTa ? 'முக்கியம்' : 'Urgent'}
                      </span>
                    )}
                    <span className="group-hover/item:underline font-semibold">{title}</span>
                    <span className="text-slate-400 text-[11px]">•</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.publishDate || 'Latest'}
                    </span>
                    <ChevronRight className="w-3 h-3 text-slate-400 group-hover/item:text-blue-600 group-hover/item:translate-x-0.5 transition shrink-0" />
                    <span className="text-slate-300 dark:text-slate-700 mx-2">|</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Controls: Pause/Play toggle */}
          <div className="shrink-0 hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title={isPaused ? 'Play continuous scroll' : 'Pause scrolling'}
              aria-label={isPaused ? 'Resume scrolling' : 'Pause scrolling'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-blue-600" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes sum-marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .will-change-transform {
            animation: none !important;
          }
        }
      `}</style>
    </aside>
  );
}
