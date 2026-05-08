'use client';

import { ScreenShell } from '../components/ScreenShell';
import { RadioCard } from '../components/RadioCard';
import { useProto } from '../lib/proto-context';
import type { LivingArrangement } from '../lib/types';

const OPTIONS = [
  { value: 'together' as const, label: 'We still live together', helper: 'Same home, same address' },
  { value: 'separated' as const, label: 'We live apart', helper: 'Different homes already' },
  { value: 'undecided' as const, label: 'It’s in flux', helper: 'Some nights here, some there — or about to change' },
];

export function O2() {
  const { answers, setAnswer, next, back, step } = useProto();
  return (
    <ScreenShell
      step={step}
      heading="Where are the two of you living right now?"
      ctaDisabled={!answers.livingArrangement}
      onContinue={next}
      onBack={back}
    >
      <RadioCard<LivingArrangement>
        name="livingArrangement"
        options={OPTIONS}
        value={answers.livingArrangement}
        onChange={(v) => setAnswer('livingArrangement', v)}
      />
    </ScreenShell>
  );
}
