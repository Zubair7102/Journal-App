export type Sentiment = 'HAPPY' | 'SAD' | 'ANGRY' | 'ANXIOUS';

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
}
