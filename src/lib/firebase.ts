// ============================================================
// Firebase initialization
// Uses environment variables for configuration
// ============================================================

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const rawApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const isConfigured = Boolean(
  rawApiKey &&
  rawApiKey !== 'your-api-key' &&
  !rawApiKey.includes('your-')
);

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

export { app, db, auth, storage, isConfigured };
