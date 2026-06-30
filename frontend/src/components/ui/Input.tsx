import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--color-text-muted)]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          'w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]',
          'px-4 py-2.5 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]',
          'transition-colors focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20',
          error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
          className,
        )}
        {...props}
      />
      {error && <p className="text-sm text-rose-500">{error}</p>}
    </div>
  ),
);
Input.displayName = 'Input';
