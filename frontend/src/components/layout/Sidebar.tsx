import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  LayoutDashboard,
  Settings,
  Star,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import { getDisplayName, useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { LogoutButton } from '../common/LogoutButton';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/journals', label: 'All Journals', icon: BookOpen },
  { to: '/app/favorites', label: 'Favorites', icon: Star },
  { to: '/app/calendar', label: 'Calendar', icon: Calendar },
  { to: '/app/trash', label: 'Trash', icon: Trash2 },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export const Sidebar = ({ onNavigate }: SidebarProps) => {
  const { isAdmin, user } = useAuth();

  return (
    <aside className="flex h-full flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent)] text-lg font-bold text-white">
          J
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-text)]">Journal</p>
          <p className="text-xs text-[var(--color-text-muted)]">Your private space</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]',
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn('h-4 w-4', isActive && 'text-[var(--color-accent)]')} />
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
        {isAdmin && (
          <NavLink
            to="/app/admin/users"
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)]',
              )
            }
          >
            <Users className="h-4 w-4" />
            Admin
          </NavLink>
        )}
      </nav>

      <div className="border-t border-[var(--color-border)] p-4 space-y-3">
        <Link
          to="/app/settings"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-[var(--color-surface-muted)]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent-muted)] text-[var(--color-accent)]">
            <User className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[var(--color-text)]">
              {getDisplayName(user)}
            </p>
            <p className="truncate text-xs text-[var(--color-text-muted)]">
              {user?.email ?? 'View profile'}
            </p>
          </div>
        </Link>
        <LogoutButton />
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-[var(--color-text-muted)]">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
};
