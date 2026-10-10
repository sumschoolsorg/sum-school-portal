import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function serviceAccountFromEnv() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) return undefined;
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object') throw new Error('Invalid Firebase service account configuration');
  const account = parsed as Record<string, unknown>;
  if (typeof account.project_id !== 'string' || typeof account.client_email !== 'string' || typeof account.private_key !== 'string') {
    throw new Error('Firebase service account must include project_id, client_email, and private_key');
  }
  return cert({
    projectId: account.project_id,
    clientEmail: account.client_email,
    privateKey: account.private_key.replace(/\\n/g, '\n'),
  });
}

export function getFirebaseAdminDb() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const credential = serviceAccountFromEnv();
  if (!projectId || (!credential && !process.env.GOOGLE_APPLICATION_CREDENTIALS)) return null;
  const existing = getApps().find((app) => app.name === 'server-admin');
  const app = existing || initializeApp({ projectId, ...(credential ? { credential } : {}) }, 'server-admin');
  return getFirestore(app);
}
