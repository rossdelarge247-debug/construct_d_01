import { tokens } from '@/styles/tokens';
import { TOTAL_STEPS } from '../lib/types';

export function ProgressChip({ step }: { step: number }) {
  return (
    <div
      role="status"
      aria-label={`Step ${step} of ${TOTAL_STEPS}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 14px',
        borderRadius: 999,
        background: 'rgba(255, 255, 255, 0.7)',
        border: `1px solid ${tokens.color.border}`,
        font: `500 12px/1.2 ${tokens.font.sans}`,
        color: tokens.color.text.sub,
        letterSpacing: '0.04em',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 999, background: tokens.color.phase.build.accent }} />
      <span>Step {step} of {TOTAL_STEPS}</span>
    </div>
  );
}
