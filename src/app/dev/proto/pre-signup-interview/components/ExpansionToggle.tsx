'use client';

import { type ReactNode } from 'react';
import { tokens } from '@/styles/tokens';
import styles from './focus-visible.module.css';

interface ExpansionToggleProps {
  id: string;
  label: string;
  rationale: ReactNode;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function ExpansionToggle({
  id,
  label,
  rationale,
  open,
  onToggle,
  children,
}: ExpansionToggleProps) {
  const contentId = `${id}-content`;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        background: '#FFFFFF',
        border: `1px solid ${tokens.color.border}`,
        borderRadius: 14,
        padding: 14,
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? contentId : undefined}
        onClick={onToggle}
        className={styles.focusable}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'transparent',
          color: tokens.color.ink,
          border: 'none',
          padding: '12px 0',
          minHeight: 44,
          font: `600 13.5px/1.3 ${tokens.font.sans}`,
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 18,
            height: 18,
            borderRadius: 4,
            border: `1px solid ${tokens.color.border}`,
            font: `500 14px/1 ${tokens.font.sans}`,
          }}
        >
          {open ? '−' : '+'}
        </span>
        <span>{label}</span>
      </button>
      <div
        style={{
          font: `400 12px/1.45 ${tokens.font.sans}`,
          color: tokens.color.text.muted,
        }}
      >
        {rationale}
      </div>
      {open && (
        <div
          id={contentId}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            marginTop: 4,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
