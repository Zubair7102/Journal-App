import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoadingScreen = () => (
  <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface-muted)]">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
  </div>
);

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
