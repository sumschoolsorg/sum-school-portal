// ============================================================
// Data Access Repository Architecture
// Firebase Cloud Firestore Primary + IndexedDB Local Cache
// ============================================================

import {
  STORES,
  StoreName,
  getLocalAll,
  getLocalById,
  putLocal,
  deleteLocal,
  clearLocalStore,
  clearAllLocalData,
  exportAllLocalData,
  importAllLocalData,
  getDeletedTombstones,
} from '@/lib/db/indexedDB';

import {
  getDocument,
  getDocuments,
  setDocument,
  deleteDocument,
  whereEqual,
} from '@/lib/firestore';
import { isConfigured } from '@/lib/firebase';

import {
  SchoolSettings,
  HomepageContent,
  AboutContent,
  AcademicsContent,
  AdmissionsContent,
  Facility,
  Faculty,
  Announcement,
  SchoolEvent,
  GalleryImage,
  Achievement,
  TimelineEntry,
  Testimonial,
  Enquiry,
  ContactMessage,
  WebsiteSettings,
  HeroBanner,
  ResearchRecord,
  ThemeSettings,
  AdminUser,
  AlumniMember,
  AlumniPrivateContact,
  TransportRoute,
  StudentResult,
  MediaAsset,
} from '@/types';

import {
  defaultSchoolSettings,
  defaultHomepageContent,
  defaultAboutContent,
  defaultAcademicsContent,
  defaultAdmissionsContent,
  defaultThemeSettings,
  defaultWebsiteSettings,
  verifiedAnnouncements,
  defaultEvents,
  verifiedFacilities,
  verifiedAchievements,
  verifiedGalleryImages,
  verifiedTimelineEntries,
} from '@/lib/defaultData';

export type DataMode = 'local' | 'firebase';

export function isFirebaseConfigured(): boolean {
  return isConfigured;
}

export function getCurrentDataMode(): DataMode {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('sum_data_mode') as DataMode | null;
      if (saved === 'firebase' && isFirebaseConfigured()) return 'firebase';
      if (saved === 'local' && !isFirebaseConfigured()) return 'local';
    } catch {
      // Storage blocked by browser privacy settings; use configured default.
    }
  }
  return isFirebaseConfigured() ? 'firebase' : 'local';
}

export function setDataMode(mode: DataMode): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('sum_data_mode', mode);
    } catch {
      throw new Error('Unable to save the data mode in this browser. Check browser storage permissions.');
    }
  }
}

// Generic Single Document Repository (e.g. School Settings, Homepage, About)
export class SingleDocRepository<T extends { id?: string }> {
  constructor(
    private storeName: StoreName,
    private firestoreCollection: string,
    private defaultDocId: string = 'default',
    private fallbackProvider?: () => T
  ) {}

  async get(): Promise<T> {
    const mode = getCurrentDataMode();
    if (mode === 'firebase' && isFirebaseConfigured()) {
      try {
        const doc = await getDocument<T>(this.firestoreCollection, this.defaultDocId);
        if (doc) {
          await putLocal<T>(this.storeName, doc).catch(() => {});
          return doc;
        }
      } catch (cloudErr) {
        console.warn(`Firestore read warning for ${this.firestoreCollection}/${this.defaultDocId}:`, cloudErr);
      }
    }

    const localDoc = await getLocalById<T>(this.storeName, this.defaultDocId);
    if (localDoc) return localDoc;

    const all = await getLocalAll<T>(this.storeName);
    if (all.length > 0) return all[0];

    if (this.fallbackProvider) {
      return this.fallbackProvider();
    }

    throw new Error(`Document not found in ${this.storeName}`);
  }

  async save(data: Partial<T>): Promise<T> {
    const mode = getCurrentDataMode();
    const itemToSave = { ...data, id: this.defaultDocId } as T;

    if (mode === 'firebase' && isFirebaseConfigured()) {
      await setDocument(this.firestoreCollection, this.defaultDocId, itemToSave);
    }

    return putLocal<T>(this.storeName, itemToSave);
  }
}

// Generic Collection Repository (e.g. Faculty, Announcements, Events, Banners)
export class CollectionRepository<T extends { id?: string; status?: string; order?: number }> {
  constructor(
    private storeName: StoreName,
    private firestoreCollection: string,
    private defaultItems?: () => T[]
  ) {}

