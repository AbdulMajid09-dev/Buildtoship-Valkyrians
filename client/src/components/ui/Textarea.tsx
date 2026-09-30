import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  showCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, showCount, maxLength, id, value, className = '', required, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <label htmlFor={textareaId} className="block text-xs font-semibold text-stone-700">
              {label}
              {required && <span className="text-red-500 ml-1 font-bold">*</span>}
            </label>
          )}
          {showCount && maxLength && (
            <span className="text-xs text-stone-400">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
        <textarea
          id={textareaId}
          ref={ref}
          value={value}
          maxLength={maxLength}
          required={required}
          className={`block w-full rounded-lg text-sm bg-white border py-2.5 px-3.5 text-stone-900 transition-colors
            ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-stone-300 focus:border-agri-600 focus:ring-2 focus:ring-agri-100'
            }
            disabled:bg-stone-50 disabled:text-stone-500 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />
        {error ? (
          <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
        ) : hint ? (
          <p className="mt-1 text-xs text-stone-500">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
