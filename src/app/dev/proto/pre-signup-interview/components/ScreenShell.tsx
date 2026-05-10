'use client';

import type { ReactNode } from 'react';
import { tokens } from '@/styles/tokens';
import { ProgressChip } from './ProgressChip';
import { PrimaryCTA } from './PrimaryCTA';

interface Props {
  step: number;
  heading: string;
  eyebrow?: string;
  helper?: string;
  ctaLabel?: string;
  ctaCaption?: string;
  ctaDisabled?: boolean;
  onContinue?: () => void;
  onBack?: () => void;
  children: ReactNode;
}

export function ScreenShell({ step, heading, eyebrow, helper, ctaLabel = 'Continue', ctaCaption, ctaDisabled, onContinue, onBack, children }: Props) {
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
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <ProgressChip step={step} />
        {onBack && step > 1 && (
          <button
            type="button"
            onClick={onBack}
            style={{
              appearance: 'none',
              background: 'transparent',
              border: 'none',
              padding: 8,
              cursor: 'pointer',
              font: `500 14px/1.2 ${tokens.font.sans}`,
              color: tokens.color.text.sub,
            }}
            aria-label="Back to previous step"
          >
            Back
          </button>
        )}
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
            font: `600 24px/1.2 ${tokens.font.serif}`,
            letterSpacing: '-0.02em',
            color: tokens.color.ink,
            margin: 0,
          }}
        >
          {heading}
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
