import type { Confidence } from '../registry-schema';

const META: Record<Confidence, { emoji: string; label: string }> = {
  high: { emoji: '🔥', label: 'high' },
  medium: { emoji: '🟡', label: 'medium' },
  low: { emoji: '❓', label: 'low' },
  'low-blocked': { emoji: '⚠️', label: 'low (blocked)' },
};

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const { emoji, label } = META[confidence];
  return (
    <span
      aria-label={`Confidence: ${label}`}
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
      style={{
        background: 'var(--ds-color-surface-canvas)',
        color: 'var(--ds-color-text-sub)',
        fontSize: 'var(--ds-type-11)',
        border: '1px solid var(--ds-color-border)',
      }}
    >
      <span aria-hidden>{emoji}</span>
      <span>{label}</span>
    </span>
  );
}
