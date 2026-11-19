import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBiRY5MV9dKr2fXuo-uxICAXUneQTDNZG0",
  authDomain: "sumschool.firebaseapp.com",
  projectId: "sumschool",
  storageBucket: "sumschool.firebasestorage.app",
  messagingSenderId: "944074077877",
  appId: "1:944074077877:web:39d9e639ba4cb56bc630fc",
  measurementId: "G-6604RZSZLV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const KNOWN_COLLECTIONS = [
  'schoolSettings',
  'homepageContent',
  'aboutContent',
  'academicsContent',
  'admissionsContent',
  'themeSettings',
  'websiteSettings',
  'heroBanners',
  'faculty',
  'facilities',
  'announcements',
  'events',
  'gallery',
  'achievements',
  'timelineEntries',
  'testimonials',
  'enquiries',
  'alumni',
  'alumniPrivate',
  'studentResults',
  'adminUsers',
  'mediaAssets',
  'contactMessages',
  'researchRecords',
  'transportRoutes'
];

async function main() {
  console.log('--- Signing in as admin@sumschools.org ---');
  try {
    const cred = await signInWithEmailAndPassword(auth, 'admin@sumschools.org', 'admin@1963');
    console.log('Authenticated successfully as:', cred.user.email, 'UID:', cred.user.uid);
  } catch (err) {
    console.error('Sign-in error:', err.code, err.message);
    process.exit(1);
  }

  console.log('\n--- Scanning Firestore Collections ---');
  const report = {};

  for (const colName of KNOWN_COLLECTIONS) {
    try {
      const snap = await getDocs(collection(db, colName));
      report[colName] = {
        count: snap.size,
        docs: snap.docs.map(d => ({ id: d.id, ...d.data() }))
      };
      console.log(`Collection "${colName}": ${snap.size} documents found.`);
    } catch (err) {
      console.error(`Error reading "${colName}":`, err.code, err.message);
      report[colName] = { error: err.message };
    }
  }

  console.log('\n--- Scan Summary ---');
  let totalDocs = 0;
  for (const [col, info] of Object.entries(report)) {
    if (info.count !== undefined) {
      totalDocs += info.count;
      console.log(`${col.padEnd(20)}: ${info.count} documents`);
    } else {
      console.log(`${col.padEnd(20)}: ERROR (${info.error})`);
    }
  }
  console.log(`\nTotal Documents in Cloud Firestore: ${totalDocs}`);

  console.log('\n--- Document ID Details ---');
  for (const [col, info] of Object.entries(report)) {
    if (info.docs && info.docs.length > 0) {
      console.log(`\n[${col}] (${info.docs.length} items):`);
      info.docs.forEach((doc, idx) => {
        const title = doc.title || doc.name || doc.studentName || doc.schoolName || doc.url || '(no title/name)';
        const status = doc.status || '(no status)';
        console.log(`  ${idx + 1}. ID: "${doc.id}" | Name/Title: "${title}" | Status: ${status}`);
      });
    }
  }
}

main().catch(console.error);
