// ============================================================
// Local-First IndexedDB Database Implementation
// Supports offline storage, local preview, and data export/import
// ============================================================

import {
  defaultSchoolSettings,
  defaultHomepageContent,
  defaultAboutContent,
  defaultAcademicsContent,
  defaultAdmissionsContent,
  defaultFaculty,
  defaultFacilities,
  defaultAnnouncements,
  defaultEvents,
  defaultGalleryImages,
  defaultAchievements,
  defaultTimelineEntries,
  defaultTestimonials,
  defaultWebsiteSettings,
  defaultHeroBanners,
  defaultResearchRecords,
  defaultThemeSettings,
  defaultAlumni,
  defaultTransportRoutes,
} from '@/lib/defaultData';

const DB_NAME = 'sum_school_local_db';
const DB_VERSION = 6;
const SEED_STORAGE_KEY = 'sum_school_db_seeded_v2';
const TOMBSTONES_STORAGE_KEY = 'sum_school_deleted_tombstones';

// Tombstone tracking to prevent deleted records from ever resurrecting
export function getDeletedTombstones(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(TOMBSTONES_STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function addDeletedTombstone(id: string): void {
  if (typeof window === 'undefined' || !id) return;
  try {
    const set = getDeletedTombstones();
    set.add(id);
    localStorage.setItem(TOMBSTONES_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.warn('Failed to record deletion tombstone:', e);
  }
}

export function removeDeletedTombstone(id: string): void {
  if (typeof window === 'undefined' || !id) return;
  try {
    const set = getDeletedTombstones();
    set.delete(id);
    localStorage.setItem(TOMBSTONES_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.warn('Failed to remove deletion tombstone:', e);
  }
}

export function clearAllTombstones(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(TOMBSTONES_STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear tombstones:', e);
  }
}

export function resetSeedFlag(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SEED_STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to reset seed flag:', e);
  }
}

export const STORES = {
  SCHOOL_SETTINGS: 'school_settings',
  HOMEPAGE_CONTENT: 'homepage_content',
  HERO_BANNERS: 'hero_banners',
  ABOUT_CONTENT: 'about_content',
  ACADEMICS_CONTENT: 'academics_content',
  ADMISSIONS_CONTENT: 'admissions_content',
  FACULTY: 'faculty',
  FACILITIES: 'facilities',
  ANNOUNCEMENTS: 'announcements',
  EVENTS: 'events',
  GALLERY: 'gallery',
  ACHIEVEMENTS: 'achievements',
  TIMELINE: 'timeline_entries',
  TESTIMONIALS: 'testimonials',
  ENQUIRIES: 'enquiries',
  CONTACT_MESSAGES: 'contact_messages',
  RESEARCH_RECORDS: 'research_records',
  THEME_SETTINGS: 'theme_settings',
  WEBSITE_SETTINGS: 'website_settings',
  ADMIN_USERS: 'admin_users',
  ALUMNI: 'alumni',
  ALUMNI_PRIVATE: 'alumni_private',
  TRANSPORT_ROUTES: 'transport_routes',
  STUDENT_RESULTS: 'student_results',
} as const;

export type StoreName = (typeof STORES)[keyof typeof STORES];

// Memory/localStorage fallback for SSR or environments without IndexedDB
const memoryCache: Record<string, unknown[]> = {};

function isBrowser(): boolean {
  return typeof window !== 'undefined' && !!window.indexedDB;
}

let dbInstance: IDBDatabase | null = null;
let initPromise: Promise<IDBDatabase> | null = null;

export async function getDB(): Promise<IDBDatabase> {
  if (!isBrowser()) {
    throw new Error('IndexedDB is only accessible in browser environment.');
  }

  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      Object.values(STORES).forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      });
    };

    request.onsuccess = async (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      try {
        await seedInitialData(dbInstance);
      } catch (err) {
        console.warn('Initial seeding warning:', err);
      }
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('IndexedDB open error:', (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error);
    };
  });

  return initPromise;
}

