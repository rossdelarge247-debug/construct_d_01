'use client';

import { ScreenShell } from '../components/ScreenShell';
import { useProto } from '../lib/proto-context';
import { getCopy } from '../lib/copy/o5';
import { tokens } from '@/styles/tokens';
import type { PartnerFinancesAnswers, PartnerAwareness } from '../lib/types';

export function O5() {
  const { answers, setAnswer, next, back, step } = useProto();
  const stage = answers.stage ?? 'considering';
  const copy = getCopy(stage);
  const pf = answers.partnerFinances ?? {};

  const update = (patch: Partial<PartnerFinancesAnswers>) => {
    setAnswer('partnerFinances', { ...pf, ...patch });
  };

  return (
    <ScreenShell
      step={step}
      eyebrow={copy.eyebrow}
      heading={copy.heading}
      ctaDisabled={!pf.awareness}
      onContinue={next}
      onBack={back}
    >
      <fieldset
        style={{
          border: `1px solid ${tokens.color.border}`,
          borderRadius: 14,
          background: tokens.color.surface.panel,
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <legend style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}>
          How much do you know about your partner&rsquo;s finances?
        </legend>
        {copy.options.map((opt, i) => (
          <TallRow
            key={opt.value}
            id={`awareness-${opt.value}`}
            isFirst={i === 0}
            selected={pf.awareness === opt.value}
            label={opt.label}
            value={opt.value}
            onSelect={(v) => update({ awareness: v })}
          />
        ))}
      </fieldset>
    </ScreenShell>
  );
}

interface TallRowProps {
  id: string;
  isFirst: boolean;
  selected: boolean;
  label: string;
  value: PartnerAwareness;
  onSelect: (v: PartnerAwareness) => void;
}

function TallRow({ id, isFirst, selected, label, value, onSelect }: TallRowProps) {
  return (
    <label
      htmlFor={id}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 18px',
        borderTop: isFirst ? 'none' : `1px solid ${tokens.color.border}`,
        background: selected ? tokens.color.ink : 'transparent',
        color: selected ? tokens.color.surface.panel : tokens.color.ink,
        cursor: 'pointer',
        font: `500 15px/1.4 ${tokens.font.sans}`,
        transition: 'background-color 120ms ease, color 120ms ease',
      }}
    >
      <input
        type="radio"
        id={id}
        name="awareness"
        value={value}
        checked={selected}
        onChange={() => onSelect(value)}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
      />
      {label}
    </label>
  );
}
