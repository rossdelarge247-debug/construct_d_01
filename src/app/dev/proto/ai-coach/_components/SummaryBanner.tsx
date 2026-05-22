'use client';

import { tokens } from '@/styles/tokens';

interface Props {
  intro: string;
  flagCount: number;
  noticeCount: number;
}

const AI_VIOLET = tokens.color.accent.violet;
const AI_TINT = '#F3EEFE';
const FLAG_RED = tokens.color.danger;
const NOTICE_AMBER = '#D97706';

export function SummaryBanner({ intro, flagCount, noticeCount }: Props) {
  return (
    <div
      role="region"
      aria-label="AI coach summary"
      style={{
        background: AI_TINT,
        borderLeft: `3px solid ${AI_VIOLET}`,
        padding: '14px 16px',
        borderRadius: tokens.radius.md,
        marginBottom: 16,
        color: tokens.color.ink,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: tokens.type['14-5'],
          lineHeight: 1.45,
          fontFamily: tokens.font.sans,
        }}
      >
        {intro}
      </p>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: '#FFFFFF',
            color: FLAG_RED,
            border: `1px solid ${FLAG_RED}`,
            borderRadius: tokens.radius.sm,
            padding: '3px 8px',
            fontSize: tokens.type['11'],
            fontWeight: tokens.weight.semibold,
            letterSpacing: '0.04em',
          }}
        >
          {flagCount} FLAG
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: '#FFFFFF',
            color: NOTICE_AMBER,
            border: `1px solid ${NOTICE_AMBER}`,
            borderRadius: tokens.radius.sm,
            padding: '3px 8px',
            fontSize: tokens.type['11'],
            fontWeight: tokens.weight.semibold,
            letterSpacing: '0.04em',
          }}
        >
          {noticeCount} NOTICE
        </span>
      </div>
    </div>
  );
}
