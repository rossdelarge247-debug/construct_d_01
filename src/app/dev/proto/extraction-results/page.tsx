'use client';

import Link from 'next/link';
import { tokens } from '@/styles/tokens';

type ExtractionSection = {
  key: string;
  label: string;
  formE: string;
  items: { label: string; value: string }[];
  confidence: 'high' | 'medium' | 'low';
};

const SECTIONS: ExtractionSection[] = [
  { key: 'income', label: 'Income', formE: '2.15–2.20', confidence: 'high', items: [
    { label: 'ACME Corporation — regular salary', value: '£3,218/month' },
    { label: 'Child Benefit (HMRC)', value: '£96.25/month' },
  ]},
  { key: 'property', label: 'Property', formE: '2.1–2.2', confidence: 'medium', items: [
    { label: 'Halifax mortgage payment', value: '£1,150/month' },
    { label: 'Exeter City Council — council tax', value: '£185/month' },
  ]},
  { key: 'accounts', label: 'Accounts', formE: '2.3–2.4', confidence: 'high', items: [
    { label: 'Barclays current account', value: '£4,231.67' },
    { label: 'Halifax savings account', value: '£12,800.00' },
    { label: 'Transfer to Halifax savings', value: '£400/month' },
  ]},
  { key: 'pensions', label: 'Pensions', formE: '2.13', confidence: 'low', items: [
    { label: 'NEST workplace contribution', value: '£142/month detected' },
  ]},
  { key: 'debts', label: 'Debts', formE: '2.14', confidence: 'medium', items: [
    { label: 'Barclaycard payment', value: '£85/month' },
    { label: 'Klarna (BNPL)', value: '3 active plans detected' },
  ]},
  { key: 'spending', label: 'Spending', formE: '3.1', confidence: 'high', items: [
    { label: 'Groceries (Tesco, Sainsbury\'s)', value: '£480/month avg' },
    { label: 'Utilities (EDF, Thames Water, BT)', value: '£168/month' },
    { label: 'Childcare (after-school club)', value: '£320/month' },
    { label: 'Transport (fuel, parking)', value: '£145/month' },
  ]},
  { key: 'business', label: 'Business', formE: '2.10–2.11', confidence: 'high', items: [
    { label: 'No self-employment signals detected', value: '—' },
  ]},
];

const CONFIDENCE_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  high:   { label: 'High confidence', color: '#15803D', bg: '#DCFCE7' },
  medium: { label: 'Needs review',    color: '#D97706', bg: '#FEF3C7' },
  low:    { label: 'Incomplete',      color: '#DC2626', bg: '#FEE2E2' },
};

export default function ExtractionResultsPage() {
  const totalItems = SECTIONS.reduce((n, s) => n + s.items.length, 0);

  return (
    <div style={{ minHeight: '100dvh', background: tokens.color.surface.page, fontFamily: tokens.font.sans }}>
      <header style={{
        padding: '12px 20px', borderBottom: `1px solid ${tokens.color.border}`,
        background: tokens.color.surface.panel, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Link href="/dev/proto/bank-connect" aria-label="Back" style={{ color: tokens.color.ink, textDecoration: 'none', fontSize: 20 }}>&larr;</Link>
        <span style={{ fontSize: tokens.type['17'], fontWeight: 600, color: tokens.color.ink }}>Bank analysis</span>
      </header>

      <main style={{ maxWidth: 640, margin: '0 auto', padding: '28px 20px 64px' }}>
        <h1 style={{
          fontFamily: tokens.font.serif, fontSize: 26, fontWeight: 600,
          letterSpacing: '-0.015em', margin: '0 0 8px', color: tokens.color.ink,
        }}>
          Here&rsquo;s what we found
        </h1>
        <p style={{ fontSize: tokens.type['14-5'], lineHeight: 1.6, color: tokens.color.text.sub, margin: '0 0 6px' }}>
          We analysed 142 transactions across 12 months from your Barclays current account
          and Halifax savings account.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.5, color: tokens.color.text.muted, margin: '0 0 28px' }}>
          {totalItems} items extracted across {SECTIONS.length} sections. Items marked
          &ldquo;needs review&rdquo; need you to confirm or correct what we found.
        </p>

        <div data-testid="section-cards" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {SECTIONS.map((s) => {
            const conf = CONFIDENCE_STYLE[s.confidence];
            return (
              <div key={s.key} data-section={s.key} style={{
                background: tokens.color.surface.panel, border: `1px solid ${tokens.color.border}`,
                borderRadius: 12, padding: '16px 18px', position: 'relative',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div>
                    <span style={{ fontSize: 16, fontWeight: 600, color: tokens.color.ink }}>{s.label}</span>
                    <span style={{ fontSize: 11, color: tokens.color.text.muted, marginLeft: 8 }}>Form E {s.formE}</span>
                  </div>
                  <span data-confidence={s.confidence} style={{
                    fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
                    color: conf.color, background: conf.bg,
                  }}>
                    {conf.label}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {s.items.map((item) => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '3px 0' }}>
                      <span style={{ fontSize: 13, color: tokens.color.ink }}>{item.label}</span>
                      <span style={{ fontSize: 12, fontFamily: tokens.font.mono, color: tokens.color.text.sub }}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <p style={{ margin: '8px 0 0', fontSize: 12, color: tokens.color.text.muted }}>
                  {s.items.length} item{s.items.length !== 1 ? 's' : ''} found
                </p>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link href="/dev/proto/section-confirm" style={{
            display: 'block', padding: '14px 20px', borderRadius: 10,
            background: tokens.color.ink, color: '#fff', textAlign: 'center',
            fontWeight: 600, fontSize: tokens.type['14-5'], textDecoration: 'none',
          }}>
            Start confirming your data
          </Link>
          <Link href="/dev/proto/your-picture" style={{
            display: 'block', padding: '12px 20px', borderRadius: 10,
            background: 'transparent', color: tokens.color.text.sub, textAlign: 'center',
            fontSize: 13, textDecoration: 'none', border: `1px solid ${tokens.color.border}`,
          }}>
            Skip for now — view your picture
          </Link>
        </div>
      </main>
    </div>
  );
}
