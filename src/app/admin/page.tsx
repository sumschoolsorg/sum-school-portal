'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Inbox,
  Bell,
  Calendar,
  Users,
  Image as ImageIcon,
  Trophy,
  Plus,
  ArrowRight,
  School,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  defaultAnnouncements,
  defaultEvents,
  defaultFaculty,
  defaultSchoolSettings,
} from '@/lib/defaultData';
import {
  announcementRepository,
  eventRepository,
  facultyRepository,
  enquiryRepository,
  galleryRepository,
} from '@/lib/repositories';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    enquiriesCount: 12,
    newEnquiriesCount: 4,
    announcementsCount: defaultAnnouncements.length,
    eventsCount: defaultEvents.length,
    facultyCount: defaultFaculty.length,
    galleryCount: 9,
  });

  const [recentEnquiries, setRecentEnquiries] = useState([
    {
      id: 'enq-1',
      studentName: 'R. Kavin',
      parentName: 'R. Rajesh',
      classApplyingFor: 'Grade 11 (Science)',
      phone: '+91 98765 43210',
      status: 'new',
      date: 'Today, 10:30 AM',
    },
    {
      id: 'enq-2',
      studentName: 'M. Sneha',
      parentName: 'M. Meenakshi',
      classApplyingFor: 'LKG',
      phone: '+91 98765 12345',
      status: 'new',
      date: 'Today, 9:15 AM',
    },
    {
      id: 'enq-3',
      studentName: 'S. Harish',
      parentName: 'S. Sundaram',
      classApplyingFor: 'Grade 6',
      phone: '+91 94444 55555',
      status: 'contacted',
      date: 'Yesterday',
    },
  ]);

  useEffect(() => {
    let isMounted = true;
    const loadLiveStats = async () => {
      try {
        const [enqs, anns, evts, facs, gals] = await Promise.all([
          enquiryRepository.getAll().catch(() => []),
          announcementRepository.getAll().catch(() => []),
          eventRepository.getAll().catch(() => []),
          facultyRepository.getAll().catch(() => []),
          galleryRepository.getAll().catch(() => []),
        ]);

        if (!isMounted) return;

        if (enqs && enqs.length > 0) {
          const newCount = enqs.filter((e) => e.status === 'new').length;
          setStats((prev) => ({
            ...prev,
            enquiriesCount: enqs.length,
            newEnquiriesCount: newCount,
            announcementsCount: anns.length || prev.announcementsCount,
            eventsCount: evts.length || prev.eventsCount,
            facultyCount: facs.length || prev.facultyCount,
            galleryCount: gals.length || prev.galleryCount,
          }));
          setRecentEnquiries(
            enqs.slice(0, 5).map((e) => ({
              id: e.id || '',
              studentName: e.studentName || 'Student Applicant',
              parentName: e.parentName || 'Parent / Guardian',
              classApplyingFor: e.classApplyingFor || 'General Enquiry',
              phone: e.phone || '',
              status: e.status || 'new',
              date: e.createdAt instanceof Date
                ? e.createdAt.toLocaleDateString()
                : 'Recent',
            }))
          );
        } else {
          setStats((prev) => ({
            ...prev,
            announcementsCount: anns.length || prev.announcementsCount,
            eventsCount: evts.length || prev.eventsCount,
            facultyCount: facs.length || prev.facultyCount,
            galleryCount: gals.length || prev.galleryCount,
          }));
        }
      } catch (err) {
        console.warn('Dashboard stats load error:', err);
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

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Action Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            School Administrative Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading">
            {defaultSchoolSettings.schoolName}
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Welcome to the central management dashboard. Update school details, review admission applications, publish circulars, and manage public content in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
              {recentEnquiries.map((enq) => (
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
              ))}
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
                { title: 'School Information & Logo', href: '/admin/school-info' },
                { title: 'Homepage Hero & Highlights', href: '/admin/homepage' },
                { title: 'About Page & Core Values', href: '/admin/about' },
                { title: 'Academic Streams & Subjects', href: '/admin/academics' },
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
    </div>
  );
}
