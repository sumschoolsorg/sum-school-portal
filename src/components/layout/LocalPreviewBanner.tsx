'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Database, ArrowRight, X, Cloud } from 'lucide-react';
import { getCurrentDataMode } from '@/lib/repositories';

export function LocalPreviewBanner() {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      const isDismissed = sessionStorage.getItem('sum_preview_banner_dismissed');
      const mode = getCurrentDataMode();
      return mode === 'local' && !isDismissed;
    }
    return false;
  });

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('sum_preview_banner_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-xs border-b border-indigo-900/50 py-2 px-4 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <Database className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-medium text-slate-200">
            <strong className="text-amber-300 font-semibold">Local Preview Mode (IndexedDB):</strong> Changes are saved locally in this browser and persist across reloads.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/migration"
            className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium hover:underline transition"
          >
            <Cloud className="w-3 h-3" />
            <span>Connect / Migrate to Firebase</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
