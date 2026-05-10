'use client';

import { ScreenShell } from '../components/ScreenShell';
import { RadioChips } from '../components/RadioChips';
import { SubQuestionCard } from '../components/SubQuestionCard';
import { useProto } from '../lib/proto-context';
import { getCopy } from '../lib/copy/o2';
import type { SituationAnswers } from '../lib/types';

export function O2() {
  const { answers, setAnswer, next, back, step } = useProto();
  const stage = answers.stage ?? 'considering';
  const copy = getCopy(stage);
  const situation = answers.situation ?? {};

  const update = (patch: Partial<SituationAnswers>) => {
    setAnswer('situation', { ...situation, ...patch });
  };

  const answered =
    (situation.relationship ? 1 : 0) +
    (situation.living ? 1 : 0) +
    (situation.hasChildren ? 1 : 0) +
    (situation.home ? 1 : 0);

  return (
    <ScreenShell
      step={step}
      eyebrow={copy.eyebrow}
      heading={copy.heading}
      ctaDisabled={answered < 4}
      ctaCaption={copy.ctaCaption(answered)}
      onContinue={next}
      onBack={back}
    >
      <SubQuestionCard label={copy.relationship.label}>
        <RadioChips
          name="relationship"
          options={copy.relationship.options}
          value={situation.relationship}
          onChange={(v) => update({ relationship: v })}
        />
      </SubQuestionCard>

      <SubQuestionCard label={copy.living.label}>
        <RadioChips
          name="living"
          options={copy.living.options}
          value={situation.living}
          onChange={(v) => update({ living: v })}
        />
      </SubQuestionCard>

      <SubQuestionCard label={copy.children.label}>
        <RadioChips
          name="hasChildren"
          options={[
            { value: 'no' as const, label: copy.children.noLabel },
            { value: 'yes' as const, label: copy.children.yesLabel },
          ]}
          value={situation.hasChildren}
          onChange={(v) => {
            if (v === 'no') update({ hasChildren: 'no', childrenCount: undefined });
            else update({ hasChildren: 'yes' });
          }}
        />
        {situation.hasChildren === 'yes' && (
          <div style={{ marginTop: 12 }}>
            <RadioChips
              name="childrenCount"
              options={copy.children.countOptions}
              value={situation.childrenCount}
              onChange={(v) => update({ childrenCount: v })}
            />
          </div>
        )}
      </SubQuestionCard>

      <SubQuestionCard label={copy.home.label}>
        <RadioChips
          name="home"
          options={copy.home.options}
          value={situation.home}
          onChange={(v) => update({ home: v })}
        />
      </SubQuestionCard>
    </ScreenShell>
  );
}

