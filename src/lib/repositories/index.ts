// ============================================================
// Data Access Repository Architecture
// Provides a unified data abstraction over Local Storage (IndexedDB)
// and Google Cloud Firestore.
// ============================================================

import {
  STORES,
  StoreName,
  getLocalAll,
  getLocalById,
  putLocal,
  deleteLocal,
  exportAllLocalData,
  importAllLocalData,
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
} from '@/types';

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
      // Storage can be blocked by browser privacy settings; use the configured default.
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
    private defaultDocId: string = 'default'
  ) {}

  async get(): Promise<T> {
    const mode = getCurrentDataMode();
    if (mode === 'firebase' && isFirebaseConfigured()) {
      try {
        const doc = await getDocument<T>(this.firestoreCollection, this.defaultDocId);
        if (doc) return doc;
      } catch (err) {
        console.warn(`Firestore get fallback for ${this.firestoreCollection}:`, err);
      }
    }

    const localDoc = await getLocalById<T>(this.storeName, this.defaultDocId);
    if (localDoc) return localDoc;

    const all = await getLocalAll<T>(this.storeName);
    if (all.length > 0) return all[0];

    throw new Error(`Document not found in ${this.storeName}`);
  }

  async save(data: Partial<T>): Promise<T> {
    const mode = getCurrentDataMode();
    const itemToSave = { ...data, id: this.defaultDocId } as T;

    if (mode === 'firebase' && isFirebaseConfigured()) {
      try {
        await setDocument(this.firestoreCollection, this.defaultDocId, itemToSave);
      } catch (err) {
        console.error(`Firestore save failed for ${this.firestoreCollection}:`, err);
        throw new Error(`Cloud save failed for ${this.firestoreCollection}. Please check your administrator privileges.`);
      }
    }

    return putLocal<T>(this.storeName, itemToSave);
  }
}

// Generic Collection Repository (e.g. Faculty, Announcements, Events, Banners)
export class CollectionRepository<T extends { id?: string; status?: string; order?: number }> {
  constructor(
    private storeName: StoreName,
    private firestoreCollection: string
  ) {}

  async getAll(): Promise<T[]> {
    const mode = getCurrentDataMode();
    if (mode === 'firebase' && isFirebaseConfigured()) {
      try {
        const docs = await getDocuments<T>(this.firestoreCollection);
        if (docs && docs.length > 0) return docs;
      } catch (err) {
        console.warn(`Firestore getDocuments fallback for ${this.firestoreCollection}:`, err);
      }
    }

    return getLocalAll<T>(this.storeName);
  }

  async getPublished(): Promise<T[]> {
    const mode = getCurrentDataMode();
    if (mode === 'firebase' && isFirebaseConfigured()) {
      try {
        const docs = await getDocuments<T>(this.firestoreCollection, [whereEqual('status', 'published')]);
        if (docs && docs.length > 0) return docs;
      } catch (err) {
        console.warn(`Firestore published query fallback for ${this.firestoreCollection}:`, err);
      }
    }
    const all = await getLocalAll<T>(this.storeName);
    return all.filter((item) => item.status === 'published');
  }

  async getById(id: string): Promise<T | null> {
    const mode = getCurrentDataMode();
    if (mode === 'firebase' && isFirebaseConfigured()) {
      try {
        const doc = await getDocument<T>(this.firestoreCollection, id);
        if (doc) return doc;
      } catch (err) {
        console.warn(`Firestore getDocument fallback for ${this.firestoreCollection}/${id}:`, err);
      }
    }

    return getLocalById<T>(this.storeName, id);
  }

  async save(data: T): Promise<T> {
    const mode = getCurrentDataMode();
    if (mode === 'firebase' && isFirebaseConfigured()) {
      try {
        if (!data.id) throw new Error('A document ID is required for a cloud save.');
        await setDocument(this.firestoreCollection, data.id, data);
      } catch (err) {
        console.error(`Firestore save failed for ${this.firestoreCollection}:`, err);
        throw new Error(`Cloud save failed for ${this.firestoreCollection}. The change was not reported as synced.`);
      }
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
      try {
        await deleteDocument(this.firestoreCollection, id);
      } catch (err) {
        console.error(`Firestore delete failed for ${this.firestoreCollection}/${id}:`, err);
        throw new Error(`Cloud delete failed for ${this.firestoreCollection}/${id}. The record was not reported as deleted.`);
      }
    }
    await deleteLocal(this.storeName, id);
  }
}

// Instantiate specific repositories
export const schoolRepository = new SingleDocRepository<SchoolSettings>(
  STORES.SCHOOL_SETTINGS,
  'schoolSettings'
);

export const homepageRepository = new SingleDocRepository<HomepageContent>(
  STORES.HOMEPAGE_CONTENT,
  'homepageContent'
);

export const aboutRepository = new SingleDocRepository<AboutContent>(
  STORES.ABOUT_CONTENT,
  'aboutContent'
);

export const academicsRepository = new SingleDocRepository<AcademicsContent>(
  STORES.ACADEMICS_CONTENT,
  'academicsContent'
);

export const admissionsRepository = new SingleDocRepository<AdmissionsContent>(
  STORES.ADMISSIONS_CONTENT,
  'admissionsContent'
);

export const themeRepository = new SingleDocRepository<ThemeSettings>(
  STORES.THEME_SETTINGS,
  'themeSettings'
);

export const websiteSettingsRepository = new SingleDocRepository<WebsiteSettings>(
  STORES.WEBSITE_SETTINGS,
  'websiteSettings'
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
  'facilities'
);

export const announcementRepository = new CollectionRepository<Announcement>(
  STORES.ANNOUNCEMENTS,
  'announcements'
);

export const eventRepository = new CollectionRepository<SchoolEvent>(
  STORES.EVENTS,
  'events'
);

export const galleryRepository = new CollectionRepository<GalleryImage>(
  STORES.GALLERY,
  'gallery'
);

export const achievementRepository = new CollectionRepository<Achievement>(
  STORES.ACHIEVEMENTS,
  'achievements'
);

export const timelineRepository = new CollectionRepository<TimelineEntry>(
  STORES.TIMELINE,
  'timelineEntries'
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

// Data backup and migration helpers
export { exportAllLocalData, importAllLocalData };
