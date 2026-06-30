import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { fetchJournals, deleteJournal } from '../api/journal.api';
import { useJournalMeta } from '../context/JournalMetaContext';
import { defaultFilters, type JournalFilters } from '../lib/journal-utils';
import { useFilteredJournals } from '../hooks/useFilteredJournals';
import { JournalCard } from '../components/journal/JournalCard';
import { JournalCardSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Input } from '../components/ui/Input';
import { MOOD_OPTIONS, TAG_PRESETS } from '../lib/journal-utils';

interface JournalsListPageProps {
  title: string;
  subtitle: string;
  favoritesOnly?: boolean;
  trashedOnly?: boolean;
}

const JournalsListPage = ({ title, subtitle, favoritesOnly, trashedOnly }: JournalsListPageProps) => {
  const [filters, setFilters] = useState<JournalFilters>(defaultFilters);
  const meta = useJournalMeta();
  const queryClient = useQueryClient();

  const { data: journals, isLoading, isError } = useQuery({
    queryKey: ['journals'],
    queryFn: fetchJournals,
  });

  const filtered = useFilteredJournals(journals, filters, { favoritesOnly, trashedOnly });

  const trashMutation = useMutation({
    mutationFn: async (id: string) => {
      if (trashedOnly) {
        await deleteJournal(id);
        meta.restoreFromTrash(id);
      } else {
        meta.moveToTrash(id);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['journals'] });
      toast.success(trashedOnly ? 'Journal permanently deleted' : 'Moved to trash');
    },
    onError: () => toast.error('Action failed'),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text)]">{title}</h1>
        <p className="mt-1 text-[var(--color-text-muted)]">{subtitle}</p>
      </div>

      <div className="grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 md:grid-cols-4">
        <Input
          placeholder="Search title, content, tags..."
          value={filters.query}
          onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
          className="md:col-span-2"
        />
        <select
          value={filters.sort}
          onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value as JournalFilters['sort'] }))}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="favorites">Favorites</option>
        </select>
        <select
          value={filters.mood}
          onChange={(e) => setFilters((f) => ({ ...f, mood: e.target.value as JournalFilters['mood'] }))}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm"
        >
          <option value="ALL">All moods</option>
          {MOOD_OPTIONS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        <select
          value={filters.tag}
          onChange={(e) => setFilters((f) => ({ ...f, tag: e.target.value }))}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm md:col-span-2"
        >
          <option value="ALL">All tags</option>
          {TAG_PRESETS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <JournalCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && <p className="text-rose-500">Failed to load journals.</p>}

      {!isLoading && !filtered.length && (
        <EmptyState
          title={trashedOnly ? 'Trash is empty' : favoritesOnly ? 'No favorites yet' : 'No journals yet'}
          description={trashedOnly ? 'Deleted entries will appear here.' : 'Start writing today and capture your thoughts.'}
          actionLabel={trashedOnly ? undefined : 'Write your first entry'}
          actionTo={trashedOnly ? undefined : '/app/journals/new'}
        />
      )}

      <motion.div layout className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence>
          {filtered.map((entry) => (
            <JournalCard
              key={entry.id}
              entry={entry}
              highlight={filters.query}
              onDelete={(id) => trashMutation.mutate(id)}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default JournalsListPage;
