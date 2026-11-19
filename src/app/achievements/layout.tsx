import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Achievements & Honors | Board Exam Records & Accolades',
  description:
    'Celebrate the proud accomplishments of S.U.M. School students in Royappanpatti. Consistent 10th & 12th board exam distinctions, district sports championships, and cultural awards.',
  keywords: [
    'S.U.M. School achievements',
    'Board exam top ranks Theni',
    'District sports championships Royappanpatti',
    'School awards Tamil Nadu',
    'Student accomplishments SUM School',
  ],
  alternates: {
    canonical: 'https://www.sumschools.org/achievements',
  },
  openGraph: {
    title: 'Achievements & Honors | S.U.M. School Royappanpatti',
    description:
      'Discover academic milestones, athletic trophies, and extracurricular achievements earned by S.U.M. School scholars.',
    url: 'https://www.sumschools.org/achievements',
    siteName: 'S.U.M. Higher Secondary & Primary School',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/achievement-trophy.jpg',
        width: 1200,
        height: 630,
        alt: 'S.U.M. School Student Trophies and Accolades',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Achievements & Honors | S.U.M. School Royappanpatti',
    description:
      'Board exam distinctions, sports trophies, and institutional accolades.',
    images: ['/images/achievement-trophy.jpg'],
  },
};

export default function AchievementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Achievements', url: '/achievements' },
        ]}
      />
      {children}
    </>
  );
}
