import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <div className={cn('shimmer rounded-xl', className)} />
);

export const JournalCardSkeleton = () => (
  <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 space-y-3">
    <Skeleton className="h-5 w-2/3" />
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-16 w-full" />
    <div className="flex gap-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  </div>
);
