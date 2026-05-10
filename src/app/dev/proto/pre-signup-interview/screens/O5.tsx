'use client';

import { ScreenShell } from '../components/ScreenShell';
import { useProto } from '../lib/proto-context';
import { tokens } from '@/styles/tokens';

export function O5() {
  const { next, back, step } = useProto();
  return (
    <ScreenShell
      step={step}
      eyebrow="O5 · Partner finances"
      heading="Coming up"
      onContinue={next}
      onBack={back}
    >
      <p style={{ font: `400 14px/1.5 ${tokens.font.sans}`, color: tokens.color.text.sub }}>
        Reconstruction lands next turn.
      </p>
    </ScreenShell>
  );
}
