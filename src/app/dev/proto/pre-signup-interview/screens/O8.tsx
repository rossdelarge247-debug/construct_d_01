'use client';

import { tokens } from '@/styles/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { useProto } from '../lib/proto-context';

export function O8() {
  const { back, step, goTo } = useProto();
  return (
    <ScreenShell
      step={step}
      eyebrow="O8 · What’s next"
      heading="What’s next"
      helper="If you’d like Decouple to walk you through your settlement — finances, children, housing, future needs — you can sign up below."
      ctaLabel="Start over"
      onContinue={() => goTo(1)}
      onBack={back}
    >
      <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 10, font: `400 15px/1.55 ${tokens.font.sans}`, color: tokens.color.ink }}>
        <li>Create your account — free, no card needed.</li>
        <li>Connect your bank — Decouple finds salary, mortgage, bills, savings automatically.</li>
        <li>Build the shared picture together — your partner connects too, when they’re ready.</li>
        <li>Talk through what feels fair — backed by evidence, not assertion.</li>
        <li>Generate the consent order — Decouple drafts it from your agreement.</li>
        <li>Submit to the court — we walk you through the form and the fee.</li>
      </ol>
    </ScreenShell>
  );
}
