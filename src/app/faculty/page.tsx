'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { defaultFaculty } from '@/lib/defaultData';
import { facultyRepository } from '@/lib/repositories';
import { Faculty } from '@/types';
import { GraduationCap, Briefcase, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FacultyPage() {
  const { t, getLocalized, language } = useLanguage();
  const isTa = language === 'ta';

  const [facultyList, setFacultyList] = useState<Faculty[]>(defaultFaculty);
  const [activeSection, setActiveSection] = useState<'all' | 'primary' | 'secondary' | 'higher-secondary'>('all');

  useEffect(() => {
    let isMounted = true;
    facultyRepository.getPublished().then((items) => {
      if (isMounted && items && items.length > 0) {
        setFacultyList(items);
      }
    }).catch((err) => {
      console.warn('Failed to load faculty from repository:', err);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredFaculty = activeSection === 'all'
    ? facultyList
    : facultyList.filter((f: Faculty) => f.section === activeSection);

  const getSectionBadge = (section: string) => {
    if (isTa) {
      switch (section) {
        case 'primary':
          return 'தொடக்கப் பிரிவு';
        case 'secondary':
          return 'உயர்நிலைப் பிரிவு';
        default:
          return 'மேல்நிலைப் பிரிவு';
      }
    }
    return section === 'primary' ? 'Primary' : section === 'secondary' ? 'Secondary' : 'Higher Secondary';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Page Hero */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
          <div className="container-main relative z-10 text-center">
            <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-300 mb-4 px-3 py-1 rounded-full bg-white/10 border border-white/20">
              {t('faculty.heroTag', 'Experienced Mentors & Educators')}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight">
              {t('faculty.heroTitle', 'Faculty & Teaching Staff')}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              {t('faculty.heroDescription', 'Dedicated, passionate, and certified teachers committed to inspiring intellectual curiosity and academic brilliance.')}
            </p>
          </div>
        </section>

        {/* Section Filter Tabs */}
        <section className="section-padding bg-white dark:bg-slate-950">
          <div className="container-main">
            <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
              <button
                onClick={() => setActiveSection('all')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition cursor-pointer ${
                  activeSection === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {t('faculty.allDepartments', 'All Departments')}
              </button>
              <button
                onClick={() => setActiveSection('primary')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition cursor-pointer ${
                  activeSection === 'primary'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {t('faculty.primaryDept', 'Primary Section')}
              </button>
              <button
                onClick={() => setActiveSection('secondary')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition cursor-pointer ${
                  activeSection === 'secondary'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {t('faculty.secondaryDept', 'Secondary Section')}
              </button>
              <button
                onClick={() => setActiveSection('higher-secondary')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition cursor-pointer ${
                  activeSection === 'higher-secondary'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {t('faculty.higherSecondaryDept', 'Higher Secondary')}
              </button>
            </div>

            {/* Faculty Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredFaculty.map((staff: Faculty) => {
                const name = getLocalized(staff, 'name');
                const designation = getLocalized(staff, 'designation');
                const subject = getLocalized(staff, 'subject');
                const biography = getLocalized(staff, 'biography');

                return (
                  <div
                    key={staff.id}
                    className="bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group text-center"
                  >
                    {/* Photo */}
                    <div className="relative h-64 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={staff.photoUrl}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-3 left-3">
                        <Badge variant="primary">
                          {getSectionBadge(staff.section)}
                        </Badge>
                      </div>
                    </div>

                    {/* Body info */}
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
                          {name}
                        </h3>
                        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">
                          {designation}
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-400 text-left">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>{staff.qualification}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>{t('faculty.subjectLabel', 'Subject')}: {subject}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{t('faculty.experienceLabel', 'Experience')}: {staff.experience}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-4 line-clamp-2">
                        &ldquo;{biography}&rdquo;
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
