'use client';

import type { BgMode } from '../lib/types';
import styles from '../page.module.css';

interface Props {
  mode: BgMode;
  onToggle: (next: BgMode) => void;
}

export function BgToggle({ mode, onToggle }: Props) {
  const next: BgMode = mode === 'expressive' ? 'standalone' : 'expressive';
  const label = `bg: ${mode}`;
  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => onToggle(next)}
      aria-label={`Toggle background — currently ${mode}, click to switch to ${next}`}
    >
      {label}
    </button>
  );
}
