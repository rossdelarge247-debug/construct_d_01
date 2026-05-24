'use client';

import { useState } from 'react';
import Link from 'next/link';
import { tokens } from '@/styles/tokens';
import { JoinedAvatarsHero } from './_components/JoinedAvatarsHero';
import { MarkStatusCard } from './_components/MarkStatusCard';
import { ShareModal } from './_components/ShareModal';

export default function ShareFlowPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ minHeight: '100dvh', background: tokens.color.surface.page, fontFamily: tokens.font.sans }}>
      <header
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
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
        <h1 style={{ margin: 0, fontSize: tokens.type['17'], fontWeight: 600, color: tokens.color.ink }}>
          Reconcile
        </h1>
      </header>

      <main style={{ maxWidth: 480, margin: '0 auto', padding: '0 20px 40px' }}>
        <p
          style={{
            margin: '20px 0 0',
            fontFamily: tokens.font.sans,
            fontSize: tokens.type['14-5'],
            color: tokens.color.text.sub,
            textAlign: 'center',
          }}
        >
          This is your private view. You choose what to share.
        </p>

        <JoinedAvatarsHero />

        <h2
          style={{
            margin: '0 0 8px',
            fontSize: tokens.type['21'],
            fontWeight: 600,
            color: tokens.color.ink,
            textAlign: 'center',
          }}
        >
          Share your picture with Mark to begin.
        </h2>

        <p
          style={{
            margin: '0 0 24px',
            fontSize: tokens.type['14-5'],
            lineHeight: 1.5,
            color: tokens.color.text.sub,
            textAlign: 'center',
          }}
        >
          Reconciliation opens as soon as Mark shares his picture. Until then, you can keep
          refining yours — nothing is locked, nothing is sent to him.
        </p>

        <MarkStatusCard onShareClick={() => setModalOpen(true)} />

        <p
          data-testid="soft-reminder"
          style={{
            margin: '16px 0 0',
            fontSize: 13,
            color: tokens.color.text.muted,
            textAlign: 'center',
          }}
        >
          You&rsquo;ll get a notification when Mark shares.
        </p>
      </main>

      <ShareModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