  async getAll(): Promise<T[]> {
    const mode = getCurrentDataMode();
    if (mode === 'firebase' && isFirebaseConfigured()) {
      try {
        const docs = await getDocuments<T>(this.firestoreCollection);
        if (Array.isArray(docs) && docs.length > 0) {
          // Mirror cloud state into local cache so offline cache matches Firestore exactly
          try {
            await clearLocalStore(this.storeName);
            for (const cloudDoc of docs) {
              if (cloudDoc.id) {
                await putLocal<T>(this.storeName, cloudDoc);
              }
            }
          } catch (syncErr) {
            console.warn(`Local sync cache update warning for ${this.firestoreCollection}:`, syncErr);
          }
          return docs;
        }
      } catch (cloudErr) {
        console.warn(`Firestore getAll warning for ${this.firestoreCollection}:`, cloudErr);
      }
    }

    const localItems = await getLocalAll<T>(this.storeName);
    if (localItems && localItems.length > 0) {
      return localItems;
    }

    if (this.defaultItems) {
      const tombstones = getDeletedTombstones();
      return this.defaultItems().filter((item) => !item.id || !tombstones.has(item.id));
    }

    return [];
  }

  async getPublished(): Promise<T[]> {
    const mode = getCurrentDataMode();
    if (mode === 'firebase' && isFirebaseConfigured()) {
      try {
        const docs = await getDocuments<T>(this.firestoreCollection, [whereEqual('status', 'published')]);
        if (Array.isArray(docs) && docs.length > 0) {
          return docs;
        }
      } catch (cloudErr) {
        console.warn(`Firestore getPublished warning for ${this.firestoreCollection}:`, cloudErr);
      }
    }
    const all = await getLocalAll<T>(this.storeName);
    const published = all.filter((item) => item.status === 'published');
    if (published && published.length > 0) {
      return published;
    }

    if (this.defaultItems) {
      const tombstones = getDeletedTombstones();
      return this.defaultItems().filter(
        (item) => (item.status ? item.status === 'published' : true) && (!item.id || !tombstones.has(item.id))
      );
    }

    return [];
  }

  async getById(id: string): Promise<T | null> {
    const mode = getCurrentDataMode();
    if (mode === 'firebase' && isFirebaseConfigured()) {
      try {
        const doc = await getDocument<T>(this.firestoreCollection, id);
        if (doc) return doc;
      } catch (cloudErr) {
        console.warn(`Firestore getById warning for ${this.firestoreCollection}/${id}:`, cloudErr);
      }
    }

    const localDoc = await getLocalById<T>(this.storeName, id);
    if (localDoc) return localDoc;

    if (this.defaultItems) {
      const tombstones = getDeletedTombstones();
      if (!tombstones.has(id)) {
        const found = this.defaultItems().find((item) => item.id === id);
        if (found) return found;
      }
    }

    return null;
  }

  async save(data: T): Promise<T> {
    const mode = getCurrentDataMode();
    if (mode === 'firebase' && isFirebaseConfigured()) {
      if (!data.id) throw new Error('A document ID is required for a cloud save.');
      await setDocument(this.firestoreCollection, data.id, data);
    }

    return putLocal<T>(this.storeName, data);
  }

