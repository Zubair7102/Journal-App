import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteJournal, fetchJournalById, updateJournal } from '../api/journal.api';
import LoadingScreen from '../components/common/LoadingScreen';

const JournalDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: entry, isLoading, isError } = useQuery({
    queryKey: ['journal', id],
    queryFn: () => fetchJournalById(id!),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
    }
  }, [entry]);

  const updateMutation = useMutation({
    mutationFn: () => updateJournal(id!, { title, content }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['journals'] });
      void queryClient.invalidateQueries({ queryKey: ['journal', id] });
      setError('');
    },
    onError: () => setError('Failed to update entry.'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteJournal(id!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['journals'] });
      navigate('/app/journals');
    },
    onError: () => setError('Failed to delete entry.'),
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !entry) {
    return <Alert severity="error">Journal entry not found.</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4">Edit entry</Typography>
          <Typography color="text.secondary">
            {new Date(entry.date).toLocaleString()}
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
              multiline
              minRows={10}
            />
          </Stack>
        </Paper>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Saving...' : 'Save changes'}
          </Button>
          <Button variant="outlined" onClick={() => navigate('/app/journals')}>
            Back
          </Button>
          <Button
            color="error"
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </Button>
        </Stack>
      </Stack>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete this entry?</DialogTitle>
        <DialogContent>
          <Typography>This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JournalDetailPage;
