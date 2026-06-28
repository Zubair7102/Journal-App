import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { deleteUser, updateUser } from '../api/user.api';
import { setStoredAuth } from '../api/client';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user?.userName) {
      setUserName(user.userName);
    }
  }, [user]);

  const handleUpdate = async () => {
    setError('');
    setMessage('');
    setIsSaving(true);
    try {
      const updated = await updateUser({ userName, password });
      const token = sessionStorage.getItem('journal_app_token');
      if (token) {
        setStoredAuth(token, updated.userName);
      }
      await refreshUser();
      setPassword('');
      setMessage('Profile updated successfully.');
    } catch {
      setError('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteUser();
      logout();
      navigate('/');
    } catch {
      setError('Failed to delete account.');
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 640 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4">Profile</Typography>
          <Typography color="text.secondary">Manage your account settings</Typography>
        </Box>

        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <TextField label="Email" value={user?.email ?? ''} disabled fullWidth />
            <TextField
              label="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              fullWidth
            />
            <TextField
              label="New password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              helperText="Enter a new password when updating credentials"
            />
            <Typography variant="body2" color="text.secondary">
              Roles: {user?.roles?.join(', ') || 'USER'}
            </Typography>
          </Stack>
        </Paper>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleUpdate} disabled={isSaving || !password}>
            {isSaving ? 'Saving...' : 'Update profile'}
          </Button>
          <Button color="error" variant="outlined" onClick={() => setDeleteOpen(true)}>
            Delete account
          </Button>
        </Stack>
      </Stack>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete your account?</DialogTitle>
        <DialogContent>
          <Typography>All journal entries associated with this account will be removed.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={isDeleting}>
            Delete account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
