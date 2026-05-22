'use client';

import Link from 'next/link';
import { tokens } from '@/styles/tokens';

export default function SignUpPage() {
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
          ← Back to registry
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
          Sign up
        </h1>
      </header>

      <section>
        <p style={{ fontSize: tokens.type['16'], lineHeight: 1.55, color: tokens.color.text.sub }}>
          Sign-up canvas pending — registry row §2 <code>sign-up</code> is{' '}
          <code>canvas-drafted</code> at <code>docs/design-source/mobile-screens-v2/</code>. This
          shell is the journey-target placeholder until the canvas is ported.
        </p>
      </section>
    </main>
  );
}
