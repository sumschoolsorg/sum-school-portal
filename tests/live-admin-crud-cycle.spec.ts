import { test, expect } from '@playwright/test';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBiRY5MV9dKr2fXuo-uxICAXUneQTDNZG0",
  authDomain: "sumschool.firebaseapp.com",
  projectId: "sumschool",
  storageBucket: "sumschool.firebasestorage.app",
  messagingSenderId: "944074077877",
  appId: "1:944074077877:web:39d9e639ba4cb56bc630fc",
  measurementId: "G-6604RZSZLV"
};

test.describe('Live Firebase Cloud End-to-End CRUD Lifecycle', () => {
  test('Super-Admin can authenticate and perform full CRUD in Cloud Firestore', async () => {
    const app = initializeApp(firebaseConfig, 'live-crud-test');
    const auth = getAuth(app);
    const db = getFirestore(app);

    // 1. Authenticate with real credentials
    const userCredential = await signInWithEmailAndPassword(auth, 'admin@sumschools.org', 'admin@1963');
    expect(userCredential.user.email).toBe('admin@sumschools.org');
    expect(userCredential.user.uid).toBeTruthy();

    const testId = `ann-live-e2e-${Date.now()}`;
    const testDocRef = doc(db, 'announcements', testId);

    try {
      // 2. CREATE
      const payload = {
        id: testId,
        title: 'AUTOMATED_SMOKE_TEST_ANNOUNCEMENT',
        content: 'This announcement verifies live Cloud Firestore write and security rules.',
        category: 'academic',
        date: new Date().toISOString().split('T')[0],
        status: 'draft',
        isPinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(testDocRef, payload);

      // 3. READ & CONFIRM WRITE
      const createdSnap = await getDoc(testDocRef);
      expect(createdSnap.exists()).toBe(true);
      expect(createdSnap.data()?.title).toBe('AUTOMATED_SMOKE_TEST_ANNOUNCEMENT');
      expect(createdSnap.data()?.status).toBe('draft');

      // 4. UPDATE
      await updateDoc(testDocRef, {
        title: 'UPDATED_SMOKE_TEST_ANNOUNCEMENT',
        updatedAt: new Date().toISOString()
      });

      // 5. CONFIRM UPDATE
      const updatedSnap = await getDoc(testDocRef);
      expect(updatedSnap.exists()).toBe(true);
      expect(updatedSnap.data()?.title).toBe('UPDATED_SMOKE_TEST_ANNOUNCEMENT');

      // 6. DELETE
      await deleteDoc(testDocRef);

      // 7. CONFIRM DELETION
      const deletedSnap = await getDoc(testDocRef);
      expect(deletedSnap.exists()).toBe(false);

    } finally {
      // Ensure cleanup in case of failure
      try {
        await deleteDoc(testDocRef);
      } catch {
        // Ignore if already deleted
      }
    }
  });
});
