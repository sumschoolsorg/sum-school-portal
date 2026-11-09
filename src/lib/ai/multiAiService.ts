import { AIProviderId, AICallRequest, AICallResponse } from '@/types/ai';

export const INSTITUTIONAL_SYSTEM_PROMPT = `You are the Official AI Administrative Copilot for Savariyappa Udaiyar Memorial (S.U.M.) Higher Secondary & Primary School, located in Royappanpatti, Theni District, Tamil Nadu (PIN: 625526, Established: 1963, Secondary UDISE: 33250800109, Primary UDISE: 33250800105).

Your duties include:
1. Drafting professional, courteous, and culturally respectful school communications, announcements, parent letters, circulars, and event invitations.
2. Full bilingual support in both English and literary Tamil (தமிழ்).
3. Analyzing student academic and attendance data constructively, providing insightful diagnostic summaries.
4. Assisting school administrators with parent admission inquiries, fee reminders, bus schedule alerts, and staff notifications.

Core Principles:
- Tone: Formal, respectful, encouraging, and education-focused.
- Safety: Never output student personally identifiable sensitive information (like full Aadhaar numbers, private financial bank details).
- Verification: Always remind administrators that AI-generated circulars and public notifications require Headmaster or Correspondent verification before final distribution.`;

export function scrubSensitiveStudentData(text: string): string {
  if (!text) return '';
  // Mask 12-digit Aadhaar numbers: 1234 5678 9012 or 123456789012
  let sanitized = text.replace(/\b\d{4}\s?\d{4}\s?\d{4}\b/g, '[AADHAAR-MASKED]');
  // Mask 10-digit phone numbers
  sanitized = sanitized.replace(/\b(?:\+91[- ]?)?[6-9]\d{9}\b/g, '[PHONE-MASKED]');
  return sanitized;
}

