import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Terms of Service & Code of Conduct | School Portal',
  description:
    'Terms of service, portal usage policies, and digital guidelines for S.U.M. Higher Secondary & Primary School, Royappanpatti, Theni District.',
  keywords: [
    'S.U.M. School terms of service',
    'School portal terms of use',
    'Student digital guidelines Royappanpatti',
  ],
  alternates: {
    canonical: 'https://www.sumschools.org/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Terms of Service', url: '/terms' },
        ]}
      />
      {children}
    </>
  );
}
