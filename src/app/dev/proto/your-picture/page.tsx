'use client';

import Link from 'next/link';
import { tokens } from '@/styles/tokens';
import { SECTION_DEFINITIONS } from '@/types/hub';
import type { SectionStatus } from '@/types/hub';

type SectionEntry = { key: string; label: string; formE: string; status: SectionStatus; items: { label: string; value: string; confidence: 'confirmed' | 'estimated' }[] };

const SECTIONS: SectionEntry[] = [
  { key: 'home', label: 'The home', formE: '2.1', status: 'partial_evidence', items: [
    { label: '12 Oak Road, Exeter', value: '£320,000 (estimated)', confidence: 'estimated' },
    { label: 'Halifax mortgage', value: '£187,400 outstanding', confidence: 'confirmed' },
    { label: 'Ownership', value: 'Joint names', confidence: 'estimated' },
  ]},
  { key: 'children', label: 'The children', formE: '1', status: 'partial_evidence', items: [
    { label: 'Amelia (8)', value: 'Primary care: Sarah', confidence: 'estimated' },
    { label: 'Jack (5)', value: 'Primary care: Sarah', confidence: 'estimated' },
  ]},
  { key: 'income', label: 'Income', formE: '2.15–2.20', status: 'fully_evidenced', items: [
    { label: 'ACME Corporation — salary', value: '£3,218/month', confidence: 'confirmed' },
    { label: 'Child Benefit', value: '£96.25/month', confidence: 'confirmed' },
  ]},
  { key: 'spending', label: 'Monthly spending', formE: '3.1', status: 'partial_evidence', items: [
    { label: 'Mortgage', value: '£1,150/month', confidence: 'confirmed' },
    { label: 'Council tax', value: '£185/month', confidence: 'confirmed' },
    { label: 'Utilities', value: '£168/month', confidence: 'confirmed' },
    { label: 'Groceries', value: '£480/month', confidence: 'estimated' },
  ]},
  { key: 'pensions', label: 'Pensions', formE: '2.13', status: 'estimate_only', items: [
    { label: 'NEST workplace pension', value: 'CETV pending', confidence: 'estimated' },
  ]},
  { key: 'accounts', label: 'Accounts & savings', formE: '2.3–2.4', status: 'fully_evidenced', items: [
    { label: 'Barclays current', value: '£4,231.67', confidence: 'confirmed' },
    { label: 'Halifax savings', value: '£12,800', confidence: 'confirmed' },
  ]},
  { key: 'debts', label: 'What you owe', formE: '2.14', status: 'not_started', items: [] },
  { key: 'vehicles', label: 'Vehicles & other assets', formE: '2.4–2.9', status: 'not_started', items: [] },
];

const STATUS_ICON: Record<SectionStatus, { char: string; color: string }> = {
  fully_evidenced: { char: '✓', color: tokens.color.phase.finalise.accent },
  partial_evidence: { char: '!', color: '#D97706' },
  estimate_only: { char: '•', color: tokens.color.text.muted },
  not_started: { char: '○', color: tokens.color.border },
};

export default function YourPicturePage() {
  const completedCount = SECTIONS.filter(s => s.status === 'fully_evidenced').length;
  const pct = Math.round((completedCount / SECTIONS.length) * 100);

  return (
    <div style={{ minHeight: '100dvh', background: tokens.color.surface.page, fontFamily: tokens.font.sans }}>
      <header style={{
        padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${tokens.color.border}`, background: tokens.color.surface.panel,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/dev/proto" aria-label="Back" style={{ color: tokens.color.ink, textDecoration: 'none', fontSize: 20 }}>&larr;</Link>
          <span style={{ fontSize: tokens.type['17'], fontWeight: 600, color: tokens.color.ink }}>Sarah&rsquo;s Picture</span>
        </div>
        <button type="button" style={{
          padding: '8px 16px', borderRadius: 8, border: 'none',
          background: tokens.color.ink, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          Share with Mark
        </button>
      </header>

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
            A structured record of what you own, owe, earn and spend, as of 24 May 2026.
            Based on 142 transactions across 12 months from your connected accounts, plus items you&rsquo;ve added yourself.
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

          <Link
            href="/dev/proto/share-flow"
            style={{
              display: 'block', width: '100%', padding: '14px 20px', marginTop: 8,
              borderRadius: 10, background: tokens.color.ink, color: '#fff',
              fontWeight: 600, fontSize: tokens.type['14-5'], textAlign: 'center',
              textDecoration: 'none', fontFamily: tokens.font.sans,
            }}
          >
            Share your picture with Mark &rarr;
          </Link>
        </main>

        {/* Right rail — panels */}
        <aside style={{ padding: '20px 16px', borderLeft: `1px solid ${tokens.color.border}`, position: 'sticky', top: 0, alignSelf: 'start', maxHeight: '100dvh', overflow: 'auto' }}>
          {/* Snapshot */}
          <div style={{ marginBottom: 20, padding: '14px', borderRadius: 10, background: tokens.color.surface.panel, border: `1px solid ${tokens.color.border}` }}>
            <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Snapshot</p>
            {[
              { label: 'Net position', value: '£149,632', color: tokens.color.ink },
              { label: 'Assets', value: '£337,032', color: tokens.color.ink },
              { label: 'Debts', value: '(£187,400)', color: tokens.color.danger },
              { label: 'Monthly gap', value: '+£1,331', color: tokens.color.phase.finalise.accent },
            ].map((m) => (
              <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
                <span style={{ color: tokens.color.text.sub }}>{m.label}</span>
                <span style={{ fontWeight: 600, fontFamily: tokens.font.mono, color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>

          {/* Data sources */}
          <div style={{ marginBottom: 20, padding: '14px', borderRadius: 10, background: tokens.color.surface.panel, border: `1px solid ${tokens.color.border}` }}>
            <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Data sources</p>
            {[
              { name: 'Barclays current', date: '20 Apr', status: 'connected' },
              { name: 'Halifax savings', date: '4 Apr', status: 'connected' },
              { name: 'NHS Pension', date: null, status: 'CETV pending' },
            ].map((d) => (
              <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', fontSize: 12 }}>
                <span style={{ color: tokens.color.ink }}>{d.name}</span>
                <span style={{ color: d.status === 'connected' ? tokens.color.text.muted : '#D97706', fontSize: 11 }}>
                  {d.date ? `${d.date}` : d.status}
                </span>
              </div>
            ))}
          </div>

          {/* Needs your attention */}
          <div style={{ padding: '14px', borderRadius: 10, background: tokens.color.surface.panel, border: `1px solid ${tokens.color.border}` }}>
            <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Needs your attention</p>
            {[
              'Chase NHS pension CETV',
              'Property valuation — add or estimate',
              'Debts section — no data yet',
            ].map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 0', fontSize: 12, color: tokens.color.text.sub }}>
                <span style={{ color: '#D97706', fontSize: 14 }}>&bull;</span> {t}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
