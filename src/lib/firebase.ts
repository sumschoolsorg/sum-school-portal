// ============================================================
// Firebase initialization
// Uses environment variables for configuration
// ============================================================

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseEnvironment = [
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
];
const isConfigured = firebaseEnvironment.every((value) =>
  Boolean(
    value &&
    !['your-', 'your_', 'dummy', 'placeholder'].some((marker) => value.toLowerCase().includes(marker))
  )
);
const rawApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// Valid fallback mock config so Firebase SDK doesn't throw during build / SSR evaluation
const firebaseConfig = {
  apiKey: isConfigured ? rawApiKey : 'AIzaSyFakeKeyForLocalOfflinePreviewModeSUM00',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'sum-school-royappanpatti.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'sum-school-royappanpatti',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'sum-school-royappanpatti.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789012:web:abcdef1234567890',
};

// Initialize Firebase (prevent duplicate initialization)
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

try {
  db = getFirestore(app);
} catch (e) {
  console.warn('Firestore initialization fallback:', e);
  db = {} as Firestore;
}

try {
  auth = getAuth(app);
} catch (e) {
  console.warn('Auth initialization fallback:', e);
  auth = {} as Auth;
}

try {
  storage = getStorage(app);
} catch (e) {
  console.warn('Storage initialization fallback:', e);
  storage = {} as FirebaseStorage;
}

export interface FirebaseConfigStatus {
  isConfigured: boolean;
  hasApiKey: boolean;
  hasAuthDomain: boolean;
  hasProjectId: boolean;
  hasStorageBucket: boolean;
  hasMessagingSenderId: boolean;
  hasAppId: boolean;
  projectId: string;
}

export function getFirebaseConfigStatus(): FirebaseConfigStatus {
  const isKeyValid = (val?: string) => Boolean(
    val && !['your-', 'your_', 'dummy', 'placeholder'].some((marker) => val.toLowerCase().includes(marker))
  );

  return {
    isConfigured,
    hasApiKey: isKeyValid(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
    hasAuthDomain: isKeyValid(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
    hasProjectId: isKeyValid(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
    hasStorageBucket: isKeyValid(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
    hasMessagingSenderId: isKeyValid(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
    hasAppId: isKeyValid(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
    projectId: isKeyValid(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
      ? String(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
      : 'unconfigured',
  };
}

export { app, db, auth, storage, isConfigured };
