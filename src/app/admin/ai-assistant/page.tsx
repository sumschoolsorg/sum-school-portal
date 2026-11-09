'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import {
  Sparkles,
  Send,
  Copy,
  Check,
  FileText,
  Mail,
  BarChart2,
  Languages,
  Bus,
  RefreshCw,
  Cpu,
  Bot,
  User,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';
import { AIChatMessage, AIProviderId } from '@/types/ai';

export default function AdminAIAssistantPage() {
  const [provider, setProvider] = useState<AIProviderId>('gemini');
  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `வணக்கம்! நான் எஸ்.யு.எம். மேல்நிலைப் பள்ளியின் அதிகாரப்பூர்வ AI நிர்வாக உதவியாளர் (S.U.M. School Administrative AI Copilot).

நமது பள்ளியின் 60+ ஆண்டு வரலாற்றுப் பின்னணி (1963 முதல்), மாணவர் சேர்க்கை, அரசு பொதுத்தேர்வுகள், பெற்றோர் சுற்றறிக்கைகள், பேருந்து வழித்தடங்கள் மற்றும் தமிழ் ↔ ஆங்கில மொழிபெயர்ப்பில் உதவ நான் தயாராக உள்ளேன். 

கீழுள்ள மாதிரிகளைப் பயன்படுத்தலாம் அல்லது உங்கள் தேவையை நேரடியாகத் தட்டச்சு செய்யலாம்!`,
      providerUsed: 'gemini',
      modelUsed: 'gemini-2.0-flash',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const quickTemplates = [
    {
      label: 'Holiday Circular (Pongal / Exam)',
      category: 'circular',
      icon: <FileText className="w-3.5 h-3.5 text-blue-500" />,
      prompt: 'Draft an official school holiday circular for Pongal Festival in both Tamil and English. Include reopening date and bus timings.',
    },
    {
      label: 'Admission Reply to Parent',
      category: 'enquiry',
      icon: <Mail className="w-3.5 h-3.5 text-emerald-500" />,
      prompt: 'Draft a polite and welcoming reply to a parent inquiring about Class 11 Computer Science group admission and hostel facilities for plantation laborers.',
    },
    {
      label: '10th & 12th Board Exam Analysis',
      category: 'academic',
      icon: <BarChart2 className="w-3.5 h-3.5 text-amber-500" />,
      prompt: 'Summarize the SSLC 10th and HSC 12th board examination centum results. Highlight subject-wise pass rates and teacher appreciation remarks.',
    },
    {
      label: 'Tamil ↔ English Translation',
      category: 'translation',
      icon: <Languages className="w-3.5 h-3.5 text-purple-500" />,
      prompt: 'Translate the following school motto into high-register classical Tamil and English: "Quality Education with Moral Discipline for Rural Empowerment Since 1963".',
    },
    {
      label: 'Bus Route Notice',
      category: 'general',
      icon: <Bus className="w-3.5 h-3.5 text-indigo-500" />,
      prompt: 'Draft an urgent SMS message to parents regarding Route 01 (Cumbum Clock Tower to School) morning pickup schedule.',
    },
  ];

  const handleSendPrompt = async (textToSend?: string, category?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim()) return;

    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          prompt: text,
          category: category || 'general',
        }),
      });

      const data = await res.json();

      if (data.success && data.content) {
        const assistantMsg: AIChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.content,
          providerUsed: data.provider || provider,
          modelUsed: data.model,
          latencyMs: data.latencyMs,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        if (data.fallbackTriggered) {
          toast.info('Fallback engaged: Response generated seamlessly.');
        }
      } else {
        toast.error(data.error || 'Failed to generate response.');
      }
    } catch {
      toast.error('Network error calling AI service.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
            <span>AI School Administrative Copilot</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Bilingual drafting, admission response assistance, academic performance diagnostics, and government circular generation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active AI:</span>
            <Select
              value={provider}
              onChange={(e) => setProvider(e.target.value as AIProviderId)}
              options={[
                { value: 'gemini', label: 'Google Gemini (Fast & Tamil)' },
                { value: 'openai', label: 'OpenAI ChatGPT' },
              ]}
            />
          </div>
          <a
            href="/admin/ai-settings"
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title="Configure AI API Keys & Settings"
          >
            <Cpu className="w-5 h-5 text-blue-600" />
          </a>
        </div>
      </div>

      {/* Quick Action Templates */}
      <div>
        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          1-Click Administrative Workflows
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {quickTemplates.map((t, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(t.prompt, t.category)}
              disabled={isGenerating}
              className="p-3 text-left rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:shadow-sm transition cursor-pointer flex items-start gap-2.5 group"
            >
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:scale-110 transition-transform">
                {t.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                  {t.label}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {t.prompt}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <Card className="p-5 min-h-[420px] max-h-[580px] overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 flex flex-col">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm ${
                msg.role === 'user' ? 'bg-blue-600' : 'bg-gradient-to-br from-amber-500 to-indigo-600'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-tl-none shadow-sm'
              }`}
            >
              {/* Output Content */}
              <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

              {/* Message Metadata & Action Bar */}
              {msg.role === 'assistant' && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {msg.providerUsed === 'gemini' ? 'Google Gemini' : 'OpenAI ChatGPT'}
                    </span>
                    {msg.latencyMs && <span>• {msg.latencyMs}ms</span>}
                  </div>
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex gap-3 max-w-md mr-auto">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-tl-none shadow-sm flex items-center gap-2 text-xs font-semibold text-slate-500">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
              <span>S.U.M. AI is generating response via {provider === 'gemini' ? 'Google Gemini' : 'OpenAI ChatGPT'}...</span>
            </div>
          </div>
        )}
      </Card>

      {/* Input Box */}
      <div className="flex gap-2">
        <textarea
          rows={2}
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendPrompt();
            }
          }}
          placeholder="Type an administrative request, circular topic, admission query, or translation (Enter to send)..."
          className="flex-1 p-3 text-sm rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <Button
          onClick={() => handleSendPrompt()}
          disabled={isGenerating || !inputPrompt.trim()}
          variant="primary"
          className="px-6 rounded-2xl self-end h-[58px]"
          leftIcon={isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        >
          Send
        </Button>
      </div>

      <p className="text-[11px] text-center text-slate-400">
        AI responses are generated for administrative assistance. Official orders and circulars must be reviewed by the school authority before distribution.
      </p>
    </div>
  );
}
