import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'relative flex h-10 w-10 items-center justify-center rounded-xl',
        'border border-[var(--color-border)] bg-[var(--color-surface-elevated)]',
        'text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]',
        className,
      )}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0, scale: isDark ? 0.9 : 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </motion.div>
    </button>
  );
};
