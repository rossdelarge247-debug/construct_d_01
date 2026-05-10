'use client';

import { type BgMode, BG_MODES } from '../lib/types';
import styles from '../page.module.css';

interface Props {
  mode: BgMode;
  onToggle: (next: BgMode) => void;
}

export function BgToggle({ mode, onToggle }: Props) {
  const idx = BG_MODES.indexOf(mode);
  const next: BgMode = BG_MODES[(idx + 1) % BG_MODES.length];
  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => onToggle(next)}
      aria-label={`Background — currently ${mode}, click to cycle to ${next}`}
    >
      bg: {mode}
    </button>
  );
}
