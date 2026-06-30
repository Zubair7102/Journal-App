import { useMemo } from 'react';
import type { JournalEntry } from '../types/journal';
import type { JournalFilters } from '../lib/journal-utils';
import { useJournalMeta } from '../context/JournalMetaContext';

export const useFilteredJournals = (
  entries: JournalEntry[] | undefined,
  filters: JournalFilters,
  options?: { favoritesOnly?: boolean; trashedOnly?: boolean; archivedOnly?: boolean },
) => {
  const meta = useJournalMeta();

  return useMemo(() => {
    if (!entries) return [];

    let list = [...entries];

    if (options?.trashedOnly) {
      list = list.filter((e) => meta.isTrashed(e.id));
    } else {
      list = list.filter((e) => !meta.isTrashed(e.id));
      if (options?.archivedOnly) {
        list = list.filter((e) => meta.isArchived(e.id));
      } else {
        list = list.filter((e) => !meta.isArchived(e.id));
      }
    }

    if (options?.favoritesOnly) {
      list = list.filter((e) => meta.isFavorite(e.id));
    }

    if (filters.query.trim()) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.content.toLowerCase().includes(q) ||
          meta.getTags(e.id).some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (filters.mood !== 'ALL') {
      list = list.filter((e) => meta.getMood(e.id, e.sentiment) === filters.mood);
    }

    if (filters.tag !== 'ALL') {
      list = list.filter((e) => meta.getTags(e.id).includes(filters.tag));
    }

    if (filters.category !== 'ALL') {
      list = list.filter((e) => meta.getCategory(e.id) === filters.category);
    }

    if (filters.sort === 'favorites') {
      list.sort((a, b) => Number(meta.isFavorite(b.id)) - Number(meta.isFavorite(a.id)));
    } else if (filters.sort === 'oldest') {
      list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    const pinned = list.filter((e) => meta.isPinned(e.id));
    const rest = list.filter((e) => !meta.isPinned(e.id));
    return [...pinned, ...rest];
  }, [entries, filters, meta, options?.favoritesOnly, options?.trashedOnly, options?.archivedOnly]);
};
