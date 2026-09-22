'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, ArrowRight, Award, Star, MapPin, CheckCircle, GraduationCap } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { defaultAchievements } from '@/lib/defaultData';
import { achievementRepository } from '@/lib/repositories';
import { Achievement } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

export function AchievementsSection({ achievements: initialAchievements = defaultAchievements }: { achievements?: Achievement[] }) {
  const { t, getLocalized, language } = useLanguage();
  const isTa = language === 'ta';

  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await achievementRepository.getAll();
        if (data && data.length > 0) {
          const published = data.filter((item) => item.status === 'published');
          if (published.length > 0) {
            setAchievements(published);
          }
        }
      } catch (err) {
        console.warn('Error loading live achievements for home section:', err);
      }
    };
    loadData();
  }, []);

  const getCategoryLabel = (category: string) => {
    if (isTa) {
      switch (category) {
        case 'topper':
          return 'முதலிடம் (Topper)';
        case 'academic':
          return 'கல்விச் சாதனை';
        case 'sports':
          return 'விளையாட்டு';
        case 'cultural':
          return 'கலை & பண்பாடு';
        default:
          return 'சிறப்பு விருது';
      }
    }
    return category;
  };

  // Featured achievers
  const featuredAchievers = achievements.filter((a) => a.isFeatured).slice(0, 3);
  const displaySpotlight = featuredAchievers.length > 0 ? featuredAchievers : achievements.slice(0, 3);

  return (
    <section className="section-padding bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
      <div className="container-main relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading
            align="left"
            subtitle={isTa ? 'மாணவர் பெருமை & சாதனைகள்' : 'Student Honors & Hall of Fame'}
            title={isTa ? 'அரசுப் பொதுத்தேர்வு & மாநில அளவிலான சாதனைகள்' : 'Celebrating Student & School Achievements'}
            description={
              isTa
                ? 'எஸ்.யு.எம். மேல்நிலைப் பள்ளியின் அரசுப் பொதுத்தேர்வு முதலிடங்கள், 100% தேர்ச்சி, சதமடித்த மாணவர்கள் மற்றும் விளையாட்டுச் சாம்பியன்கள்.'
                : 'Recognizing our verified board exam toppers, centum scorers, district sports champions, and state awardees from Royappanpatti campus.'
            }
            className="mb-0"
          />

          <Link href="/achievements" className="shrink-0">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              {isTa ? 'அனைத்து சாதனையாளர்கள்' : 'View All Achievements'}
            </Button>
          </Link>
        </div>

        {/* Featured Student Spotlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displaySpotlight.map((ach) => {
            const title = getLocalized(ach, 'title');
            const description = getLocalized(ach, 'description');
            const studentOrTeam = getLocalized(ach, 'studentName') || getLocalized(ach, 'teamName') || ach.studentName || ach.teamName;

            return (
              <div
                key={ach.id}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group"
              >
                {/* Image & Rank Ribbon */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ach.imageUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 p-2.5 rounded-2xl bg-amber-500 text-slate-950 font-black shadow-lg flex items-center gap-1.5 text-xs">
                    <Trophy className="w-4 h-4" />
                    <span>{ach.rank || getCategoryLabel(ach.category)}</span>
                  </div>

                  {ach.percentage && (
                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md">
                      {ach.percentage}%
                    </div>
                  )}

                  {ach.academicYear && (
                    <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-lg bg-slate-900/80 text-white font-bold text-[10px] backdrop-blur-md border border-white/20">
                      {ach.academicYear}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    {studentOrTeam && (
                      <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 flex items-center justify-between">
                        <span>{studentOrTeam}</span>
                        {ach.className && (
                          <span className="text-[11px] font-semibold text-slate-400">{ach.className}</span>
                        )}
                      </div>
                    )}
                    <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition">
                      {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{ach.hometown || 'Royappanpatti'}</span>
                    </div>
                    {ach.totalMarks && (
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {ach.totalMarks} / {ach.totalMaxMarks || 600}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner with Verification Seal */}
        <div className="mt-12 p-5 rounded-2xl bg-gradient-to-r from-blue-900/10 via-indigo-900/5 to-amber-900/10 border border-blue-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {isTa ? 'அனைத்து மாணவர் மதிப்பெண்களும் சரிபார்க்கப்பட்டவை' : 'Government Examination Verified Laurels'}
              </div>
              <div className="text-xs text-slate-500">
                {isTa
                  ? 'பள்ளி நிர்வாகத்தால் முறையாக சரிபார்க்கப்பட்டு வெளியிடப்பட்ட அதிகாரப்பூர்வ சாதனைகள்.'
                  : 'Every public achievement entry is officially verified and approved by the School Examination Directorate.'}
              </div>
            </div>
          </div>

          <Link href="/achievements">
            <Button variant="primary" size="sm">
              {isTa ? 'முழு சாதனையாளர் பட்டியல்' : 'Explore Toppers Directory'}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
