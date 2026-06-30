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

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup({ userName, password, email });
      navigate('/login', { state: { message: 'Account created. Please sign in.' } });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Signup failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 shadow-[var(--shadow-soft)]"
      >
        <div>
          <h2 className="text-3xl font-bold">Create account</h2>
          <p className="text-[var(--color-text-muted)]">Start your journaling journey</p>
        </div>
        {error && <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-500">{error}</p>}
        <Input label="Username" value={userName} onChange={(e) => setUserName(e.target.value)} required />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <PasswordInput label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
        <Button type="submit" size="lg" className="w-full" loading={loading}>Sign up</Button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border)]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[var(--color-surface-elevated)] px-2 text-[var(--color-text-muted)]">or</span>
          </div>
        </div>

        <GoogleSignInButton />

        <p className="text-center text-sm text-[var(--color-text-muted)]">
          Have an account? <Link to="/login" className="font-medium text-[var(--color-accent)]">Sign in</Link>
        </p>
      </motion.form>
    </div>
  );
};

export default SignupPage;
