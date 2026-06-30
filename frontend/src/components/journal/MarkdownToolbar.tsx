import {
  Bold,
  Code,
  Heading2,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
} from 'lucide-react';
import { runMarkdownAction, applyTextEdit, type MarkdownAction } from '../../lib/markdown-utils';
import { cn } from '../../lib/utils';

interface MarkdownToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const tools: { action: MarkdownAction; icon: typeof Bold; label: string }[] = [
  { action: 'bold', icon: Bold, label: 'Bold' },
  { action: 'italic', icon: Italic, label: 'Italic' },
  { action: 'heading', icon: Heading2, label: 'Heading' },
  { action: 'quote', icon: Quote, label: 'Quote' },
  { action: 'ul', icon: List, label: 'Bullet list' },
  { action: 'ol', icon: ListOrdered, label: 'Numbered list' },
  { action: 'code', icon: Code, label: 'Inline code' },
  { action: 'link', icon: Link, label: 'Link' },
];

export const MarkdownToolbar = ({
  textareaRef,
  value,
  onChange,
  className,
}: MarkdownToolbarProps) => {
  const handleAction = (action: MarkdownAction) => {
    const el = textareaRef.current;
    if (!el) return;
    const result = runMarkdownAction(value, el.selectionStart, el.selectionEnd, action);
    onChange(result.value);
    requestAnimationFrame(() => applyTextEdit(el, result));
  };

  return (
    <div
      role="toolbar"
      aria-label="Formatting toolbar"
      className={cn(
        'flex flex-wrap items-center gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-1.5',
        className,
      )}
    >
      {tools.map(({ action, icon: Icon, label }) => (
        <button
          key={action}
          type="button"
          title={label}
          aria-label={label}
          onClick={() => handleAction(action)}
          className="rounded-lg p-2 text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-accent)]"
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
};
