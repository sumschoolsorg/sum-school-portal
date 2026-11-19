import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Contact Campus Office | Address, Email & Map Location',
  description:
    'Get in touch with S.U.M. Higher Secondary & Primary School, Royappanpatti, Theni District. Email: sumschool.royappanpatti@gmail.com. Office hours, campus address, and Google Maps location.',
  keywords: [
    'Contact S.U.M. School',
    'S.U.M. School Royappanpatti communication',
    'Royappanpatti school address',
    'Theni school contact office',
    'SUM school campus directions',
  ],
  alternates: {
    canonical: 'https://www.sumschools.org/contact',
  },
  openGraph: {
    title: 'Contact S.U.M. School | Royappanpatti Campus Office',
    description:
      'We welcome parents, alumni, and prospective students to reach out or visit our Royappanpatti campus.',
    url: 'https://www.sumschools.org/contact',
    siteName: 'S.U.M. Higher Secondary & Primary School',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/hero-campus.jpg',
        width: 1200,
        height: 630,
        alt: 'S.U.M. School Administrative Office in Royappanpatti',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact S.U.M. School | Campus Office',
    description:
      'Official phone, email, office hours, and campus location in Royappanpatti, Theni.',
    images: ['/images/hero-campus.jpg'],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Contact Us', url: '/contact' },
        ]}
      />
      {children}
    </>
  );
}
