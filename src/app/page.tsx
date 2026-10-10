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
} from '@/lib/repositories';

export default function HomePage() {
  const [data, setData] = useState({
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
          homepageRepository.get(),
          aboutRepository.get(),
          academicsRepository.get(),
          facilityRepository.getPublished(),
          announcementRepository.getPublished(),
          eventRepository.getPublished(),
          achievementRepository.getPublished(),
          testimonialRepository.getPublished(),
        ]);

        setData({
          homepage: homepageContent || defaultHomepageContent,
          about: aboutContent || defaultAboutContent,
          academics: academicsContent || defaultAcademicsContent,
          facilities: facilitiesList && facilitiesList.length > 0 ? facilitiesList : defaultFacilities,
          announcements: announcementsList && announcementsList.length > 0 ? announcementsList : defaultAnnouncements,
          events: eventsList && eventsList.length > 0 ? eventsList : defaultEvents,
          achievements: achievementsList && achievementsList.length > 0 ? achievementsList : defaultAchievements,
          testimonials: testimonialsList && testimonialsList.length > 0 ? testimonialsList : defaultTestimonials,
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
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </main>
        <Footer />
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
        <FacilitiesPreviewSection facilities={data.facilities} />
        <AnnouncementsSection announcements={data.announcements} />
        <EventsSection events={data.events} />
        <AchievementsSection achievements={data.achievements} />
        <GalleryPreviewSection />
        <TestimonialsSection testimonials={data.testimonials} />
        <AdmissionCtaSection content={data.homepage.admissionCta} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
