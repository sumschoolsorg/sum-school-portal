'use client';

import React from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export interface AdminTopbarProps {
  onToggleSidebar: () => void;
  title?: string;
}

export function AdminTopbar({ onToggleSidebar, title = 'Administration' }: AdminTopbarProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      // ignore
    }
    localStorage.removeItem('sum_admin_authenticated');
    router.push('/admin/login');
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold font-heading text-slate-900 dark:text-white">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            {user?.email ? user.email.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {user?.email || 'Super Administrator'}
            </span>
            <span className="text-[10px] text-amber-500 font-semibold uppercase">
              Full Privileges
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Sign out"
          className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
