'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { defaultAdmissionsContent } from '@/lib/defaultData';
import { enquiryRepository } from '@/lib/repositories';
import { addDocument } from '@/lib/firestore';
import { Enquiry } from '@/types';
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Send,
  Sparkles,
  Search,
  Copy,
  Check,
  Calendar,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  UserCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdmissionsPage() {
  const { t, getLocalized, language } = useLanguage();
  const isTa = language === 'ta';

  const content = defaultAdmissionsContent;

  const [activeTab, setActiveTab] = useState<'form' | 'tracker' | 'guidelines'>('form');

  // Registration Form State
  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    dob: '',
    gender: 'male',
    phone: '',
    email: '',
    address: '',
    classApplyingFor: 'LKG',
    previousSchool: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<{
    appNo: string;
    studentName: string;
    classApplyingFor: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Application Tracker State
  const [trackQuery, setTrackQuery] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackedRecord, setTrackedRecord] = useState<Enquiry | null>(null);
  const [trackSearched, setTrackSearched] = useState(false);

  const classOptions = isTa
    ? [
        { value: 'LKG', label: 'LKG (தொடக்க வகுப்பு)' },
        { value: 'UKG', label: 'UKG (முன்தொடக்க வகுப்பு)' },
        { value: 'Grade 1', label: '1-ஆம் வகுப்பு' },
        { value: 'Grade 2', label: '2-ஆம் வகுப்பு' },
        { value: 'Grade 3', label: '3-ஆம் வகுப்பு' },
        { value: 'Grade 4', label: '4-ஆம் வகுப்பு' },
        { value: 'Grade 5', label: '5-ஆம் வகுப்பு' },
        { value: 'Grade 6', label: '6-ஆம் வகுப்பு' },
        { value: 'Grade 7', label: '7-ஆம் வகுப்பு' },
        { value: 'Grade 8', label: '8-ஆம் வகுப்பு' },
        { value: 'Grade 9', label: '9-ஆம் வகுப்பு' },
        { value: 'Grade 10', label: '10-ஆம் வகுப்பு (SSLC)' },
        { value: 'Grade 11 (Science)', label: '11-ஆம் வகுப்பு – அறிவியல் பிரிவு' },
        { value: 'Grade 11 (Commerce)', label: '11-ஆம் வகுப்பு – வணிகவியல் பிரிவு' },
        { value: 'Grade 11 (Arts)', label: '11-ஆம் வகுப்பு – கலைப்பிரிவு' },
      ]
    : [
        { value: 'LKG', label: 'LKG (Lower Kindergarten)' },
        { value: 'UKG', label: 'UKG (Upper Kindergarten)' },
        { value: 'Grade 1', label: 'Grade 1' },
        { value: 'Grade 2', label: 'Grade 2' },
        { value: 'Grade 3', label: 'Grade 3' },
        { value: 'Grade 4', label: 'Grade 4' },
        { value: 'Grade 5', label: 'Grade 5' },
        { value: 'Grade 6', label: 'Grade 6' },
        { value: 'Grade 7', label: 'Grade 7' },
        { value: 'Grade 8', label: 'Grade 8' },
        { value: 'Grade 9', label: 'Grade 9' },
        { value: 'Grade 10', label: 'Grade 10' },
        { value: 'Grade 11 (Science)', label: 'Grade 11 – Science Stream' },
        { value: 'Grade 11 (Commerce)', label: 'Grade 11 – Commerce Stream' },
        { value: 'Grade 11 (Arts)', label: 'Grade 11 – Arts / Humanities Stream' },
      ];

  const genderOptions = [
    { value: 'male', label: t('admissions.genderMale', 'Male') },
    { value: 'female', label: t('admissions.genderFemale', 'Female') },
    { value: 'other', label: t('admissions.genderOther', 'Other') },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.parentName || !formData.studentName || !formData.phone) {
      toast.error(t('contact.errorRequired', 'Please complete all required fields.'));
      return;
    }

    setIsSubmitting(true);
    const appNumber = `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split('T')[0];

    const applicationPayload: Enquiry = {
      applicationNumber: appNumber,
      parentName: formData.parentName.trim(),
      studentName: formData.studentName.trim(),
      dob: formData.dob || undefined,
      gender: formData.gender,
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      classApplyingFor: formData.classApplyingFor,
      previousSchool: formData.previousSchool.trim(),
      message: formData.message.trim(),
      source: 'admission',
      status: 'new',
      notes: 'Online application received via admissions portal. Initial verification pending.',
      applicationDate: today,
    };

    try {
      // Save locally first to IndexedDB
      await enquiryRepository.create(applicationPayload);

      // Attempt Firestore sync
      try {
        await addDocument('enquiries', applicationPayload);
      } catch (fbErr) {
        console.warn('Firestore write warning, saved locally in IndexedDB:', fbErr);
      }

      setSubmittedApp({
        appNo: appNumber,
        studentName: formData.studentName,
        classApplyingFor: formData.classApplyingFor,
      });

      toast.success(
        isTa
          ? `சேர்க்கை விண்ணப்பம் பதிவு செய்யப்பட்டது! விண்ணப்ப எண்: ${appNumber}`
          : `Admission application submitted! Application No: ${appNumber}`
      );

      // Reset form
      setFormData({
        parentName: '',
        studentName: '',
        dob: '',
        gender: 'male',
        phone: '',
        email: '',
        address: '',
        classApplyingFor: 'LKG',
        previousSchool: '',
        message: '',
      });
    } catch (error) {
      console.error('Error recording admission enquiry:', error);
      toast.error('Failed to submit application. Please try again or visit school office.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyAppNo = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    toast.success('Application Number copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearchTracking = async (queryToSearch?: string) => {
    const term = (queryToSearch || trackQuery).trim().toLowerCase();
    if (!term) {
      toast.error(t('admissions.enterAppNoOrPhone', 'Please enter Application Number or Phone Number'));
      return;
    }

    setIsTracking(true);
    setTrackSearched(true);
    try {
      const allRecords = await enquiryRepository.getAll();
      const cleanDigits = term.replace(/\D/g, '');

      const match = allRecords.find((rec) => {
        const appMatch = rec.applicationNumber && rec.applicationNumber.toLowerCase() === term;
        const phoneMatch = cleanDigits.length >= 7 && rec.phone && rec.phone.replace(/\D/g, '').includes(cleanDigits);
        return appMatch || phoneMatch;
      });

      setTrackedRecord(match || null);
      if (!match) {
        toast.info(
          isTa
            ? 'விண்ணப்பம் கிடைக்கவில்லை. தயவுசெய்து எண்ணைச் சரிபார்க்கவும்.'
            : 'No matching application found. Please verify Application Number or Phone.'
        );
      }
    } catch (err) {
      console.error('Tracking query failed:', err);
      toast.error('Error fetching application records. Please try again.');
    } finally {
      setIsTracking(false);
    }
  };

  const announcementText = getLocalized(content, 'announcement');
  const eligibilityText = getLocalized(content, 'eligibility');
  const feeInfo = getLocalized(content, 'feeInformation');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50 dark:bg-slate-950">
        {/* Hero Banner */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
          <div className="container-main relative z-10 text-center">
            {content.announcementActive && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 animate-pulse-soft">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{announcementText}</span>
              </div>
            )}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight">
              {t('admissions.heroTitle', 'Admissions Open 2025–2026')}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              {t(
                'admissions.heroDescription',
                'Join the S.U.M. School family. We welcome online applications for Primary (LKG–5th), Secondary (6th–10th), and Higher Secondary (11th & 12th).'
              )}
            </p>

            {/* Navigation Tabs */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setActiveTab('form')}
                className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition shadow-sm cursor-pointer ${
                  activeTab === 'form'
                    ? 'bg-amber-400 text-slate-950 shadow-amber-400/20'
                    : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10'
                }`}
              >
                {t('admissions.tabApplication', 'Online Admission Registration')}
              </button>
              <button
                onClick={() => setActiveTab('tracker')}
                className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'tracker'
                    ? 'bg-amber-400 text-slate-950 shadow-amber-400/20'
                    : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>{t('admissions.tabStatus', 'Track Application Status')}</span>
              </button>
              <button
                onClick={() => setActiveTab('guidelines')}
                className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition shadow-sm cursor-pointer ${
                  activeTab === 'guidelines'
                    ? 'bg-amber-400 text-slate-950 shadow-amber-400/20'
                    : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10'
                }`}
              >
                {t('admissions.tabProcedure', 'Criteria & Guidelines')}
              </button>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="section-padding">
          <div className="container-main">
            {/* TAB 1: Online Admission Form */}
            {activeTab === 'form' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {isTa ? 'இணையவழி விண்ணப்பம்' : 'Online Registration'}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white mt-1">
                      {t('admissions.enquiryFormTitle', 'Online Admission Registration')}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {t(
                        'admissions.enquiryFormDesc',
                        'Please fill the applicant and guardian details. You will receive an official Application Tracking Number immediately upon submission.'
                      )}
                    </p>
                  </div>

                  {submittedApp ? (
                    <div className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-4 animate-scale-in">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-emerald-950 dark:text-emerald-100 font-heading">
                        {t('admissions.submissionSuccessTitle', 'Application Registered Successfully!')}
                      </h3>
                      <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 max-w-md mx-auto">
                        {t(
                          'admissions.saveAppNoHelp',
                          'Please save this Application Number to track your admission progress and verification status.'
                        )}
                      </p>

                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 inline-flex flex-col sm:flex-row items-center gap-4 shadow-sm">
                        <div className="text-left">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            {t('admissions.appNoGenerated', 'Application Tracking Number')}
                          </span>
                          <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
                            {submittedApp.appNo}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleCopyAppNo(submittedApp.appNo)}
                          variant="secondary"
                          size="sm"
                          leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        >
                          {copied ? 'Copied!' : 'Copy Code'}
                        </Button>
                      </div>

                      <div className="flex flex-wrap justify-center gap-3 pt-3">
                        <Button
                          onClick={() => {
                            setTrackQuery(submittedApp.appNo);
                            setActiveTab('tracker');
                            handleSearchTracking(submittedApp.appNo);
                          }}
                          variant="primary"
                          size="sm"
                          rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                          {t('admissions.trackNowBtn', 'Track Status Now')}
                        </Button>
                        <Button
                          onClick={() => setSubmittedApp(null)}
                          variant="outline"
                          size="sm"
                        >
                          {t('admissions.submitAnotherBtn', 'Submit Another Application')}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label={t('admissions.studentNameLabel', 'Student Full Name *')}
                          name="studentName"
                          required
                          placeholder={t('admissions.studentNamePlaceholder', 'Enter student name')}
                          value={formData.studentName}
                          onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        />

                        <Input
                          label={t('admissions.dobLabel', 'Date of Birth *')}
                          name="dob"
                          type="date"
                          required
                          value={formData.dob}
                          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select
                          label={t('admissions.genderLabel', 'Gender *')}
                          name="gender"
                          options={genderOptions}
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        />

                        <Select
                          label={t('admissions.classApplyingLabel', 'Class / Grade Applying For *')}
                          name="classApplyingFor"
                          options={classOptions}
                          value={formData.classApplyingFor}
                          onChange={(e) => setFormData({ ...formData, classApplyingFor: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label={t('admissions.parentNameLabel', 'Parent / Guardian Full Name *')}
                          name="parentName"
                          required
                          placeholder={t('admissions.parentNamePlaceholder', "Enter parent's full name")}
                          value={formData.parentName}
                          onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        />

                        <Input
                          label={t('admissions.phoneLabel', 'Contact Mobile Number *')}
                          name="phone"
                          type="tel"
                          required
                          placeholder={t('admissions.phonePlaceholder', '10-digit mobile number')}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label={t('admissions.emailLabel', 'Email Address (Optional)')}
                          name="email"
                          type="email"
                          placeholder={t('admissions.emailPlaceholder', 'parent@example.com')}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />

                        <Input
                          label={t('admissions.prevSchoolLabel', 'Previous School Details')}
                          name="previousSchool"
                          placeholder={t('admissions.prevSchoolPlaceholder', 'Previous school, location, and marks')}
                          value={formData.previousSchool}
                          onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                        />
                      </div>

                      <Textarea
                        label={t('admissions.addressLabel', 'Residential Address *')}
                        name="address"
                        required
                        rows={2}
                        placeholder={t('admissions.addressPlaceholder', 'Door No., Street Name, Village/Town, District, Pincode')}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />

                      <Textarea
                        label={t('admissions.messageLabel', 'Specific Enquiries or Questions')}
                        name="message"
                        rows={2}
                        placeholder={t(
                          'admissions.messagePlaceholder',
                          'Mention medium preference (Tamil/English), bus route requirement, or stream choice.'
                        )}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />

                      <Button
                        type="submit"
                        variant="accent"
                        size="lg"
                        className="w-full mt-3"
                        isLoading={isSubmitting}
                        rightIcon={<Send className="w-4 h-4" />}
                      >
                        {t('admissions.submitEnquiryBtn', 'Submit Official Admission Application')}
                      </Button>
                    </form>
                  )}
                </div>

                {/* Right Side: Quick Info & Document Checklist */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Status Checker Mini-Card */}
                  <div className="p-6 rounded-3xl bg-blue-900 text-white shadow-md relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800/80 text-blue-200 text-xs font-bold mb-3">
                        <Search className="w-3.5 h-3.5" />
                        <span>Already Registered?</span>
                      </div>
                      <h3 className="text-xl font-bold font-heading">
                        Check Your Application Status
                      </h3>
                      <p className="text-xs text-blue-200 mt-1 leading-relaxed">
                        Track verification progress, interview dates, or seat allotment status in real-time.
                      </p>
                      <Button
                        onClick={() => setActiveTab('tracker')}
                        variant="accent"
                        size="sm"
                        className="mt-4"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        Launch Status Tracker
                      </Button>
                    </div>
                  </div>

                  {/* Required Documents Checklist */}
                  <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      {t('admissions.docsTitle', 'Mandatory Document Checklist')}
                    </h3>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {(isTa && content.requiredDocuments_ta
                        ? content.requiredDocuments_ta
                        : content.requiredDocuments
                      ).map((doc: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Helpline Assistance */}
                  <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-bold uppercase">
                          Admissions Office Helpline
                        </div>
                        <a
                          href="tel:+914554265225"
                          className="text-base font-extrabold text-slate-900 dark:text-white hover:text-blue-600 transition"
                        >
                          +91 4554 265225
                        </a>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                      Working hours: Monday to Friday (9:00 AM – 4:30 PM). Royappanpatti, Theni District.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Application Status Tracker */}
            {activeTab === 'tracker' && (
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {isTa ? 'சேர்க்கை கண்காணிப்பு' : 'Application Tracking System'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white mt-1">
                    {t('admissions.tabStatus', 'Track Application Status')}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-lg mx-auto">
                    Enter your Application Tracking Number (e.g., ADM-2026-1001) or your registered 10-digit mobile number to view real-time status.
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
                    <Input
                      name="trackQuery"
                      placeholder="e.g. ADM-2026-1001 or 9842178901"
                      value={trackQuery}
                      onChange={(e) => setTrackQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearchTracking();
                      }}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleSearchTracking()}
                      variant="primary"
                      isLoading={isTracking}
                      leftIcon={<Search className="w-4 h-4" />}
                    >
                      {t('admissions.trackNowBtn', 'Track Status')}
                    </Button>
                  </div>

                  {/* Sample Chips for Testing */}
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                    <span className="text-slate-500 font-medium">Quick Demo Search:</span>
                    {['ADM-2026-1001', 'ADM-2026-1002', 'ADM-2026-1003', 'ADM-2026-1004'].map((chip) => (
                      <button
                        key={chip}
                        onClick={() => {
                          setTrackQuery(chip);
                          handleSearchTracking(chip);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-mono font-bold transition border border-slate-200 dark:border-slate-700 cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tracked Record Result */}
                {trackSearched && trackedRecord && (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 animate-scale-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800">
                            {trackedRecord.applicationNumber || 'APPLICATION'}
                          </span>
                          <span className="text-xs text-slate-400">
                            Registered on {trackedRecord.applicationDate || 'Recent'}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mt-1">
                          {trackedRecord.studentName}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500">
                          Class Applied: {trackedRecord.classApplyingFor}
                        </p>
                      </div>

                      <div>
                        {trackedRecord.status === 'approved' && (
                          <Badge variant="success" className="text-sm px-3 py-1">
                            ADMISSION APPROVED
                          </Badge>
                        )}
                        {trackedRecord.status === 'contacted' && (
                          <Badge variant="info" className="text-sm px-3 py-1">
                            PARENTS CONTACTED
                          </Badge>
                        )}
                        {trackedRecord.status === 'new' && (
                          <Badge variant="warning" className="text-sm px-3 py-1">
                            UNDER SCRUTINY
                          </Badge>
                        )}
                        {trackedRecord.status === 'follow-up' && (
                          <Badge variant="warning" className="text-sm px-3 py-1">
                            ADDITIONAL INFO NEEDED
                          </Badge>
                        )}
                        {trackedRecord.status === 'rejected' && (
                          <Badge variant="danger" className="text-sm px-3 py-1">
                            APPLICATION DECLINED
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Progress Milestones */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 py-2">
                      <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mb-1" />
                        <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">1. Submitted</span>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400">Registered</span>
                      </div>
                      <div className={`flex flex-col items-center text-center p-3 rounded-2xl border ${
                        trackedRecord.status !== 'new'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
                      }`}>
                        <Clock className={`w-5 h-5 mb-1 ${trackedRecord.status !== 'new' ? 'text-emerald-600' : 'text-amber-600 animate-spin-slow'}`} />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">2. Scrutiny</span>
                        <span className="text-[10px] text-slate-500">Document Check</span>
                      </div>
                      <div className={`flex flex-col items-center text-center p-3 rounded-2xl border ${
                        trackedRecord.status === 'approved'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}>
                        <ShieldCheck className={`w-5 h-5 mb-1 ${trackedRecord.status === 'approved' ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">3. Decision</span>
                        <span className="text-[10px] text-slate-500">{trackedRecord.status.toUpperCase()}</span>
                      </div>
                      <div className={`flex flex-col items-center text-center p-3 rounded-2xl border ${
                        trackedRecord.status === 'approved'
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60'
                      }`}>
                        <GraduationCap className={`w-5 h-5 mb-1 ${trackedRecord.status === 'approved' ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">4. Enrollment</span>
                        <span className="text-[10px] text-slate-500">ID &amp; Admission No</span>
                      </div>
                    </div>

                    {/* Official Remarks */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      <span className="text-xs font-bold uppercase text-slate-500">
                        Official Admissions Office Note:
                      </span>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1 leading-relaxed">
                        {trackedRecord.notes || 'Your application is registered. The school admissions committee is reviewing submitted details.'}
                      </p>
                    </div>

                    {/* Applicant Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400">Parent / Guardian:</span>
                        <div className="font-bold text-slate-800 dark:text-slate-200">{trackedRecord.parentName}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Contact Number:</span>
                        <div className="font-bold text-slate-800 dark:text-slate-200">{trackedRecord.phone}</div>
                      </div>
                      {trackedRecord.dob && (
                        <div>
                          <span className="text-slate-400">Date of Birth:</span>
                          <div className="font-bold text-slate-800 dark:text-slate-200">{trackedRecord.dob}</div>
                        </div>
                      )}
                      {trackedRecord.previousSchool && (
                        <div>
                          <span className="text-slate-400">Previous School:</span>
                          <div className="font-bold text-slate-800 dark:text-slate-200">{trackedRecord.previousSchool}</div>
                        </div>
                      )}
                      {trackedRecord.address && (
                        <div className="sm:col-span-2">
                          <span className="text-slate-400">Address:</span>
                          <div className="font-bold text-slate-800 dark:text-slate-200">{trackedRecord.address}</div>
                        </div>
                      )}
                    </div>

                    {/* Assistance Action */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                      <span className="text-slate-500">
                        Need assistance or clarification on your admission?
                      </span>
                      <a
                        href="tel:+914554265225"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call School Office (+91 4554 265225)</span>
                      </a>
                    </div>
                  </div>
                )}

                {trackSearched && !trackedRecord && (
                  <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                    <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      No Application Found
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      We could not find an admission record matching &ldquo;{trackQuery}&rdquo;. Please verify your tracking number or contact the school office directly.
                    </p>
                    <Button
                      onClick={() => setActiveTab('form')}
                      variant="primary"
                      size="sm"
                    >
                      Submit a New Application
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Criteria & Guidelines */}
            {activeTab === 'guidelines' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-6 space-y-8">
                  <div>
                    <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-3">
                      {t('admissions.eligibilityTitle', 'Eligibility & Age Criteria')}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {eligibilityText}
                    </p>
                  </div>

                  {/* Admission Steps */}
                  <div>
                    <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-4">
                      {t('admissions.stepsTitle', 'Step-by-Step Admission Procedure')}
                    </h3>
                    <div className="space-y-4">
                      {content.procedure.map((p) => {
                        const stepTitle = getLocalized(p, 'title');
                        const stepDesc = getLocalized(p, 'description');

                        return (
                          <div
                            key={p.step}
                            className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm"
                          >
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                              {p.step}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white text-sm font-heading">
                                {stepTitle}
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                                {stepDesc}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-8">
                  {/* Required Documents */}
                  <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                    <h3 className="text-base font-bold font-heading text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      {t('admissions.docsTitle', 'Required Documents Checklist')}
                    </h3>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {(isTa && content.requiredDocuments_ta
                        ? content.requiredDocuments_ta
                        : content.requiredDocuments
                      ).map((doc: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Fee Information Notice */}
                  <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-900 dark:text-amber-200">
                        {isTa ? 'கட்டணக் கொள்கை: ' : 'Fee Policy: '}
                      </span>
                      <span>{feeInfo}</span>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                      Ready to apply?
                    </h4>
                    <p className="text-xs text-slate-500 mb-4">
                      Submit your application online in just 2 minutes to reserve your interview slot.
                    </p>
                    <Button
                      onClick={() => setActiveTab('form')}
                      variant="primary"
                      size="sm"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Fill Online Admission Form
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
