import React from 'react';

/**
 * School and LocalBusiness Schema.org JSON-LD
 * Represents S.U.M. Higher Secondary & Primary School in Google Knowledge Graph & Local Pack.
 */
export function SchoolJsonLd() {
  const schoolSchema = {
    '@context': 'https://schema.org',
    '@type': ['School', 'EducationalOrganization', 'LocalBusiness'],
    '@id': 'https://www.sumschools.org/#school',
    name: 'Savariyappa Udaiyar Memorial Higher Secondary & Primary School',
    alternateName: [
      'S.U.M. School',
      'S.U.M. Higher Secondary & Primary School',
      'S.U.M. Hr. Sec. & Primary School, Royappanpatti',
      'சவரியப்ப உடையார் நினைவு மேல்நிலை மற்றும் தொடக்கப் பள்ளி',
    ],
    url: 'https://www.sumschools.org',
    logo: 'https://www.sumschools.org/images/school-crest.png',
    image: [
      'https://www.sumschools.org/images/hero-campus.jpg',
      'https://www.sumschools.org/images/school-crest.png',
      'https://www.sumschools.org/images/diamond-jubilee-logo.png',
    ],
    description:
      'Savariyappa Udaiyar Memorial (S.U.M.) Higher Secondary & Primary School is a premier, government-aided co-educational school established in 1963 in Royappanpatti, Theni District, Tamil Nadu. Affiliated with Tamil Nadu State Board (DGE) with UDISE 33250800109.',
    foundingDate: '1963',
    telephone: '+91-4554-253224',
    email: 'sumschool.royappanpatti@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '105/W-2, Savarimuthu Lourdu Nagar / East Street',
      addressLocality: 'Royappanpatti',
      addressRegion: 'Tamil Nadu',
      postalCode: '625526',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 9.772386,
      longitude: 77.3412086,
    },
    hasMap: 'https://maps.app.goo.gl/Q1VbvDa2VjnwkAQh9',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'https://schema.org/Monday',
          'https://schema.org/Tuesday',
          'https://schema.org/Wednesday',
          'https://schema.org/Thursday',
          'https://schema.org/Friday',
        ],
        opens: '09:00',
        closes: '16:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['https://schema.org/Saturday'],
        opens: '09:00',
        closes: '13:00',
      },
    ],
    priceRange: 'Free / Govt. Aided',
    alumni: [
      {
        '@type': 'Organization',
        name: 'S.U.M. School Alumni Association',
      },
    ],
    sameAs: [
      'https://facebook.com',
      'https://instagram.com',
      'https://youtube.com',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.sumschools.org/#website',
    url: 'https://www.sumschools.org',
    name: 'S.U.M. Higher Secondary & Primary School',
    publisher: {
      '@id': 'https://www.sumschools.org/#school',
    },
    inLanguage: ['en-IN', 'ta-IN'],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * BreadcrumbList Schema.org JSON-LD
 * Enables breadcrumb rich snippets in Google SERPs.
 */
export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `https://www.sumschools.org${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * FAQPage Schema.org JSON-LD
 * Enables rich FAQ dropdowns directly in Google Search results.
 */
export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
