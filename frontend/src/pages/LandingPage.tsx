import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Sparkles, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { ThemeToggle } from '../components/common/ThemeToggle';

const features = [
  { icon: BookOpen, title: 'Beautiful journaling', desc: 'Write with focus in a calm, distraction-free editor.' },
  { icon: Sparkles, title: 'Mood & insights', desc: 'Track how you feel and see patterns over time.' },
  { icon: Shield, title: 'Secure & private', desc: 'JWT auth and your data stays yours.' },
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--color-surface-muted)]">
      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <div className="flex items-center gap-2 font-bold text-[var(--color-text)]">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-accent)] text-white">J</span>
          Journal
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link to="/app/dashboard"><Button>Dashboard</Button></Link>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost">Login</Button></Link>
              <Link to="/signup"><Button>Get started</Button></Link>
            </>
          )}
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-10 text-center md:pt-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold tracking-tight text-[var(--color-text)] md:text-6xl"
        >
          Your thoughts deserve a
          <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent"> beautiful home</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-text-muted)]"
        >
          A premium journal app with mood tracking, calendar view, favorites, and a design inspired by Notion and Linear.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-8">
          <Link to={isAuthenticated ? '/app/dashboard' : '/signup'}>
            <Button size="lg">
              Start writing <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 md:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-soft)]"
          >
            <f.icon className="mb-4 h-8 w-8 text-[var(--color-accent)]" />
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">{f.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default LandingPage;
