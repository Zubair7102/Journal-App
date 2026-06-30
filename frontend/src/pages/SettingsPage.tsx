import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTheme } from '../context/ThemeContext';
import { useSettings, type AccentColor, type FontSize } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { useJournalMeta } from '../context/JournalMetaContext';
import { deleteUser, updateUser } from '../api/user.api';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PasswordInput } from '../components/ui/PasswordInput';
import { LogoutButton } from '../components/common/LogoutButton';
import type { JournalLocalMeta } from '../types/journal';

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const settings = useSettings();
  const { user, logout, refreshUser } = useAuth();
  const meta = useJournalMeta();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userName, setUserName] = useState(user?.userName ?? '');
  const [password, setPassword] = useState('');

  const handleProfileUpdate = async () => {
    try {
      await updateUser({ userName, password });
      await refreshUser();
      toast.success('Profile updated');
      setPassword('');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Delete your account permanently?')) return;
    try {
      await deleteUser();
      logout();
      navigate('/');
      toast.success('Account deleted');
    } catch {
      toast.error('Failed to delete account');
    }
  };

  const exportJournals = () => {
    const data = localStorage.getItem('journal_local_meta');
    const blob = new Blob([data ?? '{}'], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'journal-meta-export.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Metadata exported');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as Partial<JournalLocalMeta>;
        meta.importMeta(parsed);
        toast.success('Journal metadata imported');
      } catch {
        toast.error('Invalid import file');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-[var(--color-text-muted)]">Personalize your journal experience</p>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <h2 className="font-semibold">Appearance</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant={theme === 'light' ? 'primary' : 'secondary'} onClick={() => { setTheme('light'); toast.success('Theme changed'); }}>
              Light
            </Button>
            <Button variant={theme === 'dark' ? 'primary' : 'secondary'} onClick={() => { setTheme('dark'); toast.success('Theme changed'); }}>
              Dark
            </Button>
          </div>
          <div>
            <p className="mb-2 text-sm text-[var(--color-text-muted)]">Font size</p>
            <div className="flex gap-2">
              {(['sm', 'md', 'lg'] as FontSize[]).map((size) => (
                <Button key={size} variant={settings.fontSize === size ? 'primary' : 'secondary'} onClick={() => settings.setFontSize(size)}>
                  {size.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-[var(--color-text-muted)]">Accent</p>
            <div className="flex flex-wrap gap-2">
              {(['indigo', 'violet', 'blue', 'emerald', 'rose'] as AccentColor[]).map((accent) => (
                <Button key={accent} variant={settings.accent === accent ? 'primary' : 'secondary'} onClick={() => { settings.setAccent(accent); toast.success('Accent updated'); }}>
                  {accent}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-[var(--color-text-muted)]">Daily writing goal (words)</p>
            <Input
              type="number"
              value={settings.writingGoal}
              onChange={(e) => settings.setWritingGoal(Number(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <h2 className="font-semibold">Profile</h2>
          <Input label="Email" value={user?.email ?? ''} disabled />
          <Input label="Username" value={userName} onChange={(e) => setUserName(e.target.value)} />
          <PasswordInput label="New password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button onClick={handleProfileUpdate} disabled={!password}>Update profile</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3">
          <h2 className="font-semibold">Session</h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            Sign out of your account on this device.
          </p>
          <LogoutButton variant="settings" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3">
          <h2 className="font-semibold">Data</h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            Export or import favorites, tags, categories, and other local metadata.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={exportJournals}>Export metadata</Button>
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
              Import metadata
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleImport}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-rose-500/30">
        <CardContent className="space-y-3">
          <h2 className="font-semibold text-rose-500">Danger zone</h2>
          <p className="text-sm text-[var(--color-text-muted)]">Permanently delete your account and all journal entries.</p>
          <Button variant="danger" onClick={handleDeleteAccount}>Delete account</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
