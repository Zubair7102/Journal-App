import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Edit3, Star, Trash2 } from 'lucide-react';
import type { JournalEntry } from '../../types/journal';
import { useJournalMeta } from '../../context/JournalMetaContext';
import {
  formatRelativeDate,
  getMoodEmoji,
  previewContent,
  readingTimeMinutes,
  TAG_COLORS,
} from '../../lib/journal-utils';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { cn } from '../../lib/utils';

interface JournalCardProps {
  entry: JournalEntry;
  onDelete?: (id: string) => void;
  highlight?: string;
}

export const JournalCard = ({ entry, onDelete, highlight }: JournalCardProps) => {
  const meta = useJournalMeta();
  const mood = meta.getMood(entry.id, entry.sentiment);
  const tags = meta.getTags(entry.id);
  const category = meta.getCategory(entry.id);
  const favorite = meta.isFavorite(entry.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <Card hover className="group h-full overflow-hidden">
        <CardContent className="flex h-full flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xl" aria-hidden>
                  {getMoodEmoji(mood)}
                </span>
                <Badge variant="muted">{category}</Badge>
              </div>
              <Link to={`/app/journals/${entry.id}`} className="block">
                <h3 className="truncate text-lg font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
                  {entry.title || 'Untitled entry'}
                </h3>
              </Link>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {formatRelativeDate(entry.date)} · {readingTimeMinutes(entry.content)} min read
              </p>
            </div>
            <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
              <Button
                size="icon"
                variant="ghost"
                aria-label={favorite ? 'Remove favorite' : 'Add favorite'}
                onClick={() => meta.toggleFavorite(entry.id)}
              >
                <Star className={cn('h-4 w-4', favorite && 'fill-amber-400 text-amber-400')} />
              </Button>
              <Link to={`/app/journals/${entry.id}`} aria-label="Edit entry">
                <Button size="icon" variant="ghost">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </Link>
              {onDelete && (
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Move to trash"
                  onClick={() => onDelete(entry.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <p
            className="line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--color-text-muted)]"
            dangerouslySetInnerHTML={{
              __html: highlight
                ? previewContent(entry.content).replace(
                    new RegExp(`(${highlight})`, 'gi'),
                    '<mark class="rounded bg-[var(--color-accent-muted)] px-0.5">$1</mark>',
                  )
                : previewContent(entry.content),
            }}
          />

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    TAG_COLORS[tag] ?? 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]',
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
