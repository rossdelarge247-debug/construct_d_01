'use client';

import { ScreenShell } from '../components/ScreenShell';
import { RadioCard } from '../components/RadioCard';
import { useProto } from '../lib/proto-context';
import type { PartnerFinanceKnowledge } from '../lib/types';

const OPTIONS = [
  { value: 'open-book' as const, label: 'I have a clear picture', helper: 'We share accounts, talk about money, nothing is hidden' },
  { value: 'mostly-known' as const, label: 'I know most of it', helper: 'Big things yes, small things less so' },
  { value: 'partially-known' as const, label: 'Some of it', helper: 'I know what they earn, not where it goes' },
  { value: 'unknown' as const, label: 'Honestly, very little', helper: 'Money has been their domain — I don’t have full visibility' },
];

export function O6() {
  const { answers, setAnswer, next, back, step } = useProto();
  return (
    <ScreenShell
      step={step}
      heading="How much do you know about your partner’s finances?"
      helper="There’s no right answer. Many people don’t — and Decouple is designed for exactly that."
      ctaDisabled={!answers.partnerFinance}
      onContinue={next}
      onBack={back}
    >
      <RadioCard<PartnerFinanceKnowledge>
        name="partnerFinance"
        options={OPTIONS}
        value={answers.partnerFinance}
        onChange={(v) => setAnswer('partnerFinance', v)}
      />
    </ScreenShell>
  );
}
