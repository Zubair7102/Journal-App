import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export const Card = ({ className, children, hover, ...props }: CardProps) => (
  <div
    className={cn(
      'rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]',
      'shadow-[var(--shadow-soft)] transition-all duration-300',
      hover && 'hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[var(--shadow-lift)]',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-5 pb-0', className)} {...props}>
    {children}
  </div>
);

export const CardContent = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-5', className)} {...props}>
    {children}
  </div>
);
