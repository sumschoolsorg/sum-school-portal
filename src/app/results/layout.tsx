import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Student Exam Results & Marksheet Portal | Board Verification',
  description:
    'Secure online examination result verification portal for S.U.M. Higher Secondary & Primary School, Royappanpatti. Instant roll number lookup and digital marksheet access for school assessments and board exams.',
  keywords: [
    'S.U.M. School exam results',
    'Royappanpatti school marksheet lookup',
    'Student result portal Theni',
    '10th standard results SUM school',
    '12th higher secondary results Royappanpatti',
    'Online marksheet verification Tamil Nadu',
  ],
  alternates: {
    canonical: 'https://www.sumschools.org/results',
  },
  openGraph: {
    title: 'Student Exam Results Portal | S.U.M. School Royappanpatti',
    description:
      'Check academic term examination results and verify official student performance records securely.',
    url: 'https://www.sumschools.org/results',
    siteName: 'S.U.M. Higher Secondary & Primary School',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/hero-campus.jpg',
        width: 1200,
        height: 630,
        alt: 'S.U.M. School Online Examination Result Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exam Results Portal | S.U.M. School',
    description:
      'Official student marksheet lookup and examination result verification.',
    images: ['/images/hero-campus.jpg'],
  },
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Exam Results', url: '/results' },
        ]}
      />
      {children}
    </>
  );
}
