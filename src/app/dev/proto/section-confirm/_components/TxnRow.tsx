'use client';

import { tokens } from '@/styles/tokens';

export function TxnRow({
  logo,
  logoBg,
  logoColor,
  merchant,
  sub,
  amount,
  neg = true,
}: {
  logo: string;
  logoBg: string;
  logoColor: string;
  merchant: string;
  sub: string;
  amount: string;
  neg?: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: logoBg,
          color: logoColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {logo}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: tokens.color.ink, letterSpacing: '-0.005em' }}>
          {merchant}
        </div>
        <div style={{ fontSize: 11, color: tokens.color.text.muted, marginTop: 1 }}>{sub}</div>
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: neg ? tokens.color.ink : '#059669',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.01em',
        }}
      >
        {neg ? '−' : '+'}
        {amount}
      </div>
    </div>
  );
}
