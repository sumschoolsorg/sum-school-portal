'use client';

import React from 'react';
import { Menu, LogOut, Cloud, CloudOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSyncStatus } from '@/contexts/SyncStatusContext';
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
  '/admin/academic-years': 'Academic Year Master Table (2000–2041)',
  '/admin/admissions': 'Admissions Information & Procedure',
  '/admin/faculty': 'Faculty & Staff Directory',
  '/admin/facilities': 'Campus Facilities & Infrastructure',
  '/admin/announcements': 'Announcements & Circulars',
  '/admin/events': 'School Calendar & Events',
  '/admin/gallery': 'Photo Gallery & Media',
  '/admin/media': 'Image Upload & Media Asset Manager',
  '/admin/achievements': 'Student Honors & Toppers Directory',
  '/admin/testimonials': 'Parent & Alumni Testimonials',
  '/admin/timeline': 'School History & Milestones',
  '/admin/research': 'Heritage & Historical Research',
  '/admin/theme': 'Branding & Theme Settings',
  '/admin/enquiries': 'Admission Applications & Enquiries',
  '/admin/alumni': '60+ Years of Proud Alumni Heritage',
  '/admin/transport': 'Transport Routes & Bus Schedules',
  '/admin/results': 'Student Results & Grade Cards',
  '/admin/users': 'Admin Accounts & Roles',
  '/admin/settings': 'Website Settings & Configuration',
  '/admin/migration': 'Data Storage & Cloud Migration',
};

export function AdminTopbar({ onToggleSidebar, title }: AdminTopbarProps) {
  const { user, isSuperAdmin, isSchoolAdmin, isCloudAuthenticated, role, logout } = useAuth();
  const { status, isOnline, isCloudConnected, lastSyncTime, lastError, checkConnection } = useSyncStatus();
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
    await logout();
    toast.success('Signed out of Admin Portal.');
    router.push('/admin/login');
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 min-w-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex flex-col min-w-0">
          <span className="hidden sm:block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            S.U.M. School Portal
          </span>
          <h1 className="text-sm sm:text-lg lg:text-xl font-bold font-heading text-slate-900 dark:text-white truncate">
            {displayTitle}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {(() => {
          let badgeClasses = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
          let badgeIcon = <Cloud className="w-3.5 h-3.5" />;
          let badgeLabel = 'CONNECTING';

          const isConnectedOnline = isOnline && (status === 'ONLINE' || isCloudConnected || isCloudAuthenticated);

          if (status === 'SYNCING') {
            badgeClasses = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 animate-pulse';
            badgeIcon = <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600 dark:text-blue-400" />;
            badgeLabel = 'SYNCING';
          } else if (isConnectedOnline) {
            badgeClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 cursor-pointer';
            badgeIcon = <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
            badgeLabel = 'ONLINE';
          } else if (status === 'CONNECTING') {
            badgeClasses = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 cursor-pointer';
            badgeIcon = <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600 dark:text-amber-400" />;
            badgeLabel = 'CONNECTING';
          } else if (status === 'SYNC_ERROR') {
            badgeClasses = 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-700 hover:bg-amber-100 cursor-pointer';
            badgeIcon = <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
            badgeLabel = 'SYNC WARNING';
          } else {
            badgeClasses = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800 hover:bg-rose-100 cursor-pointer';
            badgeIcon = <CloudOff className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
            badgeLabel = 'OFFLINE';
          }

          const tooltip = lastSyncTime
            ? `Status: ${badgeLabel} • Cloud Firestore synchronized at ${lastSyncTime.toLocaleTimeString()} (Click to verify connection)`
            : (lastError ? `Status: ${badgeLabel} • ${lastError} (Click to re-check)` : `Firebase Status: ${badgeLabel} (Click to verify)`);

          const handleBadgeClick = async () => {
            toast.loading('Checking Firebase Cloud Database connection...', { id: 'sync-status-check' });
            try {
              const ok = await checkConnection();
              if (ok) {
                toast.success('Firebase Cloud Firestore & Storage is connected and synchronized (ONLINE)!', { id: 'sync-status-check' });
              } else {
                toast.warning('Working with local cached data. Cloud synchronization will resume automatically when connected.', { id: 'sync-status-check' });
              }
            } catch {
              toast.error('Could not reach Firebase. Check your internet connection.', { id: 'sync-status-check' });
            }
          };

          return (
            <button
              type="button"
              onClick={handleBadgeClick}
              className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${badgeClasses}`}
              title={tooltip}
              aria-label={`Database synchronization status: ${badgeLabel}. Click to verify.`}
            >
              {badgeIcon}
              <span>{badgeLabel}</span>
            </button>
          );
        })()}

        <div className="flex items-center gap-2 sm:gap-3">
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
