import ReactMarkdown from 'react-markdown';

interface MarkdownPreviewProps {
  content: string;
}

export const MarkdownPreview = ({ content }: MarkdownPreviewProps) => (
  <div className="prose-journal min-h-[200px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-4">
    {content.trim() ? (
      <ReactMarkdown>{content}</ReactMarkdown>
    ) : (
      <p className="text-[var(--color-text-muted)]">Nothing to preview yet.</p>
    )}
  </div>
);
