import { NextRequest, NextResponse } from 'next/server';
import { orchestrateMultiAICall } from '@/lib/ai/multiAiService';
import { AICallRequest } from '@/types/ai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AICallRequest;

    if (!body || !body.prompt || typeof body.prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid prompt string.' },
        { status: 400 }
      );
    }

    const response = await orchestrateMultiAICall(body);

    return NextResponse.json(response);
  } catch (err: unknown) {
    console.error('Error in /api/ai/chat:', err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Internal AI service error',
      },
      { status: 500 }
    );
  }
}
