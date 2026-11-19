'use client';

import React, { useState } from 'react';
import { User } from 'lucide-react';

export interface AvatarProps {
  src?: string | null;
  alt: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  badge?: React.ReactNode;
}

const SIZE_MAP = {
  xs: 'w-7 h-7 text-[10px]',
  sm: 'w-9 h-9 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
  xl: 'w-24 h-24 text-xl',
  '2xl': 'w-32 h-32 text-2xl',
};

const COLOR_PALETTES = [
  'bg-blue-600 text-white',
  'bg-indigo-600 text-white',
  'bg-slate-700 text-white',
  'bg-teal-700 text-white',
  'bg-emerald-700 text-white',
  'bg-amber-700 text-white',
  'bg-sky-700 text-white',
  'bg-cyan-700 text-white',
];

function getInitials(name: string): string {
  if (!name) return '';
  const clean = name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.|Rev\.|Tmt\.|Thiru\.)\s+/i, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTES.length;
  return COLOR_PALETTES[index];
}

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  className = '',
  badge,
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  const displayName = name || alt || 'Member';
  const initials = getInitials(displayName);
  const colorClass = getColor(displayName);
  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md;

  // Detect genuine uploaded image (clean URL that is not empty)
  const isValidPhoto = Boolean(src && typeof src === 'string' && src.trim().length > 0 && !hasError);

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      <div
        className={`${sizeClasses} rounded-2xl overflow-hidden flex items-center justify-center font-bold tracking-wider shadow-sm select-none border border-slate-200/80 dark:border-slate-800 transition-transform duration-200`}
      >
        {isValidPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src!}
            alt={alt || displayName}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center font-heading ${colorClass}`}>
            {initials ? initials : <User className="w-1/2 h-1/2 opacity-80" />}
          </div>
        )}
      </div>
      {badge && <div className="absolute -bottom-1 -right-1">{badge}</div>}
    </div>
  );
}
