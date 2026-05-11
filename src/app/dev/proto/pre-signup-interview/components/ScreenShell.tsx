'use client';

import { useState, type ReactNode } from 'react';
import { tokens } from '@/styles/tokens';
import { Arrow } from './Arrow';
import { BrandBar } from './BrandBar';
import { ProgressPill } from './ProgressPill';
import type { TitleShape } from '../lib/types';

interface TrustBand {
  left: string;
  right: string;
}

interface Props {
  step: number;
  heading: string | TitleShape;
  eyebrow?: string;
  helper?: string;
  ctaLabel?: string;
  ctaCaption?: string;
  trustBand?: TrustBand;
  ctaDisabled?: boolean;
  onContinue?: () => void;
  onBack?: () => void;
  children: ReactNode;
}

const DEFAULT_TRUST_BAND: TrustBand = { left: 'Free', right: 'Private until saved' };

function normalizeTitle(heading: string | TitleShape): TitleShape {
  return typeof heading === 'string' ? { kind: 'plain', text: heading } : heading;
}

export function ScreenShell({
  step,
  heading,
  eyebrow,
  helper,
  ctaLabel = 'Continue',
  ctaCaption,
  trustBand,
  ctaDisabled,
  onContinue,
  onBack,
  children,
}: Props) {
  const title = normalizeTitle(heading);
  const backVisible = Boolean(onBack && step > 1);
  const [backFocused, setBackFocused] = useState(false);
  const band = trustBand ?? DEFAULT_TRUST_BAND;
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 480,
        margin: '0 auto',
        minHeight: '100vh',
        paddingTop: 24,
      }}
    >
      <BrandBar />
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px 12px',
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
            padding: '0',
            cursor: backVisible ? 'pointer' : 'default',
            visibility: backVisible ? 'visible' : 'hidden',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            font: `500 12px/1.2 ${tokens.font.sans}`,
            color: tokens.color.text.sub,
            outline: backVisible && backFocused ? `2px solid ${tokens.color.ink}` : 'none',
            outlineOffset: 2,
            borderRadius: 4,
          }}
        >
          <Arrow dir="left" size={11} />
          <span>Back</span>
        </button>
        <ProgressPill step={step} />
        <span aria-hidden="true" style={{ display: 'inline-block', width: 36 }} />
      </header>

      <div
        style={{
          padding: '20px 20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
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
          <p style={{ font: `400 15px/1.5 ${tokens.font.sans}`, color: tokens.color.text.sub, margin: 0 }}>
            {helper}
          </p>
        )}
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>{children}</div>

      {onContinue && (
        <div
          style={{
            padding: '12px 20px 20px',
            borderTop: `1px solid ${tokens.color.border}`,
            background: 'rgba(245,245,244,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {ctaCaption ? (
            <div
              style={{
                font: `500 10.5px/1.3 ${tokens.font.mono}`,
                color: tokens.color.text.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                textAlign: 'center',
              }}
            >
              {ctaCaption}
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                font: `500 10.5px/1.3 ${tokens.font.mono}`,
                color: tokens.color.text.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                flexWrap: 'wrap',
              }}
            >
              <span>{band.left}</span>
              <span aria-hidden="true" style={{ color: '#C9C5BD' }}>·</span>
              <span>{band.right}</span>
            </div>
          )}
          <button
            type="button"
            onClick={onContinue}
            disabled={ctaDisabled}
            style={{
              appearance: 'none',
              width: '100%',
              padding: '14px 18px',
              borderRadius: 999,
              border: 'none',
              background: ctaDisabled ? tokens.color.border : tokens.color.ink,
              color: ctaDisabled ? '#9A968E' : '#FFFFFF',
              font: `600 14px/1.2 ${tokens.font.sans}`,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: ctaDisabled ? 'not-allowed' : 'pointer',
              transition: 'background-color 240ms ease-out, color 240ms ease-out',
            }}
          >
            <span>{ctaLabel}</span>
            <Arrow dir="right" size={13} strokeWidth={2} />
          </button>
        </div>
      )}
    </main>
  );
}
