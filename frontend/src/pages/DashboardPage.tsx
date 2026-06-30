import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookOpen, Flame, Heart, PenLine, TrendingUp } from 'lucide-react';
import { fetchJournals } from '../api/journal.api';
import { fetchGreeting } from '../api/user.api';
import { getDisplayName, useAuth } from '../context/AuthContext';
import { useJournalMeta } from '../context/JournalMetaContext';
import { journalStats, MOOD_OPTIONS } from '../lib/journal-utils';
import { Card, CardContent } from '../components/ui/Card';
import { JournalCard } from '../components/journal/JournalCard';
import { JournalCardSkeleton } from '../components/ui/Skeleton';
import { Input } from '../components/ui/Input';

const StatCard = ({
  icon,
  label,
  value,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent-muted)] text-[var(--color-accent)]">
          {icon}
        </div>
        <div>
          <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
          <p className="text-2xl font-bold text-[var(--color-text)]">{value}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const meta = useJournalMeta();
  const [city, setCity] = useState('London');
  const [greeting, setGreeting] = useState('');

  const { data: journals, isLoading } = useQuery({
    queryKey: ['journals'],
    queryFn: fetchJournals,
  });

  const stats = journalStats(journals ?? []);
  const favorites = (journals ?? []).filter((j) => meta.isFavorite(j.id)).length;
  const recent = [...(journals ?? [])]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const loadGreeting = async () => {
    try {
      const msg = await fetchGreeting(city);
      setGreeting(msg);
    } catch {
      setGreeting(`Hi ${getDisplayName(user)}`);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl">
          Welcome back, {getDisplayName(user)}
        </h1>
        <p className="mt-2 text-[var(--color-text-muted)]">
          Your writing sanctuary — calm, focused, and beautifully organized.
        </p>
      </motion.div>

      <Card>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-end">
          <Input label="City for weather greet" value={city} onChange={(e) => setCity(e.target.value)} />
          <button
            type="button"
            onClick={loadGreeting}
            className="h-10 rounded-xl bg-[var(--color-accent)] px-4 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
          >
            Get greeting
          </button>
        </CardContent>
        {greeting && (
          <div className="border-t border-[var(--color-border)] px-5 py-4 text-sm text-[var(--color-text-muted)]">
            {greeting}
          </div>
        )}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<BookOpen className="h-5 w-5" />} label="Total journals" value={stats.total} delay={0.05} />
        <StatCard icon={<Heart className="h-5 w-5" />} label="Favorites" value={favorites} delay={0.1} />
        <StatCard icon={<Flame className="h-5 w-5" />} label="Current streak" value={`${stats.streak} days`} delay={0.15} />
        <StatCard icon={<PenLine className="h-5 w-5" />} label="Words written" value={stats.totalWords.toLocaleString()} delay={0.2} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[var(--color-accent)]" />
              <h2 className="font-semibold">Mood tracker</h2>
            </div>
            <div className="space-y-3">
              {MOOD_OPTIONS.map((m) => {
                const count = stats.moods[m.value] ?? 0;
                const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={m.value}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{m.emoji} {m.label}</span>
                      <span className="text-[var(--color-text-muted)]">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--color-surface-muted)]">
                      <motion.div
                        className="h-2 rounded-full bg-[var(--color-accent)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-xl font-semibold">Recent activity</h2>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              <JournalCardSkeleton />
              <JournalCardSkeleton />
            </div>
          ) : recent.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {recent.map((entry) => (
                <JournalCard key={entry.id} entry={entry} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--color-text-muted)]">No recent entries yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
