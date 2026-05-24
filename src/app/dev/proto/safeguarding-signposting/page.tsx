'use client';

import { useState } from 'react';
import Link from 'next/link';
import { tokens } from '@/styles/tokens';
import { ExitThisPage } from './_components/ExitThisPage';

type Helpline = { name: string; contact: string; note?: string; type: 'tel' | 'url'; href?: string };

const HELPLINES: Helpline[] = [
  { name: "Women's Aid", contact: '0808 2000 247', note: '24/7', type: 'tel' },
  { name: 'National Domestic Abuse Helpline', contact: '0808 2000 247', note: '24/7', type: 'tel' },
  { name: "Men's Advice Line", contact: '0808 8010 327', type: 'tel' },
  { name: 'Refuge', contact: 'refuge.org.uk', href: 'https://www.refuge.org.uk', type: 'url' },
  { name: 'Surviving Economic Abuse', contact: 'survivingeconomicabuse.org', href: 'https://www.survivingeconomicabuse.org', type: 'url' },
  { name: 'Samaritans', contact: '116 123', note: '24/7', type: 'tel' },
];

const bodyStyle: React.CSSProperties = {
  margin: '0 0 16px',
  fontSize: tokens.type['14-5'],
  lineHeight: 1.6,
  color: tokens.color.text.sub,
};

const ctaBase: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '14px 20px',
  borderRadius: 10,
  fontSize: tokens.type['14-5'],
  fontWeight: 600,
  fontFamily: tokens.font.sans,
  textAlign: 'center',
  textDecoration: 'none',
  cursor: 'pointer',
  border: 'none',
};

export default function SafeguardingSignpostingPage() {
  const [showMore, setShowMore] = useState(false);

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
        <ExitThisPage />
      </header>

      <main style={{ maxWidth: 480, margin: '0 auto', padding: '24px 20px 40px' }}>
        <h1 style={{ margin: '0 0 20px', fontSize: tokens.type['21'], fontWeight: 600, color: tokens.color.ink, lineHeight: 1.25 }}>
          Before we go further — something important
        </h1>

        <p style={bodyStyle}>
          You told us there are safety concerns. We want to be honest about where we fit.
        </p>

        <p style={bodyStyle}>
          Decouple helps separating couples build a complete settlement — finances, children,
          housing, and the path through to a legal agreement. It&rsquo;s not a domestic abuse service.
          For what you might be facing right now, these services are built for exactly that:
        </p>

        <ul
          role="list"
          style={{ margin: '0 0 20px', padding: 0, listStyle: 'none' }}
        >
          {HELPLINES.map((h) => (
            <li
              key={h.name}
              style={{
                padding: '10px 0',
                borderBottom: `1px solid ${tokens.color.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: 8,
              }}
            >
              <span style={{ fontWeight: 600, color: tokens.color.ink, fontSize: tokens.type['14-5'] }}>
                {h.name}
              </span>
              <span style={{ fontSize: 13, color: tokens.color.text.sub, textAlign: 'right' }}>
                {h.type === 'tel' ? (
                  <a
                    href={`tel:${h.contact.replace(/\s/g, '')}`}
                    style={{ color: tokens.color.phase.build.accent, textDecoration: 'none' }}
                  >
                    {h.contact}
                  </a>
                ) : (
                  <a
                    href={h.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: tokens.color.phase.build.accent, textDecoration: 'none' }}
                  >
                    {h.contact}
                  </a>
                )}
                {h.note ? <span style={{ marginLeft: 6, color: tokens.color.text.muted }}>({h.note})</span> : null}
              </span>
            </li>
          ))}
        </ul>

        <p
          style={{
            margin: '0 0 24px',
            padding: '12px 16px',
            background: tokens.color.danger + '12',
            borderRadius: 8,
            fontSize: tokens.type['14-5'],
            fontWeight: 600,
            color: tokens.color.ink,
            textAlign: 'center',
          }}
        >
          If you&rsquo;re in immediate danger, call{' '}
          <a
            href="tel:999"
            style={{ color: tokens.color.danger, textDecoration: 'underline' }}
          >
            999
          </a>
          .
        </p>

        <p style={{ ...bodyStyle, marginBottom: 28 }}>
          Decouple can still help once you&rsquo;re safe — building your picture privately,
          preparing the financial side, planning how to move forward. Come back when the time
          is right.
        </p>

        <p style={{ ...bodyStyle, fontWeight: 600, color: tokens.color.ink, marginBottom: 16 }}>
          What would you like to do?
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link
            href="/dev/proto"
            style={{
              ...ctaBase,
              background: tokens.color.ink,
              color: '#fff',
            }}
          >
            Continue — I&rsquo;m safe to
          </Link>

          <a
            href="https://www.bbc.co.uk/news"
            style={{
              ...ctaBase,
              background: tokens.color.danger,
              color: '#fff',
            }}
          >
            Exit to a safe site now
          </a>

          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            aria-expanded={showMore}
            style={{
              ...ctaBase,
              background: 'transparent',
              color: tokens.color.text.sub,
              border: `1px solid ${tokens.color.border}`,
            }}
          >
            {showMore ? 'Hide support services' : 'Show me more support services'}
          </button>
        </div>

        {showMore && (
          <div
            role="region"
            aria-label="Additional support services"
            style={{ marginTop: 20, padding: '16px', background: tokens.color.surface.panel, borderRadius: 10 }}
          >
            <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600, color: tokens.color.ink }}>
              Additional resources
            </p>
            <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 13, lineHeight: 1.8, color: tokens.color.text.sub }}>
              <li>
                <a href="https://www.citizensadvice.org.uk" target="_blank" rel="noopener noreferrer" style={{ color: tokens.color.phase.build.accent }}>
                  Citizens Advice
                </a>{' '}— free legal and practical guidance
              </li>
              <li>
                <a href="https://www.gov.uk/guidance/domestic-abuse-how-to-get-help" target="_blank" rel="noopener noreferrer" style={{ color: tokens.color.phase.build.accent }}>
                  GOV.UK domestic abuse guidance
                </a>
              </li>
              <li>
                <a href="https://www.nspcc.org.uk" target="_blank" rel="noopener noreferrer" style={{ color: tokens.color.phase.build.accent }}>
                  NSPCC
                </a>{' '}— if children are at risk
              </li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
