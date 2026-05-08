'use client';

import { ScreenShell } from '../components/ScreenShell';
import { RadioCard } from '../components/RadioCard';
import { useProto } from '../lib/proto-context';
import type { Employment } from '../lib/types';

const OPTIONS = [
  { value: 'employed' as const, label: 'Employed', helper: 'Salary or wages from a single employer' },
  { value: 'self-employed' as const, label: 'Self-employed', helper: 'Sole trader, partner, or running your own company' },
  { value: 'mixed' as const, label: 'A mix of both', helper: 'Some payroll, some self-employment income' },
  { value: 'not-working' as const, label: 'Not currently working', helper: 'Between roles, retired, or caring full-time' },
];

export function O5() {
  const { answers, setAnswer, next, back, step } = useProto();
  return (
    <ScreenShell
      step={step}
      heading="What’s your working situation?"
      helper="No income amounts yet — just the shape. We’ll use bank data later to do the heavy lifting."
      ctaDisabled={!answers.employment}
      onContinue={next}
      onBack={back}
    >
      <RadioCard<Employment>
        name="employment"
        options={OPTIONS}
        value={answers.employment}
        onChange={(v) => setAnswer('employment', v)}
      />
    </ScreenShell>
  );
}
