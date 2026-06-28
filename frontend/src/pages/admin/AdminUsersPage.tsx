import { useQuery } from '@tanstack/react-query';
import {
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { apiClient } from '../../api/client';
import type { UserProfile } from '../../types/user';
import LoadingScreen from '../../components/common/LoadingScreen';

interface AdminUser extends UserProfile {
  id?: string;
}

const fetchAllUsers = async (): Promise<AdminUser[]> => {
  const { data } = await apiClient.get<AdminUser[]>('/admin/all-users');
  return data;
};

const AdminUsersPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchAllUsers,
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        All users
      </Typography>
      {isError && <Alert severity="error">Failed to load users.</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Roles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(data ?? []).map((user) => (
              <TableRow key={user.userName}>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.email ?? '-'}</TableCell>
                <TableCell>{user.roles?.join(', ') ?? 'USER'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default AdminUsersPage;
