import type { Metadata } from 'next';
import { BreadcrumbJsonLd, FaqJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'School Bus Routes & Transport | Cumbum Valley & Theni Logistics',
  description:
    'Comprehensive school bus routes and pickup schedules for S.U.M. School Royappanpatti. Safe, reliable transit connecting Royappanpatti, Uthamapalayam, Chinnamanur, Kombai, and Cumbum Valley.',
  keywords: [
    'S.U.M. School bus routes',
    'School transport Royappanpatti',
    'Student bus timings Uthamapalayam',
    'School transport Chinnamanur',
    'Safe school bus Cumbum Valley',
    'GPS enabled school bus Theni',
  ],
  alternates: {
    canonical: 'https://www.sumschools.org/transport',
  },
  openGraph: {
    title: 'School Transport & Bus Routes | S.U.M. School Royappanpatti',
    description:
      'Detailed route stops, pickup timings, and driver safety standards across Cumbum Valley and Theni District.',
    url: 'https://www.sumschools.org/transport',
    siteName: 'S.U.M. Higher Secondary & Primary School',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/facility-transport.jpg',
        width: 1200,
        height: 630,
        alt: 'S.U.M. School Bus Fleet and Transit Logistics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'School Transport Routes | S.U.M. School',
    description:
      'Bus routes, pickup points, and safety guidelines for students in Theni District.',
    images: ['/images/facility-transport.jpg'],
  },
};

const transportFaqs = [
  {
    question: 'What villages and towns does the S.U.M. School transport network cover?',
    answer:
      'Our school buses serve Royappanpatti, Uthamapalayam, Chinnamanur, Kombai, Cumbum Valley, and multiple rural residential neighborhoods.',
  },
  {
    question: 'Are the school buses monitored for student safety?',
    answer:
      'Yes, each school vehicle features speed-governor compliance, emergency medical kits, regular mechanical inspections, and experienced licensed drivers.',
  },
  {
    question: 'How can parents know the exact morning pickup and evening drop times?',
    answer:
      'Detailed stop schedules with morning pickup and evening drop times are published on the Transport page of our portal, complete with direct route coordinator contacts.',
  },
];

export default function TransportLayout({
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
        ]}
      />
      <FaqJsonLd items={transportFaqs} />
      {children}
    </>
  );
}
