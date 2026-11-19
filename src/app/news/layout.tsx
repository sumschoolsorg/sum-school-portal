import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'News & Official Announcements | School Circulars & Notices',
  description:
    'Latest school notifications, board exam timetables, academic circulars, and press coverage from S.U.M. Higher Secondary & Primary School, Royappanpatti.',
  keywords: [
    'S.U.M. School news',
    'Official school circulars Theni',
    'Board exam notifications Royappanpatti',
    'School announcements Tamil Nadu',
    'Academic calendar updates SUM School',
  ],
  alternates: {
    canonical: 'https://www.sumschools.org/news',
  },
  openGraph: {
    title: 'News & Announcements | S.U.M. School Royappanpatti',
    description:
      'Stay updated with official circulars, examination schedules, and academic bulletins from S.U.M. School.',
    url: 'https://www.sumschools.org/news',
    siteName: 'S.U.M. Higher Secondary & Primary School',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/dinamani-news-2026.jpg',
        width: 1200,
        height: 630,
        alt: 'S.U.M. School Press Releases and Announcements',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'News & Announcements | S.U.M. School',
    description:
      'Official announcements, exam circulars, and community updates.',
    images: ['/images/dinamani-news-2026.jpg'],
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'News & Circulars', url: '/news' },
        ]}
      />
      {children}
    </>
  );
}
