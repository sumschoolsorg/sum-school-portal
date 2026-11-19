import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Privacy Policy | Student & Parent Data Security',
  description:
    'Official Privacy Policy of S.U.M. Higher Secondary & Primary School, Royappanpatti. Explains our commitment to protecting student, parent, and alumni personal information.',
  keywords: [
    'S.U.M. School privacy policy',
    'Student data protection',
    'School web portal privacy Theni',
  ],
  alternates: {
    canonical: 'https://www.sumschools.org/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Privacy Policy', url: '/privacy' },
        ]}
      />
      {children}
    </>
  );
}
