import { MultiAISettings } from '@/types/ai';

export const defaultMultiAISettings: MultiAISettings = {
  defaultProvider: 'gemini',
  fallbackProvider: 'openai',
  autoFallbackEnabled: true,
  dailyTokenQuota: 100000,
  usedTokensToday: 14200,
  requireAdminApprovalForBroadcasts: true,
  maskStudentPii: true,
  systemTone: 'formal',
  updatedAt: new Date().toISOString(),
  providers: {
    gemini: {
      id: 'gemini',
      name: 'Google Gemini',
      tagline: 'Primary AI Provider (Optimized for Multilingual Tamil & Fast Reasoning)',
      isEnabled: true,
      hasKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
      selectedModel: 'gemini-2.0-flash',
      status: process.env.GEMINI_API_KEY ? 'active' : 'not_configured',
      availableModels: [
        {
          id: 'gemini-2.0-flash',
          name: 'Gemini 2.0 Flash',
          description: 'Ultra-fast, state-of-the-art multilingual reasoning model (Recommended for School Admin)',
          contextWindow: 1000000,
          isRecommended: true,
        },
        {
          id: 'gemini-1.5-pro',
          name: 'Gemini 1.5 Pro',
          description: 'High-capability complex analysis model for academic performance and diagnostic reports',
          contextWindow: 2000000,
        },
        {
          id: 'gemini-1.5-flash',
          name: 'Gemini 1.5 Flash',
          description: 'Lightweight and high-efficiency model for quick translations and short SMS drafting',
          contextWindow: 1000000,
        },
      ],
    },
    openai: {
      id: 'openai',
      name: 'OpenAI ChatGPT',
      tagline: 'Secondary AI Provider (High-Precision Drafting & Alternative Redundancy)',
      isEnabled: true,
      hasKeyConfigured: Boolean(process.env.OPENAI_API_KEY),
      selectedModel: 'gpt-4o-mini',
      status: process.env.OPENAI_API_KEY ? 'active' : 'not_configured',
      availableModels: [
        {
          id: 'gpt-4o-mini',
          name: 'GPT-4o Mini',
          description: 'Affordable, fast intelligent model for general drafting and parent inquiry responses',
          contextWindow: 128000,
          isRecommended: true,
        },
        {
          id: 'gpt-4o',
          name: 'GPT-4o',
          description: 'Flagship multimodal model with deep language precision for formal administrative deeds',
          contextWindow: 128000,
        },
      ],
    },
    claude: {
      id: 'claude',
      name: 'Anthropic Claude',
      tagline: 'Future Integration (Long-Form Archival Research & Policy Drafting)',
      isEnabled: false,
      hasKeyConfigured: false,
      selectedModel: 'claude-3-5-sonnet',
      status: 'coming_soon',
      availableModels: [
        {
          id: 'claude-3-7-sonnet',
          name: 'Claude 3.7 Sonnet',
          description: 'Hybrid reasoning and prose model for detailed educational policy drafting',
          contextWindow: 200000,
        },
        {
          id: 'claude-3-5-haiku',
          name: 'Claude 3.5 Haiku',
          description: 'Fast, compact model for rapid notifications',
          contextWindow: 200000,
        },
      ],
    },
    perplexity: {
      id: 'perplexity',
      name: 'Perplexity AI',
      tagline: 'Future Integration (Live Educational Research & Government Gazette Search)',
      isEnabled: false,
      hasKeyConfigured: false,
      selectedModel: 'sonar',
      status: 'coming_soon',
      availableModels: [
        {
          id: 'sonar',
          name: 'Sonar Search',
          description: 'Online search-augmented model for current Tamil Nadu Education Board gazettes',
          contextWindow: 128000,
        },
      ],
    },
  },
};
