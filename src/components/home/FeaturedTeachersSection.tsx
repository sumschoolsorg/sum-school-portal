'use client';

import React from 'react';
import Link from 'next/link';
import { Faculty } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { GraduationCap, ArrowRight, BookOpen, Award } from 'lucide-react';

export interface FeaturedTeachersSectionProps {
  teachers: Faculty[];
}

export function FeaturedTeachersSection({ teachers }: FeaturedTeachersSectionProps) {
  const { language } = useLanguage();
  const isTa = language === 'ta';

  if (!teachers || teachers.length === 0) {
    return null;
  }

  const getSectionLabel = (section?: string) => {
    if (isTa) {
      switch (section) {
        case 'primary':
          return 'தொடக்கப்பள்ளி';
        case 'secondary':
          return 'உயர்நிலைப்பள்ளி';
        case 'higher-secondary':
          return 'மேல்நிலைப்பள்ளி';
        default:
          return 'நிர்வாகம்';
      }
    }
    switch (section) {
      case 'primary':
        return 'Primary Wing';
      case 'secondary':
        return 'Secondary Wing';
      case 'higher-secondary':
        return 'Higher Secondary';
      default:
        return 'Academic Faculty';
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white via-slate-50 to-blue-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 border-t border-slate-200/80 dark:border-slate-800">
      <div className="container-main">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/80 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/80 text-blue-800 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
              <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{isTa ? 'ஆசிரியர் பெருமக்கள்' : 'Our Distinguished Educators'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
              {isTa ? 'எம் அர்ப்பணிப்புள்ள ஆசிரியர்கள்' : 'Meet Our Dedicated Teachers'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {isTa
                ? 'அறிவார்ந்த சிந்தனையையும், ஒழுக்க நெறிகளையும் மாணவர்களிடத்தில் விதைக்கும் சிறந்த வழிகாட்டிகள்.'
                : 'Passionate and certified educators inspiring curiosity, character, and academic brilliance across generations at S.U.M. School.'}
            </p>
          </div>

          <Link
            href="/faculty"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-400 transition group self-start md:self-auto shrink-0"
          >
            <span>{isTa ? 'அனைத்து ஆசிரியர்களையும் காண்க' : 'View All Faculty Members'}</span>
            <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Featured Teachers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col group"
            >
              {/* Photo Area with Top Badge */}
              <div className="relative pt-8 pb-6 px-6 bg-gradient-to-b from-blue-50/60 to-transparent dark:from-blue-950/20 dark:to-transparent flex flex-col items-center text-center">
                <div className="absolute top-3 right-3">
                  <Badge variant="primary" size="sm">
                    {getSectionLabel(teacher.section)}
                  </Badge>
                </div>

                <div className="relative">
                  <Avatar
                    src={teacher.photoUrl}
                    alt={teacher.name}
                    name={teacher.name}
                    size="xl"
                    className="shadow-lg group-hover:scale-105 transition-transform duration-300"
                    badge={
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900" title="Featured Faculty">
                        <Award className="w-3.5 h-3.5 fill-white" />
                      </div>
                    }
                  />
                </div>

                <h3 className="mt-4 text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white line-clamp-1">
                  {teacher.name}
                </h3>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5 line-clamp-1">
                  {teacher.designation}
                </p>
                {teacher.department && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {teacher.department}
                  </p>
                )}
              </div>

              {/* Information Body */}
              <div className="p-6 pt-2 flex flex-col flex-1 justify-between text-xs space-y-4">
                <div className="space-y-2.5">
                  {teacher.subject && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="font-medium truncate">{teacher.subject}</span>
                    </div>
                  )}

                  {teacher.qualification && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Qual: </span>
                      <span>{teacher.qualification}</span>
                      {teacher.experience && <span> &bull; {teacher.experience}</span>}
                    </div>
                  )}

                  {teacher.biography && (
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 text-[11px] pt-1 italic">
                      &ldquo;{teacher.biography}&rdquo;
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href={`/faculty#teacher-${teacher.id}`}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 text-center font-bold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <span>{isTa ? 'சுயவிவரம் காண்க' : 'View Profile'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
