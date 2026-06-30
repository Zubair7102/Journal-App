import { useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';

export const SettingsEffects = () => {
  const { accent, fontSize } = useSettings();

  useEffect(() => {
    document.documentElement.dataset.accent = accent;
    document.documentElement.dataset.fontSize = fontSize;
  }, [accent, fontSize]);

  return null;
};
