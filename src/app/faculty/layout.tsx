import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Faculty & Academic Leadership | Dedicated Teachers & Mentors',
  description:
    'Meet the passionate teaching faculty and administrative leadership of S.U.M. Higher Secondary & Primary School, Royappanpatti. Guided by Headmaster S. Thomas M.Sc., M.Ed. with 70+ experienced educators.',
  keywords: [
    'S.U.M. School faculty',
    'Headmaster S. Thomas Royappanpatti',
    'Experienced teachers Theni district',
    'Higher secondary subject experts Tamil Nadu',
    'School educators Royappanpatti',
  ],
  alternates: {
    canonical: 'https://www.sumschools.org/faculty',
  },
  openGraph: {
    title: 'Faculty & Mentors | S.U.M. School Royappanpatti',
    description:
      'Learn about our qualified educators and institutional mentors guiding generations of students to academic success.',
    url: 'https://www.sumschools.org/faculty',
    siteName: 'S.U.M. Higher Secondary & Primary School',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/principal-photo.jpg',
        width: 1200,
        height: 630,
        alt: 'S.U.M. School Headmaster and Faculty',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Faculty & Mentors | S.U.M. School Royappanpatti',
    description:
      'Dedicated educators shaping young minds in Royappanpatti, Theni District.',
    images: ['/images/principal-photo.jpg'],
  },
};

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Faculty', url: '/faculty' },
        ]}
      />
      {children}
    </>
  );
}
