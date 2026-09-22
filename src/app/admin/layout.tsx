'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  // If on login page, don't show admin sidebar/topbar
  const isLoginPage = pathname === '/admin/login';

  const hasLocalAuth = typeof window !== 'undefined' && localStorage.getItem('sum_admin_authenticated') === 'true';
  const isAuthorized = Boolean(user || hasLocalAuth);

  useEffect(() => {
    if (isLoginPage) return;

    if (!loading && !isAuthorized) {
      router.push('/admin/login');
    }
  }, [loading, isAuthorized, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading && !isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner size="lg" label="Verifying Administrator Access..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col lg:flex-row">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
