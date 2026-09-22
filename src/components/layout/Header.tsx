'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Shield,
  ChevronDown,
  Award,
  Sparkles,
  Info,
  ExternalLink,
  GraduationCap,
  Calendar,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { LiveAnnouncementBar } from './LiveAnnouncementBar';

export interface FounderMember {
  id: string;
  name: string;
  name_ta: string;
  title: string;
  title_ta: string;
  role: string;
  role_ta: string;
  period?: string;
  imageUrl: string;
  description: string;
  description_ta: string;
}

export const HISTORICAL_FOUNDERS: FounderMember[] = [
  {
    id: 'founder-1',
    name: 'M. Savariyappaudayar',
    name_ta: 'அமரர் எம். சவரிப்ப உடையார்',
    title: 'School Patron & Memorial Inspirator',
    title_ta: 'பள்ளிப் புரவலர் & நினைவாளர்',
    role: 'Patron',
    role_ta: 'புரவலர்',
    period: 'Demise: 01-08-1930',
    imageUrl: '/images/founder-1-savariyappa-udaiyar.jpg',
    description: 'The benevolent soul and revered patron in whose blessed memory S.U.M. School was founded in 1963 to bring education to rural youth.',
    description_ta: 'இவரது புனித நினைவாகவும், கல்விப் பணிக்கான தியாகத்தின் அடையாளமாகவும் 1963-இல் சவரியப்ப உடையார் நினைவுப் பள்ளி நிறுவப்பட்டது.',
  },
  {
    id: 'founder-2',
    name: 'Amarar Thiru M. Savarimuthu Udaiyar',
    name_ta: 'நிறுவனர் அமரர் உயர்திரு. எம். சவரிமுத்து உடையார்',
    title: 'Founder & Philanthropist',
    title_ta: 'பள்ளி நிறுவனர்',
    role: 'Founder',
    role_ta: 'நிறுவனர்',
    imageUrl: '/images/founder-2-savarimuthu-udaiyar.jpg',
    description: 'Visionary co-founder who dedicated his personal lands, resources, and life to establish primary and secondary education for Royappanpatti.',
    description_ta: 'ராயப்பன்பட்டி கிராமப்புற மக்களின் கல்வி வளர்ச்சிக்காக நிலங்களையும் வளங்களையும் வழங்கி பள்ளியைத் தோற்றுவித்த பெருமைக்குரிய நிறுவனர்.',
  },
  {
    id: 'founder-3',
    name: 'Amarar Thiru M. S. Savarimuthu Udaiyar',
    name_ta: 'நிறுவனர் அமரர் உயர்திரு. எம். எஸ். சவரிமுத்து உடையார்',
    title: 'Founder & Institutional Architect',
    title_ta: 'பள்ளி நிறுவனர்',
    role: 'Founder',
    role_ta: 'நிறுவனர்',
    imageUrl: '/images/founder-3-ms-savarimuthu-udaiyar.png',
    description: 'Stalwart founder whose administrative vision and steadfast dedication nurtured the school into an acclaimed institution of moral and academic distinction.',
    description_ta: 'ஒழுக்கமும் கல்வியறிவும் நிறைந்த சமுதாயத்தை உருவாக்க பள்ளியின் கட்டமைப்பை உருவாக்கி வழிநடத்திய தலைமை நிறுவனர்.',
  },
  {
    id: 'founder-4',
    name: 'Amarar Thiru M. S. Singarayar',
    name_ta: 'நிறுவனர் அமரர் உயர்திரு. எம். எஸ். சிங்கராயர்',
    title: 'Founder & Community Pioneer',
    title_ta: 'பள்ளி நிறுவனர்',
    role: 'Founder',
    role_ta: 'நிறுவனர்',
    imageUrl: '/images/founder-4-ms-singarayar.jpg',
    description: 'Dynamic founding leader whose relentless efforts elevated S.U.M. into a premier Higher Secondary institution serving the entire Cumbum Valley.',
    description_ta: 'இளைய தலைமுறையின் எதிர்காலத்திற்காகவும் மேல்நிலைக் கல்வி வளர்ச்சிக்காகவும் அருந்தொண்டாற்றிய தொலைநோக்குப் பார்வை கொண்ட நிறுவனர்.',
  },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [academicsDropdown, setAcademicsDropdown] = useState(false);
  const [foundersModalOpen, setFoundersModalOpen] = useState(false);
  const [selectedFounder, setSelectedFounder] = useState<FounderMember | null>(null);

  const pathname = usePathname();
  const { t, language } = useLanguage();
  const isTa = language === 'ta';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 45);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on actual route changes (skip initial mount)
  const prevPathnameRef = React.useRef(pathname);
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      setMobileMenuOpen(false);
      setAcademicsDropdown(false);
    }
  }, [pathname]);

  const navLinks = [
    { href: '/', label: t('nav.home', 'Home') },
    { href: '/about', label: t('nav.about', 'About Us') },
    {
      label: t('nav.academics', 'Academics'),
      isDropdown: true,
      href: '/academics',
      items: [
        { href: '/academics', label: t('nav.academicsOverview', 'Overview & Streams') },
        { href: '/facilities', label: t('nav.facilities', 'Campus Facilities') },
        { href: '/faculty', label: t('nav.faculty', 'Faculty & Staff') },
        { href: '/transport', label: t('nav.transport', 'Bus & Transport') },
        { href: '/transport/tracking', label: t('nav.busTracking', 'Live Bus Tracking') },
        { href: '/results', label: t('nav.results', 'Exam Results') },
      ],
    },
    { href: '/admissions', label: t('nav.admissions', 'Admissions'), badge: 'Open' },
    { href: '/news', label: t('nav.news', 'Announcements') },
    { href: '/events', label: t('nav.events', 'School Events') },
    { href: '/gallery', label: t('nav.gallery', 'Photo Gallery') },
    { href: '/achievements', label: t('nav.achievements', 'Achievements') },
    { href: '/alumni', label: t('nav.alumni', 'Alumni Network') },
    { href: '/contact', label: t('nav.contact', 'Contact Us') },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="w-full z-40 relative bg-white dark:bg-slate-950 transition-all duration-300">
        {/* MAIN BRANDING & HERITAGE TRIBUTE BAR (Row 1) */}
        <div className="w-full bg-gradient-to-b from-white via-slate-50/70 to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800 py-3 sm:py-3.5">
          <div className="container-main flex items-center justify-between gap-3 lg:gap-6">
            {/* FIRST: School Logo & School Name */}
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-slate-800 p-1 flex items-center justify-center shadow-md border-2 border-amber-400/30 group-hover:scale-105 group-hover:border-amber-400 transition-all duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/school-crest.png"
                    alt="S.U.M. Higher Secondary School Crest"
                    className="w-full h-full object-contain drop-shadow-xs"
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-heading font-black text-lg sm:text-xl lg:text-2xl text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-blue-600 transition">
                    S.U.M. SCHOOL
                  </span>
                  <span className="text-[11px] sm:text-xs font-black text-blue-700 dark:text-blue-400 tracking-wider uppercase leading-snug">
                    HIGHER SECONDARY &amp; PRIMARY
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span>Royappanpatti</span>
                    <span className="text-amber-500 font-bold">•</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">Estd. 1963</span>
                  </span>
                </div>
              </Link>
            </div>

            {/* SECOND: Four Historical Members / Founders Photos (Desktop & Tablet Tribute) */}
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
              <div className="flex flex-col text-right pr-1 shrink-0">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center justify-end gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>{isTa ? 'நிறுவனர்கள்' : 'Founders'}</span>
                </span>
                <span className="text-[8px] font-bold text-slate-500 dark:text-slate-400 tracking-tight">
                  {isTa ? 'புரவலர் & முன்னோடிகள்' : 'Heritage Tribute'}
                </span>
                <button
                  onClick={() => setFoundersModalOpen(true)}
                  className="text-[9px] text-blue-600 dark:text-blue-400 font-extrabold hover:underline mt-0.5 cursor-pointer text-right"
                >
                  {isTa ? 'விவரம் →' : 'View →'}
                </button>
              </div>

              {/* 4 Portraits side-by-side */}
              <div className="flex items-center gap-1.5">
                {HISTORICAL_FOUNDERS.map((founder, idx) => (
                  <div
                    key={founder.id}
                    onClick={() => {
                      setSelectedFounder(founder);
                      setFoundersModalOpen(true);
                    }}
                    className="group relative cursor-pointer"
                    title={`${isTa ? founder.name_ta : founder.name} (${isTa ? founder.title_ta : founder.title})`}
                  >
                    <div className="w-12 h-14 xl:w-13 xl:h-15 rounded-xl overflow-hidden border-2 border-amber-300 dark:border-amber-500/60 shadow-xs bg-slate-900 group-hover:scale-105 group-hover:border-amber-400 group-hover:shadow-md transition-all duration-300">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={founder.imageUrl}
                        alt={founder.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    {/* Index Tag */}
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-slate-950 font-black text-[8px] flex items-center justify-center shadow-xs border border-white dark:border-slate-900">
                      {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* THIRD: Diamond Jubilee Logo & Mobile Controls */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <Link
                href="/about"
                className="flex items-center gap-2 hover:opacity-95 transition group"
                title="S.U.M. School Diamond Jubilee 60 Years (1963–2023)"
              >
                <div className="h-13 sm:h-16 w-auto flex items-center justify-center group-hover:scale-105 transition duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/diamond-jubilee-logo.png"
                    alt="S.U.M. School 60th Diamond Jubilee Anniversary Logo"
                    className="h-12 sm:h-15 w-auto object-contain drop-shadow-xs"
                  />
                </div>
                <div className="hidden 2xl:flex flex-col text-left border-l border-slate-200 dark:border-slate-700 pl-2.5">
                  <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider leading-none">
                    DIAMOND JUBILEE
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                    60 Years (1963–2023)
                  </span>
                </div>
              </Link>

              {/* Mobile Founders Quick Button */}
              <button
                onClick={() => setFoundersModalOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                title="View Founders"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">{isTa ? 'நிறுவனர்கள்' : 'Founders'}</span>
              </button>

              {/* Mobile Hamburger Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2.5 rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer border border-slate-200 dark:border-slate-700"
                aria-label={t('header.toggleMenu', 'Toggle navigation menu')}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* FOURTH: NAVIGATION MENU BAR (Row 2 - Sticky on Scroll) */}
        <div
          className={`w-full z-30 transition-all duration-300 bg-slate-900 text-slate-100 border-b border-slate-800 shadow-md ${
            isScrolled ? 'sticky top-0 shadow-xl bg-slate-950/95 backdrop-blur-md' : 'relative'
          }`}
        >
          <div className="container-main flex items-center justify-between">
            {/* Scrolled Compact Brand Mark */}
            {isScrolled && (
              <Link href="/" className="hidden lg:flex items-center gap-2.5 py-2 mr-4 shrink-0 group">
                <div className="w-8 h-8 rounded-xl bg-white p-0.5 flex items-center justify-center shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/school-crest.png"
                    alt="S.U.M. School Crest"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-extrabold text-xs text-white leading-none">
                    S.U.M. SCHOOL
                  </span>
                  <span className="text-[9px] font-bold text-amber-400 leading-tight">
                    Royappanpatti
                  </span>
                </div>
              </Link>
            )}

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1.5 py-1.5 overflow-x-auto">
              {navLinks.map((link, idx) => {
                if (link.isDropdown) {
                  return (
                    <div
                      key={idx}
                      className="relative"
                      onMouseEnter={() => setAcademicsDropdown(true)}
                      onMouseLeave={() => setAcademicsDropdown(false)}
                    >
                      <button
                        className={`flex items-center gap-1 px-3 py-2 text-xs 2xl:text-sm font-semibold rounded-xl transition cursor-pointer ${
                          isActive('/academics') ||
                          isActive('/facilities') ||
                          isActive('/faculty') ||
                          isActive('/transport') ||
                          isActive('/results')
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-200 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                      </button>

                      {academicsDropdown && (
                        <div className="absolute top-full left-0 w-60 pt-2 z-50 animate-fadeIn">
                          <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-2 text-white">
                            {link.items?.map((sub, sIdx) => (
                              <Link
                                key={sIdx}
                                href={sub.href}
                                className={`block px-3.5 py-2.5 text-xs font-semibold rounded-xl transition ${
                                  isActive(sub.href)
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={idx}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs 2xl:text-sm font-semibold rounded-xl transition whitespace-nowrap ${
                      isActive(link.href)
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-200 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] tracking-wide animate-pulse">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 py-1.5">
              <LanguageSwitcher variant="header" />
              <Link href="/admissions" className="hidden sm:inline-block">
                <Button variant="accent" size="sm" className="font-extrabold shadow-sm">
                  {t('common.applyOnline', 'Apply Online')}
                </Button>
              </Link>
              <Link href="/contact" className="hidden md:inline-block">
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-200 hover:bg-slate-800 font-semibold">
                  {t('common.contactUs', 'Contact Us')}
                </Button>
              </Link>
              <Link
                href="/admin/login"
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition border border-slate-700/60"
                title={t('header.adminLogin', 'Admin Portal')}
              >
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden 2xl:inline">{t('header.adminLogin', 'Admin')}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* LIVE NOTIFICATION & ANNOUNCEMENT TICKER */}
        <LiveAnnouncementBar />

        {/* MOBILE FULL-SCREEN RESPONSIVE DRAWER */}
        {mobileMenuOpen && (
          <div className="xl:hidden fixed inset-0 top-[76px] bg-slate-950/70 backdrop-blur-sm z-50 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 max-h-[calc(100vh-120px)] overflow-y-auto px-6 py-6 shadow-2xl space-y-6">
              {/* Dual Brand Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-amber-50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-100 dark:border-slate-700 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 p-1 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/school-crest.png"
                      alt="S.U.M. School Crest"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-heading font-black text-sm text-slate-900 dark:text-white leading-tight">
                      S.U.M. SCHOOL
                    </div>
                    <div className="text-[10px] font-bold text-blue-700 dark:text-blue-400">
                      Higher Secondary &amp; Primary
                    </div>
                    <div className="text-[9px] text-slate-500 font-semibold">
                      Royappanpatti • Estd. 1963
                    </div>
                  </div>
                </div>

                <div className="h-12 w-auto shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/diamond-jubilee-logo.png"
                    alt="Diamond Jubilee 60 Years"
                    className="h-12 w-auto object-contain"
                  />
                </div>
              </div>

              {/* Mobile Founders Tribute Showcase */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isTa ? 'பள்ளி நிறுவனர்கள் & முன்னோடிகள்' : 'Founders & Benefactors'}</span>
                  </span>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setFoundersModalOpen(true);
                    }}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    {isTa ? 'முழு விவரம் →' : 'View Full Bios →'}
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {HISTORICAL_FOUNDERS.map((founder) => (
                    <div
                      key={founder.id}
                      onClick={() => {
                        setSelectedFounder(founder);
                        setMobileMenuOpen(false);
                        setFoundersModalOpen(true);
                      }}
                      className="flex flex-col items-center text-center cursor-pointer group"
                    >
                      <div className="w-14 h-16 rounded-xl overflow-hidden border-2 border-amber-300 dark:border-amber-500/70 shadow-xs bg-slate-950 group-hover:scale-105 transition">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={founder.imageUrl}
                          alt={founder.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 mt-1 line-clamp-1">
                        {founder.name.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Language Switcher */}
              <LanguageSwitcher variant="mobile" />

              {/* Mobile Nav Links */}
              <nav className="flex flex-col gap-1.5">
                {navLinks.map((link, idx) => {
                  if (link.isDropdown) {
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {link.label}
                        </div>
                        <div className="pl-3 flex flex-col gap-1">
                          {link.items?.map((sub, sIdx) => (
                            <Link
                              key={sIdx}
                              href={sub.href}
                              className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition ${
                                isActive(sub.href)
                                  ? 'bg-blue-600 text-white'
                                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={idx}
                      href={link.href}
                      className={`px-4 py-3 text-sm font-semibold rounded-2xl flex items-center justify-between transition ${
                        isActive(link.href)
                          ? 'bg-blue-600 text-white font-bold shadow-sm'
                          : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile CTAs */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
                <Link href="/admissions" className="w-full">
                  <Button variant="accent" size="lg" className="w-full font-black">
                    {t('common.applyOnline', 'Apply for Admission')}
                  </Button>
                </Link>
                <Link href="/results" className="w-full">
                  <Button variant="secondary" size="md" className="w-full font-bold" leftIcon={<Award className="w-4 h-4" />}>
                    {t('nav.results', 'Check Exam Results')}
                  </Button>
                </Link>
                <Link href="/admin/login" className="w-full">
                  <Button variant="outline" size="sm" className="w-full" leftIcon={<Shield className="w-4 h-4" />}>
                    {t('header.adminLogin', 'Admin Portal Login')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* FOUNDERS HISTORICAL TRIBUTE MODAL */}
      <Modal
        isOpen={foundersModalOpen}
        onClose={() => {
          setFoundersModalOpen(false);
          setSelectedFounder(null);
        }}
        title={isTa ? 'பள்ளி நிறுவனர்கள் & வரலாற்றுப் புரவலர்' : 'S.U.M. School Founders & Historical Benefactors'}
        description={
          isTa
            ? '1963-ஆம் ஆண்டு சவரியப்ப உடையார் அவர்களின் நினைவாக நிறுவப்பட்டு 60+ ஆண்டுகளைக் கடந்த வரலாற்றுப் பெருமை'
            : 'Honoring the visionaries whose philanthropy, dedication, and leadership laid the foundation of S.U.M. School in 1963.'
        }
        size="xl"
      >
        <div className="space-y-6">
          {/* Selected Portrait Spotlight or All 4 Grid */}
          {selectedFounder ? (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-50 to-blue-50 dark:from-amber-950/30 dark:via-slate-900 dark:to-blue-950/30 border border-amber-300 dark:border-amber-700/60 flex flex-col md:flex-row items-center gap-6">
              <div className="w-40 sm:w-48 h-52 sm:h-64 rounded-2xl overflow-hidden border-4 border-amber-400 dark:border-amber-500 shadow-xl shrink-0 bg-slate-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedFounder.imageUrl}
                  alt={selectedFounder.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="space-y-3 text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-400/40 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isTa ? selectedFounder.role_ta : selectedFounder.role}</span>
                </span>

                <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 dark:text-white">
                  {isTa ? selectedFounder.name_ta : selectedFounder.name}
                </h3>

                <div className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400">
                  {isTa ? selectedFounder.title_ta : selectedFounder.title}
                  {selectedFounder.period && ` • ${selectedFounder.period}`}
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isTa ? selectedFounder.description_ta : selectedFounder.description}
                </p>

                <Button
                  onClick={() => setSelectedFounder(null)}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  {isTa ? 'அனைத்து நிறுவனர்களையும் பார்க்க' : 'View All 4 Founders'}
                </Button>
              </div>
            </div>
          ) : null}

          {/* All 4 Founders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HISTORICAL_FOUNDERS.map((f, idx) => (
              <div
                key={f.id}
                onClick={() => setSelectedFounder(f)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center group ${
                  selectedFounder?.id === f.id
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 shadow-md scale-102'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300 hover:shadow-md'
                }`}
              >
                <div className="w-24 h-32 rounded-xl overflow-hidden border-2 border-amber-400 dark:border-amber-500 shadow-md bg-slate-950 mb-3 group-hover:scale-105 transition">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.imageUrl}
                    alt={f.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  {isTa ? f.role_ta : f.role} #{idx + 1}
                </span>

                <h4 className="text-sm font-bold font-heading text-slate-900 dark:text-white mt-1 line-clamp-2">
                  {isTa ? f.name_ta : f.name}
                </h4>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {isTa ? f.title_ta : f.title}
                </p>

                <span className="mt-3 text-[10px] font-extrabold text-blue-600 dark:text-blue-400 group-hover:underline">
                  {isTa ? 'மேலும் படிக்க →' : 'Read Bio →'}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {isTa
                ? 'சவரியப்ப உடையார் நினைவு மேல்நிலை மற்றும் தொடக்கப்பள்ளி (S.U.M. School) 1963-இல் தொடங்கி இன்று வரை தேனி மாவட்ட கிராமப்புற மாணவர்களுக்குத் தலைசிறந்த கல்வியை வழங்கி வருகிறது.'
                : 'Savariyappa Udaiyar Memorial Higher Secondary & Primary School (Estd. 1963) continues its legacy of empowering thousands of rural scholars across Theni District, honoring its founding pillars.'}
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
