'use client';

import React, { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
}: ModalProps) {
  const baseId = useId();
  const titleId = title ? `modal-title-${baseId}` : undefined;
  const descId = description ? `modal-desc-${baseId}` : undefined;
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);

      // Focus close button on mount
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = 'unset';
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-5xl',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Dialog card */}
      <div
        className={`relative w-full ${sizeClasses[size]} my-4 sm:my-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-8 z-10 animate-scale-in max-h-[90vh] flex flex-col`}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div>
            {title && (
              <h3 id={titleId} className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading">
                {title}
              </h3>
            )}
            {description && (
              <p id={descId} className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] rounded-full p-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 sm:mt-6 overflow-y-auto pr-1 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
