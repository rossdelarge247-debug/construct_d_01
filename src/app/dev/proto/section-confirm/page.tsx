'use client';

import Link from 'next/link';
import { tokens } from '@/styles/tokens';

type SectionRow = {
  key: string;
  label: string;
  formE: string;
  status: 'confirmed' | 'needs-review' | 'not-started';
  questions: number;
  answered: number;
  formTypes: { href: string; label: string }[];
};

const SECTIONS: SectionRow[] = [
  { key: 'income', label: 'Income', formE: '2.15–2.20', status: 'confirmed', questions: 4, answered: 4, formTypes: [
    { href: '/dev/proto/section-confirm/categorise', label: 'Categorise income' },
    { href: '/dev/proto/section-confirm/confirm-recurring', label: 'Confirm recurring' },
  ]},
  { key: 'property', label: 'Property', formE: '2.1–2.2', status: 'needs-review', questions: 5, answered: 2, formTypes: [
    { href: '/dev/proto/section-confirm/confirm-recurring', label: 'Confirm mortgage' },
    { href: '/dev/proto/section-confirm/manual-entry', label: 'Add property value' },
  ]},
  { key: 'accounts', label: 'Accounts', formE: '2.3–2.4', status: 'confirmed', questions: 3, answered: 3, formTypes: [
    { href: '/dev/proto/section-confirm/balance-check', label: 'Confirm balances' },
    { href: '/dev/proto/section-confirm/resolve-duplicate', label: 'Resolve duplicates' },
  ]},
  { key: 'pensions', label: 'Pensions', formE: '2.13', status: 'needs-review', questions: 2, answered: 0, formTypes: [
    { href: '/dev/proto/section-confirm/categorise', label: 'Confirm pension type' },
    { href: '/dev/proto/section-confirm/manual-entry', label: 'Add CETV' },
  ]},
  { key: 'debts', label: 'Debts', formE: '2.14', status: 'needs-review', questions: 3, answered: 1, formTypes: [
    { href: '/dev/proto/section-confirm/categorise', label: 'Categorise debts' },
    { href: '/dev/proto/section-confirm/confirm-recurring', label: 'Confirm repayments' },
  ]},
  { key: 'spending', label: 'Spending', formE: '3.1', status: 'needs-review', questions: 6, answered: 3, formTypes: [
    { href: '/dev/proto/section-confirm/categorise', label: 'Categorise spending' },
    { href: '/dev/proto/section-confirm/split', label: 'Split transactions' },
    { href: '/dev/proto/section-confirm/confirm-recurring', label: 'Confirm recurring' },
  ]},
  { key: 'business', label: 'Business', formE: '2.10–2.11', status: 'confirmed', questions: 1, answered: 1, formTypes: [] },
];

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  'confirmed':    { label: 'Confirmed',    color: '#15803D', bg: '#DCFCE7', icon: '✓' },
  'needs-review': { label: 'Needs review', color: '#D97706', bg: '#FEF3C7', icon: '!' },
  'not-started':  { label: 'Not started',  color: tokens.color.text.muted, bg: tokens.color.surface.page, icon: '○' },
};

export default function SectionConfirmHubPage() {
  const totalQ = SECTIONS.reduce((n, s) => n + s.questions, 0);
  const totalA = SECTIONS.reduce((n, s) => n + s.answered, 0);
  const pct = Math.round((totalA / totalQ) * 100);

  return (
    <main style={{
      minHeight: '100vh', background: tokens.color.surface.page,
      fontFamily: tokens.font.sans, color: tokens.color.ink, padding: '32px 20px 64px',
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <Link href="/dev/proto/extraction-results" style={{
          display: 'inline-block', fontSize: 12, color: tokens.color.text.sub,
          textDecoration: 'none', marginBottom: 16,
        }}>
          &larr; Back to what we found
        </Link>

        <h1 style={{
          fontFamily: tokens.font.serif, fontSize: 28, fontWeight: 600,
          letterSpacing: '-0.015em', margin: '0 0 8px',
        }}>
          Confirm your data
        </h1>
        <p style={{ fontSize: tokens.type['14-5'], color: tokens.color.text.sub, margin: '0 0 6px', lineHeight: 1.55 }}>
          Go through each section to confirm or correct what we found in your bank data.
          Confirmed items build your financial picture with full evidence.
        </p>
        <p style={{ fontSize: 12, color: tokens.color.text.muted, margin: '0 0 24px' }}>
          {pct}% complete — {totalA} of {totalQ} questions answered
        </p>

        <div data-testid="section-list" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {SECTIONS.map((s) => {
            const st = STATUS_STYLE[s.status];
            return (
              <div key={s.key} data-section={s.key} data-status={s.status} style={{
                background: tokens.color.surface.panel, border: `1px solid ${tokens.color.border}`,
                borderRadius: 12, padding: '16px 18px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: s.formTypes.length > 0 ? 10 : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%', display: 'inline-flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
                      color: st.color, background: st.bg,
                      border: s.status === 'not-started' ? `1.5px solid ${tokens.color.border}` : 'none',
                    }}>
                      {st.icon}
                    </span>
                    <div>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{s.label}</span>
                      <span style={{ fontSize: 11, color: tokens.color.text.muted, marginLeft: 8 }}>Form E {s.formE}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6, color: st.color, background: st.bg }}>
                    {s.answered}/{s.questions}
                  </span>
                </div>

                {s.formTypes.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                    {s.formTypes.map((f) => (
                      <Link key={f.label} href={f.href} style={{
                        fontSize: 12, padding: '5px 10px', borderRadius: 6,
                        background: s.status === 'confirmed' ? tokens.color.surface.page : '#FEF3C7',
                        color: s.status === 'confirmed' ? tokens.color.text.muted : '#92400E',
                        textDecoration: 'none', border: `1px solid ${tokens.color.border}`,
                      }}>
                        {f.label} →
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Link href="/dev/proto/your-picture" style={{
          display: 'block', padding: '14px 20px', marginTop: 24, borderRadius: 10,
          background: tokens.color.ink, color: '#fff', textAlign: 'center',
          fontWeight: 600, fontSize: tokens.type['14-5'], textDecoration: 'none',
        }}>
          View your picture →
        </Link>
      </div>
    </main>
  );
}
