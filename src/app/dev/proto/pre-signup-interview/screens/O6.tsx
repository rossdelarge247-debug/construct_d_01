'use client';

import { ScreenShell } from '../components/ScreenShell';
import { CheckChips } from '../components/CheckChips';
import { SubQuestionCard } from '../components/SubQuestionCard';
import { useProto } from '../lib/proto-context';
import { getCopy } from '../lib/copy/o6';
import { tokens } from '@/styles/tokens';
import type { WhatMattersAnswers } from '../lib/types';

const CAP = 3;

export function O6() {
  const { answers, setAnswer, next, back, step } = useProto();
  const stage = answers.stage ?? 'thinking';
  const copy = getCopy(stage);
  const whatMatters = answers.whatMatters ?? {};
  const priorities = whatMatters.priorities ?? [];
  const worries = whatMatters.worries ?? [];

  const update = (patch: Partial<WhatMattersAnswers>) => {
    setAnswer('whatMatters', { ...whatMatters, ...patch });
  };

  return (
    <ScreenShell
      step={step}
      eyebrow={copy.eyebrow}
      heading={copy.heading}
      ctaLabel={copy.ctaLabel(priorities.length, worries.length)}
      onContinue={next}
      onBack={back}
    >
      <p style={{ font: `400 14px/1.5 ${tokens.font.sans}`, color: tokens.color.text.sub, margin: 0 }}>
        {copy.hint}
      </p>

      <SubQuestionCard label={copy.priorities.label} caption={`Pick up to ${CAP} (${priorities.length}/${CAP})`}>
        <CheckChips
          name="priorities"
          options={copy.priorities.options}
          values={priorities}
          cap={CAP}
          onChange={(vals) => update({ priorities: vals })}
        />
      </SubQuestionCard>

      <SubQuestionCard label={copy.worries.label} caption={`Pick up to ${CAP} (${worries.length}/${CAP})`}>
        <CheckChips
          name="worries"
          options={copy.worries.options}
          values={worries}
          cap={CAP}
          onChange={(vals) => update({ worries: vals })}
        />
      </SubQuestionCard>
    </ScreenShell>
  );
}

