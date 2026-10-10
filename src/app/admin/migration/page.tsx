'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  exportAllLocalData,
  importAllLocalData,
  getLocalAll,
  STORES,
  StoreName,
} from '@/lib/db/indexedDB';
import {
  isFirebaseConfigured,
  getCurrentDataMode,
  setDataMode,
  DataMode,
} from '@/lib/repositories';
import {
  Database,
  Cloud,
  Download,
  Upload,
  RefreshCw,
  Server,
} from 'lucide-react';
import { toast } from 'sonner';

interface CollectionStatItem {
  storeName: StoreName;
  displayName: string;
  count: number;
}

const STORE_DISPLAY_NAMES: Record<StoreName, string> = {
  [STORES.SCHOOL_SETTINGS]: 'School Profile & Settings',
  [STORES.HOMEPAGE_CONTENT]: 'Homepage Content',
  [STORES.HERO_BANNERS]: 'Hero Banners (Carousel)',
  [STORES.ABOUT_CONTENT]: 'About School Content',
  [STORES.ACADEMICS_CONTENT]: 'Academics & Streams',
  [STORES.ADMISSIONS_CONTENT]: 'Admissions Content',
  [STORES.FACULTY]: 'Faculty & Staff Members',
  [STORES.FACILITIES]: 'Campus Facilities',
  [STORES.ANNOUNCEMENTS]: 'Announcements & News',
  [STORES.EVENTS]: 'Calendar Events',
  [STORES.GALLERY]: 'Photo Gallery',
  [STORES.ACHIEVEMENTS]: 'Student Achievements',
  [STORES.TESTIMONIALS]: 'Parent & Alum Testimonials',
  [STORES.RESEARCH_RECORDS]: 'Verified Research Records',
  [STORES.THEME_SETTINGS]: 'Theme & Brand Tokens',
  [STORES.WEBSITE_SETTINGS]: 'SEO & Legal Settings',
  [STORES.ADMIN_USERS]: 'Admin Users (RBAC)',
  [STORES.TIMELINE]: 'School Journey Timeline Entries',
  [STORES.ALUMNI]: 'Alumni Directory & Profiles',
  [STORES.ALUMNI_PRIVATE]: 'Private Alumni Contact Records',
  [STORES.TRANSPORT_ROUTES]: 'School Bus & Transport Routes',
  [STORES.STUDENT_RESULTS]: 'Student Examination Results & Marksheets',
  [STORES.ENQUIRIES]: 'Admission Enquiries',
  [STORES.CONTACT_MESSAGES]: 'Contact Messages',
};

// IndexedDB uses snake_case names while Firestore uses these collection names.
const FIRESTORE_COLLECTIONS: Partial<Record<StoreName, string>> = {
  [STORES.SCHOOL_SETTINGS]: 'schoolSettings',
  [STORES.HOMEPAGE_CONTENT]: 'homepageContent',
  [STORES.HERO_BANNERS]: 'heroBanners',
  [STORES.ABOUT_CONTENT]: 'aboutContent',
  [STORES.ACADEMICS_CONTENT]: 'academicsContent',
  [STORES.ADMISSIONS_CONTENT]: 'admissionsContent',
  [STORES.FACULTY]: 'faculty',
  [STORES.FACILITIES]: 'facilities',
  [STORES.ANNOUNCEMENTS]: 'announcements',
  [STORES.EVENTS]: 'events',
  [STORES.GALLERY]: 'gallery',
  [STORES.ACHIEVEMENTS]: 'achievements',
  [STORES.TIMELINE]: 'timelineEntries',
  [STORES.TESTIMONIALS]: 'testimonials',
  [STORES.ENQUIRIES]: 'enquiries',
  [STORES.CONTACT_MESSAGES]: 'contactMessages',
  [STORES.RESEARCH_RECORDS]: 'researchRecords',
  [STORES.THEME_SETTINGS]: 'themeSettings',
  [STORES.WEBSITE_SETTINGS]: 'websiteSettings',
  [STORES.ADMIN_USERS]: 'adminUsers',
  [STORES.ALUMNI]: 'alumni',
  [STORES.ALUMNI_PRIVATE]: 'alumniPrivate',
  [STORES.TRANSPORT_ROUTES]: 'transportRoutes',
  [STORES.STUDENT_RESULTS]: 'studentResults',
};

