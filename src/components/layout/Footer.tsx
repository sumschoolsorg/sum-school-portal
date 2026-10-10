'use client';

import React from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { BackToTop } from '@/components/ui/BackToTop';
import { defaultSchoolSettings } from '@/lib/defaultData';
import { useLanguage } from '@/contexts/LanguageContext';
import { BottomAnnouncementTicker } from './BottomAnnouncementTicker';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-slate-950 text-slate-300 relative overflow-hidden border-t border-slate-800">
      {/* Clean White Bottom Continuous Scrolling Announcement Box */}
      <BottomAnnouncementTicker />

      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="container-main py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Column 1: School Brand (Col 4) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-13 h-13 rounded-2xl bg-white p-1 flex items-center justify-center shadow-lg border border-white/20 group-hover:scale-105 transition duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/school-crest.png"
                    alt="S.U.M. School Crest"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-extrabold text-lg text-white tracking-tight leading-tight">
                    {t('header.schoolTitle')}
                  </span>
                  <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
                    {t('header.schoolSubtitle')}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {t('common.location')}
                  </span>
                </div>
              </Link>

              {/* Jubilee Emblem */}
              <div className="pl-3 border-l border-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/diamond-jubilee-logo.png"
                  alt="Diamond Jubilee 60 Years"
                  className="h-12 w-auto object-contain drop-shadow-md"
                />
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              {t('footer.brandDescription')}
            </p>

            {/* Accreditation Badge */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-400 text-[11px] uppercase tracking-wider">
                <span>Recognized by Tamil Nadu Education Board</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span>UDISE: 33250800109</span>
                <span>•</span>
                <span>Govt. Aided / Non-Profitable</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <a
                href={defaultSchoolSettings.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href={defaultSchoolSettings.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-pink-600 transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a
                href={defaultSchoolSettings.socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-sky-500 transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href={defaultSchoolSettings.socialMedia.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-600 transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (Col 2) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="text-white font-heading font-bold text-sm tracking-wider uppercase">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  {t('nav.academics')}
                </Link>
              </li>
              <li>
                <Link href="/facilities" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  {t('nav.facilities')}
                </Link>
              </li>
              <li>
                <Link href="/faculty" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  {t('nav.faculty')}
                </Link>
              </li>
              <li>
                <Link href="/transport" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  {t('nav.transport')}
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  {t('nav.results')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Admissions & Campus (Col 2) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="text-white font-heading font-bold text-sm tracking-wider uppercase">
              {t('footer.schoolLife')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/admissions" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  {t('nav.admissions')}
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  {t('nav.news')}
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  {t('nav.events')}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  {t('nav.gallery')}
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  {t('nav.achievements')}
                </Link>
              </li>
              <li>
                <Link href="/alumni" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  {t('nav.alumni')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info (Col 4) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h4 className="text-white font-heading font-bold text-sm tracking-wider uppercase">
              {t('footer.schoolContact')}
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="leading-snug">
                    {defaultSchoolSettings.address}, {defaultSchoolSettings.city},{' '}
                    {defaultSchoolSettings.state} – {defaultSchoolSettings.pincode}
                  </div>
                  <a
                    href={defaultSchoolSettings.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium mt-1 transition"
                    title="Open in Google Maps"
                  >
                    <span>{t('footer.viewOnMaps')}</span>
                    <span>&rarr;</span>
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{defaultSchoolSettings.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{defaultSchoolSettings.email}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>{t('header.topHours')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            {t('footer.copyright').replace('{year}', String(currentYear))}
          </p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300 transition">
              {t('footer.privacyPolicy')}
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition">
              {t('footer.termsConditions')}
            </Link>
            <Link
              href="/admin/login"
              className="flex items-center gap-1 hover:text-amber-400 transition"
            >
              <Shield className="w-3 h-3 text-blue-400" />
              <span>{t('footer.adminPortal')}</span>
            </Link>
          </div>
        </div>
      </div>

      <BackToTop />
    </footer>
  );
}
