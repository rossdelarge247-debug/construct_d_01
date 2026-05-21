'use client';

import Link from 'next/link';
import { tokens } from '@/styles/tokens';

const TIERS = [
  {
    name: 'Start',
    price: 'Free',
    cadence: 'to begin',
    bullets: [
      'Bank connect and disclosure picture build',
      'Invite your ex-partner',
      'Initial reconciliation walkthrough',
    ],
    cta: 'Get started',
    primary: false,
  },
  {
    name: 'Complete',
    price: 'From £800',
    cadence: 'per settlement',
    bullets: [
      'Everything in Start',
      'Full proposal modelling with AI reasonableness scoring',
      'Court-ready Consent Order + Form D81 generation',
      'Digital submission or solicitor hand-off',
    ],
    cta: 'See full pricing',
    primary: true,
  },
];

export default function PricingPage() {
  return (
    <main
      className="mx-auto max-w-4xl px-6 py-12"
      style={{
        color: tokens.color.ink,
        background: tokens.color.surface.page,
        minHeight: '100vh',
        fontFamily: tokens.font.sans,
      }}
    >
      <nav className="mb-8">
        <Link
          href="/dev/proto"
          style={{ color: tokens.color.text.sub, textDecoration: 'underline', fontSize: tokens.type['14-5'] }}
        >
          ← back to hub
        </Link>
      </nav>

      <header className="mb-12">
        <h1
          style={{
            fontFamily: tokens.font.serif,
            fontSize: tokens.type['40'],
            fontWeight: tokens.weight.semibold,
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          One settlement. Two paths.
        </h1>
        <p
          className="mt-3"
          style={{ fontSize: tokens.type['17'], color: tokens.color.text.sub, margin: '0.75rem 0 0' }}
        >
          A consumer-first alternative to the £14,561 solicitor-led journey.
        </p>
      </header>

      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
      >
        {TIERS.map((t) => (
          <article
            key={t.name}
            style={{
              border: `1px solid ${t.primary ? tokens.color.ink : tokens.color.border}`,
              background: tokens.color.surface.panel,
              borderRadius: tokens.radius.lg,
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h2
              style={{
                fontFamily: tokens.font.serif,
                fontSize: tokens.type['26'],
                fontWeight: tokens.weight.medium,
                margin: 0,
              }}
            >
              {t.name}
            </h2>
            <div style={{ margin: '1rem 0', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span
                style={{
                  fontFamily: tokens.font.serif,
                  fontSize: tokens.type['28'],
                  fontWeight: tokens.weight.semibold,
                }}
              >
                {t.price}
              </span>
              <span style={{ fontSize: tokens.type['14-5'], color: tokens.color.text.muted }}>{t.cadence}</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', flex: 1 }}>
              {t.bullets.map((b) => (
                <li
                  key={b}
                  style={{
                    fontSize: tokens.type['15-5'],
                    color: tokens.color.text.sub,
                    padding: '0.5rem 0',
                    borderBottom: `1px solid ${tokens.color.border}`,
                  }}
                >
                  {b}
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled
              style={{
                background: t.primary ? tokens.color.ink : 'transparent',
                color: t.primary ? tokens.color.surface.panel : tokens.color.ink,
                border: `1px solid ${tokens.color.ink}`,
                borderRadius: tokens.radius.md,
                padding: '0.75rem 1.25rem',
                fontSize: tokens.type['15-5'],
                fontFamily: tokens.font.sans,
                fontWeight: tokens.weight.medium,
                cursor: 'not-allowed',
                opacity: 0.6,
              }}
            >
              {t.cta}
            </button>
          </article>
        ))}
      </div>

      <footer
        style={{
          marginTop: '3rem',
          paddingTop: '1.5rem',
          borderTop: `1px solid ${tokens.color.border}`,
          fontSize: tokens.type['11'],
          color: tokens.color.text.muted,
        }}
      >
        Placeholder shell — pricing copy TBD. Content replaced via subsequent canvas-port slice.
      </footer>
    </main>
  );
}
