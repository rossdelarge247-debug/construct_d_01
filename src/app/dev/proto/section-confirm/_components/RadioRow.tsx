'use client';

import { tokens } from '@/styles/tokens';
import { AI_PURPLE, AI_PURPLE_DEEP, AI_PURPLE_TINT, SparkGlyph } from './SparkGlyph';

export function RadioRow({
  checked,
  label,
  sub,
  recommended = false,
  onClick,
}: {
  checked: boolean;
  label: string;
  sub?: string;
  recommended?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onClick}
      style={{
        width: '100%',
        minHeight: 44,
        textAlign: 'left',
        padding: '11px 12px',
        borderRadius: 10,
        background: checked ? 'rgba(109,91,208,0.06)' : tokens.color.surface.panel,
        border: `1.5px solid ${checked ? AI_PURPLE : tokens.color.border}`,
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 999,
          border: `1.5px solid ${checked ? AI_PURPLE : '#CBD5E1'}`,
          background: tokens.color.surface.panel,
          flexShrink: 0,
          marginTop: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-hidden="true"
      >
        {checked ? (
          <span style={{ width: 9, height: 9, borderRadius: 999, background: AI_PURPLE, display: 'inline-block' }} />
        ) : null}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: tokens.color.ink }}>{label}</span>
          {recommended ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                padding: '1px 6px',
                borderRadius: 999,
                background: AI_PURPLE_TINT,
                color: AI_PURPLE_DEEP,
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <SparkGlyph size={9} color={AI_PURPLE_DEEP} /> AI suggests
            </span>
          ) : null}
        </div>
        {sub ? (
          <div style={{ fontSize: 11.5, color: tokens.color.text.sub, marginTop: 3, lineHeight: 1.4 }}>{sub}</div>
        ) : null}
      </div>
    </button>
  );
}
