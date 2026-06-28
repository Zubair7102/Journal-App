import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #e8eaf6 0%, #e0f2f1 100%)',
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={3} sx={{ alignItems: 'flex-start' }}>
          <BookIcon sx={{ fontSize: 56, color: 'primary.main' }} />
          <Typography variant="h3" component="h1">
            Capture your thoughts, track your mood
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 640 }}>
            A secure personal journal with weather-aware greetings, sentiment insights, and
            role-based admin tools powered by your Spring Boot backend.
          </Typography>
          <Stack direction="row" spacing={2}>
            {isAuthenticated ? (
              <Button component={RouterLink} to="/app/dashboard" variant="contained" size="large">
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button component={RouterLink} to="/signup" variant="contained" size="large">
                  Get Started
                </Button>
                <Button component={RouterLink} to="/login" variant="outlined" size="large">
                  Login
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default LandingPage;
