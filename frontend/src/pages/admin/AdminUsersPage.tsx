import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import type { UserProfile } from '../../types/user';
import { JournalCardSkeleton } from '../../components/ui/Skeleton';

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

  if (isLoading) return <JournalCardSkeleton />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All users</h1>
      {isError && <p className="text-rose-500">Failed to load users.</p>}
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Roles</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((user) => (
              <tr key={user.userName} className="border-t border-[var(--color-border)]">
                <td className="px-4 py-3">{user.userName}</td>
                <td className="px-4 py-3">{user.email ?? '—'}</td>
                <td className="px-4 py-3">{user.roles?.join(', ') ?? 'USER'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
