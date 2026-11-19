import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Live School Bus Tracking & Transit Simulation | Real-Time Route Monitor',
  description:
    'Live transit tracking and bus route simulation for S.U.M. Higher Secondary & Primary School. Monitor pickup stops, estimated arrival timings, and campus bus fleet status in real time.',
  keywords: [
    'Live school bus tracking',
    'S.U.M. School transit monitor',
    'Bus route status Royappanpatti',
    'Real-time student transport Theni',
    'School bus GPS tracking Cumbum Valley',
  ],
  alternates: {
    canonical: 'https://www.sumschools.org/transport/tracking',
  },
  openGraph: {
    title: 'Live Bus Tracking | S.U.M. Higher Secondary & Primary School',
    description:
      'Real-time school bus route simulation, pickup milestones, and fleet tracking for Royappanpatti campus routes.',
    url: 'https://www.sumschools.org/transport/tracking',
    siteName: 'S.U.M. Higher Secondary & Primary School',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/facility-transport.jpg',
        width: 1200,
        height: 630,
        alt: 'S.U.M. School Live Bus Fleet Monitor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Live Bus Tracking | S.U.M. School',
    description:
      'Real-time transit simulation, estimated stop arrivals, and school bus fleet tracking.',
    images: ['/images/facility-transport.jpg'],
  },
};

export default function BusTrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Transport', url: '/transport' },
          { name: 'Live Bus Tracking', url: '/transport/tracking' },
        ]}
      />
      {children}
    </>
  );
}
