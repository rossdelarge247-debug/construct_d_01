'use client';

import { useEffect, useState } from 'react';
import { tokens } from '@/styles/tokens';
import { AI_PURPLE_DEEP, AI_PURPLE_EDGE, AI_PURPLE_TINT, AIBadge } from './SparkGlyph';

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = (matches: boolean) => setReduced(matches);
    update(mq.matches);
    const onChange = (e: MediaQueryListEvent) => update(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

type Severity = 'info' | 'notice' | 'warn';

const SEV = {
  info: { border: AI_PURPLE_EDGE, tint: AI_PURPLE_TINT, dot: '#059669' },
  notice: { border: '#F9D89D', tint: '#FFFBEB', dot: '#B45309' },
  warn: { border: '#FCA5A5', tint: '#FFF5F5', dot: '#B91C1C' },
} as const;

const KIND_MAP: Record<string, string> = {
  tip: 'Tip',
  court_risk: 'Court reasonableness',
  fairness: 'Fairness check',
};

export function AIMarginCard({
  kind = 'tip',
  severity = 'info',
  title,
  body,
  citation,
  relatedTo,
  defaultOpenReasoning = false,
}: {
  kind?: string;
  severity?: Severity;
  title: string;
  body?: string;
  citation?: string | null;
  relatedTo?: { label: string } | null;
  defaultOpenReasoning?: boolean;
}) {
  const [openReasoning, setOpenReasoning] = useState(defaultOpenReasoning);
  const reducedMotion = useReducedMotion();
  const sev = SEV[severity];
  const kindLabel = KIND_MAP[kind] ?? kind;
  const hasReasoning = Boolean(body || citation);

  return (
    <div
      style={{
        background: sev.tint,
        border: `1px solid ${sev.border}`,
        borderRadius: 11,
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(76,63,184,0.04)',
      }}
    >
      <div style={{ padding: '10px 12px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
          <AIBadge size={18} />
          <span
            style={{
              fontSize: 9.5,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: AI_PURPLE_DEEP,
              whiteSpace: 'nowrap',
            }}
          >
            Decouple AI
          </span>
          <span style={{ flex: 1 }} />
          <span
            style={{
              fontSize: 9.5,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: tokens.color.text.muted,
              whiteSpace: 'nowrap',
            }}
          >
            {kindLabel}
          </span>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: sev.dot, flexShrink: 0 }} />
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: tokens.color.ink,
            lineHeight: 1.4,
            letterSpacing: '-0.005em',
          }}
        >
          {title}
        </div>
        {relatedTo ? (
          <span
            style={{
              marginTop: 6,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px 3px 7px',
              background: 'rgba(109,91,208,0.08)',
              border: `1px solid ${AI_PURPLE_EDGE}`,
              borderRadius: 999,
              fontSize: 10.5,
              color: AI_PURPLE_DEEP,
              fontWeight: 600,
            }}
          >
            <span style={{ fontSize: 9 }}>↳</span> {relatedTo.label}
          </span>
        ) : null}
      </div>

      {hasReasoning ? (
        <>
          <button
            type="button"
            onClick={() => setOpenReasoning((x) => !x)}
            aria-expanded={openReasoning}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '7px 12px',
              background: 'rgba(255,255,255,0.6)',
              border: 'none',
              borderTop: `1px solid ${sev.border}`,
              cursor: 'pointer',
              color: tokens.color.text.sub,
            }}
          >
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {openReasoning ? 'Hide reasoning' : 'Show reasoning'}
            </span>
            <span
              style={{
                fontSize: 9,
                transform: openReasoning ? 'rotate(180deg)' : 'none',
                transition: reducedMotion ? 'none' : 'transform 180ms',
              }}
            >
              ▾
            </span>
          </button>
          {openReasoning && body ? (
            <div
              style={{
                padding: '9px 12px 11px',
                background: tokens.color.surface.panel,
                borderTop: `1px solid ${sev.border}`,
                fontSize: 11.5,
                color: tokens.color.text.sub,
                lineHeight: 1.55,
              }}
            >
              {body}
              {citation ? (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 10,
                    color: tokens.color.text.muted,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}
                >
                  ❡ {citation}
                </div>
              ) : null}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
