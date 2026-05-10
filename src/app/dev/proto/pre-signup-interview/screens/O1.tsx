'use client';

import { ScreenShell } from '../components/ScreenShell';
import { RadioCard } from '../components/RadioCard';
import { useProto } from '../lib/proto-context';
import { getCopy } from '../lib/copy/o1';
import type { Stage } from '../lib/types';

const OPTIONS = [
  { value: 'considering' as const, label: 'I’m considering it', helper: 'Thinking it through, not decided yet' },
  { value: 'starting' as const, label: 'We’ve decided to separate', helper: 'It’s settled but the work is ahead' },
  { value: 'in-process' as const, label: 'I’m already in the process', helper: 'Solicitor, papers, court — already underway' },
];

export function O1() {
  const { answers, setAnswer, next, back, step } = useProto();
  const stage = answers.stage ?? 'considering';
  const copy = getCopy(stage);
  return (
    <ScreenShell
      step={step}
      eyebrow={copy.eyebrow}
      heading={copy.heading}
      helper={copy.helper}
      ctaDisabled={!answers.stage}
      onContinue={next}
      onBack={back}
    >
      <RadioCard<Stage>
        name="stage"
        options={OPTIONS}
        value={answers.stage}
        onChange={(v) => setAnswer('stage', v)}
      />
    </ScreenShell>
  );
}
