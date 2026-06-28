import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { fetchJournals } from '../api/journal.api';
import { fetchGreeting } from '../api/user.api';
import { getDisplayName, useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/common/LoadingScreen';

const DashboardPage = () => {
  const { user } = useAuth();
  const [cityName, setCityName] = useState('London');
  const [greeting, setGreeting] = useState('');
  const [greetingError, setGreetingError] = useState('');

  const { data: journals, isLoading } = useQuery({
    queryKey: ['journals'],
    queryFn: fetchJournals,
  });

  useEffect(() => {
    const loadGreeting = async () => {
      if (!cityName.trim()) return;
      setGreetingError('');
      try {
        const message = await fetchGreeting(cityName.trim());
        setGreeting(message);
      } catch {
        setGreeting('');
        setGreetingError('Weather greeting is unavailable. Check weather API configuration.');
      }
    };
    void loadGreeting();
  }, [cityName]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const recentEntries = (journals ?? []).slice(0, 3);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Hello, {getDisplayName(user)}</Typography>
        <Typography color="text.secondary">Here is your journal overview</Typography>
      </Box>

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'flex-start' }}>
            <TextField
              label="City"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              size="small"
              sx={{ minWidth: 200 }}
            />
            <Box sx={{ flexGrow: 1 }}>
              {greeting ? (
                <Alert severity="info">{greeting}</Alert>
              ) : greetingError ? (
                <Alert severity="warning">{greetingError}</Alert>
              ) : null}
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Recent entries</Typography>
        <Button
          component={RouterLink}
          to="/app/journals/new"
          variant="contained"
          startIcon={<AddIcon />}
        >
          New entry
        </Button>
      </Stack>

      {recentEntries.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              No journal entries yet.
            </Typography>
            <Button component={RouterLink} to="/app/journals/new" variant="outlined">
              Write your first entry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {recentEntries.map((entry) => (
            <Grid key={entry.id} size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom noWrap>
                    {entry.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {new Date(entry.date).toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {entry.content}
                  </Typography>
                  <Button
                    component={RouterLink}
                    to={`/app/journals/${entry.id}`}
                    sx={{ mt: 2 }}
                  >
                    View
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
};

export default DashboardPage;
