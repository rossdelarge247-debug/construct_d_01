'use client';

import { tokens } from '@/styles/tokens';
import { ProtoHeader } from '../../_components/ProtoHeader';

export function FormTop({ title, step, backHref = '/dev/proto/section-confirm' }: { title: string; step?: string; backHref?: string }) {
  return (
    <ProtoHeader
      backHref={backHref}
      backLabel={title}
      rightSlot={step ? (
        <span style={{ fontSize: 11, color: tokens.color.text.muted, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
          {step}
        </span>
      ) : undefined}
    />
  );
}
