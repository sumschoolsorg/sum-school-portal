'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { AboutSection } from '@/components/home/AboutSection';
import { StatsSection } from '@/components/home/StatsSection';
import { CorrespondentMessageSection } from '@/components/home/CorrespondentMessageSection';
import { PrincipalMessageSection } from '@/components/home/PrincipalMessageSection';
import { AcademicsPreviewSection } from '@/components/home/AcademicsPreviewSection';
import { FacilitiesPreviewSection } from '@/components/home/FacilitiesPreviewSection';
import { FeaturedTeachersSection } from '@/components/home/FeaturedTeachersSection';
import { AnnouncementsSection } from '@/components/home/AnnouncementsSection';
import { EventsSection } from '@/components/home/EventsSection';
import { AchievementsSection } from '@/components/home/AchievementsSection';
import { GalleryPreviewSection } from '@/components/home/GalleryPreviewSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { AdmissionCtaSection } from '@/components/home/AdmissionCtaSection';
import { ContactSection } from '@/components/home/ContactSection';
import {
  defaultHomepageContent,
  defaultAboutContent,
  defaultAcademicsContent,
} from '@/lib/defaultData';
import {
  homepageRepository,
  aboutRepository,
  academicsRepository,
  facilityRepository,
  facultyRepository,
  announcementRepository,
  eventRepository,
  achievementRepository,
  testimonialRepository,
} from '@/lib/repositories';
import type {
  HomepageContent,
  AboutContent,
  AcademicsContent,
  Facility,
  Faculty,
  Announcement,
  SchoolEvent,
  Achievement,
  Testimonial,
} from '@/types';

interface HomePageData {
  homepage: HomepageContent;
  about: AboutContent;
  academics: AcademicsContent;
  facilities: Facility[];
  teachers: Faculty[];
  announcements: Announcement[];
  events: SchoolEvent[];
  achievements: Achievement[];
  testimonials: Testimonial[];
}

export default function HomePage() {
  // Use default data only as initial rendering state; real data replaces it once loaded
  const [data, setData] = useState<HomePageData>({
    homepage: defaultHomepageContent,
    about: defaultAboutContent,
    academics: defaultAcademicsContent,
    facilities: [],
    teachers: [],
    announcements: [],
    events: [],
    achievements: [],
    testimonials: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          homepageContent,
          aboutContent,
          academicsContent,
          facilitiesList,
          facultyList,
          announcementsList,
          eventsList,
          achievementsList,
          testimonialsList,
        ] = await Promise.all([
          homepageRepository.get().catch(() => null),
          aboutRepository.get().catch(() => null),
          academicsRepository.get().catch(() => null),
          facilityRepository.getPublished().catch(() => []),
          facultyRepository.getPublished().catch(() => []),
          announcementRepository.getPublished().catch(() => []),
          eventRepository.getPublished().catch(() => []),
          achievementRepository.getPublished().catch(() => []),
          testimonialRepository.getPublished().catch(() => []),
        ]);

        // Filter featured, published, and active teachers
        const featuredTeachers = (facultyList || []).filter(
          (f: Faculty) => f.isFeatured && f.status === 'published' && f.isActive !== false
        );

        // Populate data with real cloud data
        setData({
          homepage: homepageContent || defaultHomepageContent,
          about: aboutContent || defaultAboutContent,
          academics: academicsContent || defaultAcademicsContent,
          facilities: facilitiesList || [],
          teachers: featuredTeachers,
          announcements: announcementsList || [],
          events: eventsList || [],
          achievements: achievementsList || [],
          testimonials: testimonialsList || [],
        });
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    // Real-time synchronization for homepage updates
    const unsubHomepage = homepageRepository.subscribe((latestHomepage) => {
      if (latestHomepage) {
        setData((prev) => ({
          ...prev,
          homepage: latestHomepage,
        }));
      }
    });

    return () => unsubHomepage();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main
          id="main-content"
          className="flex-1 flex flex-col items-center justify-center gap-4 px-4 text-center"
          aria-busy="true"
        >
          <div
            className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-primary-600"
            aria-hidden="true"
          />
          <p role="status" aria-live="polite" className="text-sm font-medium text-slate-600">
            Loading school website content…
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-1">
        <HeroSection content={data.homepage} />
        <StatsSection stats={data.homepage.stats} />
        <AboutSection content={data.about} />
        <CorrespondentMessageSection content={data.homepage.correspondentMessage} />
        <PrincipalMessageSection content={data.homepage.principalMessage} />
        <AcademicsPreviewSection content={data.academics} />
        {data.facilities.length > 0 && <FacilitiesPreviewSection facilities={data.facilities} />}
        {data.teachers.length > 0 && <FeaturedTeachersSection teachers={data.teachers} />}
        {data.announcements.length > 0 && <AnnouncementsSection announcements={data.announcements} />}
        {data.events.length > 0 && <EventsSection events={data.events} />}
        {data.achievements.length > 0 && <AchievementsSection achievements={data.achievements} />}
        <GalleryPreviewSection />
        {data.testimonials.length > 0 && <TestimonialsSection testimonials={data.testimonials} />}
        <AdmissionCtaSection content={data.homepage.admissionCta} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