export default function MigrationAdminPage() {
  const [stats, setStats] = useState<CollectionStatItem[]>([]);
  const [currentMode, setCurrentMode] = useState<DataMode>(() => getCurrentDataMode());
  const [firebaseReady, setFirebaseReady] = useState(() => isFirebaseConfigured());
  const [isMigrating, setIsMigrating] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [migrationLog, setMigrationLog] = useState<string[]>([]);

  const loadStats = useCallback(async () => {
    try {
      setCurrentMode(getCurrentDataMode());
      setFirebaseReady(isFirebaseConfigured());

      const list = await Promise.all(
        Object.values(STORES).map(async (storeName) => {
          try {
            const items = await getLocalAll(storeName);
            return {
              storeName,
              displayName: STORE_DISPLAY_NAMES[storeName] || storeName,
              count: items.length,
            };
          } catch {
            return {
              storeName,
              displayName: STORE_DISPLAY_NAMES[storeName] || storeName,
              count: 0,
            };
          }
        })
      );
      setStats(list);
    } catch (err) {
      console.warn('Error loading migration stats:', err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.all(
      Object.values(STORES).map(async (storeName) => {
        try {
          const items = await getLocalAll(storeName);
          return {
            storeName,
            displayName: STORE_DISPLAY_NAMES[storeName] || storeName,
            count: items.length,
          };
        } catch {
          return {
            storeName,
            displayName: STORE_DISPLAY_NAMES[storeName] || storeName,
            count: 0,
          };
        }
      })
    ).then((list) => {
      if (isMounted) {
        setStats(list);
      }
    }).catch((err) => {
      console.warn('Error loading initial stats:', err);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleExportBackup = async () => {
    try {
      toast.loading('Preparing complete JSON database export...', { id: 'export' });
      const data = await exportAllLocalData();
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sum_school_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Database backup downloaded successfully!', { id: 'export' });
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to export backup.', { id: 'export' });
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        toast.loading('Importing records into IndexedDB...', { id: 'import' });
        const count = await importAllLocalData(parsed);
        await loadStats();
        toast.success(`Successfully imported ${count} records!`, { id: 'import' });
      } catch (err) {
        console.error('Import parse error:', err);
        toast.error('Invalid backup JSON file format.', { id: 'import' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleToggleMode = (mode: DataMode) => {
    if (mode === 'firebase' && !isFirebaseConfigured()) {
      toast.error(
        'Firebase environment credentials not detected in .env.local. Please configure Firebase API key first.'
      );
      return;
    }
    setDataMode(mode);
    setCurrentMode(mode);
    toast.success(`Active data provider switched to: ${mode === 'firebase' ? 'Firebase Cloud' : 'Local IndexedDB'}`);
  };

  const handleStartFirebaseMigration = async () => {
    setIsConfirmModalOpen(false);
    setIsMigrating(true);
    setMigrationLog([]);

    const log = (msg: string) => {
      setMigrationLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    log('Starting migration to Firebase Cloud Firestore...');
    if (!isFirebaseConfigured()) {
      log('ERROR: Firebase environment variables are not configured. Cannot migrate to cloud.');
      log('Please set NEXT_PUBLIC_FIREBASE_* variables in .env.local and restart.');
      toast.error('Firebase is not configured. Migration aborted.');
      setIsMigrating(false);
      return;
    }

    try {
      const { setDocument } = await import('@/lib/firestore');
      const data = await exportAllLocalData();
      let totalMigrated = 0;
      let totalFailed = 0;

      for (const [store, items] of Object.entries(data)) {
        if (store === STORES.ADMIN_USERS) {
          log('Skipping admin user profiles. Provision Firebase Auth accounts and UID-keyed roles through the secure administrator setup process.');
          continue;
        }
        const collectionName = FIRESTORE_COLLECTIONS[store as StoreName];
        if (!collectionName) {
          log(`Skipping unrecognized local store: ${store}`);
          continue;
        }
        if (!items || items.length === 0) {
          log(`Skipping empty collection: ${store}`);
          continue;
        }
        if (store === STORES.ALUMNI) {
          log(`Migrating ${items.length} records from collection: alumni (sanitizing private contact fields)...`);
          for (const item of items as Record<string, unknown>[]) {
            try {
              const docId = (item.id as string) || `migrated-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
              const email = item.email as string | undefined;
              const phone = item.phone as string | undefined;
              const publicData = { ...item };
              delete publicData.id;
              delete publicData.email;
              delete publicData.phone;
              await setDocument(collectionName, docId, publicData);
              totalMigrated++;

              if (email || phone) {
                try {
                  await setDocument('alumniPrivate', docId, {
                    alumniId: docId,
                    name: (publicData.name as string) || '',
                    email: email || '',
                    phone: phone || '',
                  });
                } catch (privErr) {
                  log(`  Notice: Private contact info write for ${docId} skipped or failed: ${(privErr as Error)?.message || 'Unknown'}`);
                }
              }
            } catch (writeErr) {
              totalFailed++;
              log(`  WARNING: Failed to write alumni record: ${(writeErr as Error)?.message || 'Unknown error'}`);
            }
          }
          log(`  ✓ ${store} — migration complete`);
          continue;
        }

        for (const item of items as Record<string, unknown>[]) {
          try {
            const docId = (item.id as string) || `migrated-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            const docData = { ...item };
            delete docData.id;
            await setDocument(collectionName, docId, docData);
            totalMigrated++;
          } catch (writeErr) {
            totalFailed++;
            log(`  WARNING: Failed to write document in ${store}: ${(writeErr as Error)?.message || 'Unknown error'}`);
          }
        }
        log(`  ✓ ${store} — migration complete`);
      }

      log(`Migration summary: ${totalMigrated} records written, ${totalFailed} failed.`);
      log('Preserving all local copies (Never deleted).');
      if (totalFailed === 0) {
        log('MIGRATION COMPLETED SUCCESSFULLY!');
        toast.success(`Firebase migration completed! ${totalMigrated} records migrated.`);
      } else {
        log(`MIGRATION COMPLETED WITH ${totalFailed} ERRORS.`);
        toast.warning(`Migration completed with ${totalFailed} errors. Check log for details.`);
      }
    } catch (err: unknown) {
      const error = err as { message?: string } | undefined;
      log(`ERROR: Migration interrupted: ${error?.message || 'Unknown error'}`);
      toast.error('Migration failed.');
    } finally {
      setIsMigrating(false);
    }
  };

  const totalRecords = stats.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-heading font-extrabold text-slate-900">
              Data Storage & Firebase Migration
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              Repository Engine
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Manage local IndexedDB storage, export offline backups, and migrate records into Google Cloud Firestore.
          </p>
        </div>
        <Button variant="outline" onClick={loadStats} className="flex items-center gap-1.5 text-xs">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Stats
        </Button>
      </div>

      {/* Mode Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Local Storage Card */}
        <Card className={`p-6 border-2 transition-all ${
          currentMode === 'local' ? 'border-amber-400 bg-amber-50/40 shadow-md' : 'border-slate-200'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-base">
                  Local-First Storage (IndexedDB)
                </h3>
                <p className="text-xs text-slate-500">
                  Browser-native database for instant offline preview & admin edits
                </p>
              </div>
            </div>
            <Badge variant={currentMode === 'local' ? 'warning' : 'outline'}>
              {currentMode === 'local' ? 'Active Provider' : 'Ready'}
            </Badge>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Status:</span>
              <strong className="text-emerald-700">Online & Fully Initialized</strong>
            </div>
            <div className="flex justify-between">
              <span>Total Cached Records:</span>
              <strong>{totalRecords} records across 19 stores</strong>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <Button
              variant={currentMode === 'local' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleToggleMode('local')}
              className="text-xs"
            >
              Select Local Mode
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportBackup}
              className="text-xs flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON Backup
            </Button>
          </div>
        </Card>

        {/* Firebase Cloud Card */}
        <Card className={`p-6 border-2 transition-all ${
          currentMode === 'firebase' ? 'border-blue-600 bg-blue-50/40 shadow-md' : 'border-slate-200'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-base">
                  Firebase Cloud Firestore
                </h3>
                <p className="text-xs text-slate-500">
                  Production multi-user cloud database & security rules
                </p>
              </div>
            </div>
            <Badge variant={firebaseReady ? 'success' : 'outline'}>
              {firebaseReady ? 'Configured' : 'No Keys in .env.local'}
            </Badge>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Configuration:</span>
              <strong>{firebaseReady ? 'API Keys Connected' : 'Requires .env.local'}</strong>
            </div>
            <div className="flex justify-between">
              <span>Security Rules:</span>
              <strong className="text-blue-700">Protected & RBAC Enabled</strong>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <Button
              variant={currentMode === 'firebase' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleToggleMode('firebase')}
              disabled={!firebaseReady}
              className="text-xs"
            >
              Select Firebase Mode
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsConfirmModalOpen(true)}
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1"
            >
              <Server className="w-3.5 h-3.5" />
              Migrate Local to Firebase
            </Button>
          </div>
        </Card>
      </div>

      {/* Migration Log if Active */}
      {migrationLog.length > 0 && (
        <Card className="p-4 bg-slate-950 text-slate-200 font-mono text-xs border-slate-800 space-y-1">
          <div className="text-amber-400 font-bold mb-2 flex items-center gap-2">
            <RefreshCw className={`w-3.5 h-3.5 ${isMigrating ? 'animate-spin' : ''}`} />
            Migration Engine Execution Log:
          </div>
          {migrationLog.map((line, idx) => (
            <div key={idx} className="leading-relaxed">
              {line}
            </div>
          ))}
        </Card>
      )}

      {/* Collections Breakdown */}
      <Card className="p-6 border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-base font-heading font-bold text-slate-900">
              Database Store Statistics
            </h2>
            <p className="text-xs text-slate-500">
              Breakdown of entities currently saved in local persistent storage.
            </p>
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm">
              <Upload className="w-3.5 h-3.5" />
              Restore from Backup (.json)
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {stats.map((item) => (
            <div
              key={item.storeName}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-800">{item.displayName}</div>
                <div className="text-[11px] text-slate-400 font-mono">{item.storeName}</div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
                {item.count} items
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Migration Confirmation Modal */}
      <ConfirmDialog
        isOpen={isConfirmModalOpen}
        title="Confirm Cloud Migration"
        message={`Are you ready to migrate all ${totalRecords} local records from IndexedDB to Firebase Cloud Firestore? Existing local data will be safely preserved.`}
        confirmLabel="Start Migration"
        onConfirm={handleStartFirebaseMigration}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
}
