import { motion } from 'framer-motion';
import { PenLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}

export const EmptyState = ({ title, description, actionLabel, actionTo }: EmptyStateProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-6 py-16 text-center"
  >
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-accent-muted)] text-[var(--color-accent)]"
    >
      <PenLine className="h-8 w-8" />
    </motion.div>
    <h3 className="text-xl font-semibold text-[var(--color-text)]">{title}</h3>
    <p className="mt-2 max-w-md text-sm text-[var(--color-text-muted)]">{description}</p>
    {actionLabel && actionTo && (
      <Link to={actionTo} className="mt-6">
        <Button size="lg">{actionLabel}</Button>
      </Link>
    )}
  </motion.div>
);