export async function callGemini(
  prompt: string,
  apiKey: string,
  model: string = 'gemini-2.0-flash',
  systemPrompt: string = INSTITUTIONAL_SYSTEM_PROMPT
): Promise<{ content: string; latencyMs: number }> {
  const startTime = Date.now();
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nTask:\n${prompt}` }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    }),
  });

  const latencyMs = Date.now() - startTime;

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Gemini API returned an empty response.');
  }

  return { content: text.trim(), latencyMs };
}

export async function callOpenAI(
  prompt: string,
  apiKey: string,
  model: string = 'gpt-4o-mini',
  systemPrompt: string = INSTITUTIONAL_SYSTEM_PROMPT
): Promise<{ content: string; latencyMs: number }> {
  const startTime = Date.now();
  const endpoint = 'https://api.openai.com/v1/chat/completions';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  const latencyMs = Date.now() - startTime;

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const choice = data.choices?.[0];
  const text = choice?.message?.content;

  if (!text) {
    throw new Error('OpenAI API returned an empty response.');
  }

  return { content: text.trim(), latencyMs };
}

export function generateLocalDemoResponse(
  prompt: string,
  category?: string,
  language: 'en' | 'ta' = 'en'
): string {
  const isTa = language === 'ta' || /[\u0B80-\u0BFF]/.test(prompt);

  if (category === 'circular' || /circular|notice|holiday|leave|விடுமுறை|சுற்றறிக்கை/i.test(prompt)) {
    return isTa
      ? `🏛️ **எஸ்.யு.எம். மேல்நிலைப் பள்ளி & தொடக்கப் பள்ளி — ராயப்பன்பட்டி**
**சுற்றறிக்கை எண்: SUM/CIR/2026/04**
**தேதி:** ${new Date().toLocaleDateString('ta-IN')}

**அனைத்து பெற்றோர்கள், ஆசிரியர்கள் மற்றும் மாணவர்களின் கவனத்திற்கு:**

பொருள்: வரவிருக்கும் பள்ளி சிறப்பு நிகழ்வு மற்றும் விடுமுறை அறிவிப்பு.

நமது எஸ்.யு.எம். மேல்நிலைப் பள்ளியில் பயிலும் அனைத்து மாணவ-மாணவியருக்கும் வரும் வாரம் பள்ளி நிர்வாக வாரியம் மற்றும் அரசு கல்வித்துறை வழிகாட்டுதலின்படி திட்டமிடப்பட்ட செயல்பாடுகள் குறித்த விவரங்கள்:

1. **பள்ளி நேரம்:** வழக்கம் போல் காலை 08:45 மணி முதல் மாலை 04:30 மணி வரை வகுப்புகள் நடைபெறும்.
2. **சிறப்பு மன்றக் கூட்டங்கள்:** இலக்கிய மன்றம், அறிவியல் கழகம் மற்றும் ரோபோடிக்ஸ் ஆய்வகப் பயிற்சிகள் மதிய உணவு இடைவேளைக்குப் பின் நடைபெறும்.
3. **போக்குவரத்து வசதி:** அனைத்து வழித்தடப் பேருந்துகளும் வழக்கமான நேரத்திற்கு காலை மற்றும் மாலையில் இயக்கப்படும்.

ஏதேனும் கூடுதல் தகவல்களுக்கு பள்ளி அலுவலகத்தை (04554-290000) அலுவலக நேரத்தில் தொடர்புகொள்ளவும்.

**செயலர் & நிர்வாக அலுவலர்**  
எஸ்.யு.எம். மேல்நிலைப் பள்ளி, ராயப்பன்பட்டி.`
      : `🏛️ **SAVARIYAPPA UDAIYAR MEMORIAL HIGHER SECONDARY SCHOOL**
**Royappanpatti – 625526, Theni District**
**Circular Ref:** SUM/CIR/2026/04 | **Date:** ${new Date().toLocaleDateString('en-IN')}

**OFFICIAL ADMINISTRATIVE NOTICE**

**Subject:** Campus Academic Schedule & Official Notification

Dear Parents, Teachers, and Students,

Please take note of the following institutional guidelines and scheduled programs at S.U.M. Higher Secondary School:

1. **Instruction Hours:** Morning assembly commences at 08:45 AM sharp. Regular classes proceed until 04:30 PM.
2. **Laboratories & Special Mentorship:** Practical sessions for Physics, Chemistry, Biology, and Computer Science will continue as per the academic timetable.
3. **School Transportation:** All authorized school bus routes (Cumbum Express, Uthamapalayam Loop, Chinnamanur) will operate at their designated stop timings.
4. **Parent Inquiries:** For academic updates, fee receipts, or bus inquiries, parents may contact the administration office between 09:00 AM and 05:00 PM.

By Order,  
**Headmaster & Administrative Council**  
S.U.M. Higher Secondary School, Royappanpatti.`;
  }

  if (category === 'enquiry' || /admission|fee|seat|சேர்க்கை|கட்டணம்/i.test(prompt)) {
    return isTa
      ? `வணக்கம்,
எஸ்.யு.எம். மேல்நிலைப் பள்ளியில் (ராயப்பன்பட்டி) உங்கள் குழந்தையின் சேர்க்கை குறித்து விசாரித்தமைக்கு மிக்க நன்றி.

1. **வகுப்புகள் & பிரிவுகள்:** 1-ஆம் வகுப்பு முதல் 12-ஆம் வகுப்பு வரை (தமிழ் & ஆங்கில வழிக் கல்வி).
2. **மேல்நிலைப் பிரிவு (+2 பாடப்பிரிவுகள்):** 
   - உயிரி-கணிதம் (Bio-Maths)
   - கணினி அறிவியல் & கணிதம் (Computer Science)
   - தூய அறிவியல் (Pure Science)
   - வணிகவியல் & கணக்குப்பதிவியல் (Commerce & Accountancy)
3. **வசதிகள்:** அடல் டிங்கரிங் ரோபோடிக்ஸ் ஆய்வகம், டிஜிட்டல் ஸ்மார்ட் வகுப்பறைகள், இலவச புத்தக வங்கி மற்றும் கிராமப்புற பேருந்து வசதிகள்.
4. **விண்ணப்ப முறை:** எங்களது இணையதள சேர்க்கை போர்ட்டல் வழியே ஆன்லைனில் விண்ணப்பிக்கலாம் அல்லது பள்ளி அலுவலகத்தை நேரில் அணுகலாம்.`
      : `Dear Parent,

Thank you for your interest in admissions at Savariyappa Udaiyar Memorial (S.U.M.) Higher Secondary School, Royappanpatti (Est. 1963).

1. **Admissions Open For:** Classes 1st to 12th Standard (Tamil & English Medium streams).
2. **Higher Secondary (+2) Groups:**
   - Group 1: Mathematics, Physics, Chemistry, Biology
   - Group 2: Mathematics, Physics, Chemistry, Computer Science
   - Group 3: Commerce, Accountancy, Economics, Computer Applications
3. **Campus Facilities:** Atal Tinkering Lab (Robotics), Digital Smart Boards, Modern Physics/Chemistry Labs, High-Speed Computer Center, and Fleet Bus Routes across Cumbum Valley.
4. **Next Steps:** You may register online at our Admissions Portal (/admissions) or visit the campus office from 09:00 AM to 04:30 PM with your child's previous marksheet and transfer documents.`;
  }

  return isTa
    ? `வணக்கம்! எஸ்.யு.எம். பள்ளி AI நிர்வாக உதவியாளர் பணியில் உள்ளார்.

உங்களின் கேள்வி: "${prompt}"

நமது பள்ளி வரலாற்றுப் பின்னணி (1963 முதல் 60+ ஆண்டுகள்), மாணவர் சேர்க்கை, தேர்வுகள், பேருந்து வழித்தடங்கள் அல்லது அரசு சுற்றறிக்கைகள் தொடர்பான எந்தவொரு ஆவணங்களையும் உருவாக்க நான் உதவ முடியும். நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?`
    : `Hello! I am the S.U.M. School Administrative AI Copilot.

Regarding your request: "${prompt}"

I am ready to assist with drafting bilingual announcements, summarizing parent inquiries, generating student attendance reminders, preparing board examination marksheet analyses, or translating administrative orders between English and Tamil. How would you like to proceed?`;
}

