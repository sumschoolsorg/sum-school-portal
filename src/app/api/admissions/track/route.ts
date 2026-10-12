import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminDb } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimitKey(request: NextRequest) {
  const configuredHeader = process.env.TRUSTED_PROXY_HEADER;
  return ((configuredHeader && request.headers.get(configuredHeader))
    || request.headers.get('x-real-ip')
    || request.headers.get('cf-connecting-ip'))?.trim().slice(0, 128) || 'unknown-client';
}

function limited(key: string) {
  const now = Date.now();
  for (const [candidate, item] of attempts) if (item.resetAt <= now) attempts.delete(candidate);
  const item = attempts.get(key);
  if (!item || item.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + 60_000 });
    return 0;
  }
  if (item.count >= 5) return Math.max(1, Math.ceil((item.resetAt - now) / 1000));
  item.count += 1;
  return 0;
}

export async function POST(request: NextRequest) {
  try {
    const retryAfter = limited(rateLimitKey(request));
    if (retryAfter) return NextResponse.json({ success: false, message: 'Too many tracking requests. Please wait before trying again.' }, { status: 429, headers: { 'Retry-After': String(retryAfter), 'Cache-Control': 'no-store' } });

    const length = Number(request.headers.get('content-length') || 0);
    if (length > 2_000) return NextResponse.json({ success: false, message: 'Invalid request.' }, { status: 413 });
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Enter valid tracking details.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    if (!body || typeof body !== 'object') return NextResponse.json({ success: false, message: 'Enter valid tracking details.' }, { status: 400 });
    const input = body as Record<string, unknown>;
    const applicationNumber = typeof input.applicationNumber === 'string' ? input.applicationNumber.trim().toUpperCase() : '';
    const phone = typeof input.phone === 'string' ? input.phone.replace(/\D/g, '') : '';
    if (!/^[A-Z0-9-]{6,40}$/.test(applicationNumber) || phone.length < 10 || phone.length > 15) {
      return NextResponse.json({ success: false, message: 'Enter a valid application number and registered phone number.' }, { status: 400 });
    }

    const db = getFirebaseAdminDb();
    if (!db) return NextResponse.json({
      success: false,
      requiresOfficeContact: true,
      message: 'Online application tracking is not configured. Please contact the school office for an update.',
    }, { status: 503, headers: { 'Cache-Control': 'no-store' } });

    const snapshot = await db.collection('enquiries').where('applicationNumber', '==', applicationNumber).limit(5).get();
    const cleanPhone = phone.slice(-10);
    const matching = snapshot.docs.filter((doc) => {
      const record = doc.data();
      const storedPhone = typeof record.phone === 'string' ? record.phone.replace(/\D/g, '') : '';
      return storedPhone.length >= 10 && storedPhone.slice(-10) === cleanPhone && record.source === 'admission';
    });
    if (matching.length !== 1) return NextResponse.json({ success: false, error: 'NOT_FOUND', message: 'No application matched those details.' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });

    const record = matching[0].data();
    const allowedStatuses = ['new', 'contacted', 'follow-up', 'approved', 'rejected'];
    return NextResponse.json({
      success: true,
      isLocalPreview: false,
      result: {
        applicationNumber: String(record.applicationNumber || ''),
        studentName: String(record.studentName || ''),
        classApplyingFor: String(record.classApplyingFor || ''),
        ...(typeof record.applicationDate === 'string' ? { applicationDate: record.applicationDate } : {}),
        status: allowedStatuses.includes(record.status) ? record.status : 'new',
      },
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Admission tracking failed:', error instanceof Error ? error.message : 'Unknown server error');
    return NextResponse.json({ success: false, error: 'SERVER_ERROR', message: 'Application status could not be retrieved. Please try again later.' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
