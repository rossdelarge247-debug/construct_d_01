'use client';

import type { CSSProperties, ReactNode } from 'react';
import { tokens } from '@/styles/tokens';
import styles from './Hero.module.css';

interface HeroProps {
  eyebrow: string;
  eyebrowColor?: string;
  heading: ReactNode;
  helper?: ReactNode;
  helperVariant?: 'sans' | 'italic-serif';
  staggerIndex?: number;
  className?: string;
}

export function Hero({
  eyebrow,
  eyebrowColor,
  heading,
  helper,
  helperVariant = 'sans',
  staggerIndex = 0,
  className,
}: HeroProps) {
  const wrapperClass = className ? `${styles.hero} ${className}` : styles.hero;
  return (
    <div
      className={wrapperClass}
      style={{ '--stagger-index': staggerIndex } as CSSProperties}
    >
      <div
        style={{
          font: `500 9.5px/1.3 ${tokens.font.sans}`,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: eyebrowColor ?? 'var(--ds-color-text-muted)',
        }}
      >
        {eyebrow}
      </div>
      <h1
        style={{
          margin: '8px 0 0',
          font: `600 21px/1.18 ${tokens.font.serif}`,
          letterSpacing: '-0.02em',
          color: 'var(--ds-color-ink)',
        }}
      >
        {heading}
      </h1>
      {helper !== undefined && helper !== null && helper !== '' && (
        <p
          style={
            helperVariant === 'italic-serif'
              ? {
                  margin: '12px 0 0',
                  font: `italic 400 14px/1.5 ${tokens.font.serif}`,
                  color: 'var(--ds-color-text-sub)',
                }
              : {
                  margin: '8px 0 0',
                  font: `400 12px/1.45 ${tokens.font.sans}`,
                  color: 'var(--ds-color-text-sub)',
                }
          }
        >
          {helper}
        </p>
      )}
    </div>
  );
}
