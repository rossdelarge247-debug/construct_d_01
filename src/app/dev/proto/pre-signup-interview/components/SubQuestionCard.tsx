'use client';

import type { ReactNode } from 'react';
import { tokens } from '@/styles/tokens';

interface Props {
  label: string;
  caption?: string;
  children: ReactNode;
}

export function SubQuestionCard({ label, caption, children }: Props) {
  return (
    <div
      style={{
        background: tokens.color.surface.panel,
        border: `1px solid ${tokens.color.border}`,
        borderRadius: 14,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: caption ? 12 : 10,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <div style={{ font: `600 14px/1.2 ${tokens.font.serif}`, color: tokens.color.ink }}>
          {label}
        </div>
        {caption && (
          <div style={{ font: `500 11px/1.3 ${tokens.font.mono}`, color: tokens.color.text.muted }}>
            {caption}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
