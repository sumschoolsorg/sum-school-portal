import type { Metadata } from 'next';
import { BreadcrumbJsonLd, FaqJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Admissions 2025–2026 | Online Registration & Guidelines',
  description:
    'Apply for admission at S.U.M. Higher Secondary & Primary School, Royappanpatti. Simple online enquiry, eligibility criteria, required certificates, and application tracking for Classes 1–12.',
  keywords: [
    'S.U.M. School admissions 2025-2026',
    'School admission Royappanpatti',
    '11th standard admission Theni',
    'Primary school admission Royappanpatti',
    'State Board school application Theni',
    'Admissions enquiry SUM school',
  ],
  alternates: {
    canonical: 'https://www.sumschools.org/admissions',
  },
  openGraph: {
    title: 'Admissions 2025–2026 | S.U.M. School Royappanpatti',
    description:
      'Enroll your child at S.U.M. Higher Secondary & Primary School. Online application, stream selection, and admissions helpdesk.',
    url: 'https://www.sumschools.org/admissions',
    siteName: 'S.U.M. Higher Secondary & Primary School',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/hero-campus.jpg',
        width: 1200,
        height: 630,
        alt: 'S.U.M. School Admissions Desk & Campus',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Admissions 2025–2026 | S.U.M. School Royappanpatti',
    description:
      'Online school admission enquiry and application tracking for Classes 1 to 12 in Theni District.',
    images: ['/images/hero-campus.jpg'],
  },
};

const admissionFaqs = [
  {
    question: 'How do I apply for admission to S.U.M. Higher Secondary & Primary School?',
    answer:
      'Parents and guardians can submit an online admission enquiry through the website admission portal or visit the school administrative office in Royappanpatti during working hours.',
  },
  {
    question: 'What groups are available for Higher Secondary (Class 11 & 12)?',
    answer:
      'We offer Tamil Nadu State Board approved streams including Bio-Maths, Computer Science with Mathematics, Pure Science, and Commerce with Accountancy & Computer Applications.',
  },
  {
    question: 'What documents are required during school admission?',
    answer:
      'Essential documents include the student birth certificate, Transfer Certificate (TC) from the previous school, Aadhaar card photocopy, Community Certificate, and recent passport-size photographs.',
  },
  {
    question: 'Is bus transportation provided for students from nearby villages?',
    answer:
      'Yes, our school operates dedicated bus routes serving Royappanpatti, Uthamapalayam, Chinnamanur, Kombai, Cumbum Valley, and surrounding localities.',
  },
];

export default function AdmissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Admissions', url: '/admissions' },
        ]}
      />
      <FaqJsonLd items={admissionFaqs} />
      {children}
    </>
  );
}
