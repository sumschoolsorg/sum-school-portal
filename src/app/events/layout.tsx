import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'School Events & Academic Calendar | Celebrations & Sports',
  description:
    'Upcoming events and celebrations at S.U.M. Higher Secondary & Primary School, Royappanpatti. Annual Day, Sports Day, Kalai Thiruvizha, Science Expos, and Diamond Jubilee celebrations.',
  keywords: [
    'S.U.M. School events',
    'Annual Day Royappanpatti',
    'Sports Day Theni schools',
    'Kalai Thiruvizha Tamil Nadu schools',
    'Diamond jubilee celebrations SUM School',
    'School event calendar Theni',
  ],
  alternates: {
    canonical: 'https://www.sumschools.org/events',
  },
  openGraph: {
    title: 'School Events & Calendar | S.U.M. School Royappanpatti',
    description:
      'Join us for academic, cultural, and sporting events celebrating student achievement and school heritage.',
    url: 'https://www.sumschools.org/events',
    siteName: 'S.U.M. Higher Secondary & Primary School',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/event-annual-day.jpg',
        width: 1200,
        height: 630,
        alt: 'S.U.M. School Annual Day and Cultural Fest',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'School Events & Calendar | S.U.M. School Royappanpatti',
    description:
      'Explore upcoming cultural fests, athletic tournaments, and academic milestones.',
    images: ['/images/event-annual-day.jpg'],
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Events', url: '/events' },
        ]}
      />
      {children}
    </>
  );
}
