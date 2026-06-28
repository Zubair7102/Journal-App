import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { setStoredAuth } from '../api/client';
import { fetchCurrentUser } from '../api/user.api';

const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const username = searchParams.get('username');

    const completeLogin = async () => {
      if (!token || !username) {
        setError('OAuth login failed. Missing token or username.');
        return;
      }

      setStoredAuth(token, username);
      try {
        await fetchCurrentUser();
        navigate('/app/dashboard', { replace: true });
      } catch {
        setError('OAuth login succeeded but profile could not be loaded.');
      }
    };

    void completeLogin();
  }, [navigate, searchParams]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 2,
      }}
    >
      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <CircularProgress />
          <Typography>Completing Google sign-in...</Typography>
        </>
      )}
    </Box>
  );
};

export default OAuthCallbackPage;