async function seedInitialData(db: IDBDatabase): Promise<void> {
  // If already seeded in this browser, never re-seed automatically!
  // This ensures deletions made by administrators are permanently respected.
  if (typeof window !== 'undefined' && localStorage.getItem(SEED_STORAGE_KEY) === 'true') {
    return;
  }

  const tombstones = getDeletedTombstones();

  const seeds: Record<string, unknown[]> = {
    [STORES.SCHOOL_SETTINGS]: [{ id: 'default', ...defaultSchoolSettings }],
    [STORES.HOMEPAGE_CONTENT]: [{ id: 'default', ...defaultHomepageContent }],
    [STORES.ABOUT_CONTENT]: [{ id: 'default', ...defaultAboutContent }],
    [STORES.ACADEMICS_CONTENT]: [{ id: 'default', ...defaultAcademicsContent }],
    [STORES.ADMISSIONS_CONTENT]: [{ id: 'default', ...defaultAdmissionsContent }],
    [STORES.WEBSITE_SETTINGS]: [{ id: 'default', ...defaultWebsiteSettings }],
    [STORES.THEME_SETTINGS]: [{ id: 'default', ...defaultThemeSettings }],
    [STORES.HERO_BANNERS]: defaultHeroBanners,
    [STORES.FACULTY]: defaultFaculty,
    [STORES.FACILITIES]: defaultFacilities,
    [STORES.ANNOUNCEMENTS]: defaultAnnouncements,
    [STORES.EVENTS]: defaultEvents,
    [STORES.GALLERY]: defaultGalleryImages,
    [STORES.ACHIEVEMENTS]: defaultAchievements,
    [STORES.TIMELINE]: defaultTimelineEntries,
    [STORES.TESTIMONIALS]: defaultTestimonials,
    [STORES.RESEARCH_RECORDS]: defaultResearchRecords,
    [STORES.ALUMNI]: defaultAlumni,
    [STORES.TRANSPORT_ROUTES]: defaultTransportRoutes,
    [STORES.CONTACT_MESSAGES]: [],
    [STORES.ENQUIRIES]: [],
    [STORES.STUDENT_RESULTS]: [],
  };

  for (const [storeName, defaultItems] of Object.entries(seeds)) {
    if (!defaultItems || defaultItems.length === 0) continue;
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const countReq = store.count();

    await new Promise<void>((resolve) => {
      countReq.onsuccess = () => {
        // Only seed when store is completely brand new / zero count on very first startup
        if (countReq.result === 0) {
          defaultItems.forEach((item) => {
            const record = item as { id?: string };
            // Never insert an item that was previously deleted
            if (!record?.id || !tombstones.has(record.id)) {
              store.put(item);
            }
          });
        }
        resolve();
      };
      countReq.onerror = () => resolve();
    });
  }

  // Mark as seeded permanently so subsequent getDB() calls never re-seed
  if (typeof window !== 'undefined') {
    localStorage.setItem(SEED_STORAGE_KEY, 'true');
  }
}

// Generic CRUD operations on IndexedDB with fallback
export async function getLocalAll<T>(storeName: StoreName): Promise<T[]> {
  const tombstones = getDeletedTombstones();

  if (!isBrowser()) {
    const rawList = (memoryCache[storeName] as Array<T & { id?: string }>) || [];
    return rawList.filter((item) => !item.id || !tombstones.has(item.id));
  }

  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();

      req.onsuccess = () => {
        const results = (req.result as Array<T & { id?: string }>) || [];
        // Filter out any tombstoned/deleted items
        const filtered = results.filter((item) => !item.id || !tombstones.has(item.id));
        resolve(filtered as T[]);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.warn(`Fallback getLocalAll for ${storeName}:`, error);
    const rawList = (memoryCache[storeName] as Array<T & { id?: string }>) || [];
    return rawList.filter((item) => !item.id || !tombstones.has(item.id));
  }
}

export async function getLocalById<T>(storeName: StoreName, id: string): Promise<T | null> {
  const tombstones = getDeletedTombstones();
  if (tombstones.has(id)) {
    return null;
  }

  if (!isBrowser()) {
    const list = (memoryCache[storeName] as Array<{ id?: string }>) || [];
    const found = list.find((x) => x.id === id);
    return (found as unknown as T) || null;
  }

  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(id);

      req.onsuccess = () => {
        resolve((req.result as T) || null);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.warn(`Fallback getLocalById for ${storeName}/${id}:`, error);
    const list = (memoryCache[storeName] as Array<{ id?: string }>) || [];
    const found = list.find((x) => x.id === id);
    return (found as unknown as T) || null;
  }
}

export async function putLocal<T extends { id?: string }>(
  storeName: StoreName,
  data: T
): Promise<T> {
  const item = {
    ...data,
    id: data.id || `${storeName}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    updatedAt: new Date().toISOString(),
  };

  // If this item ID was previously tombstoned, untombstone it on save
  if (item.id) {
    removeDeletedTombstone(item.id);
  }

  if (!isBrowser()) {
    if (!memoryCache[storeName]) memoryCache[storeName] = [];
    const list = memoryCache[storeName] as Array<{ id?: string }>;
    const idx = list.findIndex((x) => x.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.push(item);
    }
    return item as T;
  }

  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.put(item);

    req.onsuccess = () => resolve(item as T);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteLocal(storeName: StoreName, id: string): Promise<void> {
  // Mark as tombstone immediately so it can never reappear from cache or legacy seeds
  addDeletedTombstone(id);

  if (!isBrowser()) {
    if (memoryCache[storeName]) {
      const list = memoryCache[storeName] as Array<{ id?: string }>;
      memoryCache[storeName] = list.filter((x) => x.id !== id);
    }
    return;
  }

  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.delete(id);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function clearLocalStore(storeName: StoreName): Promise<void> {
  if (!isBrowser()) {
    memoryCache[storeName] = [];
    return;
  }

  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.clear();

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Backup & Export All Data
export async function exportAllLocalData(): Promise<Record<string, unknown[]>> {
  const exportData: Record<string, unknown[]> = {};
  for (const storeName of Object.values(STORES)) {
    exportData[storeName] = await getLocalAll(storeName);
  }
  return exportData;
}

// Restore & Import All Data
export async function importAllLocalData(data: Record<string, Array<{ id?: string } & Record<string, unknown>>>): Promise<number> {
  let totalImported = 0;
  for (const [storeName, items] of Object.entries(data)) {
    if (Object.values(STORES).includes(storeName as StoreName) && Array.isArray(items)) {
      for (const item of items) {
        await putLocal(storeName as StoreName, item);
        totalImported++;
      }
    }
  }
  return totalImported;
}
