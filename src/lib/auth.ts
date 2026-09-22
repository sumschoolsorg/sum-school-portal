// ============================================================
// Firebase Authentication helpers
// ============================================================

import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from './firebase';

// --- Sign in with email and password ---
export async function signIn(
  email: string,
  password: string
): Promise<User> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  } catch (error) {
    const err = error as { code?: string; message?: string };
    let message = 'Login failed. Please try again.';
    switch (err.code) {
      case 'auth/user-not-found':
        message = 'No account found with this email address.';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password. Please try again.';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later.';
        break;
      case 'auth/invalid-credential':
        message = 'Invalid email or password.';
        break;
    }
    throw new Error(message);
  }
}

// --- Sign out ---
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

// --- Listen to auth state changes ---
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// --- Get current user ---
export function getCurrentUser(): User | null {
  return auth.currentUser;
}
