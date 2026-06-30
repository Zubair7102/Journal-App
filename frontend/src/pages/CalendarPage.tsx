import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  parseISO,
  startOfMonth,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchJournals } from '../api/journal.api';
import { useJournalMeta } from '../context/JournalMetaContext';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

import type { JournalEntry } from '../types/journal';

const CalendarPage = () => {
  const [current, setCurrent] = useState(new Date());
  const meta = useJournalMeta();

  const { data: journals } = useQuery({ queryKey: ['journals'], queryFn: fetchJournals });

  const days = useMemo(
    () => eachDayOfInterval({ start: startOfMonth(current), end: endOfMonth(current) }),
    [current],
  );

  const entriesByDay = useMemo(() => {
    const map = new Map<string, JournalEntry[]>();
    (journals ?? [])
      .filter((j) => !meta.isTrashed(j.id))
      .forEach((j) => {
        const key = format(parseISO(j.date), 'yyyy-MM-dd');
        const list = map.get(key) ?? [];
        list.push(j);
        map.set(key, list);
      });
    return map;
  }, [journals, meta]);

  const [selected, setSelected] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const selectedEntries = entriesByDay.get(selected) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-[var(--color-text-muted)]">View journals by date</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="icon" onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="secondary" onClick={() => setCurrent(new Date())}>Today</Button>
          <Button variant="secondary" size="icon" onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent>
          <h2 className="mb-4 text-lg font-semibold">{format(current, 'MMMM yyyy')}</h2>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-[var(--color-text-muted)]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {days.map((day) => {
              const key = format(day, 'yyyy-MM-dd');
              const count = entriesByDay.get(key)?.length ?? 0;
              const active = selected === key;
              const today = isSameDay(day, new Date());
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelected(key)}
                  className={`min-h-16 rounded-xl border p-2 text-left transition ${
                    active
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-muted)]'
                      : 'border-[var(--color-border)] hover:border-[var(--color-accent)]'
                  }`}
                >
                  <span className={`text-sm font-medium ${today ? 'text-[var(--color-accent)]' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  {count > 0 && (
                    <span className="mt-1 block text-xs text-[var(--color-text-muted)]">{count} entries</span>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="mb-3 text-lg font-semibold">{format(parseISO(selected), 'EEEE, MMM d')}</h3>
        {selectedEntries.length ? (
          <div className="space-y-2">
            {selectedEntries.map((e) => (
              <Link
                key={e.id}
                to={`/app/journals/${e.id}`}
                className="block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 hover:border-[var(--color-accent)]"
              >
                <p className="font-medium">{e.title}</p>
                <p className="text-sm text-[var(--color-text-muted)]">{format(parseISO(e.date), 'h:mm a')}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--color-text-muted)]">No entries for this day.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
