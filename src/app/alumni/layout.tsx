import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Alumni Network & Directory | 60+ Years of Alumni Since 1963',
  description:
    'Join the official alumni community of S.U.M. Higher Secondary & Primary School, Royappanpatti. Discover distinguished alumni, register your profile, and reconnect with fellow batchmates across the globe.',
  keywords: [
    'S.U.M. School alumni',
    'Royappanpatti alumni network',
    'Savariyappa Udaiyar alumni directory',
    'SUM School Hall of Fame',
    'Old students association Theni',
    'Alumni registration portal',
  ],
  alternates: {
    canonical: 'https://www.sumschools.org/alumni',
  },
  openGraph: {
    title: 'Alumni Network & Directory | S.U.M. School Royappanpatti',
    description:
      'Connecting generations of alumni since 1963. Share memories, discover Hall of Fame honorees, and stay connected.',
    url: 'https://www.sumschools.org/alumni',
    siteName: 'S.U.M. Higher Secondary & Primary School',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/alumnus-1.jpg',
        width: 1200,
        height: 630,
        alt: 'S.U.M. School Alumni Gathering and Network',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alumni Network | S.U.M. School Royappanpatti',
    description:
      'Reuniting 60+ years of graduates from S.U.M. Higher Secondary & Primary School.',
    images: ['/images/alumnus-1.jpg'],
  },
};

export default function AlumniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Alumni', url: '/alumni' },
        ]}
      />
      {children}
    </>
  );
}
