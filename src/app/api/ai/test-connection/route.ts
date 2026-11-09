import { NextRequest, NextResponse } from 'next/server';
import { callGemini, callOpenAI } from '@/lib/ai/multiAiService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { provider, apiKey, model } = await req.json();

    if (!provider || !apiKey) {
      return NextResponse.json(
        { success: false, message: 'Provider and API key are required.' },
        { status: 400 }
      );
    }

    const testPrompt = 'Respond strictly with the single word: CONNECTED';

    if (provider === 'gemini') {
      const { content, latencyMs } = await callGemini(
        testPrompt,
        apiKey,
        model || 'gemini-2.0-flash',
        'You are an API connection testing agent. Output single word responses.'
      );
      return NextResponse.json({
        success: true,
        message: `Google Gemini connected successfully (${latencyMs}ms)! Model: ${model || 'gemini-2.0-flash'}. Response: ${content.slice(0, 50)}`,
        latencyMs,
      });
    }

    if (provider === 'openai') {
      const { content, latencyMs } = await callOpenAI(
        testPrompt,
        apiKey,
        model || 'gpt-4o-mini',
        'You are an API connection testing agent. Output single word responses.'
      );
      return NextResponse.json({
        success: true,
        message: `OpenAI ChatGPT connected successfully (${latencyMs}ms)! Model: ${model || 'gpt-4o-mini'}. Response: ${content.slice(0, 50)}`,
        latencyMs,
      });
    }

    return NextResponse.json({
      success: false,
      message: `Provider '${provider}' is not yet active for live pings.`,
    }, { status: 400 });
  } catch (err: unknown) {
    console.error('Connection test failed:', err);
    return NextResponse.json({
      success: false,
      message: err instanceof Error ? err.message : 'Connection test failed. Check key validity.',
    }, { status: 400 });
  }
}
