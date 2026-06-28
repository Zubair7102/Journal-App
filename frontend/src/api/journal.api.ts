import { apiClient } from './client';
import type { JournalEntry, JournalEntryInput } from '../types/journal';

export const fetchJournals = async (): Promise<JournalEntry[]> => {
  try {
    const { data } = await apiClient.get<JournalEntry[]>('/journal');
    return data;
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      (error as { response?: { status?: number } }).response?.status === 404
    ) {
      return [];
    }
    throw error;
  }
};

export const fetchJournalById = async (id: string): Promise<JournalEntry> => {
  const { data } = await apiClient.get<JournalEntry>(`/journal/id/${id}`);
  return data;
};

export const createJournal = async (entry: JournalEntryInput): Promise<JournalEntry> => {
  const { data } = await apiClient.post<JournalEntry>('/journal', entry);
  return data;
};

export const updateJournal = async (
  id: string,
  entry: Partial<JournalEntryInput>,
): Promise<JournalEntry> => {
  const { data } = await apiClient.put<JournalEntry>(`/journal/id/${id}`, entry);
  return data;
};

export const deleteJournal = async (id: string): Promise<void> => {
  await apiClient.delete(`/journal/id/${id}`);
};
