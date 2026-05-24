'use client';

import { tokens } from '@/styles/tokens';

export function ExitThisPage() {
  return (
    <a
      href="https://www.bbc.co.uk/news"
      data-testid="exit-this-page"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        background: tokens.color.danger,
        color: '#fff',
        fontFamily: tokens.font.sans,
        fontSize: 13,
        fontWeight: 600,
        borderRadius: 6,
        textDecoration: 'none',
        letterSpacing: '0.01em',
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 16 }}>&times;</span>
      Exit this page
    </a>
  );
}
