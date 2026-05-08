'use client';

import { ScreenShell } from '../components/ScreenShell';
import { RadioCard } from '../components/RadioCard';
import { useProto } from '../lib/proto-context';
import type { ChildrenStatus } from '../lib/types';

const OPTIONS = [
  { value: 'none' as const, label: 'No children', helper: 'Between the two of you' },
  { value: 'have-with-partner' as const, label: 'We have children together', helper: 'Whether they live with you or your partner' },
  { value: 'have-from-prior' as const, label: 'Children from a prior relationship', helper: 'Yours, theirs, or both — but not shared' },
];

export function O3() {
  const { answers, setAnswer, next, back, step } = useProto();
  return (
    <ScreenShell
      step={step}
      heading="Are there children involved?"
      helper="If there are, the picture has more layers — but Decouple is built to handle them."
      ctaDisabled={!answers.children}
      onContinue={next}
      onBack={back}
    >
      <RadioCard<ChildrenStatus>
        name="children"
        options={OPTIONS}
        value={answers.children}
        onChange={(v) => setAnswer('children', v)}
      />
    </ScreenShell>
  );
}
