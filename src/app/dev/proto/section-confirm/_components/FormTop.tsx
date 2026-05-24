'use client';

import Link from 'next/link';
import { tokens } from '@/styles/tokens';
import { BackArrow } from './BackArrow';

export function FormTop({ title, step, backHref = '/dev/proto/section-confirm' }: { title: string; step?: string; backHref?: string }) {
  return (
    <div
      style={{
        height: 52,
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${tokens.color.border}`,
        background: tokens.color.surface.panel,
        color: tokens.color.ink,
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <Link
          href={backHref}
          aria-label="Back"
          style={{ display: 'inline-flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}
        >
          <BackArrow />
        </Link>
        <span style={{ fontSize: 14, fontWeight: 600 }}>{title}</span>
      </div>
      {step ? (
        <span
          style={{
            fontSize: 11,
            color: tokens.color.text.muted,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          {step}
        </span>
      ) : null}
    </div>
  );
}
