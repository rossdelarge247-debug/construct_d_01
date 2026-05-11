'use client';

import { useState, type ReactNode } from 'react';
import { tokens } from '@/styles/tokens';
import { BrandBar } from './BrandBar';
import { ProgressPill } from './ProgressPill';
import { PrimaryCTA } from './PrimaryCTA';
import type { TitleShape } from '../lib/types';

interface Props {
  step: number;
  heading: string | TitleShape;
  eyebrow?: string;
  helper?: string;
  ctaLabel?: string;
  ctaCaption?: string;
  ctaDisabled?: boolean;
  onContinue?: () => void;
  onBack?: () => void;
  children: ReactNode;
}

function normalizeTitle(heading: string | TitleShape): TitleShape {
  return typeof heading === 'string' ? { kind: 'plain', text: heading } : heading;
}

export function ScreenShell({ step, heading, eyebrow, helper, ctaLabel = 'Continue', ctaCaption, ctaDisabled, onContinue, onBack, children }: Props) {
  const title = normalizeTitle(heading);
  const backVisible = Boolean(onBack && step > 1);
  const [backFocused, setBackFocused] = useState(false);
  return (
    <main
      style={{
        maxWidth: 480,
        margin: '0 auto',
        padding: '64px 20px 48px',
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        minHeight: '100vh',
        boxSizing: 'border-box',
      }}
    >
      <BrandBar />
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 12,
          borderBottom: `1px solid ${tokens.color.border}`,
        }}
      >
        <button
          type="button"
          onClick={onBack}
          onFocus={() => setBackFocused(true)}
          onBlur={() => setBackFocused(false)}
          aria-hidden={!backVisible}
          aria-label={backVisible ? 'Back to previous step' : undefined}
          tabIndex={backVisible ? 0 : -1}
          style={{
            appearance: 'none',
            background: 'transparent',
            border: 'none',
            padding: '12px 8px',
            cursor: backVisible ? 'pointer' : 'default',
            visibility: backVisible ? 'visible' : 'hidden',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            minHeight: 44,
            minWidth: 44,
            font: `500 11px/1.2 ${tokens.font.sans}`,
            color: tokens.color.text.sub,
            outline: backVisible && backFocused ? `2px solid ${tokens.color.ink}` : 'none',
            outlineOffset: 2,
            borderRadius: 4,
          }}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="7,2 3,5.5 7,9" />
          </svg>
          <span>Back</span>
        </button>
        <ProgressPill step={step} />
        <span aria-hidden="true" style={{ display: 'inline-block', width: 36 }} />
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {eyebrow && (
          <div
            style={{
              font: `600 10.5px/1.2 ${tokens.font.mono}`,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: tokens.color.accent.violet,
            }}
          >
            {eyebrow}
          </div>
        )}
        <h1
          style={{
            font: `600 26px/1.05 ${tokens.font.serif}`,
            letterSpacing: '-0.02em',
            color: tokens.color.ink,
            margin: 0,
          }}
        >
          {title.kind === 'plain' ? (
            title.text
          ) : (
            <>
              {title.bold}{' '}
              <span style={{ fontStyle: 'italic', fontWeight: 400 }}>{title.accent}</span>
              {title.period ? '.' : ''}
            </>
          )}
        </h1>
        {helper && (
          <p style={{ font: `400 15px/1.5 ${tokens.font.sans}`, color: tokens.color.text.sub, margin: 0 }}>{helper}</p>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>

      {onContinue && (
        <div style={{ marginTop: 'auto', paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ctaCaption && (
            <div
              style={{
                font: `500 12px/1.3 ${tokens.font.sans}`,
                color: tokens.color.text.muted,
                textAlign: 'center',
              }}
            >
              {ctaCaption}
            </div>
          )}
          <PrimaryCTA label={ctaLabel} onClick={onContinue} disabled={ctaDisabled} />
        </div>
      )}
    </main>
  );
}
