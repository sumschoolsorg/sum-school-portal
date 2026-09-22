'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  School,
  Home,
  Info,
  GraduationCap,
  FileCheck,
  Users,
  Building2,
  Bell,
  Calendar,
  Image as ImageIcon,
  Trophy,
  MessageSquareQuote,
  Inbox,
  Settings,
  ShieldAlert,
  LogOut,
  ExternalLink,
  X,
  Search,
  Layers,
  Palette,
  Cloud,
  Bus,
  Award,
  UserCheck,
  Milestone,
} from 'lucide-react';
import { signOut } from '@/lib/auth';
import { toast } from 'sonner';

export interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      // ignore
    }
    localStorage.removeItem('sum_admin_authenticated');
    toast.success('Signed out of Admin Portal.');
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/admin/school-info', label: 'School Info', icon: <School className="w-4 h-4" /> },
    { href: '/admin/research', label: 'Research & Verification', icon: <Search className="w-4 h-4" /> },
    { href: '/admin/banners', label: 'Hero Banners', icon: <Layers className="w-4 h-4" /> },
    { href: '/admin/homepage', label: 'Homepage Content', icon: <Home className="w-4 h-4" /> },
    { href: '/admin/about', label: 'About School', icon: <Info className="w-4 h-4" /> },
    { href: '/admin/academics', label: 'Academics', icon: <GraduationCap className="w-4 h-4" /> },
    { href: '/admin/results', label: 'Exam Results', icon: <Award className="w-4 h-4" /> },
    { href: '/admin/admissions', label: 'Admissions', icon: <FileCheck className="w-4 h-4" /> },
    { href: '/admin/faculty', label: 'Faculty & Staff', icon: <Users className="w-4 h-4" /> },
    { href: '/admin/facilities', label: 'Facilities', icon: <Building2 className="w-4 h-4" /> },
    { href: '/admin/transport', label: 'Bus & Transport', icon: <Bus className="w-4 h-4" /> },
    { href: '/admin/alumni', label: 'Alumni Network', icon: <UserCheck className="w-4 h-4" /> },
    { href: '/admin/announcements', label: 'Announcements', icon: <Bell className="w-4 h-4" /> },
    { href: '/admin/events', label: 'Events & Calendar', icon: <Calendar className="w-4 h-4" /> },
    { href: '/admin/gallery', label: 'Photo Gallery', icon: <ImageIcon className="w-4 h-4" /> },
    { href: '/admin/achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
    { href: '/admin/timeline', label: 'School Timeline', icon: <Milestone className="w-4 h-4" /> },
    { href: '/admin/testimonials', label: 'Testimonials', icon: <MessageSquareQuote className="w-4 h-4" /> },
    { href: '/admin/enquiries', label: 'Enquiries & Messages', icon: <Inbox className="w-4 h-4" /> },
    { href: '/admin/theme', label: 'Theme & Branding', icon: <Palette className="w-4 h-4" /> },
    { href: '/admin/settings', label: 'Website Settings', icon: <Settings className="w-4 h-4" /> },
    { href: '/admin/users', label: 'Admin Users', icon: <ShieldAlert className="w-4 h-4" /> },
    { href: '/admin/migration', label: 'Backup & Firebase', icon: <Cloud className="w-4 h-4" /> },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`admin-sidebar fixed lg:static inset-y-0 left-0 z-50 bg-slate-950 text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white p-1 flex items-center justify-center shadow-md border border-white/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/school-crest.png"
                  alt="S.U.M. School Crest"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-base text-white">
                  S.U.M. Admin
                </span>
                <span className="text-[10px] font-semibold text-amber-400 tracking-wider uppercase">
                  Royappanpatti • 1963
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-180px)] space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive(item.href)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              View Public Website
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
