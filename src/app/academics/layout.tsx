import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Academic Streams & Curriculum | Classes 1 to 12 | State Board',
  description:
    'Comprehensive academic streams at S.U.M. School Royappanpatti: Primary (Classes 1–5), High School (6–10), and Higher Secondary (11–12 Bio-Maths, CS, Commerce) in Tamil & English mediums.',
  keywords: [
    'S.U.M. School academics',
    'Tamil Nadu State Board school Theni',
    'Higher secondary groups Royappanpatti',
    '11th standard bio maths computer science',
    'Commerce stream schools Theni',
    'Primary education Royappanpatti',
    'High school syllabus Tamil Nadu',
  ],
  alternates: {
    canonical: 'https://www.sumschools.org/academics',
  },
  openGraph: {
    title: 'Academic Programs & Curriculum | S.U.M. School Royappanpatti',
    description:
      'Explore classes 1 to 12 academic streams, curriculum highlights, and co-curricular learning at S.U.M. School.',
    url: 'https://www.sumschools.org/academics',
    siteName: 'S.U.M. Higher Secondary & Primary School',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/higher-secondary.jpg',
        width: 1200,
        height: 630,
        alt: 'S.U.M. School Academic Classrooms and Labs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Academic Streams | S.U.M. School Royappanpatti',
    description:
      'Classes 1 to 12 curriculum, science & arts streams, state board syllabus in Royappanpatti.',
    images: ['/images/higher-secondary.jpg'],
  },
};

export default function AcademicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Academics', url: '/academics' },
        ]}
      />
      {children}
    </>
  );
}
