'use client';

import { tokens } from '@/styles/tokens';
import { TOTAL_STEPS } from '../lib/types';

interface Props {
  step: number;
  total?: number;
}

export function ProgressPill({ step, total = TOTAL_STEPS }: Props) {
  const fillWidth = total > 0 ? Math.max(0, Math.min(100, (step / total) * 100)) : 0;
  return (
    <div
      style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Step ${step} of ${total}`}
    >
      <span style={{ font: `500 9.5px/1.2 ${tokens.font.sans}`, color: tokens.color.text.muted }}>
        Step {step} / {total}
      </span>
      <span
        style={{
          position: 'relative',
          display: 'inline-block',
          width: 96,
          height: 3,
          borderRadius: 999,
          overflow: 'hidden',
          background: tokens.color.border,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: `${fillWidth}%`,
            background: tokens.color.ink,
            borderRadius: 999,
          }}
        />
      </span>
    </div>
  );
}
