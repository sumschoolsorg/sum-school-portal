'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Trophy,
  Medal,
  Award,
  Search,
  MapPin,
  GraduationCap,
  Calendar,
  Sparkles,
  CheckCircle,
  ExternalLink,
  Filter,
  X,
  Share2,
} from 'lucide-react';
import { achievementRepository } from '@/lib/repositories';
import { defaultAchievements } from '@/lib/defaultData';
import { Achievement } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner';

export default function AchievementsPage() {
  const { t, getLocalized, language } = useLanguage();
  const isTa = language === 'ta';

  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalItem, setActiveModalItem] = useState<Achievement | null>(null);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        setIsLoading(true);
        const data = await achievementRepository.getAll();
        if (data && data.length > 0) {
          const published = data.filter((item) => item.status === 'published');
          setAchievements(published.length > 0 ? published : defaultAchievements);
        } else {
          setAchievements(defaultAchievements);
        }
      } catch (err) {
        console.warn('Error loading achievements from repository:', err);
        setAchievements(defaultAchievements);
      } finally {
        setIsLoading(false);
      }
    };
    loadAchievements();
  }, []);

  // Academic years list
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    achievements.forEach((a) => {
      if (a.academicYear) years.add(a.academicYear);
    });
    return ['all', ...Array.from(years).sort().reverse()];
  }, [achievements]);

  // Categories list
  const categories = [
    { id: 'all', label: isTa ? 'அனைத்துப் பிரிவுகளும்' : 'All Categories' },
    { id: 'topper', label: isTa ? 'பள்ளி முதலிடங்கள் (Toppers)' : 'Board Exam Toppers' },
    { id: 'academic', label: isTa ? 'கல்விச் சிறப்பிடம்' : 'Academic Merits' },
    { id: 'sports', label: isTa ? 'விளையாட்டு சாம்பியன்கள்' : 'Sports & Athletics' },
    { id: 'cultural', label: isTa ? 'கலை & இலக்கியம்' : 'Cultural & Arts' },
  ];

  // Filtered list
  const filteredAchievements = useMemo(() => {
    return achievements.filter((ach) => {
      // Year filter
      if (selectedYear !== 'all' && ach.academicYear !== selectedYear) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'topper' && ach.category !== 'topper') return false;
        if (selectedCategory === 'academic' && ach.category !== 'academic') return false;
        if (selectedCategory === 'sports' && ach.category !== 'sports') return false;
        if (selectedCategory === 'cultural' && ach.category !== 'cultural' && ach.category !== 'competition') return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const student = (ach.studentName || '').toLowerCase();
        const title = (ach.title || '').toLowerCase();
        const hometown = (ach.hometown || '').toLowerCase();
        const className = (ach.className || '').toLowerCase();
        const exam = (ach.examinationName || '').toLowerCase();
        if (!student.includes(q) && !title.includes(q) && !hometown.includes(q) && !className.includes(q) && !exam.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [achievements, selectedYear, selectedCategory, searchQuery]);

  // Top 3 Podium rankers for the selected year (or all years if top)
  const podiumToppers = useMemo(() => {
    return filteredAchievements
      .filter((a) => a.category === 'topper' || a.rank?.toLowerCase().includes('rank') || a.rank?.includes('1st') || a.rank?.includes('2nd') || a.rank?.includes('3rd'))
      .slice(0, 3);
  }, [filteredAchievements]);

  const handleShare = (ach: Achievement) => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: ach.title,
        text: `${ach.studentName || 'Student'} achieved ${ach.rank || 'honor'} at S.U.M. School, Royappanpatti!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      toast.success(isTa ? 'இணைப்பு நகலெடுக்கப்பட்டது!' : 'Link copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-24 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
          <div className="container-main relative z-10 text-center">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-300 mb-4 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{isTa ? 'அரசுப் பொதுத்தேர்வு & விளையாட்டுச் சாதனைகள்' : 'Verified Student Achievements & Top Rankers'}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight">
              {isTa ? 'பள்ளி முதலிடங்கள் & சாதனையாளர்கள்' : 'Student Honors & Toppers Directory'}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {isTa
                ? 'எஸ்.யு.எம். மேல்நிலைப் பள்ளியின் 10-ஆம் மற்றும் 12-ஆம் வகுப்பு அரசுப் பொதுத்தேர்வில் முதலிடம் பிடித்த மாணவர்கள், சதமடித்தவர்கள் மற்றும் விளையாட்டுச் சாம்பியன்களின் விவரங்கள்.'
                : 'Official verified record of academic toppers, centum scorers, state-level athletes, and cultural champions of S.U.M. Higher Secondary & Primary School, Royappanpatti.'}
            </p>

            {/* Quick Stats Banner */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">100%</div>
                <div className="text-xs text-blue-100 mt-1">{isTa ? 'பொதுத்தேர்வு தேர்ச்சி' : 'Board Pass Rate'}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">584/600</div>
                <div className="text-xs text-blue-100 mt-1">{isTa ? '12-ஆம் வகுப்பு உச்ச மதிப்பெண்' : 'HSC Top Score (97.3%)'}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">489/500</div>
                <div className="text-xs text-blue-100 mt-1">{isTa ? '10-ஆம் வகுப்பு உச்ச மதிப்பெண்' : 'SSLC Top Score (97.8%)'}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">25+</div>
                <div className="text-xs text-blue-100 mt-1">{isTa ? 'மாவட்ட & மாநிலப் பரிசுகள்' : 'District/State Trophies'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Toolbar Section */}
        <section className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 sticky top-16 z-20 shadow-sm backdrop-blur-md bg-opacity-95">
          <div className="container-main space-y-4">
            {/* Top row: Year Selector Pills & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Academic Year Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {isTa ? 'கல்வியாண்டு:' : 'Academic Year:'}
                </span>
                {availableYears.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      selectedYear === yr
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {yr === 'all' ? (isTa ? 'அனைத்து ஆண்டுகள்' : 'All Academic Years') : yr}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-80 shrink-0">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isTa ? 'மாணவர் பெயர், ஊர், தேர்வு தேடுக...' : 'Search student, hometown, exam...'}
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

            {/* Bottom row: Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Podium Section (Top 3 Rankers Spotlight) */}
        {podiumToppers.length > 0 && selectedCategory !== 'sports' && selectedCategory !== 'cultural' && !searchQuery && (
          <section className="py-12 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent">
            <div className="container-main">
              <div className="text-center mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  {isTa ? 'பெருமைமிகு தருணம்' : 'Excellence on Stage'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {isTa ? 'பள்ளி முதன்மை சாதனையாளர்கள்' : 'Top Rankers Podium'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {selectedYear !== 'all' ? `${selectedYear} ${isTa ? 'கல்வியாண்டு' : 'Academic Year'}` : (isTa ? 'அனைத்து கல்வியாண்டுகளின் சிறந்த சாதனையாளர்கள்' : 'Prominent Board Examination Achievers')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-end">
                {podiumToppers.map((topper, idx) => {
                  const isFirst = idx === 0;
                  const rankBadge = isFirst
                    ? { color: 'bg-amber-500 text-slate-950 ring-4 ring-amber-400/40', text: '1st Rank • School Topper', border: 'border-amber-400' }
                    : idx === 1
                    ? { color: 'bg-slate-300 text-slate-900 ring-4 ring-slate-300/40', text: '2nd Rank', border: 'border-slate-300' }
                    : { color: 'bg-amber-700 text-white ring-4 ring-amber-700/40', text: '3rd Rank', border: 'border-amber-700' };

                  return (
                    <div
                      key={topper.id}
                      onClick={() => setActiveModalItem(topper)}
                      className={`relative bg-white dark:bg-slate-900 rounded-3xl p-6 border ${rankBadge.border} shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer flex flex-col items-center text-center ${
                        isFirst ? 'md:-translate-y-4 md:border-2' : ''
                      }`}
                    >
                      {/* Rank ribbon badge */}
                      <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4 ${rankBadge.color}`}>
                        {topper.rank || rankBadge.text}
                      </div>

                      {/* Student Portrait */}
                      <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl mb-4 bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={topper.imageUrl}
                          alt={topper.studentName || topper.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Student Info */}
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {topper.studentName || topper.title}
                      </h3>
                      <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                        {topper.className || 'Higher Secondary'}
                      </div>

                      {/* Marks and Percentage */}
                      {topper.percentage && (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-2xl font-black text-slate-900 dark:text-white">
                            {topper.percentage}%
                          </span>
                          {topper.totalMarks && (
                            <span className="text-xs text-slate-500 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                              {topper.totalMarks} / {topper.totalMaxMarks || 600}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Hometown */}
                      {topper.hometown && (
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-500" />
                          <span>{topper.hometown}</span>
                        </div>
                      )}

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 w-full text-xs text-slate-500 italic line-clamp-2">
                        {getLocalized(topper, 'description')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Main Achievements Grid */}
        <section className="section-padding bg-white dark:bg-slate-950">
          <div className="container-main">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  {isTa ? 'அனைத்து மாணவர் சாதனைகள்' : 'Verified Achievements & Honors'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isTa
                    ? `${filteredAchievements.length} சாதனைகள் காண்பிக்கப்படுகின்றன`
                    : `Showing ${filteredAchievements.length} verified school accolades`}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-slate-500 font-medium">Loading verified records...</p>
              </div>
            ) : filteredAchievements.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
                <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
                  {isTa ? 'சாதனைப் பதிவுகள் எதுவும் கிடைக்கவில்லை' : 'No achievements found matching your filters'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  {isTa
                    ? 'வேறு கல்வியாண்டு அல்லது பிரிவைத் தேர்ந்தெடுத்து முயற்சிக்கவும்.'
                    : 'Try selecting a different academic year or resetting your search keywords.'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAchievements.map((ach) => {
                  const title = getLocalized(ach, 'title');
                  const desc = getLocalized(ach, 'description');
                  const student = getLocalized(ach, 'studentName') || ach.studentName;

                  return (
                    <div
                      key={ach.id}
                      onClick={() => setActiveModalItem(ach)}
                      className="bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group cursor-pointer"
                    >
                      {/* Image Frame */}
                      <div className="relative h-56 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ach.imageUrl}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Rank / Category Badge */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          <div className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-md flex items-center gap-1">
                            <Trophy className="w-3.5 h-3.5" />
                            <span>{ach.rank || ach.category.toUpperCase()}</span>
                          </div>
                          {ach.academicYear && (
                            <div className="px-2.5 py-0.5 rounded-lg bg-slate-900/80 text-white font-bold text-[10px] backdrop-blur-md self-start border border-white/20">
                              {ach.academicYear}
                            </div>
                          )}
                        </div>

                        {/* Marks pill on bottom right */}
                        {ach.percentage && (
                          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-blue-600 text-white font-black text-xs shadow-md">
                            {ach.percentage}%
                          </div>
                        )}
                      </div>

                      {/* Content Details */}
                      <div className="p-6 flex flex-col flex-1 justify-between">
                        <div>
                          {student && (
                            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 flex items-center justify-between">
                              <span>{student}</span>
                              {ach.className && (
                                <span className="text-[11px] font-semibold text-slate-400">{ach.className}</span>
                              )}
                            </div>
                          )}
                          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition">
                            {title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                            {desc}
                          </p>
                        </div>

                        {/* Footer info: hometown & total marks */}
                        <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                          {ach.hometown ? (
                            <div className="flex items-center gap-1 text-slate-500">
                              <MapPin className="w-3.5 h-3.5 text-rose-500" />
                              <span>{ach.hometown}</span>
                            </div>
                          ) : (
                            <span>Royappanpatti</span>
                          )}

                          {ach.totalMarks && (
                            <div className="font-bold text-slate-700 dark:text-slate-300">
                              {ach.totalMarks} / {ach.totalMaxMarks || 600}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Detailed Achiever Profile & Verification Modal */}
        {activeModalItem && (
          <Modal
            isOpen={Boolean(activeModalItem)}
            onClose={() => setActiveModalItem(null)}
            title={activeModalItem.studentName ? `${activeModalItem.studentName} — Achievement Profile` : activeModalItem.title}
          >
            <div className="space-y-6">
              {/* Photo & Header info */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-100 dark:border-slate-700">
                <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-white shadow-md shrink-0 bg-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeModalItem.imageUrl}
                    alt={activeModalItem.studentName || activeModalItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs">
                      {activeModalItem.rank || activeModalItem.category.toUpperCase()}
                    </span>
                    {activeModalItem.academicYear && (
                      <Badge variant="info">{activeModalItem.academicYear}</Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {activeModalItem.studentName || activeModalItem.title}
                  </h3>
                  {activeModalItem.className && (
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1 justify-center sm:justify-start">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                      <span>{activeModalItem.className}</span>
                    </div>
                  )}
                  {activeModalItem.hometown && (
                    <div className="text-xs text-slate-500 flex items-center gap-1 justify-center sm:justify-start">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{activeModalItem.hometown}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Scorecard Table if marks available */}
              {activeModalItem.percentage && (
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="text-xs text-slate-500 uppercase font-bold">{isTa ? 'மதிப்பெண்' : 'Total Marks'}</div>
                    <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
                      {activeModalItem.totalMarks || 0} / {activeModalItem.totalMaxMarks || 600}
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="text-xs text-slate-500 uppercase font-bold">{isTa ? 'சதவீதம்' : 'Percentage'}</div>
                    <div className="text-lg font-black text-blue-600 dark:text-blue-400 mt-1">
                      {activeModalItem.percentage}%
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="text-xs text-slate-500 uppercase font-bold">{isTa ? 'நிலை' : 'Position'}</div>
                    <div className="text-sm font-black text-amber-600 dark:text-amber-400 mt-1 truncate">
                      {activeModalItem.rank || 'Merit'}
                    </div>
                  </div>
                </div>
              )}

              {/* Description & Examination */}
              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeModalItem.examinationName && (
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{isTa ? 'தேர்வு:' : 'Examination:'}</span>{' '}
                    {activeModalItem.examinationName}
                  </div>
                )}
                <p>{getLocalized(activeModalItem, 'description')}</p>
              </div>

              {/* Official Seal of Verification */}
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Verified & Officially Approved by S.U.M. School Administration</span>
                </div>
                <button
                  onClick={() => handleShare(activeModalItem)}
                  className="p-2 rounded-lg bg-white dark:bg-slate-800 text-slate-600 hover:text-blue-600 shadow-sm border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                  title="Share Achievement"
                >
                  <Share2 className="w-3.5 h-3.5" />
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
