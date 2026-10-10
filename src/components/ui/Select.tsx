import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : undefined);
    const displayLabel = label ? label.replace(/\s*\*+$/, '') : '';
    const hasRequiredAsterisk = Boolean(props.required || (label && /\*/.test(label)));
    const describedById = error
      ? (selectId ? `${selectId}-error` : undefined)
      : helperText
      ? (selectId ? `${selectId}-helper` : undefined)
      : undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
          >
            {displayLabel}
            {hasRequiredAsterisk && (
              <span className="text-red-500 ml-1 font-bold" aria-hidden="true">*</span>
            )}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          aria-required={props.required ? true : undefined}
          aria-invalid={Boolean(error) ? true : undefined}
          aria-describedby={props['aria-describedby'] || describedById}
          className={`w-full min-h-[44px] rounded-xl border bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 ${
            error
              ? 'border-red-500 focus:ring-red-500 dark:border-red-500'
              : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error ? (
          <p id={selectId ? `${selectId}-error` : undefined} role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={selectId ? `${selectId}-helper` : undefined} className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
