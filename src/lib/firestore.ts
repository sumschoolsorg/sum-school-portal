// ============================================================
// Firestore CRUD helpers
// Generic functions for all collections
// ============================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type QueryConstraint,
  type DocumentData,
  type WhereFilterOp,
} from 'firebase/firestore';
import { db } from './firebase';

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
    throw error;
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
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as unknown as T[];
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    throw error;
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
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
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
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(`Error updating document ${collectionName}/${docId}:`, error);
    throw error;
  }
}

// --- Set/create a document with a specific ID ---
export async function setDocument(
  collectionName: string,
  docId: string,
  data: DocumentData
): Promise<void> {
  try {
    const { setDoc } = await import('firebase/firestore');
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error(`Error setting document ${collectionName}/${docId}:`, error);
    throw error;
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
    throw error;
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
