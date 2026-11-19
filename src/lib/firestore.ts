// ============================================================
// Firestore CRUD helpers
// Generic functions for all collections with undefined stripping
// and actionable error reporting
// ============================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  type QueryConstraint,
  type DocumentData,
  type WhereFilterOp,
} from 'firebase/firestore';
import { db } from './firebase';

// Recursively remove undefined values because Firestore rejects `undefined` fields
export function sanitizeForFirestore<T>(value: T): T {
  if (value === undefined) return value;
  if (value === null) return value;
  if (value instanceof Date || value instanceof Timestamp) return value;
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    // Preserve Firestore FieldValue sentinels (e.g. serverTimestamp)
    if ('_methodName' in obj || typeof (obj as { isEqual?: unknown }).isEqual === 'function') {
      return value;
    }
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined) {
        clean[k] = sanitizeForFirestore(v);
      }
    }
    return clean as T;
  }
  return value;
}

export function formatFirestoreError(error: unknown, context: string): Error {
  const err = error as { code?: string; message?: string } | undefined;
  const code = err?.code || '';
  if (code === 'permission-denied' || err?.message?.toLowerCase().includes('insufficient permissions')) {
    return new Error(
      `Firebase permission denied while saving ${context}. Please sign out and sign in with your Firebase Admin email & password.`
    );
  }
  if (code === 'unauthenticated') {
    return new Error(
      `Not signed in to Firebase Authentication. Please sign in at /admin/login to save ${context}.`
    );
  }
  if (code === 'invalid-argument') {
    return new Error(`Invalid data format for ${context}: ${err?.message || 'check form fields.'}`);
  }
  if (code === 'unavailable') {
    return new Error(`Firebase Cloud is temporarily unreachable. Please check your internet connection and try again.`);
  }
  return new Error(err?.message || `Cloud operation failed for ${context}.`);
}

// --- Get a single document ---
export async function getDocument<T extends DocumentData>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as unknown as T;
    }
    return null;
  } catch (error) {
    console.error(`Error getting document ${collectionName}/${docId}:`, error);
    throw formatFirestoreError(error, `${collectionName}/${docId}`);
  }
}

// --- Get multiple documents with optional filters ---
export async function getDocuments<T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as unknown as T[];
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    throw formatFirestoreError(error, collectionName);
  }
}

// --- Get published documents (common pattern) ---
export async function getPublishedDocuments<T extends DocumentData>(
  collectionName: string,
  orderByField: string = 'createdAt',
  orderDirection: 'asc' | 'desc' = 'desc',
  limitCount?: number
): Promise<T[]> {
  const constraints: QueryConstraint[] = [
    where('status', '==', 'published'),
    orderBy(orderByField, orderDirection),
  ];
  if (limitCount) {
    constraints.push(limit(limitCount));
  }
  return getDocuments<T>(collectionName, constraints);
}

// --- Add a document ---
export async function addDocument(
  collectionName: string,
  data: DocumentData
): Promise<string> {
  try {
    const collectionRef = collection(db, collectionName);
    const cleanData = sanitizeForFirestore(data);
    const docRef = await addDoc(collectionRef, {
      ...cleanData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw formatFirestoreError(error, collectionName);
  }
}

// --- Update a document ---
export async function updateDocument(
  collectionName: string,
  docId: string,
  data: Partial<DocumentData>
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    const cleanData = sanitizeForFirestore(data);
    await updateDoc(docRef, {
      ...cleanData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(`Error updating document ${collectionName}/${docId}:`, error);
    throw formatFirestoreError(error, `${collectionName}/${docId}`);
  }
}

// --- Set/create a document with a specific ID ---
export async function setDocument(
  collectionName: string,
  docId: string,
  data: DocumentData
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    const cleanData = sanitizeForFirestore(data);
    await setDoc(
      docRef,
      {
        ...cleanData,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error(`Error setting document ${collectionName}/${docId}:`, error);
    throw formatFirestoreError(error, `${collectionName}/${docId}`);
  }
}

// --- Delete a document ---
export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document ${collectionName}/${docId}:`, error);
    throw formatFirestoreError(error, `${collectionName}/${docId}`);
  }
}

// --- Helper: build where constraint ---
export function whereEqual(field: string, value: unknown) {
  return where(field, '==', value);
}

export function whereFilter(field: string, op: WhereFilterOp, value: unknown) {
  return where(field, op, value);
}

export function orderByField(field: string, direction: 'asc' | 'desc' = 'asc') {
  return orderBy(field, direction);
}

export function limitResults(count: number) {
  return limit(count);
}

export { serverTimestamp };
