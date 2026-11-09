'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Cpu,
  Key,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Sliders,
  Zap,
  Lock,
  Eye,
  EyeOff,
  ExternalLink,
  Bot,
} from 'lucide-react';
import { toast } from 'sonner';
import { MultiAISettings, AIProviderId } from '@/types/ai';
import { defaultMultiAISettings } from '@/lib/ai/defaultAiSettings';

export default function AdminAISettingsPage() {
  const [settings, setSettings] = useState<MultiAISettings>(defaultMultiAISettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Key testing states
  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [testingGemini, setTestingGemini] = useState(false);

  const [openaiKeyInput, setOpenaiKeyInput] = useState('');
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [testingOpenai, setTestingOpenai] = useState(false);

  useEffect(() => {
    fetch('/api/ai/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => {
        console.error('Failed to load AI settings:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleTestConnection = async (provider: 'gemini' | 'openai') => {
    const key = provider === 'gemini' ? geminiKeyInput : openaiKeyInput;
    if (!key) {
      toast.error(`Please enter a valid ${provider.toUpperCase()} API key to test.`);
      return;
    }

    if (provider === 'gemini') setTestingGemini(true);
    if (provider === 'openai') setTestingOpenai(true);

    try {
      const res = await fetch('/api/ai/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          apiKey: key,
          model: settings.providers[provider].selectedModel,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || 'Connection verified successfully!');
        setSettings((prev) => ({
          ...prev,
          providers: {
            ...prev.providers,
            [provider]: {
              ...prev.providers[provider],
              status: 'active',
              hasKeyConfigured: true,
              latencyMs: data.latencyMs,
            },
          },
        }));
      } else {
        toast.error(data.message || 'Connection test failed.');
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Network test error.');
    } finally {
      if (provider === 'gemini') setTestingGemini(false);
      if (provider === 'openai') setTestingOpenai(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/ai/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Multi-AI configuration saved successfully!');
      } else {
        toast.error('Failed to save settings.');
      }
    } catch {
      toast.error('Network error saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateModelSelection = (providerId: AIProviderId, modelId: string) => {
    setSettings((prev) => ({
      ...prev,
      providers: {
        ...prev.providers,
        [providerId]: {
          ...prev.providers[providerId],
          selectedModel: modelId,
        },
      },
    }));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white flex items-center gap-3">
            <Cpu className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span>Multi-AI Provider &amp; Intelligence Control</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Orchestrate Google Gemini, OpenAI ChatGPT, and upcoming AI models with server-side security, automatic failover, and token controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            variant="primary"
            leftIcon={isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
          >
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </div>

      {/* Primary / Fallback Orchestrator Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-900/10 via-indigo-900/5 to-transparent border-blue-200 dark:border-blue-900/40">
        <div className="flex items-center gap-3 mb-4">
          <Sliders className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Dual-Provider Orchestration &amp; Redundancy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Default Primary Provider
            </label>
            <Select
              value={settings.defaultProvider}
              onChange={(e) => setSettings({ ...settings, defaultProvider: e.target.value as AIProviderId })}
              options={[
                { value: 'gemini', label: 'Google Gemini (Recommended — Multilingual Tamil & Fast)' },
                { value: 'openai', label: 'OpenAI ChatGPT (High Precision & Reasoning)' },
              ]}
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Primary provider used for all routine administrative prompts.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Secondary Fallback Provider
            </label>
            <Select
              value={settings.fallbackProvider}
              onChange={(e) => setSettings({ ...settings, fallbackProvider: e.target.value as AIProviderId })}
              options={[
                { value: 'openai', label: 'OpenAI ChatGPT' },
                { value: 'gemini', label: 'Google Gemini' },
              ]}
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Engaged immediately if the primary API faces timeout or quota limits.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Automatic Failover
            </label>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="autoFallback"
                checked={settings.autoFallbackEnabled}
                onChange={(e) => setSettings({ ...settings, autoFallbackEnabled: e.target.checked })}
                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700"
              />
              <label htmlFor="autoFallback" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                Enable Instant Zero-Downtime Fallback
              </label>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Seamlessly switch between Gemini and ChatGPT without admin interruption.
            </p>
          </div>
        </div>
      </Card>

      {/* Provider Details & API Key Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Gemini Card */}
        <Card className="p-6 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 font-extrabold text-lg">
                  G
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Google Gemini
                    <Badge variant={settings.providers.gemini.status === 'active' ? 'success' : 'neutral'}>
                      {settings.providers.gemini.status === 'active' ? 'Active' : 'Awaiting Key'}
                    </Badge>
                  </h3>
                  <p className="text-[11px] text-slate-500">Primary Provider • Free &amp; Pay-as-you-go tiers</p>
                </div>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Get Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Active Model
                </label>
                <Select
                  value={settings.providers.gemini.selectedModel}
                  onChange={(e) => updateModelSelection('gemini', e.target.value)}
                  options={settings.providers.gemini.availableModels.map((m) => ({
                    value: m.id,
                    label: `${m.name} (${m.contextWindow / 1000}k Context) ${m.isRecommended ? '★ Recommended' : ''}`,
                  }))}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Gemini API Key
                </label>
                <div className="relative">
                  <Input
                    type={showGeminiKey ? 'text' : 'password'}
                    value={geminiKeyInput}
                    onChange={(e) => setGeminiKeyInput(e.target.value)}
                    placeholder="AIzaSy... (stored securely on server)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGeminiKey(!showGeminiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>Encrypted server-side. Never shared or visible to public visitors.</span>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {settings.providers.gemini.latencyMs ? `Avg Latency: ${settings.providers.gemini.latencyMs}ms` : 'Not tested'}
            </span>
            <Button
              onClick={() => handleTestConnection('gemini')}
              disabled={testingGemini || !geminiKeyInput}
              size="sm"
              variant="outline"
              leftIcon={testingGemini ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-500" />}
            >
              {testingGemini ? 'Testing...' : 'Test Connection'}
            </Button>
          </div>
        </Card>

        {/* OpenAI ChatGPT Card */}
        <Card className="p-6 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 font-extrabold text-lg">
                  O
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    OpenAI ChatGPT
                    <Badge variant={settings.providers.openai.status === 'active' ? 'success' : 'neutral'}>
                      {settings.providers.openai.status === 'active' ? 'Active' : 'Awaiting Key'}
                    </Badge>
                  </h3>
                  <p className="text-[11px] text-slate-500">Secondary Provider • High Reasoning Precision</p>
                </div>
              </div>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Get Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Active Model
                </label>
                <Select
                  value={settings.providers.openai.selectedModel}
                  onChange={(e) => updateModelSelection('openai', e.target.value)}
                  options={settings.providers.openai.availableModels.map((m) => ({
                    value: m.id,
                    label: `${m.name} (${m.contextWindow / 1000}k Context) ${m.isRecommended ? '★ Recommended' : ''}`,
                  }))}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  OpenAI API Key
                </label>
                <div className="relative">
                  <Input
                    type={showOpenaiKey ? 'text' : 'password'}
                    value={openaiKeyInput}
                    onChange={(e) => setOpenaiKeyInput(e.target.value)}
                    placeholder="sk-proj-... (stored securely on server)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>Masked in UI. Kept safe in server-side session.</span>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {settings.providers.openai.latencyMs ? `Avg Latency: ${settings.providers.openai.latencyMs}ms` : 'Not tested'}
            </span>
            <Button
              onClick={() => handleTestConnection('openai')}
              disabled={testingOpenai || !openaiKeyInput}
              size="sm"
              variant="outline"
              leftIcon={testingOpenai ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-500" />}
            >
              {testingOpenai ? 'Testing...' : 'Test Connection'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Security, Privacy & Compliance Controls */}
      <Card className="p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Institutional Safety &amp; Data Protection Rules</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
            <input
              type="checkbox"
              id="maskPii"
              checked={settings.maskStudentPii}
              onChange={(e) => setSettings({ ...settings, maskStudentPii: e.target.checked })}
              className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <div>
              <label htmlFor="maskPii" className="text-sm font-bold text-slate-900 dark:text-white block cursor-pointer">
                Strict PII Masking
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically masks student Aadhaar numbers and phone numbers before sending prompts to external AI servers.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
            <input
              type="checkbox"
              id="humanApproval"
              checked={settings.requireAdminApprovalForBroadcasts}
              onChange={(e) => setSettings({ ...settings, requireAdminApprovalForBroadcasts: e.target.checked })}
              className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <div>
              <label htmlFor="humanApproval" className="text-sm font-bold text-slate-900 dark:text-white block cursor-pointer">
                Human-in-the-Loop Verification
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                AI creates draft circulars and notices; explicit Headmaster/Administrator approval is mandatory before broadcasting.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
