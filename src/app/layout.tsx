import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { SchoolJsonLd } from "@/components/seo/JsonLd";

export const viewport: Viewport = {
  themeColor: "#1e3a8a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sumschools.org"),
  title: {
    template: "%s | S.U.M. Higher Secondary & Primary School",
    default:
      "S.U.M. Higher Secondary & Primary School | Royappanpatti, Theni",
  },
  description:
    "Official portal of Savariyappa Udaiyar Memorial (S.U.M.) Higher Secondary & Primary School, Royappanpatti, Theni District, Tamil Nadu (UDISE: 33250800109). Providing quality State Board education, smart classrooms, science labs, and holistic character development since 1963.",
  keywords: [
    "S.U.M. School Royappanpatti",
    "Savariyappa Udaiyar Memorial School",
    "SUM Higher Secondary School Theni",
    "SUM Primary School Royappanpatti",
    "Best Schools in Royappanpatti",
    "Top Schools in Theni District",
    "Government Aided School Tamil Nadu",
    "Tamil Nadu State Board Schools",
    "School Admissions Royappanpatti",
    "Higher Secondary Admissions Theni",
    "Diamond Jubilee School 1963",
    "Cumbum Valley Schools",
  ],
  authors: [{ name: "S.U.M. School Administration", url: "https://www.sumschools.org" }],
  creator: "S.U.M. Higher Secondary & Primary School",
  publisher: "Savariyappa Udaiyar Memorial Educational Trust",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "https://www.sumschools.org",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "S.U.M. Higher Secondary & Primary School | Royappanpatti",
    description:
      "Empowering students through academic excellence, moral integrity, modern laboratories, and holistic values since 1963 in Royappanpatti, Theni.",
    url: "https://www.sumschools.org",
    siteName: "S.U.M. Higher Secondary & Primary School",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "S.U.M. Higher Secondary & Primary School Royappanpatti Campus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "S.U.M. Higher Secondary & Primary School | Royappanpatti",
    description:
      "Official portal of Savariyappa Udaiyar Memorial Higher Secondary & Primary School, Royappanpatti, Theni District. Academic excellence since 1963.",
    images: ["/images/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=4", sizes: "any" },
      { url: "/favicon-32x32.png?v=4", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png?v=4", type: "image/png", sizes: "16x16" },
      { url: "/icon-512.png?v=4", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png?v=4", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=4",
  },
  manifest: "/site.webmanifest?v=4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/favicon.ico?v=4" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=4" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=4" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=4" />
        <link rel="shortcut icon" href="/favicon.ico?v=4" />
        <SchoolJsonLd />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white dark:bg-slate-950 dark:text-slate-100">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
