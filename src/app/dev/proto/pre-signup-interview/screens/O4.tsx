'use client';

import { ScreenShell } from '../components/ScreenShell';
import { RadioCard } from '../components/RadioCard';
import { useProto } from '../lib/proto-context';
import type { RelationshipDynamic } from '../lib/types';

const OPTIONS = [
  { value: 'collaborative' as const, label: 'We’re working through it together', helper: 'Not always easy, but we’re aligned on doing this fairly' },
  { value: 'difficult-but-managing' as const, label: 'It’s difficult but manageable', helper: 'Hard conversations, but we can have them' },
  { value: 'high-conflict' as const, label: 'We’re in conflict', helper: 'Trust is broken; conversations are tense' },
  { value: 'safety-concern' as const, label: 'I have safety concerns', helper: 'You can pause here — we’ll point you to specialist support if you need it' },
];

export function O4() {
  const { answers, setAnswer, next, back, step } = useProto();
  return (
    <ScreenShell
      step={step}
      heading="How would you describe the two of you right now?"
      helper="Honesty here shapes what Decouple shows you. You can change your answer any time."
      ctaDisabled={!answers.relationship}
      onContinue={next}
      onBack={back}
    >
      <RadioCard<RelationshipDynamic>
        name="relationship"
        options={OPTIONS}
        value={answers.relationship}
        onChange={(v) => setAnswer('relationship', v)}
      />
    </ScreenShell>
  );
}
