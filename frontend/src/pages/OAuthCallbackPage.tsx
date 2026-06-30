import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setStoredAuth } from '../api/client';
import { fetchCurrentUser } from '../api/user.api';

const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const username = searchParams.get('username');

    const complete = async () => {
      if (!token || !username) return;
      setStoredAuth(token, username);
      try {
        await fetchCurrentUser();
        navigate('/app/dashboard', { replace: true });
      } catch {
        navigate('/login', { replace: true });
      }
    };
    void complete();
  }, [navigate, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
    </div>
  );
};

export default OAuthCallbackPage;
