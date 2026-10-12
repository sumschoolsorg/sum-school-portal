import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminDb } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 5;
const MAX_BODY_BYTES = 2_000;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: NextRequest): string {
  const trustedHeader = process.env.TRUSTED_PROXY_HEADER;
  const trustedAddress = (trustedHeader ? request.headers.get(trustedHeader) : null)
    || request.headers.get('x-real-ip')
    || request.headers.get('cf-connecting-ip');
  return trustedAddress?.trim().slice(0, 128) || 'unknown-client';
}

function rateLimited(key: string) {
  const now = Date.now();
  for (const [candidate, entry] of rateLimitMap) {
    if (entry.resetAt <= now) rateLimitMap.delete(candidate);
  }
  const entry = rateLimitMap.get(key);
  if (!entry || entry.resetAt <= now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return 0;
  }
  if (entry.count >= RATE_LIMIT) return Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
  entry.count += 1;
  return 0;
}

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

export async function POST(request: NextRequest) {
  try {
    const retryAfter = rateLimited(clientKey(request));
    if (retryAfter) {
      return NextResponse.json({ success: false, error: 'RATE_LIMIT_EXCEEDED', message: 'Too many attempts. Please wait before trying again.' }, {
        status: 429,
        headers: { 'Retry-After': String(retryAfter), 'Cache-Control': 'no-store' },
      });
    }

    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ success: false, error: 'PAYLOAD_TOO_LARGE', message: 'Invalid request.' }, { status: 413 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: 'INVALID_REQUEST', message: 'Enter a valid roll or registration number and date of birth.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'INVALID_REQUEST', message: 'Enter a valid roll or registration number and date of birth.' }, { status: 400 });
    }
    const payload = body as Record<string, unknown>;
    const rollNumber = typeof payload.rollNumber === 'string' ? payload.rollNumber.trim().toUpperCase() : '';
    const dob = typeof payload.dob === 'string' ? payload.dob.trim() : '';
    if (!/^[A-Z0-9/-]{4,25}$/.test(rollNumber) || !validDate(dob)) {
      return NextResponse.json({ success: false, error: 'INVALID_REQUEST', message: 'Enter a valid roll or registration number and date of birth.' }, { status: 400 });
    }

    const db = getFirebaseAdminDb();
    if (!db) {
      return NextResponse.json({
        success: false,
        requiresAdminVerification: true,
        error: 'RESULT_LOOKUP_NOT_CONFIGURED',
        message: 'Online result lookup is not configured. Please contact the school office to verify your result.',
      }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
    }

    // Private results are read only by this server endpoint with service credentials.
    // Query both supported identifiers and require DOB to match before release.
    const [rollSnapshot, registerSnapshot] = await Promise.all([
      db.collection('studentResults').where('rollNumber', '==', rollNumber).limit(2).get(),
      db.collection('studentResults').where('registerNumber', '==', rollNumber).limit(2).get(),
    ]);
    const docs = new Map([...rollSnapshot.docs, ...registerSnapshot.docs].map((doc) => [doc.id, doc]));
    const candidate = [...docs.values()].find((doc) => {
      const record = doc.data();
      return record.status === 'published' && typeof record.dob === 'string' && record.dob === dob;
    });

    if (!candidate) {
      // Identical response prevents determining whether a roll number exists.
      return NextResponse.json({ success: false, error: 'NOT_FOUND', message: 'No result matched the supplied details.' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    }

    const record = candidate.data();
    const result = {
      id: candidate.id,
      rollNumber: String(record.rollNumber || ''),
      registerNumber: String(record.registerNumber || ''),
      studentName: String(record.studentName || ''),
      ...(typeof record.studentName_ta === 'string' ? { studentName_ta: record.studentName_ta } : {}),
      className: String(record.className || ''),
      ...(typeof record.section === 'string' ? { section: record.section } : {}),
      examName: String(record.examName || ''),
      academicYear: String(record.academicYear || ''),
      subjects: Array.isArray(record.subjects) ? record.subjects : [],
      totalMarks: Number(record.totalMarks || 0),
      totalMaxMarks: Number(record.totalMaxMarks || 0),
      percentage: Number(record.percentage || 0),
      overallGrade: String(record.overallGrade || ''),
      resultStatus: record.resultStatus === 'PASS' || record.resultStatus === 'FAIL' ? record.resultStatus : 'WITHHELD',
      issueDate: String(record.issueDate || ''),
      status: 'published' as const,
    };
    return NextResponse.json({ success: true, result, isLocalPreview: false }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Results lookup failed:', error instanceof Error ? error.message : 'Unknown server error');
    return NextResponse.json({ success: false, error: 'SERVER_ERROR', message: 'Results could not be retrieved. Please try again later.' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
