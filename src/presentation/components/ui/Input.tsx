import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@shared/lib/cn';

// =============================================================================
// Input — label + hata mesajı destekli text input wrapper'ı
// =============================================================================
// React Hook Form ile birlikte kullanılırken `register` direkt bu component'e geçer.
// Hata mesajı altında (varsa) kırmızı renk + helperText (yoksa nötr).
// =============================================================================

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...rest }, ref) => {
    const fieldId = id ?? rest.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={fieldId} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <input
          id={fieldId}
          ref={ref}
          className={cn(
            'h-10 rounded-md border bg-white px-3 text-sm placeholder:text-slate-400',
            'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
            error
              ? 'border-red-500 focus-visible:ring-red-400'
              : 'border-slate-300 focus-visible:border-brand-500',
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...rest}
        />
        {error ? (
          <p id={`${fieldId}-error`} className="text-xs text-red-600">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
