import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Campus Facilities & Labs | Smart Classes, ATL & Library',
  description:
    'State-of-the-art infrastructure at S.U.M. School Royappanpatti: Atal Tinkering Lab (ATL), Physics, Chemistry & Biology laboratories, computer centre, digital smart classrooms, sports ground, and library.',
  keywords: [
    'S.U.M. School facilities',
    'Atal Tinkering Lab school Theni',
    'Computer lab school Royappanpatti',
    'Science laboratories Theni school',
    'Digital smart classrooms Tamil Nadu',
    'School sports ground and library',
  ],
  alternates: {
    canonical: 'https://www.sumschools.org/facilities',
  },
  openGraph: {
    title: 'Campus Infrastructure & Facilities | S.U.M. School Royappanpatti',
    description:
      'Explore our modern learning environment featuring science laboratories, smart classrooms, sports arena, and safe transit.',
    url: 'https://www.sumschools.org/facilities',
    siteName: 'S.U.M. Higher Secondary & Primary School',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/facility-science-lab.jpg',
        width: 1200,
        height: 630,
        alt: 'S.U.M. School Science Laboratory and Atal Tinkering Lab',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Facilities & Infrastructure | S.U.M. School Royappanpatti',
    description:
      'Smart classrooms, scientific laboratories, sports grounds, and educational resources.',
    images: ['/images/facility-science-lab.jpg'],
  },
};

export default function FacilitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Facilities', url: '/facilities' },
        ]}
      />
      {children}
    </>
  );
}
