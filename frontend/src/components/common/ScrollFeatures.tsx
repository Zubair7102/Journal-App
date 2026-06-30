import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed left-0 top-0 z-50 h-0.5 origin-left bg-[var(--color-accent)]"
      style={{ scaleX, width: '100%' }}
      aria-hidden
    />
  );
};

export const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-6 z-20 hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-2 text-sm font-medium text-[var(--color-text)] shadow-[var(--shadow-soft)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] md:block"
      aria-label="Back to top"
    >
      ↑ Top
    </button>
  );
};
