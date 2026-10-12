'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { AboutSection } from '@/components/home/AboutSection';
import { StatsSection } from '@/components/home/StatsSection';
import { PrincipalMessageSection } from '@/components/home/PrincipalMessageSection';
import { AcademicsPreviewSection } from '@/components/home/AcademicsPreviewSection';
import { FacilitiesPreviewSection } from '@/components/home/FacilitiesPreviewSection';
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
  defaultFacilities,
  defaultAnnouncements,
  defaultEvents,
  defaultAchievements,
  defaultTestimonials,
} from '@/lib/defaultData';
import {
  homepageRepository,
  aboutRepository,
  academicsRepository,
  facilityRepository,
  announcementRepository,
  eventRepository,
  achievementRepository,
  testimonialRepository,
  isFirebaseConfigured,
} from '@/lib/repositories';
import type {
  HomepageContent,
  AboutContent,
  AcademicsContent,
  Facility,
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
    facilities: defaultFacilities,
    announcements: defaultAnnouncements,
    events: defaultEvents,
    achievements: defaultAchievements,
    testimonials: defaultTestimonials,
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
          announcementsList,
          eventsList,
          achievementsList,
          testimonialsList,
        ] = await Promise.all([
          homepageRepository.get().catch(() => null),
          aboutRepository.get().catch(() => null),
          academicsRepository.get().catch(() => null),
          facilityRepository.getPublished().catch(() => []),
          announcementRepository.getPublished().catch(() => []),
          eventRepository.getPublished().catch(() => []),
          achievementRepository.getPublished().catch(() => []),
          testimonialRepository.getPublished().catch(() => []),
        ]);

        const useFirebase = isFirebaseConfigured();

        // When Firebase is configured (production), use real data — empty arrays mean
        // the collection genuinely has no published records, so show empty sections.
        // When Firebase is NOT configured (local preview), fall back to default data
        // so developers can see the UI with representative content.
        setData({
          homepage: homepageContent || defaultHomepageContent,
          about: aboutContent || defaultAboutContent,
          academics: academicsContent || defaultAcademicsContent,
          facilities: useFirebase ? facilitiesList : (facilitiesList.length > 0 ? facilitiesList : defaultFacilities),
          announcements: useFirebase ? announcementsList : (announcementsList.length > 0 ? announcementsList : defaultAnnouncements),
          events: useFirebase ? eventsList : (eventsList.length > 0 ? eventsList : defaultEvents),
          achievements: useFirebase ? achievementsList : (achievementsList.length > 0 ? achievementsList : defaultAchievements),
          testimonials: useFirebase ? testimonialsList : (testimonialsList.length > 0 ? testimonialsList : defaultTestimonials),
        });
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
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
        <PrincipalMessageSection content={data.homepage.principalMessage} />
        <AcademicsPreviewSection content={data.academics} />
        {data.facilities.length > 0 && <FacilitiesPreviewSection facilities={data.facilities} />}
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