  async create(data: Partial<T>): Promise<T> {
    const itemToSave = {
      ...data,
      id: data.id || `${this.storeName}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: (data as { createdAt?: Date }).createdAt || new Date(),
      updatedAt: new Date(),
    } as unknown as T;
    return this.save(itemToSave);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const existing = await this.getById(id);
    const itemToSave = {
      ...(existing || {}),
      ...data,
      id,
      updatedAt: new Date(),
    } as unknown as T;
    return this.save(itemToSave);
  }

  async delete(id: string): Promise<void> {
    const mode = getCurrentDataMode();
    if (mode === 'firebase' && isFirebaseConfigured()) {
      await deleteDocument(this.firestoreCollection, id);
    }
    await deleteLocal(this.storeName, id);
  }

  async deleteAll(): Promise<void> {
    const items = await this.getAll();
    for (const item of items) {
      if (item.id) {
        await this.delete(item.id);
      }
    }
  }
}

// Instantiate specific repositories
export const schoolRepository = new SingleDocRepository<SchoolSettings>(
  STORES.SCHOOL_SETTINGS,
  'schoolSettings',
  'default',
  () => defaultSchoolSettings
);

export const homepageRepository = new SingleDocRepository<HomepageContent>(
  STORES.HOMEPAGE_CONTENT,
  'homepageContent',
  'default',
  () => defaultHomepageContent
);

export const aboutRepository = new SingleDocRepository<AboutContent>(
  STORES.ABOUT_CONTENT,
  'aboutContent',
  'default',
  () => defaultAboutContent
);

export const academicsRepository = new SingleDocRepository<AcademicsContent>(
  STORES.ACADEMICS_CONTENT,
  'academicsContent',
  'default',
  () => defaultAcademicsContent
);

export const admissionsRepository = new SingleDocRepository<AdmissionsContent>(
  STORES.ADMISSIONS_CONTENT,
  'admissionsContent',
  'default',
  () => defaultAdmissionsContent
);

export const themeRepository = new SingleDocRepository<ThemeSettings>(
  STORES.THEME_SETTINGS,
  'themeSettings',
  'default',
  () => defaultThemeSettings
);

export const websiteSettingsRepository = new SingleDocRepository<WebsiteSettings>(
  STORES.WEBSITE_SETTINGS,
  'websiteSettings',
  'default',
  () => defaultWebsiteSettings
);

// Collections
export const heroBannerRepository = new CollectionRepository<HeroBanner>(
  STORES.HERO_BANNERS,
  'heroBanners'
);

export const researchRepository = new CollectionRepository<ResearchRecord>(
  STORES.RESEARCH_RECORDS,
  'researchRecords'
);

export const facultyRepository = new CollectionRepository<Faculty>(
  STORES.FACULTY,
  'faculty'
);

export const facilityRepository = new CollectionRepository<Facility>(
  STORES.FACILITIES,
  'facilities',
  () => verifiedFacilities
);

export const announcementRepository = new CollectionRepository<Announcement>(
  STORES.ANNOUNCEMENTS,
  'announcements',
  () => verifiedAnnouncements
);

export const eventRepository = new CollectionRepository<SchoolEvent>(
  STORES.EVENTS,
  'events',
  () => defaultEvents
);

export const galleryRepository = new CollectionRepository<GalleryImage>(
  STORES.GALLERY,
  'gallery',
  () => verifiedGalleryImages
);

export const achievementRepository = new CollectionRepository<Achievement>(
  STORES.ACHIEVEMENTS,
  'achievements',
  () => verifiedAchievements
);

export const timelineRepository = new CollectionRepository<TimelineEntry>(
  STORES.TIMELINE,
  'timelineEntries',
  () => verifiedTimelineEntries
);

export const testimonialRepository = new CollectionRepository<Testimonial>(
  STORES.TESTIMONIALS,
  'testimonials'
);

export const enquiryRepository = new CollectionRepository<Enquiry>(
  STORES.ENQUIRIES,
  'enquiries'
);

export const contactMessageRepository = new CollectionRepository<ContactMessage>(
  STORES.CONTACT_MESSAGES,
  'contactMessages'
);

export const adminUserRepository = new CollectionRepository<AdminUser>(
  STORES.ADMIN_USERS,
  'adminUsers'
);

export const alumniRepository = new CollectionRepository<AlumniMember>(
  STORES.ALUMNI,
  'alumni'
);

export const alumniPrivateRepository = new CollectionRepository<AlumniPrivateContact>(
  STORES.ALUMNI_PRIVATE,
  'alumniPrivate'
);

export const transportRepository = new CollectionRepository<TransportRoute>(
  STORES.TRANSPORT_ROUTES,
  'transportRoutes'
);

export const studentResultRepository = new CollectionRepository<StudentResult>(
  STORES.STUDENT_RESULTS,
  'studentResults'
);

export const mediaAssetRepository = new CollectionRepository<MediaAsset>(
  STORES.MEDIA_ASSETS,
  'mediaAssets'
);

// Data backup and migration helpers
export { exportAllLocalData, importAllLocalData, clearAllLocalData };
