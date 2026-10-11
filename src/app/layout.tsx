import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";

export const viewport: Viewport = {
  themeColor: "#1e3a8a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.sumschools.org'),
  title: {
    template: "%s | S.U.M. Higher Secondary & Primary School",
    default: "S.U.M. Higher Secondary & Primary School | Excellence in Education",
  },
  description:
    "Official website of S.U.M. Higher Secondary & Primary School. Empowering students with academic excellence, holistic character development, state-of-the-art facilities, and inclusive learning.",
  keywords: [
    "S.U.M. School",
    "Higher Secondary School",
    "Primary School",
    "Admissions",
    "Academic Excellence",
    "Best School",
  ],
  authors: [{ name: "S.U.M. School Administration" }],
  openGraph: {
    title: "S.U.M. Higher Secondary & Primary School",
    description:
      "Nurturing intellect, building character, and inspiring leadership. Explore academics, admissions, faculty, and school life.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white dark:bg-slate-950 dark:text-slate-100">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
