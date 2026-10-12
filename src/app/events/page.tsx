'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { eventRepository, isFirebaseConfigured } from '@/lib/repositories';
import { defaultEvents } from '@/lib/defaultData';
import { SchoolEvent } from '@/types';
import {
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  Search,
  X,
  Share2,
  CalendarCheck,
  History,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';

export default function EventsPage() {
  const { getLocalized, language } = useLanguage();
  const isTa = language === 'ta';

  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Tabs: upcoming vs archive
  const [activeTab, setActiveTab] = useState<'upcoming' | 'archive'>('upcoming');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalEvent, setActiveModalEvent] = useState<SchoolEvent | null>(null);

  const [currentTime] = useState(() => Date.now());

  useEffect(() => {
    const useFirebase = isFirebaseConfigured();
    const loadEvents = async (showLoading = false) => {
      try {
        if (showLoading) setIsLoading(true);
        const data = await eventRepository.getPublished();
        if (data && data.length > 0) {
          const published = data.filter((item) => item.status === 'published');
          setEvents(published.length > 0 ? published : (useFirebase ? [] : defaultEvents));
        } else {
          setEvents(useFirebase ? [] : defaultEvents);
        }
      } catch (err) {
        console.warn('Error loading events:', err);
        setEvents(useFirebase ? [] : defaultEvents);
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents(false);
  }, []);

  const formatEventDate = (date: unknown) => {
    try {
      const rawDate = date as { toDate?: () => Date } | Date | string | number | undefined;
      const d = rawDate && typeof rawDate === 'object' && 'toDate' in rawDate && typeof rawDate.toDate === 'function'
        ? rawDate.toDate()
        : (date instanceof Date ? date : new Date(date as string | number));
      if (isNaN(d.getTime())) return { day: '15', month: 'OCT', full: 'Event Date', timestamp: 0 };
      return {
        day: d.getDate().toString().padStart(2, '0'),
        month: d.toLocaleString(language === 'ta' ? 'ta-IN' : 'en-US', { month: 'short' }).toUpperCase(),
        full: d.toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        timestamp: d.getTime(),
      };
    } catch {
      return { day: '15', month: 'OCT', full: 'Event Date', timestamp: 0 };
    }
  };

  // Partition upcoming vs past archive
  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = currentTime;
    const up: SchoolEvent[] = [];
    const past: SchoolEvent[] = [];

    const getTime = (raw: unknown): number => {
      if (!raw) return 0;
      const r = raw as { toDate?: () => Date } | Date | string | number;
      if (typeof (r as { toDate?: () => Date })?.toDate === 'function') return (r as { toDate: () => Date }).toDate().getTime();
      if (r instanceof Date) return r.getTime();
      return new Date(r as string | number).getTime() || 0;
    };

    events.forEach((ev) => {
      const time = getTime(ev.date);
      if (time >= now - 24 * 60 * 60 * 1000) {
        up.push(ev);
      } else {
        past.push(ev);
      }
    });

    return {
      upcomingEvents: up.sort((a, b) => getTime(a.date) - getTime(b.date)),
      pastEvents: past.sort((a, b) => getTime(b.date) - getTime(a.date)),
    };
  }, [events, currentTime]);

  // Academic years
  const availableYears = useMemo(() => {
    const yrs = new Set<string>();
    events.forEach((e) => {
      if (e.academicYear) yrs.add(e.academicYear);
    });
    ['2025–2026', '2024–2025', '2023–2024'].forEach((y) => yrs.add(y));
    return ['all', ...Array.from(yrs).sort().reverse()];
  }, [events]);

  const categories = [
    { id: 'all', label: isTa ? 'அனைத்து நிகழ்வுகளும்' : 'All Types' },
    { id: 'cultural', label: isTa ? 'கலாச்சார & ஆண்டு விழா' : 'Cultural & Annual Day' },
    { id: 'academic', label: isTa ? 'அறிவியல் & கல்வி' : 'Science & Academics' },
    { id: 'sports', label: isTa ? 'விளையாட்டுப் போட்டிகள்' : 'Sports Meets' },
    { id: 'celebration', label: isTa ? 'சுதந்திர தினம் & பண்டிகைகள்' : 'National Days & Festivals' },
  ];

  // Active list based on tab
  const currentList = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  // Filtered by year, category, search
  const filteredEvents = useMemo(() => {
    return currentList.filter((ev) => {
      if (selectedYear !== 'all' && ev.academicYear && ev.academicYear !== selectedYear) {
        return false;
      }
      if (selectedCategory !== 'all' && ev.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = (ev.title || '').toLowerCase();
        const desc = (ev.description || '').toLowerCase();
        const guest = (ev.chiefGuest || '').toLowerCase();
        const venue = (ev.venue || '').toLowerCase();
        if (!title.includes(q) && !desc.includes(q) && !guest.includes(q) && !venue.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [currentList, selectedYear, selectedCategory, searchQuery]);

  const handleShare = (ev: SchoolEvent) => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: ev.title,
        text: `School event: ${ev.title} on ${ev.venue || 'S.U.M. School'}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      toast.success(isTa ? 'இணைப்பு நகலெடுக்கப்பட்டது!' : 'Event link copied!');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="relative py-20 lg:py-24 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
          <div className="container-main relative z-10 text-center">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-300 mb-4 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <CalendarCheck className="w-4 h-4 text-amber-400" />
              <span>{isTa ? 'நிகழ்வுகள் நாட்காட்டி & காப்பகம்' : 'School Events & Historical Archive'}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight">
              {isTa ? 'பள்ளி விழாக்கள் & முக்கிய நிகழ்வுகள்' : 'School Events & Activities'}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {isTa
                ? 'பள்ளி ஆண்டு விழாக்கள், விளையாட்டுப் போட்டிகள், சுதந்திர தின விழா, அறிவியல் கண்காட்சிகள் மற்றும் வரலாற்று நிகழ்வுகளின் காலவரிசை காப்பகம்.'
                : 'Stay informed on upcoming campus celebrations, parent forums, athletic championships, and explore past school milestones archived year-by-year.'}
            </p>
          </div>
        </section>

        {/* Navigation Toolbar: Upcoming vs Past Tabs, Years, Search */}
        <section className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 sticky top-16 z-20 shadow-sm backdrop-blur-md bg-opacity-95">
          <div className="container-main space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Upcoming vs Archive Tabs */}
              <div className="inline-flex p-1 rounded-2xl bg-slate-200 dark:bg-slate-800 self-start">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                    activeTab === 'upcoming'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isTa ? 'வரவிருக்கும் நிகழ்வுகள்' : 'Upcoming Events'}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                    {upcomingEvents.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('archive')}
                  className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                    activeTab === 'archive'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <History className="w-4 h-4" />
                  <span>{isTa ? 'கடந்த கால நிகழ்வுகள் காப்பகம்' : 'Past Events Archive'}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                    {pastEvents.length}
                  </span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80 shrink-0">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isTa ? 'நிகழ்வு, விருந்தினர், அரங்கம் தேடுக...' : 'Search event, chief guest, venue...'}
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Academic Year & Category Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-200/60 dark:border-slate-800">
              {/* Year pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
                  {isTa ? 'கல்வியாண்டு:' : 'Academic Year:'}
                </span>
                {availableYears.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-3.5 py-1 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      selectedYear === yr
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {yr === 'all' ? (isTa ? 'அனைத்து ஆண்டுகள்' : 'All Years') : yr}
                  </button>
                ))}
              </div>

              {/* Categories */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Events List */}
        <section className="section-padding bg-white dark:bg-slate-950">
          <div className="container-main">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                  {activeTab === 'upcoming' ? (
                    <>
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span>{isTa ? 'வரவிருக்கும் பள்ளி நிகழ்வுகள்' : 'Upcoming School Calendar'}</span>
                    </>
                  ) : (
                    <>
                      <History className="w-5 h-5 text-indigo-600" />
                      <span>{isTa ? 'நிகழ்வுகள் காப்பகம் (Past Events)' : 'Past Events Historical Archive'}</span>
                    </>
                  )}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isTa
                    ? `${filteredEvents.length} நிகழ்வுகள் பட்டியலிடப்பட்டுள்ளன`
                    : `Showing ${filteredEvents.length} events in this section`}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-slate-500 font-medium">Loading events calendar...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
                  {isTa ? 'நிகழ்வுகள் எதுவும் காணப்படவில்லை' : 'No events found matching your filter'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  {activeTab === 'upcoming'
                    ? (isTa ? 'தற்போது திட்டமிடப்பட்ட புதிய நிகழ்வுகள் எதுவும் இல்லை. கடந்த கால காப்பகத்தைப் பார்க்கவும்.' : 'There are currently no scheduled upcoming events in this category. Explore the past events archive.')
                    : (isTa ? 'வேறு கல்வியாண்டைத் தேர்ந்தெடுத்து முயற்சிக்கவும்.' : 'Try selecting another academic year or category.')}
                </p>
                <button
                  onClick={() => {
                    setSelectedYear('all');
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
                >
                  {isTa ? 'அனைத்தையும் காண்பி' : 'Reset All Filters'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredEvents.map((ev) => {
                  const dateObj = formatEventDate(ev.date);
                  const title = getLocalized(ev, 'title');
                  const desc = getLocalized(ev, 'description');
                  const venue = getLocalized(ev, 'venue');

                  return (
                    <div
                      key={ev.id}
                      onClick={() => setActiveModalEvent(ev)}
                      className="bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row group cursor-pointer"
                    >
                      {/* Event Image Frame with Date Badge */}
                      <div className="relative md:w-80 h-56 md:h-auto overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ev.imageUrl}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 bg-blue-600 text-white rounded-2xl p-3 text-center min-w-[64px] shadow-lg">
                          <div className="text-2xl font-black font-heading leading-none">
                            {dateObj.day}
                          </div>
                          <div className="text-xs font-bold tracking-wider uppercase mt-0.5">
                            {dateObj.month}
                          </div>
                        </div>

                        {ev.academicYear && (
                          <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-lg bg-slate-900/80 text-white font-bold text-[10px] backdrop-blur-md border border-white/20">
                            {ev.academicYear}
                          </div>
                        )}
                      </div>

                      {/* Event Details */}
                      <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                              {ev.category}
                            </span>
                            {ev.isFeatured && (
                              <Badge variant="accent">FEATURED EVENT</Badge>
                            )}
                          </div>

                          <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 transition">
                            {title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                            {desc}
                          </p>

                          {/* Chief Guest Spotlight */}
                          {ev.chiefGuest && (
                            <div className="mt-4 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                              <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
                              <span><strong>{isTa ? 'சிறப்பு விருந்தினர்:' : 'Chief Guest:'}</strong> {ev.chiefGuest}</span>
                            </div>
                          )}
                        </div>

                        {/* Meta: Time and Venue */}
                        <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex flex-wrap items-center gap-4">
                            {ev.time && (
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-amber-500" />
                                <span>{ev.time}</span>
                              </div>
                            )}
                            {venue && (
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                <span>{venue}</span>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(ev);
                            }}
                            className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:text-blue-600 border border-slate-200 dark:border-slate-700 transition"
                            title="Share Event"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Event Detail Modal */}
        {activeModalEvent && (
          <Modal
            isOpen={Boolean(activeModalEvent)}
            onClose={() => setActiveModalEvent(null)}
            title={getLocalized(activeModalEvent, 'title')}
          >
            <div className="space-y-4">
              <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeModalEvent.imageUrl}
                  alt={activeModalEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md">
                  {activeModalEvent.academicYear || 'Academic Event'}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="accent">{activeModalEvent.category.toUpperCase()}</Badge>
                  {activeModalEvent.month && (
                    <Badge variant="neutral">{activeModalEvent.month}</Badge>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {getLocalized(activeModalEvent, 'title')}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="font-bold text-slate-500">Date & Time:</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {formatEventDate(activeModalEvent.date).full} • {activeModalEvent.time || 'Day Event'}
                  </div>
                </div>
                <div>
                  <span className="font-bold text-slate-500">Venue:</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {activeModalEvent.venue || 'S.U.M. Main Stage, Royappanpatti'}
                  </div>
                </div>
              </div>

              {activeModalEvent.chiefGuest && (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-950 dark:text-blue-200">
                  <strong>Chief Guest / Presided By:</strong> {activeModalEvent.chiefGuest}
                </div>
              )}

              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
                <p>{getLocalized(activeModalEvent, 'content') || getLocalized(activeModalEvent, 'description')}</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => handleShare(activeModalEvent)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Event Details</span>
                </button>
              </div>
            </div>
          </Modal>
        )}
      </main>
      <Footer />
    </div>
  );
}
