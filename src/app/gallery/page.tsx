'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  X,
  ZoomIn,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  Share2,
  Image as ImageIcon,
  FolderOpen,
} from 'lucide-react';
import { galleryRepository } from '@/lib/repositories';
import { defaultGalleryImages } from '@/lib/defaultData';
import { GalleryImage } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export default function GalleryPage() {
  const { getLocalized, language } = useLanguage();
  const isTa = language === 'ta';

  const [images, setImages] = useState<GalleryImage[]>(defaultGalleryImages);
  const [isLoading, setIsLoading] = useState(true);

  // Year & Month Filters
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true);
        const data = await galleryRepository.getPublished();
        if (data && data.length > 0) {
          const published = data.filter((item) => item.status === 'published');
          setImages(published.length > 0 ? published : defaultGalleryImages);
        } else {
          setImages(defaultGalleryImages);
        }
      } catch (err) {
        console.warn('Error loading gallery images:', err);
        setImages(defaultGalleryImages);
      } finally {
        setIsLoading(false);
      }
    };
    loadImages();
  }, []);

  // Academic years list
  const academicYears = useMemo(() => {
    const yrs = new Set<string>();
    images.forEach((img) => {
      if (img.academicYear) yrs.add(img.academicYear);
    });
    // Ensure standard years are included
    ['2025–2026', '2024–2025', '2023–2024', '2022–2023'].forEach((y) => yrs.add(y));
    return ['all', ...Array.from(yrs).sort().reverse()];
  }, [images]);

  // Academic months order (June to April typical school calendar)
  const schoolMonths = [
    { id: 'all', label: isTa ? 'அனைத்து மாதங்களும்' : 'All Months' },
    { id: 'June', label: isTa ? 'ஜூன்' : 'June' },
    { id: 'July', label: isTa ? 'ஜூலை' : 'July' },
    { id: 'August', label: isTa ? 'ஆகஸ்ட்' : 'August' },
    { id: 'September', label: isTa ? 'செப்டம்பர்' : 'September' },
    { id: 'October', label: isTa ? 'அக்டோபர்' : 'October' },
    { id: 'November', label: isTa ? 'நவம்பர்' : 'November' },
    { id: 'December', label: isTa ? 'டிசம்பர்' : 'December' },
    { id: 'January', label: isTa ? 'ஜனவரி' : 'January' },
    { id: 'February', label: isTa ? 'பிப்ரவரி' : 'February' },
    { id: 'March', label: isTa ? 'மார்ச்' : 'March' },
    { id: 'April', label: isTa ? 'ஏப்ரல்' : 'April' },
  ];

  // Category filters
  const categories = [
    { id: 'all', label: isTa ? 'அனைத்துப் படங்கள்' : 'All Categories' },
    { id: 'Robotics & ATL', label: isTa ? 'ரோபாட்டிக்ஸ் & அடல் லேப்' : 'Robotics & ATL' },
    { id: 'Campus Life', label: isTa ? 'பள்ளி வளாகம்' : 'Campus Life' },
    { id: 'Sports Meet', label: isTa ? 'விளையாட்டு விழா' : 'Sports & Athletics' },
    { id: 'Annual Day', label: isTa ? 'ஆண்டு விழா' : 'Annual Celebrations' },
    { id: 'Science Expo', label: isTa ? 'அறிவியல் கண்காட்சி' : 'Science & Labs' },
    { id: 'Celebrations', label: isTa ? 'வைர விழா & பண்டிகைகள்' : 'Jubilee & Festivals' },
  ];

  // Filtered Images
  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      // Academic year filter
      if (selectedYear !== 'all' && img.academicYear && img.academicYear !== selectedYear) {
        return false;
      }
      // Month filter
      if (selectedMonth !== 'all' && img.month && img.month.toLowerCase() !== selectedMonth.toLowerCase()) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all') {
        const cat = img.eventCategory || img.albumName || '';
        if (!cat.toLowerCase().includes(selectedCategory.toLowerCase())) {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = (img.title || '').toLowerCase();
        const album = (img.albumName || '').toLowerCase();
        const desc = (img.description || '').toLowerCase();
        const cat = (img.eventCategory || '').toLowerCase();
        if (!title.includes(q) && !album.includes(q) && !desc.includes(q) && !cat.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [images, selectedYear, selectedMonth, selectedCategory, searchQuery]);

  // Lightbox handlers
  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const handlePrevLightbox = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : null));
  }, [filteredImages.length]);

  const handleNextLightbox = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredImages.length : null));
  }, [filteredImages.length]);

  const handleSharePhoto = (img: GalleryImage) => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: img.title,
        text: `View school memory: ${img.title} — S.U.M. School, Royappanpatti`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      toast.success(isTa ? 'இணைப்பு நகலெடுக்கப்பட்டது!' : 'Photo link copied to clipboard!');
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') handleCloseLightbox();
      if (e.key === 'ArrowLeft') handlePrevLightbox();
      if (e.key === 'ArrowRight') handleNextLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handleCloseLightbox, handlePrevLightbox, handleNextLightbox]);

  const currentLightboxImage = lightboxIndex !== null ? filteredImages[lightboxIndex] : null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Page Hero */}
        <section className="relative py-20 lg:py-24 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
          <div className="container-main relative z-10 text-center">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-300 mb-4 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>{isTa ? 'ஆண்டு & மாத வாரியான நினைவுகள் தொகுப்பு' : 'Year-Wise & Month-Wise School Memories Gallery'}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight">
              {isTa ? 'எஸ்.யு.எம். பள்ளி நினைவகம் & புகைப்படங்கள்' : 'School Memories & Photo Archive'}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {isTa
                ? 'கல்வியாண்டு மற்றும் மாதங்களை தேர்வு செய்து பள்ளி ஆண்டு விழாக்கள், விளையாட்டு போட்டிகள், அறிவியல் கண்காட்சிகள் மற்றும் வரலாற்று நினைவுகளை ஆராயுங்கள்.'
                : 'Explore over six decades of campus celebrations, science expos, annual sports championships, and cultural moments organized chronologically by academic year and month.'}
            </p>
          </div>
        </section>

        {/* Year, Month & Category Navigation Toolbar */}
        <section className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 sticky top-16 z-20 shadow-sm backdrop-blur-md bg-opacity-95">
          <div className="container-main space-y-4">
            {/* Level 1: Academic Year Navigation Pills & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {isTa ? 'கல்வியாண்டு:' : 'Academic Year:'}
                </span>
                {academicYears.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition whitespace-nowrap cursor-pointer ${
                      selectedYear === yr
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {yr === 'all' ? (isTa ? 'அனைத்து ஆண்டுகள்' : 'All Years') : yr}
                  </button>
                ))}
              </div>

              {/* Search album / event */}
              <div className="relative w-full md:w-80 shrink-0">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isTa ? 'ஆல்பம் அல்லது நிகழ்வு தேடுக...' : 'Search album or event photos...'}
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Level 2: Month Navigation Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                {isTa ? 'மாதம்:' : 'Month:'}
              </span>
              {schoolMonths.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMonth(m.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                    selectedMonth === m.id
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Level 3: Event Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="section-padding bg-white dark:bg-slate-950">
          <div className="container-main">
            {/* Header info bar */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-blue-600" />
                  <span>
                    {selectedYear !== 'all' ? `${selectedYear} ` : ''}
                    {selectedMonth !== 'all' ? `${selectedMonth} ` : ''}
                    {isTa ? 'புகைப்படங்கள்' : 'Memories & Albums'}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isTa
                    ? `${filteredImages.length} புகைப்படங்கள் காண்பிக்கப்படுகின்றன`
                    : `Showing ${filteredImages.length} photos in this album`}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-slate-500 font-medium">Loading school gallery...</p>
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
                <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
                  {isTa ? 'புகைப்படங்கள் எதுவும் கிடைக்கவில்லை' : 'No photos found for the selected filters'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  {isTa
                    ? 'வேறு கல்வியாண்டு அல்லது மாதத்தைத் தேர்ந்தெடுத்து முயற்சிக்கவும்.'
                    : 'Try selecting a different academic year or resetting the month filter.'}
                </p>
                <button
                  onClick={() => {
                    setSelectedYear('all');
                    setSelectedMonth('all');
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
                >
                  {isTa ? 'அனைத்து புகைப்படங்களையும் காண்பி' : 'Reset All Filters'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredImages.map((img, idx) => {
                  const title = getLocalized(img, 'title');
                  const desc = getLocalized(img, 'description');

                  return (
                    <div
                      key={img.id || idx}
                      onClick={() => handleOpenLightbox(idx)}
                      className="group bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
                    >
                      {/* Photo Thumbnail */}
                      <div className="relative h-56 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.imageUrl}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/30 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity p-3 rounded-full bg-white/90 text-slate-900 shadow-lg transform translate-y-2 group-hover:translate-y-0 duration-300">
                            <ZoomIn className="w-5 h-5" />
                          </div>
                        </div>

                        {/* Month / Year Badge */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          {img.month && (
                            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-[10px] shadow-sm">
                              {img.month}
                            </span>
                          )}
                          {img.academicYear && (
                            <span className="px-2 py-0.5 rounded-lg bg-slate-900/80 text-white font-bold text-[10px] backdrop-blur-md border border-white/20">
                              {img.academicYear}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Photo Meta */}
                      <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                          {img.eventCategory && (
                            <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mb-1">
                              {img.eventCategory}
                            </div>
                          )}
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition">
                            {title}
                          </h3>
                          {desc && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {desc}
                            </p>
                          )}
                        </div>

                        {img.eventDate && (
                          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                            <span>{img.eventDate}</span>
                            <span className="font-semibold text-blue-600 dark:text-blue-400">{img.albumName || 'School Event'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Full-Screen Responsive Lightbox */}
        {currentLightboxImage && lightboxIndex !== null && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 text-white animate-fade-in"
            onClick={handleCloseLightbox}
          >
            {/* Top Bar: Title, Count, Close */}
            <div className="flex items-center justify-between w-full max-w-6xl mx-auto z-10" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {currentLightboxImage.academicYear} • {currentLightboxImage.month || 'Campus'}
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-heading">
                  {getLocalized(currentLightboxImage, 'title')}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">
                  {lightboxIndex + 1} / {filteredImages.length}
                </span>
                <button
                  onClick={() => handleSharePhoto(currentLightboxImage)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                  title="Share Photo"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCloseLightbox}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                  title="Close Lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Center Stage: Image and Arrow Controls */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {/* Previous Button */}
              <button
                onClick={handlePrevLightbox}
                className="absolute left-2 sm:left-6 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition cursor-pointer z-20"
                title="Previous Photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Main Photo */}
              <div className="max-w-5xl max-h-[72vh] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentLightboxImage.imageUrl}
                  alt={currentLightboxImage.title}
                  className="max-h-[70vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
                />
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextLightbox}
                className="absolute right-2 sm:right-6 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition cursor-pointer z-20"
                title="Next Photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption Bar */}
            <div className="w-full max-w-3xl mx-auto text-center z-10 text-xs sm:text-sm text-slate-300 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10" onClick={(e) => e.stopPropagation()}>
              <p>{getLocalized(currentLightboxImage, 'description')}</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
