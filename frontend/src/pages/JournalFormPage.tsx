import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { createJournal } from '../api/journal.api';

const JournalFormPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: createJournal,
    onSuccess: (entry) => {
      void queryClient.invalidateQueries({ queryKey: ['journals'] });
      navigate(`/app/journals/${entry.id}`);
    },
    onError: () => setError('Could not create journal entry. Please try again.'),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    mutation.mutate({ title, content });
  };

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Stack spacing={3} component="form" onSubmit={handleSubmit}>
        <Box>
          <Typography variant="h4">New journal entry</Typography>
          <Typography color="text.secondary">Write about your day, thoughts, or goals</Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              fullWidth
              multiline
              minRows={8}
            />
          </Stack>
        </Paper>

        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save entry'}
          </Button>
          <Button variant="outlined" onClick={() => navigate('/app/journals')}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default JournalFormPage;
