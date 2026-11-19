import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbCrumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbCrumb[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`py-3 px-4 sm:px-6 bg-slate-100/80 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800/80 text-xs sm:text-sm ${className}`}
    >
      <div className="container-main flex items-center">
        <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-slate-600 dark:text-slate-400">
          <li className="inline-flex items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
              title="Home"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="sr-only sm:not-sr-only">Home</span>
            </Link>
          </li>

          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={idx} className="inline-flex items-center gap-1.5 sm:gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {isLast || !item.href ? (
                  <span
                    className="font-medium text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition truncate max-w-[150px] sm:max-w-none"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
