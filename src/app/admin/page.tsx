'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Inbox,
  Bell,
  Calendar,
  Users,
  Plus,
  ArrowRight,
  School,
  Cloud,
  HardDrive,
  Upload,
  Copy,
  Check,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { toast } from 'sonner';
import {
  defaultSchoolSettings,
} from '@/lib/defaultData';
import {
  announcementRepository,
  eventRepository,
  facultyRepository,
  enquiryRepository,
  galleryRepository,
  schoolRepository,
  isFirebaseConfigured,
} from '@/lib/repositories';

export default function AdminDashboardPage() {
  const [schoolName, setSchoolName] = useState(defaultSchoolSettings.schoolName);
  const [dataMode] = useState(() => isFirebaseConfigured() ? 'cloud' : 'local');
  const [stats, setStats] = useState({
    enquiriesCount: 0,
    newEnquiriesCount: 0,
    announcementsCount: 0,
    eventsCount: 0,
    facultyCount: 0,
    galleryCount: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const [recentEnquiries, setRecentEnquiries] = useState<{
    id: string;
    studentName: string;
    parentName: string;
    classApplyingFor: string;
    phone: string;
    status: string;
    date: string;
  }[]>([]);

  useEffect(() => {
    let isMounted = true;
    const loadLiveStats = async () => {
      try {
        const [settings, enqs, anns, evts, facs, gals] = await Promise.all([
          schoolRepository.get().catch(() => null),
          enquiryRepository.getAll().catch(() => []),
          announcementRepository.getAll().catch(() => []),
          eventRepository.getAll().catch(() => []),
          facultyRepository.getAll().catch(() => []),
          galleryRepository.getAll().catch(() => []),
        ]);

        if (!isMounted) return;

        if (settings?.schoolName) {
          setSchoolName(settings.schoolName);
        }

        const newCount = enqs.filter((e) => e.status === 'new').length;
        setStats({
          enquiriesCount: enqs.length,
          newEnquiriesCount: newCount,
          announcementsCount: anns.length,
          eventsCount: evts.length,
          facultyCount: facs.length,
          galleryCount: gals.length,
        });
        setRecentEnquiries(
          enqs.slice(0, 5).map((e) => ({
            id: e.id || '',
            studentName: e.studentName || 'Student Applicant',
            parentName: e.parentName || 'Parent / Guardian',
            classApplyingFor: e.classApplyingFor || 'General Enquiry',
            phone: e.phone || '',
            status: e.status || 'new',
            date: e.createdAt
              ? (typeof e.createdAt === 'object' && 'toDate' in e.createdAt
                  ? (e.createdAt as { toDate: () => Date }).toDate().toLocaleDateString()
                  : e.createdAt instanceof Date
                    ? e.createdAt.toLocaleDateString()
                    : String(e.createdAt))
              : 'Recent',
          }))
        );
      } catch (err) {
        console.warn('Dashboard stats load error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadLiveStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const statCards = [
    {
      title: 'Total Enquiries',
      value: stats.enquiriesCount,
      sub: `${stats.newEnquiriesCount} awaiting review`,
      icon: <Inbox className="w-5 h-5 text-blue-600" />,
      link: '/admin/enquiries',
      color: 'bg-blue-50 dark:bg-blue-950/60',
    },
    {
      title: 'Announcements',
      value: stats.announcementsCount,
      sub: 'Published notices',
      icon: <Bell className="w-5 h-5 text-amber-500" />,
      link: '/admin/announcements',
      color: 'bg-amber-50 dark:bg-amber-950/60',
    },
    {
      title: 'Upcoming Events',
      value: stats.eventsCount,
      sub: 'Active calendar items',
      icon: <Calendar className="w-5 h-5 text-emerald-500" />,
      link: '/admin/events',
      color: 'bg-emerald-50 dark:bg-emerald-950/60',
    },
    {
      title: 'Faculty Members',
      value: stats.facultyCount,
      sub: 'Teaching coordinators',
      icon: <Users className="w-5 h-5 text-indigo-500" />,
      link: '/admin/faculty',
      color: 'bg-indigo-50 dark:bg-indigo-950/60',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Action Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-2">
            <span>School Administrative Portal</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              dataMode === 'cloud'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
            }`}>
              {dataMode === 'cloud' ? <Cloud className="w-3 h-3" /> : <HardDrive className="w-3 h-3" />}
              {dataMode === 'cloud' ? 'Cloud Firestore' : 'Local Preview'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-heading break-words">
            {schoolName}
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Welcome to the central management dashboard. Update school details, review admission applications, publish circulars, and manage public content in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => {
              setUploadedUrl('');
              setCopied(false);
              setIsUploadModalOpen(true);
            }}
            variant="primary"
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md font-semibold"
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Upload Image
          </Button>
          <Link href="/admin/announcements">
            <Button
              variant="accent"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Post Notice
            </Button>
          </Link>
          <Link href="/admin/enquiries">
            <Button
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white/10"
            >
              View Enquiries
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <Link key={idx} href={card.link}>
            <Card hoverEffect className="p-6 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-2xl ${card.color}`}>
                  {card.icon}
                </div>
              </div>
              <div className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                {card.value}
              </div>
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">
                {card.sub}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Two Column Section: Recent Enquiries & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Enquiries (Col 7) */}
        <div className="lg:col-span-7">
          <Card className="p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
                  Recent Admission Enquiries
                </h3>
              </div>
              <Link
                href="/admin/enquiries"
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentEnquiries.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-400 dark:text-slate-500">
                  <Inbox className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  No admission enquiries yet.
                </div>
              ) : (
                recentEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {enq.studentName}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Parent: {enq.parentName} &bull; {enq.phone}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                      Class: {enq.classApplyingFor}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Badge variant={enq.status === 'new' ? 'accent' : 'success'}>
                      {enq.status.toUpperCase()}
                    </Badge>
                    <span className="text-[11px] text-slate-400">{enq.date}</span>
                  </div>
                </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Quick Management Shortcuts (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <School className="w-5 h-5 text-amber-500" />
              Content Management Links
            </h3>

            <div className="space-y-2">
              {[
                { title: '⚡ Upload Images & Media Assets', href: '/admin/media' },
                { title: 'School Information & Logo', href: '/admin/school-info' },
                { title: 'Homepage Hero & Highlights', href: '/admin/homepage' },
                { title: 'About Page & Core Values', href: '/admin/about' },
                { title: 'Academic Streams & Subjects', href: '/admin/academics' },
                { title: '📅 Academic Years Table (2000–2041)', href: '/admin/academic-years' },
                { title: 'Admissions Criteria & Procedure', href: '/admin/admissions' },
                { title: 'Faculty & Teacher Profiles', href: '/admin/faculty' },
                { title: 'Campus Facilities & Photos', href: '/admin/facilities' },
                { title: 'School Photo Gallery', href: '/admin/gallery' },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
                >
                  <span>{item.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Image Upload Modal */}
      {isUploadModalOpen && (
        <Modal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          title="Quick Image Uploader"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Upload any campus photo, achievement trophy, or document image. Once uploaded, copy the URL to embed it into banners, announcements, or staff profiles.
            </p>

            <ImageUpload
              label="Select Image"
              folder="general"
              onImageUploaded={(url) => {
                setUploadedUrl(url);
                setCopied(false);
              }}
            />

            {uploadedUrl && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  <span>Image URL Ready:</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(uploadedUrl);
                      setCopied(true);
                      toast.success('Copied URL to clipboard!');
                      setTimeout(() => setCopied(false), 2500);
                    }}
                    className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 hover:underline cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy URL'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  readOnly
                  value={uploadedUrl}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-xs font-mono select-all text-slate-800 dark:text-slate-200"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Link
                href="/admin/media"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>Open Full Media Asset Manager</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsUploadModalOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
