import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Plus, Search, User } from 'lucide-react';
import { useAuth, getDisplayName } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { CommandPalette } from '../common/CommandPalette';
import { LogoutButton } from '../common/LogoutButton';
import { BackToTop, ScrollProgress } from '../common/ScrollFeatures';
import { Sidebar } from './Sidebar';

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[var(--color-surface-muted)]">
      <ScrollProgress />
      <div className="hidden w-64 shrink-0 md:block">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-[var(--color-surface)] shadow-[var(--shadow-lift)]">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-[var(--color-border)] glass">
          <div className="flex h-16 items-center gap-3 px-4 md:px-6">
            <button
              type="button"
              className="rounded-xl p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              className="hidden flex-1 items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-2 text-sm text-[var(--color-text-muted)] transition hover:border-[var(--color-accent)] md:flex md:max-w-md"
            >
              <Search className="h-4 w-4" />
              Search or jump to... <kbd className="ml-auto rounded bg-[var(--color-surface-muted)] px-1.5 text-xs">⌘K</kbd>
            </button>

            <div className="ml-auto flex items-center gap-2">
              <Button size="sm" onClick={() => navigate('/app/journals/new')}>
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New entry</span>
              </Button>
              <Link
                to="/app/settings"
                className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm"
              >
                <User className="h-4 w-4 text-[var(--color-accent)]" />
                <span className="hidden max-w-[120px] truncate sm:inline">
                  {getDisplayName(user)}
                </span>
              </Link>
              <LogoutButton variant="header" />
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>

      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />

      <BackToTop />

      <button
        type="button"
        onClick={() => navigate('/app/journals/new')}
        className="fixed bottom-6 right-6 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-[var(--shadow-lift)] transition hover:scale-105 md:hidden"
        aria-label="Create new journal"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
};
