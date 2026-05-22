'use client';

import Link from 'next/link';
import { tokens } from '@/styles/tokens';

const DEMOS = [
  {
    href: '/dev/proto/section-confirm/categorise',
    title: 'Categorise',
    sub: 'Categorise a transaction (joint life insurance? salary? household?)',
  },
  {
    href: '/dev/proto/section-confirm/confirm-recurring',
    title: 'Confirm recurring',
    sub: 'Confirm a recurring payment as a fixed expense',
  },
] as const;

export default function SectionConfirmHubPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: tokens.color.surface.page,
        fontFamily: tokens.font.sans,
        color: tokens.color.ink,
        padding: '32px 20px 64px',
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Link
          href="/dev/proto"
          style={{
            display: 'inline-block',
            fontSize: 12,
            color: tokens.color.text.sub,
            textDecoration: 'none',
            marginBottom: 16,
          }}
        >
          ← Back to registry
        </Link>
        <h1
          style={{
            fontFamily: tokens.font.serif,
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: '-0.015em',
            margin: 0,
          }}
        >
          Per-section confirmation
        </h1>
        <p
          style={{
            fontSize: 14,
            color: tokens.color.text.sub,
            marginTop: 8,
            lineHeight: 1.55,
            maxWidth: 560,
          }}
        >
          Build-phase confirm-or-correct pattern. Each form surfaces when the AI has inferred something from
          bank-signal that needs the user to verify or amend. Two of six forms ported in this prototype slice
          (Categorise · Confirm recurring); the remaining four are follow-up slices.
        </p>

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            marginTop: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {DEMOS.map((d) => (
            <li key={d.href}>
              <Link
                href={d.href}
                style={{
                  display: 'block',
                  background: tokens.color.surface.panel,
                  border: `1px solid ${tokens.color.border}`,
                  borderRadius: 12,
                  padding: '16px 18px',
                  textDecoration: 'none',
                  color: tokens.color.ink,
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 600 }}>{d.title}</div>
                <div style={{ fontSize: 13, color: tokens.color.text.sub, marginTop: 4 }}>{d.sub}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
