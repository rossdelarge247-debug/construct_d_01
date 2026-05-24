'use client';

import { useState } from 'react';
import { tokens } from '@/styles/tokens';
import { ProtoHeader } from '../_components/ProtoHeader';
import { JoinedAvatarsHero } from './_components/JoinedAvatarsHero';
import { MarkStatusCard } from './_components/MarkStatusCard';
import { ShareModal } from './_components/ShareModal';

export default function ShareFlowPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <ProtoHeader backHref="/dev/proto" backLabel="Reconcile" />

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
