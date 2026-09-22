'use client';

import React from 'react';
import { Calendar, Users, GraduationCap, Trophy, BookCheck } from 'lucide-react';
import { defaultHomepageContent } from '@/lib/defaultData';
import { useLanguage } from '@/contexts/LanguageContext';

export function StatsSection({ stats = defaultHomepageContent.stats }: { stats?: typeof defaultHomepageContent.stats }) {
  const { t, isTamil } = useLanguage();

  const statItems = [
    {
      label: t('home.stats.years'),
      value: isTamil ? '60+ ஆண்டுகள்' : (stats.yearsOfExcellence || '60+ Years'),
      icon: <Calendar className="w-6 h-6 text-amber-400" />,
      sub: t('home.stats.yearsSub'),
    },
    {
      label: t('home.stats.students'),
      value: isTamil ? '3,346+ மாணவர்கள்' : (stats.totalStudents || '3,346+ Scholars'),
      icon: <Users className="w-6 h-6 text-blue-400" />,
      sub: t('home.stats.studentsSub'),
    },
    {
      label: t('home.stats.teachers'),
      value: isTamil ? '72+ ஆசிரியர்கள்' : (stats.totalTeachers || '72+ Certified Faculty'),
      icon: <GraduationCap className="w-6 h-6 text-emerald-400" />,
      sub: t('home.stats.teachersSub'),
    },
    {
      label: t('home.stats.standards'),
      value: isTamil ? '85+ வகுப்பறைகள் & ஆய்வகங்கள்' : (stats.achievements || '85+ Classrooms & Labs'),
      icon: <Trophy className="w-6 h-6 text-yellow-300" />,
      sub: t('home.stats.standardsSub'),
    },
    {
      label: t('home.stats.offerings'),
      value: isTamil ? '1 முதல் 12 வகுப்புகள்' : (stats.totalClasses || 'Classes 1 to 12'),
      icon: <BookCheck className="w-6 h-6 text-indigo-400" />,
      sub: t('home.stats.offeringsSub'),
    },
  ];

  return (
    <section className="relative w-full py-16 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="container-main relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {statItems.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-amber-400/40 transition-all duration-300 hover:-translate-y-1 text-center flex flex-col items-center group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                {item.icon}
              </div>
              <div className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white mb-1">
                {item.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-amber-300 mb-1">
                {item.label}
              </div>
              <div className="text-[11px] text-slate-400">
                {item.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
