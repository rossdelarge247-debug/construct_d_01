'use client';

import { tokens } from '@/styles/tokens';

interface Props {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function PrimaryCTA({ label, onClick, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        appearance: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '14px 20px',
        borderRadius: 999,
        border: 'none',
        background: disabled ? tokens.color.text.muted : tokens.color.ink,
        color: tokens.color.surface.panel,
        font: `600 16px/1.2 ${tokens.font.sans}`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 120ms ease',
      }}
    >
      {label}
    </button>
  );
}
