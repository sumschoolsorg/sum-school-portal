// ============================================================
// Firebase Storage helpers
// Image upload, delete, and URL management
// ============================================================

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  type StorageReference,
} from 'firebase/storage';
import { storage } from './firebase';

// --- Upload an image and return the download URL ---
export async function uploadImage(
  file: File,
  path: string
): Promise<string> {
  try {
    const storageRef: StorageReference = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
    });
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error(`Error uploading image to ${path}:`, error);
    throw error;
  }
}

// --- Upload with auto-generated unique filename ---
export async function uploadImageWithUniqueId(
  file: File,
  folder: string
): Promise<{ url: string; path: string }> {
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const path = `${folder}/${timestamp}_${sanitizedName}`;
  const url = await uploadImage(file, path);
  return { url, path };
}

// --- Delete an image by path ---
export async function deleteImage(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    // If file doesn't exist, that's fine
    const err = error as { code?: string };
    if (err.code === 'storage/object-not-found') {
      console.warn(`Image not found at ${path}, skipping delete.`);
      return;
    }
    console.error(`Error deleting image at ${path}:`, error);
    throw error;
  }
}

// --- Delete an image by its download URL ---
export async function deleteImageByUrl(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === 'storage/object-not-found') {
      return;
    }
    console.error(`Error deleting image by URL:`, error);
    throw error;
  }
}

// --- Upload a document (PDF, etc.) ---
export async function uploadDocument(
  file: File,
  folder: string
): Promise<{ url: string; path: string; name: string }> {
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const path = `${folder}/${timestamp}_${sanitizedName}`;
  const url = await uploadImage(file, path);
  return { url, path, name: file.name };
}

// --- Generate a storage path for different modules ---
export function getStoragePath(
  module: string,
  filename?: string
): string {
  if (filename) {
    return `${module}/${filename}`;
  }
  return module;
}
