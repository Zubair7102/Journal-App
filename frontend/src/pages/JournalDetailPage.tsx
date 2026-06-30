import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchJournalById } from '../api/journal.api';
import { JournalEditor } from '../components/journal/JournalEditor';
import { JournalCardSkeleton } from '../components/ui/Skeleton';

const JournalDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: entry, isLoading, isError } = useQuery({
    queryKey: ['journal', id],
    queryFn: () => fetchJournalById(id!),
    enabled: Boolean(id),
  });

  if (isLoading) return <JournalCardSkeleton />;
  if (isError || !entry) {
    return <p className="text-rose-500">Journal entry not found.</p>;
  }

  return <JournalEditor entry={entry} />;
};

export default JournalDetailPage;
