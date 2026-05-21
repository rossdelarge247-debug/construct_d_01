'use client';

import Link from 'next/link';
import { tokens } from '@/styles/tokens';

const FAQS = [
  { q: 'Is my financial data safe?', a: 'Placeholder — bank-grade encryption + read-only access summary will go here.' },
  { q: 'What if we disagree on something?', a: 'Placeholder — reconciliation walkthrough + mediation handover explanation will go here.' },
  { q: 'Is Decouple legally binding?', a: 'Placeholder — Consent Order generation + court submission flow explanation will go here.' },
];

const TRUST_SIGNALS = [
  { label: 'Read-only bank access', body: 'Placeholder — Tink-based connect, no payment-initiation, no credentials stored.' },
  { label: 'Solicitor-reviewable', body: 'Placeholder — output bundles are court-ready and can be signed off by a solicitor before submission.' },
  { label: 'UK-jurisdiction first', body: 'Placeholder — Form D81 + Consent Order built for England & Wales family courts.' },
];

export default function FaqTrustPage() {
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
          Questions answered.
        </h1>
        <p
          className="mt-3"
          style={{ fontSize: tokens.type['17'], color: tokens.color.text.sub, margin: '0.75rem 0 0' }}
        >
          Trust through transparency.
        </p>
      </header>

      <section aria-labelledby="faq-heading" className="mb-12">
        <h2
          id="faq-heading"
          style={{
            fontFamily: tokens.font.serif,
            fontSize: tokens.type['21'],
            fontWeight: tokens.weight.medium,
            margin: '0 0 1rem',
          }}
        >
          Frequently asked
        </h2>
        <dl style={{ margin: 0 }}>
          {FAQS.map((f) => (
            <div
              key={f.q}
              style={{
                borderTop: `1px solid ${tokens.color.border}`,
                padding: '1.25rem 0',
              }}
            >
              <dt
                style={{
                  fontSize: tokens.type['17'],
                  fontWeight: tokens.weight.medium,
                  margin: 0,
                }}
              >
                {f.q}
              </dt>
              <dd
                style={{
                  fontSize: tokens.type['15-5'],
                  color: tokens.color.text.sub,
                  margin: '0.5rem 0 0',
                  lineHeight: 1.5,
                }}
              >
                {f.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="trust-heading">
        <h2
          id="trust-heading"
          style={{
            fontFamily: tokens.font.serif,
            fontSize: tokens.type['21'],
            fontWeight: tokens.weight.medium,
            margin: '0 0 1rem',
          }}
        >
          Trust signals
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {TRUST_SIGNALS.map((t) => (
            <li
              key={t.label}
              style={{
                borderTop: `1px solid ${tokens.color.border}`,
                padding: '1.25rem 0',
              }}
            >
              <div
                style={{
                  fontFamily: tokens.font.mono,
                  fontSize: tokens.type['11'],
                  color: tokens.color.text.muted,
                  letterSpacing: tokens.letterSpacing.wide,
                  textTransform: 'uppercase',
                }}
              >
                {t.label}
              </div>
              <p
                style={{
                  fontSize: tokens.type['15-5'],
                  color: tokens.color.text.sub,
                  margin: '0.5rem 0 0',
                  lineHeight: 1.5,
                }}
              >
                {t.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <footer
        style={{
          marginTop: '3rem',
          paddingTop: '1.5rem',
          borderTop: `1px solid ${tokens.color.border}`,
          fontSize: tokens.type['11'],
          color: tokens.color.text.muted,
        }}
      >
        Placeholder shell — FAQ copy + trust-signal sources TBD. Content replaced via subsequent canvas-port slice.
      </footer>
    </main>
  );
}
