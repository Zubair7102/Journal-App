import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../api/errors';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PasswordInput } from '../components/ui/PasswordInput';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { GoogleSignInButton } from '../components/common/GoogleSignInButton';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ userName, password });
      navigate('/app/dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-700 p-12 text-white lg:flex">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-bold">Journal</h1>
          <p className="mt-4 max-w-md text-lg text-indigo-100">
            A calm, beautiful space for your thoughts — inspired by the best productivity tools.
          </p>
        </motion.div>
      </div>
      <div className="flex flex-1 flex-col justify-center px-6 py-12">
        <div className="absolute right-6 top-6">
          <ThemeToggle />
        </div>
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-md space-y-5"
        >
          <div>
            <h2 className="text-3xl font-bold">Welcome back</h2>
            <p className="text-[var(--color-text-muted)]">Sign in to continue writing</p>
          </div>
          {error && <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-500">{error}</p>}
          <Input label="Username" value={userName} onChange={(e) => setUserName(e.target.value)} required autoComplete="username" />
          <PasswordInput label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          <Button type="submit" size="lg" className="w-full" loading={loading}>Sign in</Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-border)]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--color-surface-muted)] px-2 text-[var(--color-text-muted)]">or</span>
            </div>
          </div>

          <GoogleSignInButton />

          <p className="text-center text-sm text-[var(--color-text-muted)]">
            New here? <Link to="/signup" className="font-medium text-[var(--color-accent)]">Create account</Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default LoginPage;
