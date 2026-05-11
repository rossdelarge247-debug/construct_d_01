'use client';

import { ScreenShell } from '../components/ScreenShell';
import { RadioCard } from '../components/RadioCard';
import { useProto } from '../lib/proto-context';
import { getCopy } from '../lib/copy/o4';
import type { EmploymentAnswers } from '../lib/types';

export function O4() {
  const { answers, setAnswer, next, back, step } = useProto();
  const stage = answers.stage ?? 'thinking';
  const copy = getCopy(stage);
  const emp = answers.employment ?? {};

  const update = (patch: Partial<EmploymentAnswers>) => {
    setAnswer('employment', { ...emp, ...patch });
  };

  return (
    <ScreenShell
      step={step}
      eyebrow={copy.eyebrow}
      heading={copy.heading}
      ctaDisabled={!emp.selfEmployment}
      onContinue={next}
      onBack={back}
    >
      <RadioCard
        name="selfEmployment"
        options={copy.options}
        value={emp.selfEmployment}
        onChange={(v) => update({ selfEmployment: v })}
      />
    </ScreenShell>
  );
}
