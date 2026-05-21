'use client';

import Link from 'next/link';
import { tokens } from '@/styles/tokens';

const STEPS = [
  {
    n: '01',
    kicker: 'Disclose',
    title: 'Prepare your disclosure',
    body: 'Connect your accounts once. Decouple reads twelve months of history, classifies every transaction, and assembles your financial picture in the background.',
  },
  {
    n: '02',
    kicker: 'Reconcile',
    title: 'Share your position',
    body: 'Invite your ex-partner to build their picture alongside yours. Decouple reconciles the two and walks you through each difference in plain language.',
  },
  {
    n: '03',
    kicker: 'Settle',
    title: 'Build the proposal',
    body: 'Model splits in real time. Every proposal is scored for reasonableness against case precedent; every clause has plain-English translation and legal provenance.',
  },
  {
    n: '04',
    kicker: 'Finalise',
    title: 'Generate the agreement',
    body: 'Once aligned, Decouple drafts your Consent Order, Form D81, and supporting disclosure bundle. Share with a solicitor for final review, or submit digitally.',
  },
];

export default function HowItWorksPage() {
  return (
    <main
      className="mx-auto max-w-3xl px-6 py-12"
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
          How it works
        </h1>
        <p
          className="mt-3"
          style={{ fontSize: tokens.type['17'], color: tokens.color.text.sub, margin: '0.75rem 0 0' }}
        >
          Decouple — the complete picture, end-to-end.
        </p>
      </header>

      <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {STEPS.map((s) => (
          <li
            key={s.n}
            style={{
              borderTop: `1px solid ${tokens.color.border}`,
              padding: '2rem 0',
            }}
          >
            <div className="flex items-baseline gap-6">
              <span
                style={{
                  fontFamily: tokens.font.mono,
                  fontSize: tokens.type['14-5'],
                  color: tokens.color.text.muted,
                  letterSpacing: tokens.letterSpacing.wide,
                }}
              >
                {s.n}
              </span>
              <div style={{ flex: 1 }}>
                <h2
                  style={{
                    fontFamily: tokens.font.serif,
                    fontSize: tokens.type['26'],
                    fontWeight: tokens.weight.medium,
                    margin: 0,
                  }}
                >
                  {s.title}
                  <span style={{ color: tokens.color.text.muted, fontStyle: 'italic', fontWeight: tokens.weight.regular }}>
                    {' · '}
                    {s.kicker}
                  </span>
                </h2>
                <p
                  style={{
                    fontSize: tokens.type['16'],
                    color: tokens.color.text.sub,
                    margin: '0.5rem 0 0',
                    lineHeight: 1.5,
                  }}
                >
                  {s.body}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <footer
        style={{
          marginTop: '3rem',
          paddingTop: '1.5rem',
          borderTop: `1px solid ${tokens.color.border}`,
          fontSize: tokens.type['11'],
          color: tokens.color.text.muted,
        }}
      >
        Placeholder shell — content to be replaced via subsequent canvas-port slice.
      </footer>
    </main>
  );
}
