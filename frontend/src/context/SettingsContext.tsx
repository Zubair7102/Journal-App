import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type AccentColor = 'indigo' | 'violet' | 'blue' | 'emerald' | 'rose';
export type FontSize = 'sm' | 'md' | 'lg';

interface Settings {
  accent: AccentColor;
  fontSize: FontSize;
  focusMode: boolean;
  writingGoal: number;
}

interface SettingsContextValue extends Settings {
  setAccent: (accent: AccentColor) => void;
  setFontSize: (size: FontSize) => void;
  setFocusMode: (enabled: boolean) => void;
  setWritingGoal: (goal: number) => void;
}

const STORAGE_KEY = 'journal_settings';

const defaults: Settings = {
  accent: 'indigo',
  fontSize: 'md',
  focusMode: false,
  writingGoal: 300,
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

const load = (): Settings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(load);

  const save = useCallback((next: Settings) => {
    setSettings(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({
      ...settings,
      setAccent: (accent) => save({ ...settings, accent }),
      setFontSize: (fontSize) => save({ ...settings, fontSize }),
      setFocusMode: (focusMode) => save({ ...settings, focusMode }),
      setWritingGoal: (writingGoal) => save({ ...settings, writingGoal }),
    }),
    [settings, save],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextValue => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
