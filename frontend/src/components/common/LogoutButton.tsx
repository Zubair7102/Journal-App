import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface LogoutButtonProps {
  variant?: 'sidebar' | 'header' | 'settings';
  className?: string;
}

export const LogoutButton = ({ variant = 'sidebar', className }: LogoutButtonProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  if (variant === 'header') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        aria-label="Log out"
        className={className}
        title="Log out"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    );
  }

  if (variant === 'settings') {
    return (
      <Button variant="secondary" onClick={handleLogout} className={cn('gap-2', className)}>
        <LogOut className="h-4 w-4" />
        Log out
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
        'text-[var(--color-text-muted)] transition hover:bg-rose-500/10 hover:text-rose-500',
        className,
      )}
    >
      <LogOut className="h-4 w-4" />
      Log out
    </button>
  );
};
