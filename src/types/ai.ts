export type AIProviderId = 'gemini' | 'openai' | 'claude' | 'perplexity';

export interface AIModelConfig {
  id: string;
  name: string;
  description: string;
  contextWindow: number;
  isRecommended?: boolean;
}

export interface AIProviderConfig {
  id: AIProviderId;
  name: string;
  tagline: string;
  isEnabled: boolean;
  hasKeyConfigured: boolean;
  selectedModel: string;
  availableModels: AIModelConfig[];
  status: 'active' | 'not_configured' | 'error' | 'coming_soon';
  latencyMs?: number;
}

export interface MultiAISettings {
  defaultProvider: AIProviderId;
  fallbackProvider: AIProviderId;
  autoFallbackEnabled: boolean;
  providers: Record<AIProviderId, AIProviderConfig>;
  dailyTokenQuota: number;
  usedTokensToday: number;
  requireAdminApprovalForBroadcasts: boolean;
  maskStudentPii: boolean;
  systemTone: 'formal' | 'academic' | 'friendly';
  updatedAt: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  providerUsed?: AIProviderId;
  modelUsed?: string;
  latencyMs?: number;
  timestamp: string;
}

export interface AICallRequest {
  provider?: AIProviderId;
  model?: string;
  systemPrompt?: string;
  prompt: string;
  category?: 'circular' | 'enquiry' | 'academic' | 'translation' | 'general';
  language?: 'en' | 'ta';
  contextData?: Record<string, unknown>;
  stream?: boolean;
}

export interface AICallResponse {
  success: boolean;
  content: string;
  provider: AIProviderId;
  model: string;
  latencyMs: number;
  error?: string;
  fallbackTriggered?: boolean;
  providerUsedOriginal?: AIProviderId;
}