export async function orchestrateMultiAICall(
  request: AICallRequest,
  geminiKey?: string,
  openaiKey?: string
): Promise<AICallResponse> {
  const preferredProvider = request.provider || 'gemini';
  const prompt = scrubSensitiveStudentData(request.prompt);
  const sysPrompt = request.systemPrompt || INSTITUTIONAL_SYSTEM_PROMPT;

  // Attempt 1: Preferred Provider
  if (preferredProvider === 'gemini') {
    const key = geminiKey || process.env.GEMINI_API_KEY;
    if (key) {
      try {
        const { content, latencyMs } = await callGemini(prompt, key, request.model || 'gemini-2.0-flash', sysPrompt);
        return {
          success: true,
          content,
          provider: 'gemini',
          model: request.model || 'gemini-2.0-flash',
          latencyMs,
        };
      } catch (err: unknown) {
        console.warn('Primary Gemini call failed, evaluating fallback:', err instanceof Error ? err.message : err);
      }
    }
  } else if (preferredProvider === 'openai') {
    const key = openaiKey || process.env.OPENAI_API_KEY;
    if (key) {
      try {
        const { content, latencyMs } = await callOpenAI(prompt, key, request.model || 'gpt-4o-mini', sysPrompt);
        return {
          success: true,
          content,
          provider: 'openai',
          model: request.model || 'gpt-4o-mini',
          latencyMs,
        };
      } catch (err: unknown) {
        console.warn('Primary OpenAI call failed, evaluating fallback:', err instanceof Error ? err.message : err);
      }
    }
  }

  // Attempt 2: Automatic Fallback to Alternate Provider
  if (preferredProvider === 'gemini') {
    const backupKey = openaiKey || process.env.OPENAI_API_KEY;
    if (backupKey) {
      try {
        const { content, latencyMs } = await callOpenAI(prompt, backupKey, 'gpt-4o-mini', sysPrompt);
        return {
          success: true,
          content,
          provider: 'openai',
          model: 'gpt-4o-mini',
          latencyMs,
          fallbackTriggered: true,
          providerUsedOriginal: 'gemini',
        };
      } catch (backupErr: unknown) {
        console.warn('Fallback OpenAI call also failed:', backupErr instanceof Error ? backupErr.message : backupErr);
      }
    }
  } else {
    const backupKey = geminiKey || process.env.GEMINI_API_KEY;
    if (backupKey) {
      try {
        const { content, latencyMs } = await callGemini(prompt, backupKey, 'gemini-2.0-flash', sysPrompt);
        return {
          success: true,
          content,
          provider: 'gemini',
          model: 'gemini-2.0-flash',
          latencyMs,
          fallbackTriggered: true,
          providerUsedOriginal: 'openai',
        };
      } catch (backupErr: unknown) {
        console.warn('Fallback Gemini call also failed:', backupErr instanceof Error ? backupErr.message : backupErr);
      }
    }
  }

  // Attempt 3: Local Offline Dev Mode Fallback
  const demoContent = generateLocalDemoResponse(request.prompt, request.category, request.language);
  return {
    success: true,
    content: demoContent,
    provider: preferredProvider,
    model: request.model || (preferredProvider === 'gemini' ? 'gemini-2.0-flash' : 'gpt-4o-mini'),
    latencyMs: 120,
    fallbackTriggered: true,
    error: 'Live cloud API keys not configured or rate-limited; demonstrating high-fidelity institutional template.',
  };
}
