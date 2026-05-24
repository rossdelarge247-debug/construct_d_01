'use client';

import Link from 'next/link';
import { tokens } from '@/styles/tokens';
import type { SectionStatus } from '@/types/hub';
import { useBankData } from '../_context/bank-data-context';
import type { BankStatementExtraction } from '@/lib/ai/extraction-schemas';

type PictureItem = { label: string; value: string; confidence: 'confirmed' | 'estimated' };
type PictureSection = { key: string; label: string; formE: string; status: SectionStatus; items: PictureItem[] };

function buildSectionsFromExtractions(exts: BankStatementExtraction[]): PictureSection[] {
  const sections: PictureSection[] = [];

  const incomes = exts.flatMap(e => e.income_deposits);
  sections.push({
    key: 'income', label: 'Income', formE: '2.15–2.20',
    status: incomes.length > 0 ? 'fully_evidenced' : 'not_started',
    items: incomes.map(i => ({ label: `${i.source} — ${i.type}`, value: `£${i.amount.toLocaleString()}/month`, confidence: 'confirmed' as const })),
  });

  const mortgage = exts.flatMap(e => e.regular_payments.filter(r => r.likely_category === 'mortgage' || r.likely_category === 'council_tax' || r.likely_category === 'rent'));
  sections.push({
    key: 'home', label: 'The home', formE: '2.1',
    status: mortgage.length > 0 ? 'partial_evidence' : 'not_started',
    items: mortgage.map(p => ({ label: p.payee, value: `£${p.amount.toLocaleString()}/month`, confidence: 'confirmed' as const })),
  });

  const spending = exts.flatMap(e => e.spending_categories);
  sections.push({
    key: 'spending', label: 'Monthly spending', formE: '3.1',
    status: spending.length > 0 ? 'partial_evidence' : 'not_started',
    items: spending.map(c => ({ label: c.category, value: `£${c.monthly_average.toLocaleString()}/month`, confidence: 'confirmed' as const })),
  });

  const accounts = exts.filter(e => e.closing_balance !== null && e.closing_balance !== undefined);
  sections.push({
    key: 'accounts', label: 'Accounts & savings', formE: '2.3–2.4',
    status: accounts.length > 0 ? 'fully_evidenced' : 'not_started',
    items: accounts.map(e => ({ label: `${e.provider} ${e.account_type}`, value: `£${e.closing_balance!.toLocaleString()}`, confidence: 'confirmed' as const })),
  });

  const pensions = exts.flatMap(e => e.regular_payments.filter(r => r.likely_category === 'pension_contribution'));
  sections.push({
    key: 'pensions', label: 'Pensions', formE: '2.13',
    status: pensions.length > 0 ? 'estimate_only' : 'not_started',
    items: pensions.map(p => ({ label: `${p.payee} contribution`, value: `£${p.amount.toLocaleString()}/month`, confidence: 'estimated' as const })),
  });

  const debts = exts.flatMap(e => e.regular_payments.filter(r => r.likely_category === 'loan_repayment' || r.likely_category === 'credit_card'));
  sections.push({
    key: 'debts', label: 'What you owe', formE: '2.14',
    status: debts.length > 0 ? 'partial_evidence' : 'not_started',
    items: debts.map(p => ({ label: p.payee, value: `£${p.amount.toLocaleString()}/month`, confidence: 'confirmed' as const })),
  });

  sections.push({ key: 'vehicles', label: 'Vehicles & other assets', formE: '2.4–2.9', status: 'not_started', items: [] });

  return sections;
}

function computeSnapshot(sections: PictureSection[], exts: BankStatementExtraction[]) {
  const totalIncome = exts.flatMap(e => e.income_deposits).reduce((s, i) => s + i.amount, 0);
  const totalSpending = exts.flatMap(e => e.spending_categories).reduce((s, c) => s + c.monthly_average, 0);
  const totalBalances = exts.reduce((s, e) => s + (e.closing_balance ?? 0), 0);
  const totalDebt = exts.flatMap(e => e.regular_payments.filter(r => r.likely_category === 'mortgage')).reduce((s, p) => s + p.amount * 12 * 15, 0);
  return [
    { label: 'Net position', value: `£${(totalBalances).toLocaleString()}`, color: tokens.color.ink },
    { label: 'Monthly income', value: `£${totalIncome.toLocaleString()}`, color: tokens.color.ink },
    { label: 'Monthly spending', value: `£${totalSpending.toLocaleString()}`, color: tokens.color.danger },
    { label: 'Monthly gap', value: `${totalIncome > totalSpending ? '+' : ''}£${(totalIncome - totalSpending).toLocaleString()}`, color: totalIncome >= totalSpending ? tokens.color.phase.finalise.accent : tokens.color.danger },
  ];
}

