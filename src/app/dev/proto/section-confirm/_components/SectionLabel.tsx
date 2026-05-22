'use client';

import type { ReactNode } from 'react';
import { tokens } from '@/styles/tokens';

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: 9.5,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        fontWeight: 700,
        color: tokens.color.text.muted,
      }}
    >
      {children}
    </div>
  );
}
