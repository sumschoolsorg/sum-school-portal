// ============================================================
// Firebase Storage helpers
// Image upload, URL normalization, delete, and error reporting
// ============================================================

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  type StorageReference,
} from 'firebase/storage';
import { auth, isConfigured, storage } from './firebase';

// Normalize direct image URLs (supports Google Drive share links, Dropbox links, local paths, HTTPS URLs)
export function normalizeImageUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  // Allow relative app paths like /images/...
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  // Convert Google Drive share links to direct viewable image URLs
  // e.g. https://drive.google.com/file/d/FILE_ID/view?usp=sharing -> https://lh3.googleusercontent.com/d/FILE_ID
  const driveFileMatch = trimmed.match(
    /^https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i
  );
  if (driveFileMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
  }

  // e.g. https://drive.google.com/open?id=FILE_ID or uc?id=FILE_ID
  const driveIdMatch = trimmed.match(
    /^https?:\/\/drive\.google\.com\/(?:open|uc)\?.*id=([a-zA-Z0-9_-]+)/i
  );
  if (driveIdMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
  }

  // Convert Dropbox share link (?dl=0 -> ?raw=1)
  if (/^https?:\/\/(www\.)?dropbox\.com\//i.test(trimmed)) {
    try {
      const u = new URL(trimmed);
      u.searchParams.delete('dl');
      u.searchParams.set('raw', '1');
      return u.toString();
    } catch {
      return trimmed;
    }
  }

  // Auto-prepend https:// if user pasted domain without scheme (e.g. i.imgur.com/abc.jpg)
  if (!/^https?:\/\//i.test(trimmed) && !trimmed.startsWith('data:')) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

export function isValidImageUrl(url: string): boolean {
  const normalized = normalizeImageUrl(url);
  if (!normalized) return false;
  if (normalized.startsWith('/')) return true;
  try {
    const parsed = new URL(normalized);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

// Helper to convert file to data URL ONLY when Firebase is completely unconfigured
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read image file locally.'));
    reader.readAsDataURL(file);
  });
}

// --- Upload an image and return the download URL ---
export async function uploadImage(
  file: File,
  path: string
): Promise<string> {
  if (!file) throw new Error('No file provided for upload.');
  if (file.size > 25 * 1024 * 1024) {
    throw new Error('File size exceeds the 25MB limit allowed by school storage policy.');
  }
  if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
    throw new Error('Only image files (JPEG, PNG, WebP) and PDF documents are allowed.');
  }

  // If Firebase is NOT configured at all (local-only dev without .env), allow local data URL
  if (!isConfigured) {
    if (typeof window !== 'undefined') {
      return await fileToDataUrl(file);
    }
    throw new Error('Firebase Storage is not configured.');
  }

  try {
    const storageRef: StorageReference = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
    });
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    const err = error as { code?: string; message?: string } | undefined;
    console.error(`Firebase Storage upload failed for ${path}:`, error);

    if (err?.code === 'storage/unauthorized' || !auth.currentUser) {
      throw new Error(
        'Firebase Storage upload denied. Please make sure you are signed in with your Firebase Admin email & password (not offline mode).'
      );
    }
    if (err?.code === 'storage/quota-exceeded') {
      throw new Error('Firebase Storage quota exceeded. Please check your Firebase console.');
    }
    if (err?.code === 'storage/canceled') {
      throw new Error('Image upload was canceled.');
    }
    if (err?.code === 'storage/retry-limit-exceeded') {
      throw new Error('Upload timed out. Please check your internet connection and try again.');
    }

    throw new Error(
      err?.message || 'Failed to upload image to Firebase Storage. Please verify your connection and storage rules.'
    );
  }
}

// --- Upload with auto-generated unique filename ---
export async function uploadImageWithUniqueId(
  file: File,
  folder: string
): Promise<{ url: string; path: string }> {
  const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'uploads';
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const path = `${cleanFolder}/${timestamp}_${sanitizedName}`;
  const url = await uploadImage(file, path);
  return { url, path };
}

// --- Delete an image by path ---
export async function deleteImage(path: string): Promise<void> {
  if (!path || typeof path !== 'string') return;
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === 'storage/object-not-found') {
      console.warn(`Image not found at ${path}, skipping delete.`);
      return;
    }
    console.error(`Error deleting image at ${path}:`, error);
  }
}

// --- Delete an image by its download URL ---
export async function deleteImageByUrl(url: string): Promise<void> {
  if (!url || typeof url !== 'string') return;
  // If this is a local relative asset or data URL, skip without error
  if (!url.startsWith('gs://') && !url.includes('firebasestorage.googleapis.com')) {
    return;
  }
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === 'storage/object-not-found') {
      return;
    }
    console.warn(`Safe delete warning for ${url}:`, error);
  }
}

// --- Upload a document (PDF, etc.) ---
export async function uploadDocument(
  file: File,
  folder: string
): Promise<{ url: string; path: string; name: string }> {
  const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'uploads';
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const path = `${cleanFolder}/${timestamp}_${sanitizedName}`;
  const url = await uploadImage(file, path);
  return { url, path, name: file.name };
}
