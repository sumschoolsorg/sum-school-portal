'use client';

import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/lib/auth';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export interface AdminTopbarProps {
  onToggleSidebar: () => void;
  title?: string;
}

const ROUTE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard Overview',
  '/admin/school-info': 'School Profile & Settings',
  '/admin/homepage': 'Homepage Content Management',
  '/admin/banners': 'Hero Banners & Carousel',
  '/admin/about': 'About School & Core Values',
  '/admin/academics': 'Academics & Curriculum Streams',
  '/admin/admissions': 'Admissions Information & Procedure',
  '/admin/faculty': 'Faculty & Staff Directory',
  '/admin/facilities': 'Campus Facilities & Infrastructure',
  '/admin/announcements': 'Announcements & Circulars',
  '/admin/events': 'School Calendar & Events',
  '/admin/gallery': 'Photo Gallery & Media',
  '/admin/achievements': 'Student Achievements & Toppers',
  '/admin/testimonials': 'Parent & Alumni Testimonials',
  '/admin/timeline': 'School History & Milestones',
  '/admin/research': 'Heritage & Historical Research',
  '/admin/theme': 'Branding & Theme Settings',
  '/admin/enquiries': 'Admission Applications & Enquiries',
  '/admin/alumni': 'Alumni Directory & Network',
  '/admin/transport': 'Transport Routes & Bus Schedules',
  '/admin/results': 'Student Results & Grade Cards',
  '/admin/users': 'Admin Accounts & Roles',
  '/admin/settings': 'Website Settings & Configuration',
  '/admin/migration': 'Data Storage & Cloud Migration',
};

export function AdminTopbar({ onToggleSidebar, title }: AdminTopbarProps) {
  const { user, isSuperAdmin, isSchoolAdmin, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const displayTitle = title || ROUTE_TITLES[pathname] || 'Administration';

  const roleLabel = isSuperAdmin
    ? 'Super Administrator'
    : isSchoolAdmin
      ? 'School Administrator'
      : role === 'content-manager'
        ? 'Content Manager'
        : 'Administrator';

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Signed out of Admin Portal.');
    } catch {
      toast.info('Signed out.');
    }
    localStorage.removeItem('sum_admin_authenticated');
    router.push('/admin/login');
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex flex-col">
          <span className="hidden sm:block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            S.U.M. School Portal
          </span>
          <h1 className="text-base sm:text-xl font-bold font-heading text-slate-900 dark:text-white line-clamp-1">
            {displayTitle}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {user?.email ? user.email.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {user?.email || 'Administrator'}
            </span>
            <span
              className={`text-[10px] font-semibold uppercase ${
                isSuperAdmin
                  ? 'text-purple-600 dark:text-purple-400'
                  : isSchoolAdmin
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {roleLabel}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Sign out"
          aria-label="Sign out"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
