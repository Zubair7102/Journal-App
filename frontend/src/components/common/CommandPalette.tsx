import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  LayoutDashboard,
  LogOut,
  Moon,
  Plus,
  Search,
  Settings,
  Star,
  Sun,
  Trash2,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommandPalette = ({ open, onOpenChange }: CommandPaletteProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const run = (fn: () => void) => {
    fn();
    onOpenChange(false);
    setSearch('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[15vh] backdrop-blur-sm">
      <Command
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-lift)]"
        label="Command menu"
      >
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4">
          <Search className="h-4 w-4 text-[var(--color-text-muted)]" />
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search commands..."
            className="h-12 w-full bg-transparent text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
          />
        </div>
        <Command.List className="max-h-80 overflow-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-[var(--color-text-muted)]">
            No results found.
          </Command.Empty>
          <Command.Group heading="Navigation" className="px-2 py-1 text-xs text-[var(--color-text-muted)]">
            <CommandItem icon={<LayoutDashboard className="h-4 w-4" />} onSelect={() => run(() => navigate('/app/dashboard'))}>
              Dashboard
            </CommandItem>
            <CommandItem icon={<BookOpen className="h-4 w-4" />} onSelect={() => run(() => navigate('/app/journals'))}>
              All Journals
            </CommandItem>
            <CommandItem icon={<Star className="h-4 w-4" />} onSelect={() => run(() => navigate('/app/favorites'))}>
              Favorites
            </CommandItem>
            <CommandItem icon={<Calendar className="h-4 w-4" />} onSelect={() => run(() => navigate('/app/calendar'))}>
              Calendar
            </CommandItem>
            <CommandItem icon={<Trash2 className="h-4 w-4" />} onSelect={() => run(() => navigate('/app/trash'))}>
              Trash
            </CommandItem>
            <CommandItem icon={<Settings className="h-4 w-4" />} onSelect={() => run(() => navigate('/app/settings'))}>
              Settings
            </CommandItem>
          </Command.Group>
          <Command.Group heading="Actions" className="px-2 py-1 text-xs text-[var(--color-text-muted)]">
            <CommandItem icon={<Plus className="h-4 w-4" />} onSelect={() => run(() => navigate('/app/journals/new'))}>
              New journal entry
            </CommandItem>
            <CommandItem
              icon={theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              onSelect={() => run(toggleTheme)}
            >
              Toggle theme
            </CommandItem>
            <CommandItem icon={<LogOut className="h-4 w-4" />} onSelect={() => run(() => { logout(); navigate('/login'); })}>
              Logout
            </CommandItem>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
};

const CommandItem = ({
  children,
  icon,
  onSelect,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  onSelect: () => void;
}) => (
  <Command.Item
    onSelect={onSelect}
    className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--color-text)] aria-selected:bg-[var(--color-accent-muted)] aria-selected:text-[var(--color-accent)]"
  >
    {icon}
    {children}
  </Command.Item>
);
