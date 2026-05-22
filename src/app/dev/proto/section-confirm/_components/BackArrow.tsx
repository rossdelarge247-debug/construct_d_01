'use client';

import { tokens } from '@/styles/tokens';

export function BackArrow({ color = tokens.color.ink }: { color?: string }) {
  return (
    <span style={{ fontSize: 18, color, lineHeight: 1, fontWeight: 300 }}>←</span>
  );
}
