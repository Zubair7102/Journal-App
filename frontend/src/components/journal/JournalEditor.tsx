import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Eye, Maximize2, Minimize2, Pencil, Save } from 'lucide-react';
import { toast } from 'sonner';
import { createJournal, updateJournal } from '../../api/journal.api';
import { useJournalMeta } from '../../context/JournalMetaContext';
import { useSettings } from '../../context/SettingsContext';
import type { JournalEntry, MoodType, Sentiment } from '../../types/journal';
import {
  MOOD_OPTIONS,
  TAG_PRESETS,
  countChars,
  countWords,
  readingTimeMinutes,
} from '../../lib/journal-utils';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { MarkdownToolbar } from './MarkdownToolbar';
import { MarkdownPreview } from './MarkdownPreview';
import { cn } from '../../lib/utils';

interface JournalEditorProps {
  entry?: JournalEntry;
}

const backendMoods = new Set(['HAPPY', 'SAD', 'ANGRY', 'ANXIOUS']);

export const JournalEditor = ({ entry }: JournalEditorProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const meta = useJournalMeta();
  const { focusMode, setFocusMode } = useSettings();

  const [title, setTitle] = useState(entry?.title ?? '');
  const [content, setContent] = useState(entry?.content ?? '');
  const [mood, setMood] = useState<MoodType>(
    entry ? meta.getMood(entry.id, entry.sentiment) ?? 'NEUTRAL' : 'NEUTRAL',
  );
  const [tags, setTags] = useState<string[]>(entry ? meta.getTags(entry.id) : []);
  const [category, setCategory] = useState(entry ? meta.getCategory(entry.id) : 'Personal');
  const [fullscreen, setFullscreen] = useState(false);
  const [preview, setPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const isEdit = Boolean(entry);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const sentiment: Sentiment | null = backendMoods.has(mood)
        ? (mood as Sentiment)
        : entry?.sentiment ?? null;
      const payload = { title, content, sentiment };

      if (isEdit && entry) {
        return updateJournal(entry.id, payload);
      }
      return createJournal(payload);
    },
    onSuccess: (saved) => {
      meta.setMood(saved.id, mood);
      meta.setTags(saved.id, tags);
      meta.setCategory(saved.id, category);
      void queryClient.invalidateQueries({ queryKey: ['journals'] });
      void queryClient.invalidateQueries({ queryKey: ['journal', saved.id] });
      setLastSaved(new Date());
      toast.success(isEdit ? 'Journal saved' : 'Journal created');
      if (!isEdit) navigate(`/app/journals/${saved.id}`, { replace: true });
    },
    onError: () => toast.error('Failed to save journal'),
  });

  const handleSave = useCallback(() => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }
    saveMutation.mutate();
  }, [title, content, saveMutation]);

  useEffect(() => {
    if (!isEdit) return;
    const timer = setInterval(() => {
      if (title.trim() && content.trim() && !saveMutation.isPending) {
        handleSave();
      }
    }, 30_000);
    return () => clearInterval(timer);
  }, [isEdit, title, content, handleSave, saveMutation.isPending]);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <motion.div
      layout
      className={cn(
        'mx-auto max-w-4xl',
        fullscreen && 'fixed inset-0 z-50 overflow-auto bg-[var(--color-surface-muted)] p-6',
        focusMode && 'max-w-3xl',
      )}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] md:text-3xl">
            {isEdit ? 'Edit entry' : 'New journal entry'}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            {countWords(content)} words · {countChars(content)} chars · {readingTimeMinutes(content)} min read
            {lastSaved && ` · Saved ${lastSaved.toLocaleTimeString()}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="icon" onClick={() => setFullscreen((v) => !v)} aria-label="Toggle fullscreen">
            {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="secondary" onClick={() => setFocusMode(!focusMode)}>
            {focusMode ? 'Exit focus' : 'Focus mode'}
          </Button>
          <Button onClick={handleSave} loading={saveMutation.isPending}>
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <div className="space-y-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-soft)] md:p-8">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your entry a title..."
        />

        <div>
          <p className="mb-2 text-sm font-medium text-[var(--color-text-muted)]">Mood</p>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                className={cn(
                  'rounded-xl border px-3 py-2 text-sm transition',
                  mood === m.value
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-muted)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-accent)]',
                )}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-[var(--color-text-muted)]">Category</p>
          <div className="flex flex-wrap gap-2">
            {['Personal', 'Work', 'Ideas', 'Travel'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  'rounded-full px-3 py-1 text-sm',
                  category === c
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]',
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-[var(--color-text-muted)]">Tags</p>
          <div className="flex flex-wrap gap-2">
            {TAG_PRESETS.map((tag) => (
              <Badge
                key={tag}
                className={cn('cursor-pointer', tags.includes(tag) && 'ring-2 ring-[var(--color-accent)]')}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="content" className="text-sm font-medium text-[var(--color-text-muted)]">
              Content
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setPreview((v) => !v)}
            >
              {preview ? (
                <>
                  <Pencil className="h-4 w-4" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Preview
                </>
              )}
            </Button>
          </div>
          {!preview && (
            <MarkdownToolbar
              textareaRef={contentRef}
              value={content}
              onChange={setContent}
              className="mb-2"
            />
          )}
          {preview ? (
            <MarkdownPreview content={content} />
          ) : (
            <textarea
              ref={contentRef}
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={focusMode ? 20 : 14}
              placeholder="Write your thoughts... Markdown supported (**bold**, _italic_, # headings)."
              className="w-full resize-y rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-4 text-base leading-relaxed text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};
