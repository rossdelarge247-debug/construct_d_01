'use client';

import { Arrow } from './Arrow';
import { ProgressPill } from './ProgressPill';
import styles from './TopBar.module.css';

interface TopBarProps {
  step: number;
  total?: number;
  onBack?: () => void;
}

export function TopBar({ step, total, onBack }: TopBarProps) {
  return (
    <header className={styles.topBar}>
      {onBack ? (
        <button type="button" onClick={onBack} className={styles.backButton}>
          <Arrow dir="left" size={11} />
          <span>Back</span>
        </button>
      ) : (
        <a href="#" className={styles.homeLink}>
          <Arrow dir="left" size={11} />
          <span>Home</span>
        </a>
      )}
      <ProgressPill step={step} total={total} />
      <div aria-hidden="true" className={styles.spacer} />
    </header>
  );
}
