import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'About Us | History, Vision & Founders Since 1963',
  description:
    'Discover the 60+ year history of Savariyappa Udaiyar Memorial Higher Secondary & Primary School in Royappanpatti, Theni District. Learn about our founding vision, leadership, and educational ethos.',
  keywords: [
    'About S.U.M. School',
    'Savariyappa Udaiyar Memorial history',
    'Royappanpatti school history',
    'Founders of SUM School',
    'Diamond Jubilee school Theni',
    'Government aided school Theni district',
  ],
  alternates: {
    canonical: 'https://www.sumschools.org/about',
  },
  openGraph: {
    title: 'About S.U.M. Higher Secondary & Primary School | Royappanpatti',
    description:
      'Explore the heritage, vision, and leadership of S.U.M. School, providing quality education in Cumbum Valley since 1963.',
    url: 'https://www.sumschools.org/about',
    siteName: 'S.U.M. Higher Secondary & Primary School',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/about-school.jpg',
        width: 1200,
        height: 630,
        alt: 'S.U.M. School Campus & Historical Building',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About S.U.M. School | History & Ethos',
    description:
      '60+ years of academic excellence and value-based education in Royappanpatti, Theni.',
    images: ['/images/about-school.jpg'],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'About Us', url: '/about' },
        ]}
      />
      {children}
    </>
  );
}
