'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, isConfigured } from '@/lib/firebase';

export type SyncStatusState =
  | 'ONLINE'
  | 'CONNECTING'
  | 'OFFLINE'
  | 'SYNCING'
  | 'SYNC_ERROR';

interface SyncStatusContextType {
  status: SyncStatusState;
  isOnline: boolean;
  isCloudConnected: boolean;
  lastSyncTime: Date | null;
  lastError: string | null;
  checkConnection: () => Promise<boolean>;
  startSync: () => void;
  endSync: (success: boolean, errorMessage?: string) => void;
}

const SyncStatusContext = createContext<SyncStatusContextType>({
  status: 'CONNECTING',
  isOnline: true,
  isCloudConnected: false,
  lastSyncTime: null,
  lastError: null,
  checkConnection: async () => false,
  startSync: () => {},
  endSync: () => {},
});

export function SyncStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SyncStatusState>('CONNECTING');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const checkInProgress = useRef(false);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;
    if (!navigator.onLine) {
      setStatus('OFFLINE');
      setIsCloudConnected(false);
      return false;
    }

    if (!isConfigured) {
      setStatus('OFFLINE');
      setIsCloudConnected(false);
      setLastError('Firebase credentials not configured.');
      return false;
    }

    if (checkInProgress.current) return isCloudConnected;
    checkInProgress.current = true;

    try {
      // Probe Firestore with a quick 6-second timeout
      const probePromise = getDoc(doc(db, 'schoolSettings', 'default'));
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Connection timed out')), 6000)
      );

      await Promise.race([probePromise, timeoutPromise]);
      setStatus('ONLINE');
      setIsCloudConnected(true);
      setLastError(null);
      setLastSyncTime(new Date());
      checkInProgress.current = false;
      return true;
    } catch (err: unknown) {
      const msg = (err as Error)?.message || 'Firebase service unreachable';
      console.warn('Firebase connectivity probe:', msg);
      setStatus('OFFLINE');
      setIsCloudConnected(false);
      setLastError(msg);
      checkInProgress.current = false;
      return false;
    }
  }, [isCloudConnected]);

  const startSync = useCallback(() => {
    setStatus('SYNCING');
  }, []);

  const endSync = useCallback((success: boolean, errorMessage?: string) => {
    if (success) {
      setStatus('ONLINE');
      setIsCloudConnected(true);
      setLastSyncTime(new Date());
      setLastError(null);
    } else {
      setStatus('SYNC_ERROR');
      if (errorMessage) setLastError(errorMessage);
    }
  }, []);

  useEffect(() => {
    // Defer initial check to avoid synchronous cascading renders during mount
    const initialTimer = setTimeout(() => {
      checkConnection();
    }, 50);

    const handleOnline = () => {
      setStatus('CONNECTING');
      checkConnection();
    };

    const handleOffline = () => {
      setStatus('OFFLINE');
      setIsCloudConnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic heartbeat every 45 seconds
    const interval = setInterval(() => {
      if (navigator.onLine) {
        checkConnection();
      }
    }, 45000);

    return () => {
      clearTimeout(initialTimer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [checkConnection]);

  const isOnline = status === 'ONLINE' || status === 'SYNCING';

  return (
    <SyncStatusContext.Provider
      value={{
        status,
        isOnline,
        isCloudConnected,
        lastSyncTime,
        lastError,
        checkConnection,
        startSync,
        endSync,
      }}
    >
      {children}
    </SyncStatusContext.Provider>
  );
}

export function useSyncStatus() {
  return useContext(SyncStatusContext);
}
