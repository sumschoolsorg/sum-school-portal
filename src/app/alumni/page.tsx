'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { alumniRepository, alumniPrivateRepository } from '@/lib/repositories';
import { AlumniMember } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { uploadImageWithUniqueId } from '@/lib/storage';
import {
  GraduationCap,
  Award,
  Briefcase,
  MapPin,
  Search,
  Quote,
  PlusCircle,
  Sparkles,
  Camera,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Eye,
  Check,
  ImageIcon,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

// Batch graduation years from 2026 down to founding year 1963
const BATCH_YEARS = Array.from({ length: 2026 - 1963 + 1 }, (_, i) => 2026 - i);

// Standard Tamil Nadu school stream options
const COURSE_STREAMS = [
  { value: 'HSC - Science & Mathematics', labelEn: 'HSC (12th) - Science & Mathematics Stream', labelTa: 'மேல்நிலை (12-ஆம் வகுப்பு) - கணிதம் & அறிவியல்' },
  { value: 'HSC - Biology & Science', labelEn: 'HSC (12th) - Biology & Science Stream', labelTa: 'மேல்நிலை (12-ஆம் வகுப்பு) - உயிரியல் & அறிவியல்' },
  { value: 'HSC - Commerce & Accounts', labelEn: 'HSC (12th) - Commerce & Accountancy Stream', labelTa: 'மேல்நிலை (12-ஆம் வகுப்பு) - வணிகவியல் & கணக்குப்பதிவியல்' },
  { value: 'HSC - Arts & Humanities', labelEn: 'HSC (12th) - Arts & Humanities Stream', labelTa: 'மேல்நிலை (12-ஆம் வகுப்பு) - கலை & மனிதநேயப் பிரிவு' },
  { value: 'HSC - Vocational Stream', labelEn: 'HSC (12th) - Vocational Stream', labelTa: 'மேல்நிலை (12-ஆம் வகுப்பு) - தொழிற்கல்விப் பிரிவு' },
  { value: 'SSLC (10th Standard)', labelEn: 'SSLC (10th Standard Board)', labelTa: 'பத்தாம் வகுப்பு (SSLC அரசுத் தேர்வு)' },
  { value: 'Primary & Middle School', labelEn: 'Primary & Middle School (Class 1–8)', labelTa: 'தொடக்க & நடுநிலைப் பள்ளி (1–8 வகுப்புகள்)' },
];

const AVATAR_PRESETS = [
  { id: 'pres-1', label: 'Male Alumnus', url: '/images/faculty-1.jpg' },
  { id: 'pres-2', label: 'Female Alumnus', url: '/images/faculty-3.jpg' },
  { id: 'pres-3', label: 'Senior Scholar', url: '/images/faculty-2.jpg' },
  { id: 'pres-crest', label: 'Official Crest', url: '/images/school-crest.png' },
];

// Client-side image processor: crops 1:1 square & compresses to lightweight avatar
async function processAlumniPhoto(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select an image file (JPEG, PNG, WebP).'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 400; // 400x400 avatar is high resolution yet lightweight (<50KB)
        const { width, height } = img;
        const minDim = Math.min(width, height);
        const startX = (width - minDim) / 2;
        const startY = (height - minDim) / 2;
        canvas.width = maxDim;
        canvas.height = maxDim;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, maxDim, maxDim);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const optimized = new File([blob], `alumni_${Date.now()}.jpg`, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(optimized);
          },
          'image/jpeg',
          0.88
        );
      };
      img.onerror = () => reject(new Error('Failed to load image.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

export default function AlumniPage() {
  const { language } = useLanguage();
  const isTa = language === 'ta';

  const [alumniList, setAlumniList] = useState<AlumniMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDecade, setSelectedDecade] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoUploadSuccess, setPhotoUploadSuccess] = useState(false);

  // Success Confirmation State
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    referenceId: string;
    name: string;
    batchYear: number;
    courseCompleted?: string;
    currentDesignation: string;
    companyOrOrg: string;
    location: string;
    photoUrl: string;
  } | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<AlumniMember>>({
    name: '',
    batchYear: 2018,
    courseCompleted: 'HSC - Science & Mathematics',
    qualification: '',
    currentDesignation: '',
    companyOrOrg: '',
    location: '',
    photoUrl: '/images/faculty-1.jpg',
    message: '',
    email: '',
    phone: '',
    linkedinOrSocial: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadAlumni = async () => {
      try {
        const data = await alumniRepository.getPublished();
        if (data && data.length > 0) {
          const publicProfiles = data
            .filter((item) => item.status === 'published')
            .map((item) => {
              const copy = { ...item };
              delete copy.email;
              delete copy.phone;
              return copy;
            });
          setAlumniList(publicProfiles);
        } else {
          setAlumniList([]);
        }
      } catch (err) {
        console.warn('Error loading alumni:', err);
        setAlumniList([]);
      }
    };
    loadAlumni();
  }, []);

  // When registration succeeds, smoothly reset modal scroll to top to reveal celebration badge
  useEffect(() => {
    if (submissionSuccess) {
      const modalScrollable = document.querySelector('[role="dialog"] .overflow-y-auto');
      if (modalScrollable) {
        modalScrollable.scrollTop = 0;
      }
    }
  }, [submissionSuccess]);

  const distinguishedAlumni = alumniList.filter((a) => a.isDistinguished);

  const filteredAlumni = alumniList.filter((alumnus) => {
    const matchesSearch =
      alumnus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumnus.currentDesignation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumnus.companyOrOrg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumnus.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumnus.batchYear.toString().includes(searchQuery);

    if (!matchesSearch) return false;

    if (selectedDecade === 'all') return true;
    if (selectedDecade === '1970-1989') return alumnus.batchYear >= 1963 && alumnus.batchYear <= 1989;
    if (selectedDecade === '1990-1999') return alumnus.batchYear >= 1990 && alumnus.batchYear <= 1999;
    if (selectedDecade === '2000-2009') return alumnus.batchYear >= 2000 && alumnus.batchYear <= 2009;
    if (selectedDecade === '2010-plus') return alumnus.batchYear >= 2010;

    return true;
  });

  // Handle Photo File Upload
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(isTa ? 'தயவுசெய்து சரியான படக் கோப்பைத் தேர்ந்தெடுக்கவும் (JPG, PNG, WebP).' : 'Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error(isTa ? 'புகைப்பட அளவு 15MB-க்குள் இருக்க வேண்டும்.' : 'Photo size must be under 15MB.');
      return;
    }

    setIsUploadingPhoto(true);
    try {
      // 1. Client-side crop & optimization
      const processedFile = await processAlumniPhoto(file);
      
      // 2. Upload to storage (with offline/local base64 fallback)
      const { url } = await uploadImageWithUniqueId(processedFile, 'alumni');
      
      setFormData((prev) => ({ ...prev, photoUrl: url }));
      setPhotoUploadSuccess(true);
      toast.success(isTa ? 'புகைப்படம் வெற்றிகரமாக பதிவேற்றப்பட்டது!' : 'Photo uploaded and optimized successfully!');
    } catch (err) {
      console.error('Photo upload error:', err);
      toast.error(isTa ? 'புகைப்படம் பதிவேற்றத்தில் பிழை ஏற்பட்டது.' : 'Failed to upload photo. Please try again.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.batchYear || !formData.currentDesignation) {
      toast.error(isTa ? 'அனைத்து முக்கிய விவரங்களையும் நிரப்புக.' : 'Please fill all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const generatedId = `alumni-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const referenceCode = `SUM-OSA-${formData.batchYear}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      // Public profile document - strictly non-sensitive fields only
      await alumniRepository.create({
        id: generatedId,
        name: formData.name.trim(),
        batchYear: Number(formData.batchYear),
        courseCompleted: formData.courseCompleted || 'HSC - Science & Mathematics',
        qualification: formData.qualification?.trim() || 'Alumnus',
        currentDesignation: formData.currentDesignation.trim(),
        companyOrOrg: formData.companyOrOrg?.trim() || 'Organization',
        location: formData.location?.trim() || 'Tamil Nadu',
        photoUrl: formData.photoUrl || '/images/faculty-1.jpg',
        message: formData.message?.trim() || 'Proud alumnus of S.U.M. School, Royappanpatti.',
        linkedinOrSocial: formData.linkedinOrSocial?.trim() || '',
        isDistinguished: false,
        status: 'pending', // Awaiting admin approval
        order: alumniList.length + 1,
      });

      // Private contact info is securely stored in admin-only alumniPrivate collection
      if (formData.email || formData.phone) {
        try {
          await alumniPrivateRepository.create({
            id: generatedId,
            alumniId: generatedId,
            name: formData.name.trim(),
            email: formData.email?.trim() || '',
            phone: formData.phone?.trim() || '',
          });
        } catch (contactErr) {
          console.warn('Could not save private contact info:', contactErr);
        }
      }

      // Set Celebratory Success State
      setSubmissionSuccess({
        referenceId: referenceCode,
        name: formData.name.trim(),
        batchYear: Number(formData.batchYear),
        courseCompleted: formData.courseCompleted,
        currentDesignation: formData.currentDesignation.trim(),
        companyOrOrg: formData.companyOrOrg?.trim() || '',
        location: formData.location?.trim() || '',
        photoUrl: formData.photoUrl || '/images/faculty-1.jpg',
      });

      toast.success(
        isTa
          ? 'உங்கள் விவரங்கள் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டன! பள்ளி நிர்வாக ஒப்புதலுக்குப் பிறகு வெளியிடப்படும்.'
          : 'Registration submitted successfully! Your profile will appear after school admin verification.'
      );
    } catch (err) {
      console.error('Registration failed:', err);
      toast.error(isTa ? 'பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.' : 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSubmissionSuccess(null);
    setPhotoUploadSuccess(false);
    setFormData({
      name: '',
      batchYear: 2018,
      courseCompleted: 'HSC - Science & Mathematics',
      qualification: '',
      currentDesignation: '',
      companyOrOrg: '',
      location: '',
      photoUrl: '/images/faculty-1.jpg',
      message: '',
      email: '',
      phone: '',
      linkedinOrSocial: '',
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      <main id="main-content" className="flex-1">
        <Breadcrumbs items={[{ label: isTa ? 'முன்னாள் மாணவர்கள்' : 'Alumni' }]} />
        
        {/* Page Hero */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />
          <div className="container-main relative z-10 text-center">
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-300 mb-4 px-4 py-1.5 rounded-full bg-white/10 border border-white/20">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              {isTa ? 'எஸ்.யு.எம். முன்னாள் மாணவர் சங்கம் (OSA)' : 'S.U.M. Alumni Association (OSA)'}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight">
              {isTa ? '60+ ஆண்டுகால வரலாற்றுப் பெருமை' : '60+ Years of Proud Alumni Heritage'}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {isTa
                ? '1963 முதல் ராயப்பன்பட்டி மண்ணில் கல்வி பயின்று மருத்துவம், அரசு நிர்வாகம், பொறியியல், ஆராய்ச்சி மற்றும் சமூக சேவையில் சிறந்து விளங்கும் முன்னாள் மாணவர்களின் பெருமைமிக்க தளம்.'
                : 'Connecting generations of scholars who walked the corridors of Royappanpatti since 1963 — making exceptional contributions to medicine, public service, technology, academia, and society worldwide.'}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  setSubmissionSuccess(null);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-1 cursor-pointer active:scale-95"
              >
                <PlusCircle className="w-5 h-5 text-slate-950" />
                <span>{isTa ? 'முன்னாள் மாணவர் பதிவு (Photo Upload)' : 'Join the Alumni Network (Photo Upload)'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Heritage Stats Strip */}
        <section className="bg-blue-900/90 text-white py-6 border-y border-blue-800">
          <div className="container-main grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">1963</div>
              <div className="text-xs text-blue-200 mt-1 uppercase font-semibold">
                {isTa ? 'தொடங்கப்பட்ட ஆண்டு' : 'Foundation Year'}
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">60+</div>
              <div className="text-xs text-blue-200 mt-1 uppercase font-semibold">
                {isTa ? 'வெற்றிகரமான தொகுப்புகள்' : 'Graduating Batches'}
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">15,000+</div>
              <div className="text-xs text-blue-200 mt-1 uppercase font-semibold">
                {isTa ? 'முன்னாள் மாணவர்கள்' : 'Alumni Across Globe'}
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">100%</div>
              <div className="text-xs text-blue-200 mt-1 uppercase font-semibold">
                {isTa ? 'சமூக அர்ப்பணிப்பு' : 'Community Spirit'}
              </div>
            </div>
          </div>
        </section>

        {/* Distinguished Alumni / Hall of Fame */}
        {distinguishedAlumni.length > 0 && (
          <section className="py-16 lg:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="container-main">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                  <Award className="w-3.5 h-3.5 inline mr-1" />
                  {isTa ? 'பெருமைக்குரிய சாதனையாளர்கள்' : 'Hall of Fame'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-white mt-3">
                  {isTa ? 'முன்னணி முன்னாள் சாதனையாளர்கள்' : 'Distinguished Alumni Spotlight'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                  {isTa
                    ? 'பள்ளியின் நற்பெயரையும் நற்பண்புகளையும் உலகம் முழுவதும் போற்றிப் புகழும் முன்னோடிகள்.'
                    : 'Honoring alumni whose exemplary leadership and service bring immense pride to S.U.M. School.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {distinguishedAlumni.map((alumnus) => (
                  <div
                    key={alumnus.id}
                    className="group relative bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/80 dark:to-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/80 shadow-lg hover:shadow-2xl transition duration-300 flex flex-col justify-between"
                  >
                    <div className="absolute top-6 right-6">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        {isTa ? 'சாதனையாளர்' : 'Distinguished'}
                      </span>
                    </div>

                    <div>
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden mb-5 border-2 border-amber-400 shadow-md">
                        <Image
                          src={alumnus.photoUrl || '/images/faculty-1.jpg'}
                          alt={alumnus.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                        {alumnus.name}
                      </h3>
                      <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                        {isTa ? 'தொகுப்பு (Batch):' : 'Batch of'} {alumnus.batchYear} • {alumnus.qualification}
                      </div>

                      <div className="mt-3 flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <Briefcase className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-slate-900 dark:text-slate-100">
                            {alumnus.currentDesignation}
                          </strong>
                          , {alumnus.companyOrOrg}
                        </span>
                      </div>

                      <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{alumnus.location}</span>
                      </div>

                      {alumnus.distinctionSummary && (
                        <p className="mt-4 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200/80 dark:border-amber-800/60 leading-relaxed">
                          {alumnus.distinctionSummary}
                        </p>
                      )}
                    </div>

                    {alumnus.message && (
                      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 italic flex items-start gap-2">
                        <Quote className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>&ldquo;{alumnus.message}&rdquo;</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Searchable Alumni Directory */}
        <section className="py-16 lg:py-20">
          <div className="container-main">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                  {isTa ? 'முன்னாள் மாணவர் அடைவு' : 'Alumni Directory'}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {isTa
                    ? 'உங்கள் பள்ளித் தோழர்களைக் கண்டறிய பெயர், ஆண்டு அல்லது பணியைக் கொண்டு தேடுங்கள்.'
                    : 'Search and connect with fellow batchmates across decades.'}
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isTa ? 'பெயர், ஆண்டு, ஊர் தேடுக...' : 'Search name, batch, city...'}
                    className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                  />
                </div>

                <select
                  value={selectedDecade}
                  onChange={(e) => setSelectedDecade(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="all">{isTa ? 'அனைத்து தொகுப்புகளும்' : 'All Batches'}</option>
                  <option value="1970-1989">1963 – 1989 Batches</option>
                  <option value="1990-1999">1990 – 1999 Batches</option>
                  <option value="2000-2009">2000 – 2009 Batches</option>
                  <option value="2010-plus">2010 – Present Batches</option>
                </select>
              </div>
            </div>

            {/* Alumni Grid */}
            {filteredAlumni.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
                <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  {isTa ? 'முடிவுகள் ஏதும் கிடைக்கவில்லை' : 'No Alumni Found'}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {isTa
                    ? 'வேறு தேடல் சொற்களைப் பயன்படுத்தி முயற்சிக்கவும் அல்லது புதியவராகப் பதிவு செய்யவும்.'
                    : 'Try clearing filters or enter a different name or batch year.'}
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition cursor-pointer"
                >
                  {isTa ? 'உங்கள் பெயரைப் பதிவு செய்யுங்கள்' : 'Register Your Profile'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAlumni.map((alumnus) => (
                  <div
                    key={alumnus.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start gap-4">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100">
                          <Image
                            src={alumnus.photoUrl || '/images/faculty-1.jpg'}
                            alt={alumnus.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-base font-bold font-heading text-slate-900 dark:text-white truncate">
                            {alumnus.name}
                          </h4>
                          <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-xs mt-1">
                            {isTa ? 'தொகுப்பு' : 'Batch'} {alumnus.batchYear}
                          </span>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {alumnus.qualification}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                        <div className="flex items-start gap-2">
                          <Briefcase className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">
                            <strong>{alumnus.currentDesignation}</strong>
                            {alumnus.companyOrOrg ? ` • ${alumnus.companyOrOrg}` : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{alumnus.location}</span>
                        </div>
                      </div>
                    </div>

                    {alumnus.message && (
                      <p className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 italic line-clamp-3">
                        &ldquo;{alumnus.message}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Enhanced Alumni Registration Modal with Photo Upload & Live ID Card Preview */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={
            submissionSuccess
              ? (isTa ? 'பதிவு வெற்றிகரமாக முடிந்தது!' : 'Registration Confirmed!')
              : (isTa ? 'முன்னாள் மாணவர் பதிவு படிவம்' : 'Alumni Registration Portal')
          }
          description={
            submissionSuccess
              ? (isTa ? 'எஸ்.யு.எம். குடும்பத்திற்கு தங்களை மீண்டும் அன்போடு வரவேற்கிறோம்.' : 'Welcome to the global S.U.M. Alumni Association.')
              : (isTa ? 'உங்கள் புகைப்படம் மற்றும் தொழில்முறை விவரங்களை இணைத்து எஸ்.யு.எம். வரலாற்றுப் பதிவேட்டில் இணையுங்கள்.' : 'Submit your profile with your photo. Profiles are published after school office verification.')
          }
          size="xl"
        >
          {submissionSuccess ? (
            /* Celebratory Confirmation Screen */
            <div className="py-4 space-y-6 text-center animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-2">
                  {isTa ? 'பதிவு குறிப்பு எண்' : 'Registration Reference Code'}
                </span>
                <div className="text-2xl font-black font-heading text-slate-900 dark:text-white tracking-wider">
                  {submissionSuccess.referenceId}
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-3">
                  {isTa ? `வாழ்த்துகள், ${submissionSuccess.name}!` : `Congratulations, ${submissionSuccess.name}!`}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
                  {isTa
                    ? `உங்கள் ${submissionSuccess.batchYear}-ஆம் ஆண்டுத் தொகுப்பு பதிவு பள்ளி அலுவலகத்திற்கு அனுப்பப்பட்டது. விரைவான சரிபார்ப்பிற்குப் பிறகு வரலாற்றுப் பக்கத்தில் வெளியாகும்.`
                    : `Your Batch of ${submissionSuccess.batchYear} profile has been submitted for school verification and will be published in the Alumni Hall of Fame.`}
                </p>
              </div>

              {/* Profile Card Preview */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4 text-left shadow-xs">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0 bg-slate-200 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={submissionSuccess.photoUrl || '/images/alumnus-1.jpg'}
                    alt={submissionSuccess.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {submissionSuccess.name}
                  </h4>
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    Batch of {submissionSuccess.batchYear}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">
                    {submissionSuccess.currentDesignation}
                    {submissionSuccess.companyOrOrg ? ` • ${submissionSuccess.companyOrOrg}` : ''}
                  </div>
                </div>
                <div className="shrink-0 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                  PENDING VERIFICATION
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <Button
                  variant="primary"
                  className="px-8 font-bold"
                  onClick={handleCloseModal}
                >
                  {isTa ? 'சரி / அடைவை பார்வையிடவும்' : 'Done & View Alumni Directory'}
                </Button>
              </div>
            </div>
          ) : (
            /* Registration Form with Live Photo Upload and Dual Column Layout */
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              {/* Photo Upload Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-indigo-50/70 dark:from-slate-900 dark:via-slate-900/90 dark:to-blue-950/30 border border-blue-200/80 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Avatar Frame with Upload Action Overlay */}
                  <div className="relative group shrink-0">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-3 border-amber-400 shadow-lg bg-white dark:bg-slate-800 flex items-center justify-center relative">
                      {isUploadingPhoto ? (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                          <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                          <span className="text-[10px] font-bold mt-1">Uploading...</span>
                        </div>
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={formData.photoUrl || '/images/faculty-1.jpg'}
                          alt="Alumni Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition transform hover:scale-105 cursor-pointer"
                      title={isTa ? 'புகைப்படத்தை மாற்றுக' : 'Upload custom photo'}
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Photo Upload Instructions & Button */}
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="text-xs sm:text-sm font-extrabold font-heading text-slate-900 dark:text-white flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                        <span>{isTa ? 'உங்கள் புகைப்படம் (Alumni Photo) *' : 'Alumni Photo Upload *'}</span>
                      </span>
                      {photoUploadSuccess && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Check className="w-3 h-3" />
                          {isTa ? 'பதிவேற்றப்பட்டது' : 'Uploaded'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {isTa
                        ? 'உங்கள் பாஸ்போர்ட் அல்லது தொழில்முறை புகைப்படத்தைப் பதிவேற்றவும் (JPG, PNG, WebP — தானாகவே பொருத்தப்படும்).'
                        : 'Upload your professional headshot or passport photo (JPEG, PNG, WebP). Automatic center-crop and optimization applied.'}
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handlePhotoSelect}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingPhoto}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isTa ? 'புகைப்படம் பதிவேற்றுக' : 'Choose Photo File'}</span>
                      </button>

                      {formData.photoUrl && formData.photoUrl !== '/images/faculty-1.jpg' && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, photoUrl: '/images/faculty-1.jpg' }));
                            setPhotoUploadSuccess(false);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 text-xs font-semibold transition"
                        >
                          {isTa ? 'மீட்டமை' : 'Reset'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Preset Avatar Fallbacks */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] font-semibold text-slate-500">
                    {isTa ? 'அல்லது விரைவு அவதாரைத் தேர்வு செய்யவும்:' : 'Or choose a preset school avatar:'}
                  </span>
                  <div className="flex items-center gap-2">
                    {AVATAR_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, photoUrl: preset.url }));
                          setPhotoUploadSuccess(false);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition flex items-center gap-1 cursor-pointer ${
                          formData.photoUrl === preset.url
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                        }`}
                      >
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Input Fields Grid */}
              <div className="space-y-4">
                {/* Name & Batch Year */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <Input
                      label={isTa ? 'முழுப்பெயர் (பெயர் & முதலெழுத்து) *' : 'Full Name (with Initials) *'}
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. S. Mariappan MBBS"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      {isTa ? 'படித்த ஆண்டு (Batch) *' : 'Batch Year *'}
                    </label>
                    <select
                      value={formData.batchYear || 2018}
                      onChange={(e) => setFormData({ ...formData, batchYear: parseInt(e.target.value, 10) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-xs"
                      required
                    >
                      {BATCH_YEARS.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr} {yr === 1963 ? '— Founding Pioneer Batch' : yr === 2023 ? '— Diamond Jubilee (60th)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Stream Completed & Qualification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      {isTa ? 'பள்ளியில் படித்த பிரிவு (Stream Completed)' : 'Stream / Course Completed'}
                    </label>
                    <select
                      value={formData.courseCompleted || 'HSC - Science & Mathematics'}
                      onChange={(e) => setFormData({ ...formData, courseCompleted: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-xs"
                    >
                      {COURSE_STREAMS.map((st) => (
                        <option key={st.value} value={st.value}>
                          {isTa ? st.labelTa : st.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label={isTa ? 'உயர் கல்வித்தகுதி (Degree/Qualification)' : 'Higher Qualification'}
                    value={formData.qualification || ''}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="e.g. M.S. (Software), B.E., Ph.D."
                  />
                </div>

                {/* Profession / Designation & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label={isTa ? 'தற்போதைய பதவி / தொழில் *' : 'Current Designation / Profession *'}
                    required
                    value={formData.currentDesignation || ''}
                    onChange={(e) => setFormData({ ...formData, currentDesignation: e.target.value })}
                    placeholder="e.g. Senior Medical Officer / Principal Architect"
                  />

                  <Input
                    label={isTa ? 'நிறுவனம் / பணிபுரியும் துறை' : 'Company / Institution / Department'}
                    value={formData.companyOrOrg || ''}
                    onChange={(e) => setFormData({ ...formData, companyOrOrg: e.target.value })}
                    placeholder="e.g. Apollo Hospitals / ISRO / TCS"
                  />
                </div>

                {/* Location & Social Profile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label={isTa ? 'தற்போது வசிக்கும் நகரம் & நாடு' : 'Current City & Country'}
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Chennai, Tamil Nadu / London, UK"
                  />

                  <Input
                    label={isTa ? 'லிங்க்ட்இன் / சமூக வலைத்தள இணைப்பு' : 'LinkedIn / Website Profile URL'}
                    value={formData.linkedinOrSocial || ''}
                    onChange={(e) => setFormData({ ...formData, linkedinOrSocial: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                {/* Private Contact Information (Encrypted / Admin Only) */}
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{isTa ? '🔒 ரகசிய தொடர்பு விவரங்கள் (பள்ளி நிர்வாகத்திற்கு மட்டும்)' : '🔒 Private Official Contact (Admin Vault Only)'}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {isTa
                      ? 'உங்கள் தொலைபேசி எண் மற்றும் மின்னஞ்சல் பொது வலைத்தளத்தில் காட்டப்படாது. பள்ளி முன்னாள் மாணவர் சந்திப்பு மற்றும் முக்கிய அழைப்புகளுக்கு மட்டுமே பயன்படும்.'
                      : 'Your email and phone number are stored in a private admin-only collection and will NEVER be displayed publicly.'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <Input
                      label={isTa ? 'தொலைபேசி எண் (WhatsApp / அழைப்பு)' : 'Mobile Phone (for Invitations)'}
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />

                    <Input
                      label={isTa ? 'அதிகாரப்பூர்வ மின்னஞ்சல்' : 'Official Email Address'}
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alumnus@domain.com"
                    />
                  </div>
                </div>

                {/* School Memory / Tribute to Teachers */}
                <Textarea
                  label={isTa ? 'பள்ளி நினைவுகள் / ஆசிரியர்களுக்கு நன்றி / இளைய மாணவர்களுக்கான செய்தி' : 'School Memory / Message to Juniors / Tribute to Teachers'}
                  rows={3}
                  value={formData.message || ''}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={
                    isTa
                      ? 'எஸ்.யு.எம். பள்ளியில் தாங்கள் படித்த பொற்கால நினைவுகள் அல்லது இளைய தலைமுறைக்கான ஊக்கச் செய்தி...'
                      : 'Share a cherished memory, mentor tribute, or words of encouragement for current students...'
                  }
                />
              </div>

              {/* Live Preview Card */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isTa ? 'நேரலை அட்டை முன்னோட்டம் (Live Directory Card Preview)' : 'Live Directory Card Preview'}</span>
                </span>
                
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3.5">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.photoUrl || '/images/faculty-1.jpg'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 text-xs">
                    <div className="font-bold text-slate-900 dark:text-white text-sm truncate">
                      {formData.name || (isTa ? 'முன்னாள் மாணவர் பெயர்' : 'Alumnus Name')}
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-[10px] mt-0.5">
                      Batch of {formData.batchYear || 2018} {formData.qualification ? `• ${formData.qualification}` : ''}
                    </span>
                    <div className="text-slate-600 dark:text-slate-400 truncate mt-1">
                      <strong>{formData.currentDesignation || (isTa ? 'தொழில் / பதவி' : 'Designation')}</strong>
                      {formData.companyOrOrg ? ` • ${formData.companyOrOrg}` : ''}
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      📍 {formData.location || (isTa ? 'ஊர், தமிழ்நாடு' : 'Location')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:flex-1 cursor-pointer font-bold"
                  onClick={handleCloseModal}
                >
                  {isTa ? 'ரத்து' : 'Cancel'}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full sm:flex-1 cursor-pointer font-extrabold shadow-md shadow-blue-600/20"
                  isLoading={isSubmitting || isUploadingPhoto}
                >
                  {isTa ? 'விவரங்களைச் சமர்ப்பி (Submit Profile)' : 'Submit Alumni Profile'}
                </Button>
              </div>
            </form>
          )}
        </Modal>
      </main>

      <Footer />
    </div>
  );
}
