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
  defaultAdminUsers,
  defaultAlumni,
  defaultTransportRoutes,
  defaultStudentResults,
  defaultEnquiries,
} from '@/lib/defaultData';

const DB_NAME = 'sum_school_local_db';
const DB_VERSION = 4;

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
    [STORES.ADMIN_USERS]: defaultAdminUsers,
    [STORES.ALUMNI]: defaultAlumni,
    [STORES.TRANSPORT_ROUTES]: defaultTransportRoutes,
    [STORES.STUDENT_RESULTS]: defaultStudentResults,
    [STORES.ENQUIRIES]: defaultEnquiries,
    [STORES.CONTACT_MESSAGES]: [],
  };

  for (const [storeName, defaultItems] of Object.entries(seeds)) {
    if (defaultItems.length === 0) continue;
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const countReq = store.count();

    await new Promise<void>((resolve) => {
      countReq.onsuccess = () => {
        if (countReq.result === 0) {
          defaultItems.forEach((item) => store.put(item));
        }
        resolve();
      };
      countReq.onerror = () => resolve();
    });
  }
}

// Generic CRUD operations on IndexedDB with fallback
export async function getLocalAll<T>(storeName: StoreName): Promise<T[]> {
  if (!isBrowser()) {
    return (memoryCache[storeName] as T[]) || [];
  }

  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();

      req.onsuccess = () => {
        resolve((req.result as T[]) || []);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.warn(`Fallback getLocalAll for ${storeName}:`, error);
    return (memoryCache[storeName] as T[]) || [];
  }
}

export async function getLocalById<T>(storeName: StoreName, id: string): Promise<T | null> {
  if (!isBrowser()) {
    const list = (memoryCache[storeName] as Array<{ id?: string }>) || [];
    return ((list.find((x) => x.id === id) as unknown) as T) || null;
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
    return ((list.find((x) => x.id === id) as unknown) as T) || null;
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
