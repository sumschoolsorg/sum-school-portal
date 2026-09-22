import React from 'react';
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

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-1">
        <HeroSection content={defaultHomepageContent} />
        <StatsSection stats={defaultHomepageContent.stats} />
        <AboutSection content={defaultAboutContent} />
        <PrincipalMessageSection content={defaultHomepageContent.principalMessage} />
        <AcademicsPreviewSection content={defaultAcademicsContent} />
        <FacilitiesPreviewSection facilities={defaultFacilities} />
        <AnnouncementsSection announcements={defaultAnnouncements} />
        <EventsSection events={defaultEvents} />
        <AchievementsSection achievements={defaultAchievements} />
        <GalleryPreviewSection />
        <TestimonialsSection testimonials={defaultTestimonials} />
        <AdmissionCtaSection content={defaultHomepageContent.admissionCta} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
