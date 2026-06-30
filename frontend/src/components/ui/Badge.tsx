import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'muted';
}

export const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      variant === 'default' && 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]',
      variant === 'accent' && 'bg-[var(--color-accent)] text-white',
      variant === 'muted' && 'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]',
      className,
    )}
    {...props}
  />
);
