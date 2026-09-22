import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'bordered' | 'elevated';
  hoverEffect?: boolean;
}

export function Card({
  children,
  className = '',
  variant = 'default',
  hoverEffect = false,
  ...props
}: CardProps) {
  const variantStyles = {
    default:
      'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl',
    glass:
      'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/40 dark:border-slate-800/80 shadow-glass rounded-2xl',
    bordered:
      'bg-transparent border-2 border-slate-200 dark:border-slate-800 rounded-2xl',
    elevated:
      'bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800/60 rounded-2xl',
  };

  const hoverStyle = hoverEffect
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-500/30'
    : '';

  return (
    <div
      className={`${variantStyles[variant]} ${hoverStyle} p-6 overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 pb-3 border-b border-slate-100 dark:border-slate-800 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-lg font-bold text-slate-900 dark:text-slate-100 font-heading ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`text-sm text-slate-600 dark:text-slate-400 mt-1 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}
