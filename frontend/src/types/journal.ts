export type Sentiment = 'HAPPY' | 'SAD' | 'ANGRY' | 'ANXIOUS';

export type MoodType = Sentiment | 'NEUTRAL' | 'EXCITED' | 'TIRED';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  sentiment: Sentiment | null;
}

export interface JournalEntryInput {
  title: string;
  content: string;
  sentiment?: Sentiment | null;
}

export interface JournalLocalMeta {
  favorites: string[];
  trashed: string[];
  archived: string[];
  pinned: string[];
  tags: Record<string, string[]>;
  categories: Record<string, string>;
  moodOverrides: Record<string, MoodType>;
}
