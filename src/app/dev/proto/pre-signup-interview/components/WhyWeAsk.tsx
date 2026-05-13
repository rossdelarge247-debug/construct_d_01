'use client';

import type { CSSProperties } from 'react';
import { tokens } from '@/styles/tokens';
import styles from './WhyWeAsk.module.css';

interface WhyWeAskProps {
  body: string;
  className?: string;
  staggerIndex?: number;
}

export function WhyWeAsk({ body, className, staggerIndex = 0 }: WhyWeAskProps) {
  const wrapperClass = className ? `${styles.callout} ${className}` : styles.callout;
  return (
    <div
      className={wrapperClass}
      style={{ '--stagger-index': staggerIndex } as CSSProperties}
    >
      <p
        style={{
          margin: 0,
          font: `500 10px/1.3 ${tokens.font.sans}`,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--ds-color-text-muted)',
        }}
      >
        Why we ask
      </p>
      <p
        style={{
          margin: '6px 0 0',
          font: `400 13px/1.5 ${tokens.font.sans}`,
          color: 'var(--ds-color-text-sub)',
        }}
      >
        {body}
      </p>
    </div>
  );
}
