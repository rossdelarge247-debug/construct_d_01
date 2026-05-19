'use client';

import { tokens } from '@/styles/tokens';
import styles from './focus-visible.module.css';

interface SkipScreenButtonProps {
  onSkip: () => void;
}

export function SkipScreenButton({ onSkip }: SkipScreenButtonProps) {
  return (
    <button
      type="button"
      onClick={onSkip}
      className={styles.focusable}
      style={{
        background: 'transparent',
        color: tokens.color.text.sub,
        border: 'none',
        padding: '12px 16px',
        minHeight: 44,
        font: `500 13.5px/1.3 ${tokens.font.sans}`,
        textDecoration: 'underline',
        cursor: 'pointer',
      }}
    >
      Skip this screen
    </button>
  );
}
