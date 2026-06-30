import { format, formatDistanceToNow, isThisMonth, parseISO, startOfDay } from 'date-fns';
import type { JournalEntry, MoodType, Sentiment } from '../types/journal';

export const MOOD_OPTIONS: { value: MoodType; emoji: string; label: string }[] = [
  { value: 'HAPPY', emoji: '😊', label: 'Happy' },
  { value: 'NEUTRAL', emoji: '😐', label: 'Neutral' },
  { value: 'SAD', emoji: '😔', label: 'Sad' },
  { value: 'EXCITED', emoji: '😎', label: 'Excited' },
  { value: 'ANGRY', emoji: '😡', label: 'Angry' },
  { value: 'TIRED', emoji: '😴', label: 'Tired' },
  { value: 'ANXIOUS', emoji: '😰', label: 'Anxious' },
];

export const TAG_PRESETS = [
  'Work',
  'Personal',
  'Ideas',
  'Travel',
  'Health',
  'Coding',
  'Books',
] as const;

export const TAG_COLORS: Record<string, string> = {
  Work: 'bg-blue-500/15 text-blue-600 dark:text-blue-300',
  Personal: 'bg-violet-500/15 text-violet-600 dark:text-violet-300',
  Ideas: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
  Travel: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
  Health: 'bg-rose-500/15 text-rose-600 dark:text-rose-300',
  Coding: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300',
  Books: 'bg-orange-500/15 text-orange-600 dark:text-orange-300',
};

export const countWords = (text: string): number =>
  text.trim() ? text.trim().split(/\s+/).length : 0;

export const countChars = (text: string): number => text.length;

export const readingTimeMinutes = (text: string): number =>
  Math.max(1, Math.ceil(countWords(text) / 200));

export const formatJournalDate = (date: string): string =>
  format(parseISO(date), 'MMM d, yyyy · h:mm a');

export const formatRelativeDate = (date: string): string =>
  formatDistanceToNow(parseISO(date), { addSuffix: true });

export const getMoodEmoji = (mood?: MoodType | Sentiment | null): string => {
  const found = MOOD_OPTIONS.find((m) => m.value === mood);
  return found?.emoji ?? '📝';
};

export const getMoodLabel = (mood?: MoodType | Sentiment | null): string => {
  const found = MOOD_OPTIONS.find((m) => m.value === mood);
  return found?.label ?? 'Reflective';
};

export const previewContent = (content: string, max = 140): string => {
  const trimmed = content.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trim()}…`;
};

export type SortOption = 'newest' | 'oldest' | 'edited' | 'favorites';

export interface JournalFilters {
  query: string;
  mood: MoodType | 'ALL';
  tag: string | 'ALL';
  category: string | 'ALL';
  sort: SortOption;
}

export const defaultFilters: JournalFilters = {
  query: '',
  mood: 'ALL',
  tag: 'ALL',
  category: 'ALL',
  sort: 'newest',
};

export const computeStreak = (entries: JournalEntry[]): number => {
  if (!entries.length) return 0;
  const days = new Set(
    entries.map((e) => startOfDay(parseISO(e.date)).toISOString()),
  );
  let streak = 0;
  let cursor = startOfDay(new Date());
  while (days.has(cursor.toISOString())) {
    streak += 1;
    cursor = new Date(cursor.getTime() - 86_400_000);
  }
  return streak;
};

export const journalStats = (entries: JournalEntry[]) => {
  const totalWords = entries.reduce((sum, e) => sum + countWords(e.content), 0);
  const thisMonth = entries.filter((e) => isThisMonth(parseISO(e.date))).length;
  const moods = entries.reduce<Record<string, number>>((acc, e) => {
    const key = e.sentiment ?? 'NEUTRAL';
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  return {
    total: entries.length,
    totalWords,
    thisMonth,
    streak: computeStreak(entries),
    moods,
  };
};

export const highlightMatch = (text: string, query: string): string => {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
};
