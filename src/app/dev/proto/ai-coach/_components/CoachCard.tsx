'use client';

import { useState } from 'react';
import { tokens } from '@/styles/tokens';
import { FLAG_RED, NOTICE_AMBER } from './colors';

export type CardType = 'court-reasonableness' | 'fairness-check' | 'coaching' | 'on-this-comment';

export interface Fallback {
  title: string;
  rationale: string;
}

interface Props {
  type: CardType;
  title: string;
  body: string;
  reasoning: string;
  fallbacks?: Fallback[];
}

const POSITIVE_GREEN = '#16A34A';
const THREAD_NEUTRAL = '#57534E';

const TYPE_STYLE: Record<CardType, { color: string; label: string; tint: string }> = {
  'court-reasonableness': { color: FLAG_RED, label: 'COURT REASONABLENESS', tint: '#FEF2F2' },
  'fairness-check':       { color: NOTICE_AMBER, label: 'FAIRNESS CHECK', tint: '#FFFBEB' },
  'coaching':             { color: POSITIVE_GREEN, label: 'COACHING', tint: '#F0FDF4' },
  'on-this-comment':      { color: THREAD_NEUTRAL, label: 'ON THIS COMMENT', tint: '#F5F5F4' },
};

export function CoachCard({ type, title, body, reasoning, fallbacks }: Props) {
  const [expanded, setExpanded] = useState(false);
  const cardTheme = TYPE_STYLE[type];

  return (
    <article
      data-card-type={type}
      style={{
        background: '#FFFFFF',
        border: `1px solid ${tokens.color.border}`,
        borderLeft: `3px solid ${cardTheme.color}`,
        borderRadius: tokens.radius.md,
        padding: '14px 16px',
        marginBottom: 12,
        color: tokens.color.ink,
        fontFamily: tokens.font.sans,
      }}
    >
      <div
        style={{
          fontSize: tokens.type['11'],
          fontWeight: tokens.weight.semibold,
          letterSpacing: '0.06em',
          color: cardTheme.color,
          marginBottom: 6,
          background: cardTheme.tint,
          display: 'inline-block',
          padding: '2px 6px',
          borderRadius: tokens.radius.sm,
        }}
      >
        {cardTheme.label}
      </div>
      <h3
        style={{
          margin: 0,
          fontSize: tokens.type['15-5'],
          fontWeight: tokens.weight.semibold,
          lineHeight: 1.35,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: '8px 0 0',
          fontSize: tokens.type['14-5'],
          lineHeight: 1.5,
          color: tokens.color.text.sub,
        }}
      >
        {body}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        style={{
          marginTop: 10,
          background: 'transparent',
          border: 'none',
          padding: '10px 0',
          minHeight: 44,
          fontSize: tokens.type['11'],
          fontWeight: tokens.weight.semibold,
          letterSpacing: '0.06em',
          color: cardTheme.color,
          cursor: 'pointer',
          textDecoration: 'underline',
          textUnderlineOffset: 2,
        }}
      >
        {expanded ? 'HIDE REASONING' : 'SHOW REASONING'}
      </button>
      {expanded ? (
        <p
          style={{
            margin: '8px 0 0',
            fontSize: tokens.type['14-5'],
            lineHeight: 1.5,
            color: tokens.color.text.sub,
            background: cardTheme.tint,
            padding: '10px 12px',
            borderRadius: tokens.radius.sm,
          }}
        >
          {reasoning}
        </p>
      ) : null}
      {fallbacks && fallbacks.length > 0 ? (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px dashed ${tokens.color.border}` }}>
          <div
            style={{
              fontSize: tokens.type['11'],
              fontWeight: tokens.weight.semibold,
              letterSpacing: '0.06em',
              color: tokens.color.text.muted,
              marginBottom: 8,
            }}
          >
            FALLBACK POSITIONS
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {fallbacks.map((fb) => (
              <li
                key={fb.title}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 12,
                  fontSize: tokens.type['14-5'],
                  lineHeight: 1.4,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: tokens.weight.semibold }}>{fb.title}</div>
                  <div style={{ color: tokens.color.text.muted, fontSize: tokens.type['11'], marginTop: 2 }}>{fb.rationale}</div>
                </div>
                <button
                  type="button"
                  style={{
                    background: '#FFFFFF',
                    border: `1px solid ${cardTheme.color}`,
                    color: cardTheme.color,
                    borderRadius: tokens.radius.sm,
                    padding: '12px 10px',
                    minHeight: 44,
                    fontSize: tokens.type['11'],
                    fontWeight: tokens.weight.semibold,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  Adopt
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
