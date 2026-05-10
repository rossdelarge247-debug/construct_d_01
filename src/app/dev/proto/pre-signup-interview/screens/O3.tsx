'use client';

import { ScreenShell } from '../components/ScreenShell';
import { RadioCard } from '../components/RadioCard';
import { RadioChips } from '../components/RadioChips';
import { useProto } from '../lib/proto-context';
import { getCopy } from '../lib/copy/o3';
import { tokens } from '@/styles/tokens';
import type { ExAndSafetyAnswers } from '../lib/types';

export function O3() {
  const { answers, setAnswer, next, back, step } = useProto();
  const stage = answers.stage ?? 'considering';
  const copy = getCopy(stage);
  const exAndSafety = answers.exAndSafety ?? {};

  const update = (patch: Partial<ExAndSafetyAnswers>) => {
    setAnswer('exAndSafety', { ...exAndSafety, ...patch });
  };

  return (
    <ScreenShell
      step={step}
      eyebrow={copy.eyebrow}
      heading={copy.heading}
      ctaDisabled={!exAndSafety.relationshipQuality}
      onContinue={next}
      onBack={back}
    >
      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div
          style={{
            font: `600 13px/1.3 ${tokens.font.sans}`,
            color: tokens.color.text.sub,
          }}
        >
          {copy.relationship.label}
        </div>
        <RadioCard
          name="relationshipQuality"
          options={copy.relationship.options}
          value={exAndSafety.relationshipQuality}
          onChange={(v) => update({ relationshipQuality: v })}
        />
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p
          style={{
            font: `400 14px/1.5 ${tokens.font.sans}`,
            color: tokens.color.text.sub,
            margin: 0,
          }}
        >
          {copy.privacy.preamble}
        </p>
        <div
          style={{
            font: `600 13px/1.3 ${tokens.font.sans}`,
            color: tokens.color.text.sub,
          }}
        >
          {copy.privacy.label}
        </div>
        <RadioChips
          name="devicePrivate"
          options={copy.privacy.options}
          value={exAndSafety.devicePrivate}
          onChange={(v) => update({ devicePrivate: v })}
        />
      </section>
    </ScreenShell>
  );
}
