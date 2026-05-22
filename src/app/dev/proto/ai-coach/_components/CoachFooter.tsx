'use client';

import { tokens } from '@/styles/tokens';

export function CoachFooter() {
  return (
    <p
      style={{
        margin: 0,
        marginTop: 24,
        paddingTop: 16,
        borderTop: `1px solid ${tokens.color.border}`,
        fontSize: tokens.type['11'],
        lineHeight: 1.5,
        color: tokens.color.text.muted,
        fontFamily: tokens.font.sans,
      }}
    >
      AI suggestions are guidance based on typical court outcomes for cases like yours. Not a substitute for legal advice.
    </p>
  );
}
