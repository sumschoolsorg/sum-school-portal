'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { alumniRepository, alumniPrivateRepository } from '@/lib/repositories';
import { defaultAlumni } from '@/lib/defaultData';
import { AlumniMember } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import {
  GraduationCap,
  Award,
  Briefcase,
  MapPin,
  Search,
  Quote,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AlumniPage() {
  const { language } = useLanguage();
  const isTa = language === 'ta';

  const [alumniList, setAlumniList] = useState<AlumniMember[]>(defaultAlumni);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDecade, setSelectedDecade] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<AlumniMember>>({
    name: '',
    batchYear: 2015,
    qualification: '',
    currentDesignation: '',
    companyOrOrg: '',
    location: '',
    photoUrl: '/images/faculty-1.jpg',
    message: '',
    email: '',
    phone: '',
  });

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
        }
      } catch (err) {
        console.warn('Error loading alumni:', err);
      }
    };
    loadAlumni();
  }, []);

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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.batchYear || !formData.currentDesignation) {
      toast.error(isTa ? 'அனைத்து முக்கிய விவரங்களையும் நிரப்புக.' : 'Please fill all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const generatedId = `alumni-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      // Public profile document - strictly non-sensitive fields only
      await alumniRepository.create({
        id: generatedId,
        name: formData.name.trim(),
        batchYear: Number(formData.batchYear),
        qualification: formData.qualification || 'Alumnus',
        currentDesignation: formData.currentDesignation.trim(),
        companyOrOrg: formData.companyOrOrg?.trim() || 'Organization',
        location: formData.location?.trim() || 'Tamil Nadu',
        photoUrl: formData.photoUrl || '/images/faculty-1.jpg',
        message: formData.message?.trim() || 'Proud alumnus of S.U.M. School, Royappanpatti.',
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

      toast.success(
        isTa
          ? 'உங்கள் விவரங்கள் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டன! பள்ளி நிர்வாக ஒப்புதலுக்குப் பிறகு வெளியிடப்படும்.'
          : 'Registration submitted successfully! Your profile will appear after school admin verification.'
      );

      setIsModalOpen(false);
      setFormData({
        name: '',
        batchYear: 2015,
        qualification: '',
        currentDesignation: '',
        companyOrOrg: '',
        location: '',
        photoUrl: '/images/faculty-1.jpg',
        message: '',
        email: '',
        phone: '',
      });
    } catch (err) {
      console.error('Registration failed:', err);
      toast.error(isTa ? 'பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.' : 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="flex-1">
        {/* Page Hero */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />
          <div className="container-main relative z-10 text-center">
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-300 mb-4 px-4 py-1.5 rounded-full bg-white/10 border border-white/20">
              <GraduationCap className="w-4 h-4" />
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
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                {isTa ? 'முன்னாள் மாணவராக இணையுங்கள்' : 'Join the Alumni Network'}
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
                    ? 'வேறு தேடல் சொற்களைப் பயன்படுத்தி முயற்சிக்கவும்.'
                    : 'Try clearing filters or enter a different name or batch year.'}
                </p>
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

        {/* Registration Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={isTa ? 'முன்னாள் மாணவர் பதிவு' : 'Alumni Registration'}
          description={isTa ? 'எஸ்.யு.எம். குடும்பத்துடன் இணைந்திருங்கள் — உங்கள் விவரங்கள் பள்ளி நிர்வாக ஒப்புதலுக்குப் பிறகு வெளியிடப்படும்.' : 'Reunite with your alma mater. Your profile will be published after school verification.'}
          size="lg"
        >
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <Input
              label={isTa ? 'முழுப்பெயர் *' : 'Full Name *'}
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. S. Mariappan"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isTa ? 'படித்த ஆண்டு (Batch Year) *' : 'Graduating Batch Year *'}
                type="number"
                required
                min={1963}
                max={2030}
                value={formData.batchYear || 2015}
                onChange={(e) => setFormData({ ...formData, batchYear: parseInt(e.target.value, 10) })}
              />

              <Input
                label={isTa ? 'கல்வித்தகுதி (விருப்பத்தேர்வு)' : 'Highest Qualification'}
                value={formData.qualification || ''}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="e.g. B.Tech / M.Sc. / MBBS"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isTa ? 'தற்போதைய பதவி / தொழில் *' : 'Current Designation *'}
                required
                value={formData.currentDesignation || ''}
                onChange={(e) => setFormData({ ...formData, currentDesignation: e.target.value })}
                placeholder="e.g. Software Engineer / Teacher"
              />

              <Input
                label={isTa ? 'நிறுவனம் / பணிபுரியும் இடம்' : 'Company / Institution'}
                value={formData.companyOrOrg || ''}
                onChange={(e) => setFormData({ ...formData, companyOrOrg: e.target.value })}
                placeholder="e.g. Govt. Hospital / TCS"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={isTa ? 'தற்போது வசிக்கும் ஊர்' : 'Current City & State'}
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Theni, Tamil Nadu"
              />

              <Input
                label={isTa ? 'மின்னஞ்சல் (நிர்வாக தொடர்புக்கு மட்டும்)' : 'Email (Admin Contact Only)'}
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alumnus@gmail.com"
              />
            </div>

            <Textarea
              label={isTa ? 'பள்ளி நினைவுகள் / செய்தி' : 'School Memory / Message to Juniors'}
              rows={3}
              value={formData.message || ''}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder={
                isTa
                  ? 'உங்கள் பள்ளி நினைவுகள் அல்லது இளைய மாணவர்களுக்கான அறிவுரை...'
                  : 'Share a fond memory or word of encouragement for current students...'
              }
            />

            <div className="pt-3 flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:flex-1"
                onClick={() => setIsModalOpen(false)}
              >
                {isTa ? 'ரத்து' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="w-full sm:flex-1"
                isLoading={isSubmitting}
              >
                {isTa ? 'விவரங்களைச் சமர்ப்பி' : 'Submit Registration'}
              </Button>
            </div>
          </form>
        </Modal>
      </main>

      <Footer />
    </div>
  );
}
