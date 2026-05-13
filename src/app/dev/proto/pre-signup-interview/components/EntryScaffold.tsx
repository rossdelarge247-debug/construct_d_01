'use client';

import type { CSSProperties } from 'react';
import { tokens } from '@/styles/tokens';
import styles from './EntryScaffold.module.css';

interface EntryScaffoldProps {
  timeIntro: string;
  outcomes: ReadonlyArray<string>;
  reassurance: string;
  className?: string;
  staggerIndex?: number;
}

export function EntryScaffold({
  timeIntro,
  outcomes,
  reassurance,
  className,
  staggerIndex = 0,
}: EntryScaffoldProps) {
  const wrapperClass = className ? `${styles.scaffold} ${className}` : styles.scaffold;
  return (
    <div
      className={wrapperClass}
      style={{ '--stagger-index': staggerIndex } as CSSProperties}
    >
      <p
        style={{
          margin: 0,
          font: `500 11.5px/1.35 ${tokens.font.sans}`,
          letterSpacing: '0.02em',
          color: 'var(--ds-color-text-sub)',
        }}
      >
        {timeIntro}
      </p>
      <ul
        className={styles.list}
        style={{
          margin: '10px 0 0',
          padding: 0,
          listStyle: 'none',
        }}
      >
        {outcomes.map((outcome) => (
          <li
            key={outcome}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              font: `400 13px/1.45 ${tokens.font.sans}`,
              color: 'var(--ds-color-ink)',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                flexShrink: 0,
                marginTop: 1,
                color: 'var(--ds-color-ink)',
                font: `600 13px/1 ${tokens.font.sans}`,
              }}
            >
              ✓
            </span>
            <span>{outcome}</span>
          </li>
        ))}
      </ul>
      <p
        style={{
          margin: '14px 0 0',
          font: `italic 400 13px/1.5 ${tokens.font.serif}`,
          color: 'var(--ds-color-text-sub)',
        }}
      >
        {reassurance}
      </p>
    </div>
  );
}