const STATUS_ICON: Record<SectionStatus, { char: string; color: string }> = {
  fully_evidenced: { char: '✓', color: tokens.color.phase.finalise.accent },
  partial_evidence: { char: '!', color: '#D97706' },
  estimate_only: { char: '•', color: tokens.color.text.muted },
  not_started: { char: '○', color: tokens.color.border },
};

export default function YourPicturePage() {
  const { extractions, scenario } = useBankData();
  const hasData = extractions.length > 0;

  const SECTIONS = hasData ? buildSectionsFromExtractions(extractions) : [];
  const snapshot = hasData ? computeSnapshot(SECTIONS, extractions) : [];
  const providerNames = [...new Set(extractions.map(e => e.provider))];
  const scenarioName = scenario?.name?.split(' ')[0] ?? 'Your';

  const completedCount = SECTIONS.filter(s => s.status === 'fully_evidenced').length;
  const pct = SECTIONS.length > 0 ? Math.round((completedCount / SECTIONS.length) * 100) : 0;

  return (
    <div style={{ minHeight: '100dvh', background: tokens.color.surface.page, fontFamily: tokens.font.sans }}>
      <header style={{
        padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${tokens.color.border}`, background: tokens.color.surface.panel,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/dev/proto/section-confirm" aria-label="Back" style={{ color: tokens.color.ink, textDecoration: 'none', fontSize: 20 }}>&larr;</Link>
          <span style={{ fontSize: tokens.type['17'], fontWeight: 600, color: tokens.color.ink }}>{scenarioName}&rsquo;s Picture</span>
        </div>
        <button type="button" style={{
          padding: '8px 16px', borderRadius: 8, border: 'none',
          background: tokens.color.ink, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          Share with Mark
        </button>
      </header>

      {!hasData ? (
        <main style={{ maxWidth: 640, margin: '0 auto', padding: '48px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: tokens.type['14-5'], color: tokens.color.text.muted, lineHeight: 1.6 }}>
            No bank data loaded. <Link href="/dev/proto/bank-connect" style={{ color: tokens.color.phase.build.accent }}>Connect a bank</Link> or select a test scenario to build your picture.
          </p>
        </main>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 260px', gap: 0, maxWidth: 1200, margin: '0 auto' }}>
          {/* Left rail — TOC */}
          <nav data-testid="left-rail-toc" style={{
            padding: '20px 16px', borderRight: `1px solid ${tokens.color.border}`,
            position: 'sticky', top: 0, alignSelf: 'start', maxHeight: '100dvh', overflow: 'auto',
          }}>
            <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 600, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              In this document
            </p>
            <p style={{ margin: '0 0 16px', fontSize: 12, color: tokens.color.text.sub }}>
              {pct}% complete ({completedCount} of {SECTIONS.length})
            </p>
            {SECTIONS.map((s) => {
              const icon = STATUS_ICON[s.status];
              return (
                <a key={s.key} href={`#section-${s.key}`} data-status={s.status} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0',
                  textDecoration: 'none', fontSize: 13, color: tokens.color.ink,
                }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: icon.color, border: s.status === 'not_started' ? `1.5px solid ${tokens.color.border}` : 'none', background: s.status === 'fully_evidenced' ? '#DCFCE7' : 'transparent' }}>
                    {icon.char}
                  </span>
                  {s.label}
                </a>
              );
            })}
          </nav>

          {/* Middle column — document body */}
          <main style={{ padding: '24px 28px 60px' }}>
            <p style={{ margin: '0 0 24px', fontSize: tokens.type['14-5'], lineHeight: 1.6, color: tokens.color.text.sub }}>
              A structured record of what you own, owe, earn and spend.
              Based on data from your connected {providerNames.join(' and ')} account{extractions.length > 1 ? 's' : ''}.
            </p>

            {SECTIONS.map((s, i) => (
              <section key={s.key} id={`section-${s.key}`} style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12, borderBottom: `1px solid ${tokens.color.border}`, paddingBottom: 8 }}>
                  <span style={{ fontSize: 13, color: tokens.color.text.muted, fontFamily: tokens.font.mono }}>§{i + 1}</span>
                  <h2 style={{ margin: 0, fontSize: tokens.type['17'], fontWeight: 600, color: tokens.color.ink }}>{s.label}</h2>
                  <span style={{ fontSize: 11, color: tokens.color.text.muted, marginLeft: 'auto' }}>Form E {s.formE}</span>
                  <Link href="/dev/proto/section-confirm" aria-label={`Review ${s.label}`} style={{ fontSize: 11, color: tokens.color.phase.build.accent, textDecoration: 'none', marginLeft: 8 }}>
                    Review →
                  </Link>
                </div>

                {s.items.length === 0 ? (
                  <p style={{ fontSize: 13, color: tokens.color.text.muted, fontStyle: 'italic' }}>No data yet. <Link href="/dev/proto/section-confirm" style={{ color: tokens.color.phase.build.accent }}>Add information</Link> or connect a relevant account.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {s.items.map((item) => (
                      <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0' }}>
                        <span style={{ fontSize: tokens.type['14-5'], color: tokens.color.ink }}>{item.label}</span>
                        <span style={{ fontSize: 13, color: item.confidence === 'confirmed' ? tokens.color.ink : tokens.color.text.sub, fontFamily: tokens.font.mono }}>
                          {item.value}
                          {item.confidence === 'estimated' && <span style={{ marginLeft: 6, fontSize: 10, color: '#D97706' }}>est.</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}

            <Link href="/dev/proto/share-flow" style={{
              display: 'block', width: '100%', padding: '14px 20px', marginTop: 8,
              borderRadius: 10, background: tokens.color.ink, color: '#fff',
              fontWeight: 600, fontSize: tokens.type['14-5'], textAlign: 'center',
              textDecoration: 'none', fontFamily: tokens.font.sans,
            }}>
              Share your picture with Mark &rarr;
            </Link>
          </main>

          {/* Right rail — panels */}
          <aside style={{ padding: '20px 16px', borderLeft: `1px solid ${tokens.color.border}`, position: 'sticky', top: 0, alignSelf: 'start', maxHeight: '100dvh', overflow: 'auto' }}>
            {/* Snapshot */}
            <div style={{ marginBottom: 20, padding: '14px', borderRadius: 10, background: tokens.color.surface.panel, border: `1px solid ${tokens.color.border}` }}>
              <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Snapshot</p>
              {snapshot.map((m) => (
                <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
                  <span style={{ color: tokens.color.text.sub }}>{m.label}</span>
                  <span style={{ fontWeight: 600, fontFamily: tokens.font.mono, color: m.color }}>{m.value}</span>
                </div>
              ))}
            </div>

            {/* Data sources */}
            <div style={{ marginBottom: 20, padding: '14px', borderRadius: 10, background: tokens.color.surface.panel, border: `1px solid ${tokens.color.border}` }}>
              <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Data sources</p>
              {extractions.map((e) => (
                <div key={`${e.provider}-${e.account_number_last4}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', fontSize: 12 }}>
                  <span style={{ color: tokens.color.ink }}>{e.provider} {e.account_type}</span>
                  <span style={{ color: tokens.color.text.muted, fontSize: 11 }}>connected</span>
                </div>
              ))}
            </div>

            {/* Needs your attention */}
            <div style={{ padding: '14px', borderRadius: 10, background: tokens.color.surface.panel, border: `1px solid ${tokens.color.border}` }}>
              <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Needs your attention</p>
              {SECTIONS.filter(s => s.status === 'not_started' || s.status === 'estimate_only').map((s) => (
                <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 0', fontSize: 12, color: tokens.color.text.sub }}>
                  <span style={{ color: '#D97706', fontSize: 14 }}>&bull;</span> {s.label} — {s.status === 'not_started' ? 'no data yet' : 'needs confirmation'}
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
