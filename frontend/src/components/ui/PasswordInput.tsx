import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-[var(--color-text-muted)]">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={visible ? 'text' : 'password'}
            className={cn(
              'w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]',
              'px-4 py-2.5 pr-11 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]',
              'transition-colors focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
              className,
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error && <p className="text-sm text-rose-500">{error}</p>}
      </div>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';
