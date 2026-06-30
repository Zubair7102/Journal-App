import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { JournalLocalMeta, MoodType } from '../types/journal';

const STORAGE_KEY = 'journal_local_meta';

const emptyMeta = (): JournalLocalMeta => ({
  favorites: [],
  trashed: [],
  archived: [],
  pinned: [],
  tags: {},
  categories: {},
  moodOverrides: {},
});

interface JournalMetaContextValue {
  meta: JournalLocalMeta;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  isTrashed: (id: string) => boolean;
  moveToTrash: (id: string) => void;
  restoreFromTrash: (id: string) => void;
  isArchived: (id: string) => boolean;
  toggleArchive: (id: string) => void;
  isPinned: (id: string) => boolean;
  togglePin: (id: string) => void;
  getTags: (id: string) => string[];
  setTags: (id: string, tags: string[]) => void;
  getCategory: (id: string) => string;
  setCategory: (id: string, category: string) => void;
  getMood: (id: string, fallback?: MoodType | null) => MoodType | null;
  setMood: (id: string, mood: MoodType) => void;
  importMeta: (data: Partial<JournalLocalMeta>) => void;
}

const JournalMetaContext = createContext<JournalMetaContextValue | undefined>(undefined);

const loadMeta = (): JournalLocalMeta => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyMeta();
    return { ...emptyMeta(), ...JSON.parse(raw) };
  } catch {
    return emptyMeta();
  }
};

export const JournalMetaProvider = ({ children }: { children: ReactNode }) => {
  const [meta, setMeta] = useState<JournalLocalMeta>(loadMeta);

  const persist = useCallback((updater: (prev: JournalLocalMeta) => JournalLocalMeta) => {
    setMeta((prev) => {
      const next = updater(prev);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleInList = (list: string[], id: string) =>
    list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

  const value = useMemo<JournalMetaContextValue>(
    () => ({
      meta,
      isFavorite: (id) => meta.favorites.includes(id),
      toggleFavorite: (id) =>
        persist((prev) => ({ ...prev, favorites: toggleInList(prev.favorites, id) })),
      isTrashed: (id) => meta.trashed.includes(id),
      moveToTrash: (id) =>
        persist((prev) => ({
          ...prev,
          trashed: [...new Set([...prev.trashed, id])],
          favorites: prev.favorites.filter((x) => x !== id),
          pinned: prev.pinned.filter((x) => x !== id),
        })),
      restoreFromTrash: (id) =>
        persist((prev) => ({ ...prev, trashed: prev.trashed.filter((x) => x !== id) })),
      isArchived: (id) => meta.archived.includes(id),
      toggleArchive: (id) =>
        persist((prev) => ({ ...prev, archived: toggleInList(prev.archived, id) })),
      isPinned: (id) => meta.pinned.includes(id),
      togglePin: (id) =>
        persist((prev) => ({ ...prev, pinned: toggleInList(prev.pinned, id) })),
      getTags: (id) => meta.tags[id] ?? [],
      setTags: (id, tags) =>
        persist((prev) => ({ ...prev, tags: { ...prev.tags, [id]: tags } })),
      getCategory: (id) => meta.categories[id] ?? 'Personal',
      setCategory: (id, category) =>
        persist((prev) => ({ ...prev, categories: { ...prev.categories, [id]: category } })),
      getMood: (id, fallback) => meta.moodOverrides[id] ?? fallback ?? null,
      setMood: (id, mood) =>
        persist((prev) => ({ ...prev, moodOverrides: { ...prev.moodOverrides, [id]: mood } })),
      importMeta: (data) =>
        persist((prev) => ({
          favorites: [...new Set([...prev.favorites, ...(data.favorites ?? [])])],
          trashed: [...new Set([...prev.trashed, ...(data.trashed ?? [])])],
          archived: [...new Set([...prev.archived, ...(data.archived ?? [])])],
          pinned: [...new Set([...prev.pinned, ...(data.pinned ?? [])])],
          tags: { ...prev.tags, ...data.tags },
          categories: { ...prev.categories, ...data.categories },
          moodOverrides: { ...prev.moodOverrides, ...data.moodOverrides },
        })),
    }),
    [meta, persist],
  );

  return (
    <JournalMetaContext.Provider value={value}>{children}</JournalMetaContext.Provider>
  );
};

export const useJournalMeta = (): JournalMetaContextValue => {
  const ctx = useContext(JournalMetaContext);
  if (!ctx) throw new Error('useJournalMeta must be used within JournalMetaProvider');
  return ctx;
};
