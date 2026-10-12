'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, isSchoolAdmin, isSuperAdmin, loading } = useAuth();
  // If on login page, don't show admin sidebar/topbar
  const isLoginPage = pathname === '/admin/login';
  const isSuperAdminOnly = pathname === '/admin/users' || pathname.startsWith('/admin/users/') ||
                           pathname === '/admin/migration' || pathname.startsWith('/admin/migration/');
  const isSchoolAdminOnly = pathname === '/admin/results' || pathname.startsWith('/admin/results/') ||
                            pathname === '/admin/enquiries' || pathname.startsWith('/admin/enquiries/') ||
                            pathname === '/admin/settings' || pathname.startsWith('/admin/settings/') ||
                            pathname === '/admin/admissions' || pathname.startsWith('/admin/admissions/') ||
                            pathname === '/admin/school-info' || pathname.startsWith('/admin/school-info/');

  const isAuthorized = isAdmin && (!isSuperAdminOnly || isSuperAdmin) && (!isSchoolAdminOnly || isSchoolAdmin);

  useEffect(() => {
    if (isLoginPage) return;

    if (!loading && !isAuthorized) {
      if (isAdmin) {
        toast.error('Access restricted: Your administrator role lacks permission for this section.');
        router.replace('/admin');
      } else {
        router.replace('/admin/login');
      }
    }
  }, [loading, isAuthorized, isAdmin, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner
          size="lg"
          label={loading ? 'Verifying Administrator Access...' : 'Access denied. Returning to sign in...'}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 max-w-full">
        <AdminTopbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-3 sm:p-6 lg:p-8 flex-1 overflow-y-auto min-w-0 max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
