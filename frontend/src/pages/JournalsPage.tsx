import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { fetchJournals } from '../api/journal.api';
import LoadingScreen from '../components/common/LoadingScreen';

const JournalsPage = () => {
  const { data: journals, isLoading, isError } = useQuery({
    queryKey: ['journals'],
    queryFn: fetchJournals,
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4">My journals</Typography>
          <Typography color="text.secondary">All your entries in one place</Typography>
        </Box>
        <Button
          component={RouterLink}
          to="/app/journals/new"
          variant="contained"
          startIcon={<AddIcon />}
        >
          New entry
        </Button>
      </Stack>

      {isError && <Alert severity="error">Failed to load journal entries.</Alert>}

      {!journals?.length ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary">
              You have not written any entries yet.
            </Typography>
          </CardContent>
          <CardActions>
            <Button component={RouterLink} to="/app/journals/new">
              Create your first entry
            </Button>
          </CardActions>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {journals.map((entry) => (
            <Grid key={entry.id} size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{entry.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {new Date(entry.date).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">{entry.content}</Typography>
                </CardContent>
                <CardActions>
                  <Button component={RouterLink} to={`/app/journals/${entry.id}`}>
                    Open
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
};

export default JournalsPage;
