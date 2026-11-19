import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Campus Photo Gallery | School Life, Labs & Celebrations',
  description:
    'Visual journey through life at S.U.M. Higher Secondary & Primary School in Royappanpatti. Explore photo galleries of classroom learning, science exhibitions, sports tournaments, and festivals.',
  keywords: [
    'S.U.M. School photo gallery',
    'Campus pictures Royappanpatti',
    'Science exhibition photos Theni',
    'Sports meet gallery Tamil Nadu schools',
    'School celebrations images',
  ],
  alternates: {
    canonical: 'https://www.sumschools.org/gallery',
  },
  openGraph: {
    title: 'Photo Gallery | S.U.M. School Royappanpatti',
    description:
      'Explore vibrant moments of learning, exploration, and celebration captured across our school campus.',
    url: 'https://www.sumschools.org/gallery',
    siteName: 'S.U.M. Higher Secondary & Primary School',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/hero-campus.jpg',
        width: 1200,
        height: 630,
        alt: 'S.U.M. School Campus Photo Showcase',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Campus Gallery | S.U.M. School Royappanpatti',
    description:
      'Snapshots of student life, scientific inquiry, and annual celebrations.',
    images: ['/images/hero-campus.jpg'],
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Photo Gallery', url: '/gallery' },
        ]}
      />
      {children}
    </>
  );
}
