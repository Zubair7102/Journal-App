import { JournalCardSkeleton } from '../ui/Skeleton';

export const PageLoader = () => (
  <div className="mx-auto max-w-6xl space-y-4 p-4">
    <div className="h-8 w-48 shimmer rounded-xl" />
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <JournalCardSkeleton />
      <JournalCardSkeleton />
      <JournalCardSkeleton />
    </div>
  </div>
);
