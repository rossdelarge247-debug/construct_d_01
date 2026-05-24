'use client';

import { useState } from 'react';
import Link from 'next/link';
import { tokens } from '@/styles/tokens';
import { ExitThisPage } from '../safeguarding-signposting/_components/ExitThisPage';

const SCENARIO_BULLETS = [
  'Separating, 2 children',
  'Own with a mortgage',
  "You're employed, your ex is self-employed",
  'You know some things about their finances',
];

export default function Moment1AckPage() {
  const [safetyFlag, setSafetyFlag] = useState(false);

  return (
    <div style={{ minHeight: '100dvh', background: tokens.color.surface.page, fontFamily: tokens.font.sans }}>
      <header
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${tokens.color.border}`,
          background: tokens.color.surface.panel,
        }}
      >
        <Link
          href="/dev/proto"
          aria-label="Back"
          style={{ color: tokens.color.ink, textDecoration: 'none', fontSize: 20 }}
        >
          &larr;
        </Link>
        {safetyFlag && <ExitThisPage />}
      </header>

      <main style={{ maxWidth: 480, margin: '0 auto', padding: '32px 20px 40px' }}>
        <h1 style={{ margin: '0 0 24px', fontSize: tokens.type['21'], fontWeight: 600, color: tokens.color.ink, lineHeight: 1.3 }}>
          Based on what you told us:
        </h1>

        <ul
          role="list"
          aria-label="Your situation"
          style={{ margin: '0 0 28px', padding: 0, listStyle: 'none' }}
        >
          {SCENARIO_BULLETS.map((bullet) => (
            <li
              key={bullet}
              style={{
                padding: '10px 0',
                borderBottom: `1px solid ${tokens.color.border}`,
                fontSize: tokens.type['14-5'],
                color: tokens.color.ink,
                display: 'flex',
                alignItems: 'baseline',
                gap: 10,
              }}
            >
              <span style={{ color: tokens.color.phase.build.accent, fontSize: 18, lineHeight: 1 }}>&bull;</span>
              {bullet}
            </li>
          ))}
        </ul>

        {safetyFlag && (
          <div
            style={{
              margin: '0 0 24px',
              padding: '16px',
              background: '#F5F3FF',
              borderRadius: 10,
              borderLeft: `3px solid ${tokens.color.accent.violet}`,
            }}
          >
            <p style={{ margin: '0 0 8px', fontSize: tokens.type['14-5'], fontWeight: 600, color: tokens.color.ink }}>
              Setting up your account safely first&hellip;
            </p>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: tokens.color.text.sub }}>
              We&rsquo;ll enable the quick-exit feature and keep your browser tab title neutral.
              You can also set up discreet mode to hide Decouple from your device.
            </p>
          </div>
        )}

        <p style={{ margin: '0 0 32px', fontSize: tokens.type['14-5'], lineHeight: 1.6, color: tokens.color.text.sub }}>
          Let&rsquo;s go deeper so we can build your picture accurately.
        </p>

        <Link
          href="/dev/proto/moment-2-profiling"
          style={{
            display: 'block',
            width: '100%',
            padding: '14px 20px',
            background: tokens.color.ink,
            color: '#fff',
            borderRadius: 10,
            fontSize: tokens.type['14-5'],
            fontWeight: 600,
            fontFamily: tokens.font.sans,
            textAlign: 'center',
            textDecoration: 'none',
          }}
        >
          Continue
        </Link>

        <div
          style={{
            marginTop: 40,
            padding: '12px 16px',
            background: tokens.color.surface.panel,
            borderRadius: 8,
            border: `1px dashed ${tokens.color.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 12, color: tokens.color.text.muted, fontFamily: tokens.font.mono }}>
            Dev: safety flags
          </span>
          <button
            type="button"
            role="switch"
            aria-label="Safety flags"
            aria-checked={safetyFlag}
            onClick={() => setSafetyFlag(!safetyFlag)}
            style={{
              width: 44,
              height: 24,
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              background: safetyFlag ? tokens.color.accent.violet : tokens.color.border,
              position: 'relative',
              transition: 'background 150ms ease',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 2,
                left: safetyFlag ? 22 : 2,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 150ms ease',
              }}
            />
          </button>
        </div>
      </main>
    </div>
  );
}
