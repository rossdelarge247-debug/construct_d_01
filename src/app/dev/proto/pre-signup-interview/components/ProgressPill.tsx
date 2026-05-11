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
      aria-valuenow={Math.max(1, step)}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Step ${step} of ${total}`}
    >
      <span
        aria-hidden="true"
        style={{
          font: `500 9.5px/1.2 ${tokens.font.mono}`,
          color: tokens.color.text.muted,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
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
          data-testid="progress-pill-fill"
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
