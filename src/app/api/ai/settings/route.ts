import { NextRequest, NextResponse } from 'next/server';
import { defaultMultiAISettings } from '@/lib/ai/defaultAiSettings';
import { MultiAISettings } from '@/types/ai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// In-memory runtime settings cache (or persistent fallback)
let activeSettings: MultiAISettings = { ...defaultMultiAISettings };

export async function GET() {
  // Update live status from env
  const updated: MultiAISettings = {
    ...activeSettings,
    providers: {
      ...activeSettings.providers,
      gemini: {
        ...activeSettings.providers.gemini,
        hasKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
        status: process.env.GEMINI_API_KEY ? 'active' : 'not_configured',
      },
      openai: {
        ...activeSettings.providers.openai,
        hasKeyConfigured: Boolean(process.env.OPENAI_API_KEY),
        status: process.env.OPENAI_API_KEY ? 'active' : 'not_configured',
      },
    },
  };

  return NextResponse.json({ success: true, settings: updated });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<MultiAISettings>;
    activeSettings = {
      ...activeSettings,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return NextResponse.json({ success: true, settings: activeSettings });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to save settings' },
      { status: 500 }
    );
  }
}
