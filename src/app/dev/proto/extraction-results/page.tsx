'use client';

import Link from 'next/link';
import { tokens } from '@/styles/tokens';
import { useBankData } from '../_context/bank-data-context';
import type { BankStatementExtraction } from '@/lib/ai/extraction-schemas';
import type { ConfirmationSectionKey } from '@/lib/bank/confirmation-questions';

const SECTION_META: { key: ConfirmationSectionKey; label: string; formE: string }[] = [
  { key: 'income', label: 'Income', formE: '2.15–2.20' },
  { key: 'property', label: 'Property', formE: '2.1–2.2' },
  { key: 'accounts', label: 'Accounts', formE: '2.3–2.4' },
  { key: 'pensions', label: 'Pensions', formE: '2.13' },
  { key: 'debts', label: 'Debts', formE: '2.14' },
  { key: 'business', label: 'Business', formE: '2.10–2.11' },
];

type ExtractedItem = { label: string; value: string };

function extractItemsForSection(key: ConfirmationSectionKey, exts: BankStatementExtraction[]): ExtractedItem[] {
  const items: ExtractedItem[] = [];
  for (const e of exts) {
    switch (key) {
      case 'income':
        for (const inc of e.income_deposits) {
          items.push({ label: `${inc.source} — ${inc.type}`, value: `£${inc.amount.toLocaleString()}/month` });
        }
        break;
      case 'property':
        for (const p of e.regular_payments.filter(r => r.likely_category === 'mortgage' || r.likely_category === 'council_tax' || r.likely_category === 'rent')) {
          items.push({ label: `${p.payee}`, value: `£${p.amount.toLocaleString()}/month` });
        }
        break;
      case 'accounts':
        if (e.closing_balance !== null && e.closing_balance !== undefined) {
          items.push({ label: `${e.provider} ${e.account_type}`, value: `£${e.closing_balance.toLocaleString()}` });
        }
        break;
      case 'pensions':
        for (const p of e.regular_payments.filter(r => r.likely_category === 'pension_contribution')) {
          items.push({ label: `${p.payee} contribution`, value: `£${p.amount.toLocaleString()}/month` });
        }
        break;
      case 'debts':
        for (const p of e.regular_payments.filter(r => r.likely_category === 'loan_repayment' || r.likely_category === 'credit_card')) {
          items.push({ label: `${p.payee}`, value: `£${p.amount.toLocaleString()}/month` });
        }
        break;
      case 'business':
        for (const inc of e.income_deposits.filter(i => i.type === 'other')) {
          items.push({ label: `${inc.source}`, value: `£${inc.amount.toLocaleString()}/month` });
        }
        break;
    }
  }
  if (key === 'business' && items.length === 0) {
    items.push({ label: 'No self-employment signals detected', value: '—' });
  }
  return items;
}

function inferConfidence(items: ExtractedItem[], key: string): 'high' | 'medium' | 'low' {
  if (items.length === 0 || (items.length === 1 && items[0].value === '—')) return 'low';
  if (key === 'pensions' || key === 'debts') return 'medium';
  return 'high';
}

const CONFIDENCE_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  high:   { label: 'High confidence', color: '#15803D', bg: '#DCFCE7' },
  medium: { label: 'Needs review',    color: '#D97706', bg: '#FEF3C7' },
  low:    { label: 'Incomplete',      color: '#DC2626', bg: '#FEE2E2' },
};

function SpendingSection({ extractions }: { extractions: BankStatementExtraction[] }) {
  const categories = extractions.flatMap(e => e.spending_categories);
  if (categories.length === 0) return null;
  const items = categories.map(c => ({ label: c.category, value: `£${c.monthly_average.toLocaleString()}/month avg` }));
  const conf = CONFIDENCE_STYLE['high'];
  return (
    <div data-section="spending" style={{
      background: tokens.color.surface.panel, border: `1px solid ${tokens.color.border}`,
      borderRadius: 12, padding: '16px 18px', position: 'relative',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div>
          <span style={{ fontSize: 16, fontWeight: 600, color: tokens.color.ink }}>Spending</span>
          <span style={{ fontSize: 11, color: tokens.color.text.muted, marginLeft: 8 }}>Form E 3.1</span>
        </div>
        <span data-confidence="high" style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6, color: conf.color, background: conf.bg }}>
          {conf.label}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map(item => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '3px 0' }}>
            <span style={{ fontSize: 13, color: tokens.color.ink }}>{item.label}</span>
            <span style={{ fontSize: 12, fontFamily: tokens.font.mono, color: tokens.color.text.sub }}>{item.value}</span>
          </div>
        ))}
      </div>
      <p style={{ margin: '8px 0 0', fontSize: 12, color: tokens.color.text.muted }}>
        {items.length} categor{items.length !== 1 ? 'ies' : 'y'} found
      </p>
    </div>
  );
}

export default function ExtractionResultsPage() {
  const { extractions, scenario } = useBankData();
  const hasData = extractions.length > 0;

  const sections = SECTION_META.map(meta => {
    const items = hasData ? extractItemsForSection(meta.key, extractions) : [];
    return { ...meta, items, confidence: inferConfidence(items, meta.key) };
  });

  const spendingCount = extractions.flatMap(e => e.spending_categories).length;
  const totalItems = sections.reduce((n, s) => n + s.items.length, 0) + spendingCount;
  const providerNames = [...new Set(extractions.map(e => e.provider))].join(' and ');
  const txnCount = extractions.reduce((n, e) => n + (e.spending_categories?.reduce((sum, c) => sum + c.transaction_count, 0) ?? 0), 0);

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

        {!hasData ? (
          <p style={{ fontSize: tokens.type['14-5'], color: tokens.color.text.muted, lineHeight: 1.6 }}>
            No bank data loaded. <Link href="/dev/proto/bank-connect" style={{ color: tokens.color.phase.build.accent }}>Connect a bank</Link> or select a test scenario to see extraction results.
          </p>
        ) : (
          <>
            <p style={{ fontSize: tokens.type['14-5'], lineHeight: 1.6, color: tokens.color.text.sub, margin: '0 0 6px' }}>
              We analysed {txnCount > 0 ? `${txnCount} transactions` : 'your data'} from your {providerNames} account{extractions.length > 1 ? 's' : ''}.
              {scenario && <span style={{ fontWeight: 500 }}> Scenario: {scenario.name}.</span>}
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.5, color: tokens.color.text.muted, margin: '0 0 28px' }}>
              {totalItems} items extracted across {sections.length + (spendingCount > 0 ? 1 : 0)} sections. Items marked
              &ldquo;needs review&rdquo; need you to confirm or correct what we found.
            </p>
          </>
        )}

        <div data-testid="section-cards" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {sections.map((s) => {
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
          <SpendingSection extractions={extractions} />
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
