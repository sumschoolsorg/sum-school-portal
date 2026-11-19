import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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

async function main() {
  await signInWithEmailAndPassword(auth, 'admin@sumschools.org', 'admin@1963');
  
  const annSnap = await getDoc(doc(db, 'announcements', 'ann-1795121063083'));
  console.log('--- Announcement ---', JSON.stringify(annSnap.data(), null, 2));

  const alumniSnap = await getDoc(doc(db, 'alumni', 'alumni-1795075912837-v21gi'));
  console.log('--- Alumni ---', JSON.stringify(alumniSnap.data(), null, 2));
}

main().catch(console.error);
