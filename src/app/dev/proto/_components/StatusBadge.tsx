import type { Status } from '../registry-schema';

const META: Record<Status, { emoji: string; label: string }> = {
  'not-started': { emoji: '🔴', label: 'not started' },
  'spec-only': { emoji: '🟠', label: 'spec only' },
  'canvas-drafted': { emoji: '🟡', label: 'canvas drafted' },
  'prototype-built': { emoji: '🟢', label: 'prototype built' },
  shipped: { emoji: '✅', label: 'shipped' },
};

export function StatusBadge({ status }: { status: Status }) {
  const { emoji, label } = META[status];
  return (
    <span
      aria-label={`Status: ${label}`}
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
