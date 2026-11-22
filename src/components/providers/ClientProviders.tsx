'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { SyncStatusProvider } from '@/contexts/SyncStatusContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from 'sonner';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SyncStatusProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </SyncStatusProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
