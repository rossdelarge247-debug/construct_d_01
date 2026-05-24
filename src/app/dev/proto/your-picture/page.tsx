'use client';

import Link from 'next/link';
import { tokens } from '@/styles/tokens';
import { ProtoHeader } from '../_components/ProtoHeader';
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

const CHIP_STYLE: Record<PictureItem['confidence'], { bg: string; color: string; label: string }> = {
  confirmed: { bg: '#D1FAE5', color: '#047857', label: 'Confirmed' },
  estimated: { bg: '#FEF3C7', color: '#92400E', label: 'Estimated' },
};

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
  const deltaCount = SECTIONS.filter(s => s.status === 'partial_evidence' || s.status === 'estimate_only').length;

  return (
    <div>
      <ProtoHeader
        backHref="/dev/proto/section-confirm"
        backLabel={`${scenarioName}’s Picture`}
        rightSlot={
          <button type="button" style={{
            padding: '8px 16px', borderRadius: 8, border: 'none',
            background: tokens.color.ink, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
            Share with Mark
          </button>
        }
      />

      {!hasData ? (
        <main style={{ maxWidth: 640, margin: '0 auto', padding: '48px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: tokens.type['14-5'], color: tokens.color.text.muted, lineHeight: 1.6 }}>
            No bank data loaded. <Link href="/dev/proto/bank-connect" style={{ color: tokens.color.phase.build.accent }}>Connect a bank</Link> or select a test scenario to build your picture.
          </p>
        </main>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 260px', gap: 0, maxWidth: 1200, margin: '0 auto' }}>
          {/* Left rail — TOC with locked/unlocked sections */}
          <nav data-testid="left-rail-toc" style={{
            padding: '20px 16px', borderRight: `1px solid ${tokens.color.border}`,
            background: tokens.color.surface.panel,
            position: 'sticky', top: 0, alignSelf: 'start', maxHeight: '100dvh', overflow: 'auto',
          }}>
            <p style={{ margin: '0 0 4px', fontSize: 9.5, fontWeight: 700, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              In this document
            </p>
            <p style={{ margin: '0 0 6px', fontFamily: tokens.font.serif, fontSize: 18, fontWeight: 600, color: tokens.color.ink, letterSpacing: '-0.015em' }}>
              {scenarioName}&rsquo;s Picture
            </p>
            <p style={{ margin: '0 0 16px', fontSize: 12, color: tokens.color.text.sub }}>
              {pct}% complete &middot; {completedCount} of {SECTIONS.length} sections
            </p>
            {SECTIONS.map((s) => {
              const icon = STATUS_ICON[s.status];
              const isLocked = s.status === 'not_started';
              return (
                <a key={s.key} href={`#section-${s.key}`} data-status={s.status} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', marginBottom: 2,
                  borderRadius: 8,
                  textDecoration: 'none', fontSize: 13, color: isLocked ? tokens.color.text.muted : tokens.color.ink,
                  fontWeight: isLocked ? 400 : 500,
                  opacity: isLocked ? 0.6 : 1,
                  background: s.status === 'fully_evidenced' ? '#F0FDF4' : 'transparent',
                  transition: 'background 0.15s',
                }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: icon.color, flexShrink: 0,
                    border: isLocked ? `1.5px dashed ${tokens.color.border}` : s.status === 'fully_evidenced' ? 'none' : `1.5px solid ${icon.color}`,
                    background: s.status === 'fully_evidenced' ? '#DCFCE7' : 'transparent',
                  }}>
                    {icon.char}
                  </span>
                  <span>{s.label}</span>
                  {isLocked && <span style={{ marginLeft: 'auto', fontSize: 9, color: tokens.color.text.muted, fontStyle: 'italic' }}>empty</span>}
                </a>
              );
            })}
          </nav>

          {/* Middle column — document body */}
          <main style={{ padding: '20px 28px 60px' }}>
            {/* View bar */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: tokens.color.surface.panel, border: `1px solid ${tokens.color.border}`, borderRadius: 10, padding: '10px 12px',
              marginBottom: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, color: tokens.color.text.muted }}>View</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: tokens.color.ink }}>Private</span>
                <span style={{ fontSize: 11, color: tokens.color.text.muted }}>&blacktriangledown;</span>
              </div>
              {deltaCount > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 999, background: '#FFF7ED', color: '#9A3412', fontSize: 11, fontWeight: 600 }}>
                  &bull; {deltaCount} to share
                </span>
              )}
            </div>

            {/* Net worth headline card */}
            <div style={{
              background: tokens.color.surface.panel, border: `1px solid ${tokens.color.border}`, borderRadius: 12, padding: '14px 16px',
              marginBottom: 16,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, color: tokens.color.text.muted }}>Net worth &middot; your view</span>
                <span style={{ fontSize: 10.5, color: tokens.color.text.muted }}>Private</span>
              </div>
              <div style={{ fontFamily: tokens.font.serif, fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: tokens.color.ink, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
                &pound;{snapshot[0]?.value.replace(/£/, '') ?? '—'}
              </div>
              {deltaCount > 0 && (
                <div style={{ fontSize: 11.5, color: tokens.color.text.sub, marginTop: 2 }}>{deltaCount} deltas held back from Mark</div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 10 }}>
                {snapshot.slice(1).map(m => (
                  <div key={m.label} style={{ background: tokens.color.surface.canvas, border: `1px solid ${tokens.color.border}`, borderRadius: 8, padding: '7px 9px' }}>
                    <div style={{ fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: tokens.color.text.muted, fontWeight: 700 }}>{m.label}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: tokens.color.ink, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Provenance intro */}
            <p style={{ margin: '0 0 24px', fontSize: tokens.type['14-5'], lineHeight: 1.6, color: tokens.color.text.sub }}>
              A structured record of what you own, owe, earn and spend.
              Based on data from your connected {providerNames.join(' and ')} account{extractions.length > 1 ? 's' : ''}.
            </p>

            {/* Sections */}
            {SECTIONS.map((s, i) => (
              <section key={s.key} id={`section-${s.key}`} style={{ marginBottom: 16 }}>
                <div style={{
                  background: tokens.color.surface.panel, border: `1px solid ${tokens.color.border}`, borderRadius: 12, overflow: 'hidden',
                }}>
                  <div style={{
                    padding: '10px 14px', borderBottom: `1px solid ${tokens.color.border}`,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontSize: 12, color: tokens.color.text.muted, fontFamily: tokens.font.mono }}>§{i + 1}</span>
                      <span style={{ fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, color: tokens.color.text.muted }}>{s.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: tokens.color.text.muted }}>{s.items.length} item{s.items.length !== 1 ? 's' : ''}</span>
                      <Link href="/dev/proto/section-confirm" aria-label={`Review ${s.label}`} style={{ fontSize: 11, color: tokens.color.phase.build.accent, textDecoration: 'none' }}>
                        Review
                      </Link>
                    </div>
                  </div>

                  {s.items.length === 0 ? (
                    <div style={{ padding: '14px', fontSize: 13, color: tokens.color.text.muted, fontStyle: 'italic' }}>
                      No data yet. <Link href="/dev/proto/section-confirm" style={{ color: tokens.color.phase.build.accent }}>Add information</Link>
                    </div>
                  ) : (
                    <div>
                      {s.items.map((item, j) => {
                        const chip = CHIP_STYLE[item.confidence];
                        return (
                          <div key={item.label} style={{
                            padding: '10px 14px',
                            borderBottom: j < s.items.length - 1 ? `1px solid ${tokens.color.border}` : 'none',
                            display: 'flex', alignItems: 'flex-start', gap: 10,
                          }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13.5, color: tokens.color.ink, fontWeight: 500 }}>{item.label}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                                <span style={{ display: 'inline-block', padding: '2px 7px', borderRadius: 999, background: chip.bg, color: chip.color, fontSize: 10.5, fontWeight: 600 }}>
                                  {chip.label}
                                </span>
                              </div>
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: tokens.color.ink, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{item.value}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            ))}

          </main>

          {/* Right rail — panels */}
          <aside style={{ padding: '20px 16px', borderLeft: `1px solid ${tokens.color.border}`, position: 'sticky', top: 0, alignSelf: 'start', maxHeight: '100dvh', overflow: 'auto' }}>
            {/* Snapshot */}
            <div style={{ marginBottom: 12, padding: '14px', borderRadius: 12, background: tokens.color.surface.panel, border: `1px solid ${tokens.color.border}` }}>
              <p style={{ margin: '0 0 10px', fontSize: 9.5, fontWeight: 700, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Snapshot</p>
              {snapshot.map((m) => (
                <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13 }}>
                  <span style={{ color: tokens.color.text.sub }}>{m.label}</span>
                  <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: m.color }}>{m.value}</span>
                </div>
              ))}
            </div>

            {/* Data sources */}
            <div style={{ marginBottom: 12, padding: '14px', borderRadius: 12, background: tokens.color.surface.panel, border: `1px solid ${tokens.color.border}` }}>
              <p style={{ margin: '0 0 10px', fontSize: 9.5, fontWeight: 700, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Data sources</p>
              {extractions.map((e) => (
                <div key={`${e.provider}-${e.account_number_last4}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', fontSize: 12 }}>
                  <span style={{ color: tokens.color.ink }}>{e.provider} {e.account_type}</span>
                  <span style={{ display: 'inline-block', padding: '2px 7px', borderRadius: 999, background: '#D1FAE5', color: '#047857', fontSize: 10, fontWeight: 600 }}>connected</span>
                </div>
              ))}
            </div>

            {/* Needs your attention */}
            <div style={{ marginBottom: 12, padding: '14px', borderRadius: 12, background: tokens.color.surface.panel, border: `1px solid ${tokens.color.border}` }}>
              <p style={{ margin: '0 0 10px', fontSize: 9.5, fontWeight: 700, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Needs your attention</p>
              {SECTIONS.filter(s => s.status === 'not_started' || s.status === 'estimate_only').map((s) => (
                <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 0', fontSize: 12, color: tokens.color.text.sub }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: '#D97706', flexShrink: 0 }} />
                  {s.label} — {s.status === 'not_started' ? 'no data yet' : 'needs confirmation'}
                </div>
              ))}
            </div>

            {/* Share CTA */}
            <Link href="/dev/proto/share-flow" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', height: 46, borderRadius: 11, border: 'none',
              background: '#9A3412', color: '#fff', fontSize: 14, fontWeight: 600,
              textDecoration: 'none', cursor: 'pointer',
            }}>
              Share with Mark
              {deltaCount > 0 && (
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '1px 7px', borderRadius: 999, fontSize: 12 }}>{deltaCount}</span>
              )}
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
