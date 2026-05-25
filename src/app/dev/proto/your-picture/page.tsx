'use client';

import { useState } from 'react';
import Link from 'next/link';
import { tokens } from '@/styles/tokens';
import { useBankData } from '../_context/bank-data-context';

const SNAPSHOT = [
  { label: 'Net position', value: '£54,560', color: tokens.color.ink },
  { label: 'Assets', value: '£282,240', color: tokens.color.ink },
  { label: 'Debts', value: '(£227,680)', color: tokens.color.danger },
  { label: 'Monthly gap', value: '(£892)', color: tokens.color.danger },
];

const OUTGOINGS = [
  { icon: '🏠', label: 'Household utilities & maintenance', amount: '£300 p/m', sub: null },
  { icon: '🏠', label: 'Personal & Living Expenses', amount: '£380 p/m', sub: null },
  { icon: '🚗', label: 'Transportation costs', amount: '£560 p/m', sub: null },
  { icon: '👶', label: 'Child expenses', amount: '£400 p/m', sub: 'Nursery… Clothing…' },
  { icon: '🏠', label: 'Leisure & other expenditure', amount: '£250 p/m', sub: 'Gym… Cinema…' },
];

const LEFT_NAV = [
  { id: 'prepare', label: 'Prepare your disclosure', level: 0, children: [
    { id: 'position', label: 'Your position', progress: 0.6 },
    { id: 'children-nav', label: 'Children (2)', progress: 1.0 },
    { id: 'finances', label: 'Finances', level: 0, children: [
      { id: 'income', label: 'Income (1)', progress: 0.5 },
      { id: 'assets', label: 'Assets (3)', progress: 0.6 },
      { id: 'debt', label: 'Debt (0)', progress: 0 },
      { id: 'outgoings-nav', label: 'Outgoings', progress: 0 },
    ]},
  ]},
  { id: 'shared', label: 'Shared position', progress: -1 },
  { id: 'settle', label: 'Settle and agree', level: 0, children: [
    { id: 'proposal', label: 'The proposal', progress: -1 },
    { id: 'children-settle', label: 'Children', progress: -1 },
    { id: 'assets-settle', label: 'Assets', progress: -1 },
    { id: 'needs', label: 'Needs', progress: -1 },
  ]},
  { id: 'finalisation', label: 'Finalisation', progress: -1 },
];

function ProgressBar({ progress }: { progress: number }) {
  if (progress < 0) return <span style={{ fontSize: 10, color: tokens.color.text.muted, fontStyle: 'italic', whiteSpace: 'nowrap' }}>Not ready to start yet</span>;
  const pct = Math.round(progress * 100);
  const bg = pct === 100 ? '#22C55E' : pct > 0 ? '#F97316' : tokens.color.border;
  return (
    <div style={{ width: 60, height: 6, borderRadius: 3, background: tokens.color.border, overflow: 'hidden', flexShrink: 0 }}>
      {pct > 0 && <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: bg }} />}
    </div>
  );
}

type NavItem = { id: string; label: string; progress?: number; level?: number; children?: NavItem[] };

function NavSection({ items, depth = 0 }: { items: NavItem[]; depth?: number }) {
  return (
    <>
      {items.map(item => (
        <div key={item.id}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
            padding: `4px ${depth * 12}px`, fontSize: depth === 0 ? 13 : 12,
            fontWeight: item.children ? 600 : 400, color: tokens.color.ink,
            marginTop: depth === 0 && !item.children ? 12 : 2,
          }}>
            <span>{item.label}</span>
            {item.progress !== undefined && <ProgressBar progress={item.progress} />}
          </div>
          {item.children && <NavSection items={item.children} depth={depth + 1} />}
        </div>
      ))}
    </>
  );
}

export default function YourPicturePage() {
  const { extractions } = useBankData();
  const [bankOpen, setBankOpen] = useState(false);
  const [childrenDisclosed, setChildrenDisclosed] = useState(true);
  const [outgoingsConfirmed, setOutgoingsConfirmed] = useState(false);
  const [hasShared, setHasShared] = useState(false);
  const [discloseOpen, setDiscloseOpen] = useState(false);
  const [shareModal, setShareModal] = useState<'closed' | 'form' | 'sent'>('closed');

  const providerNames = [...new Set(extractions.map(e => e.provider))];
  const accountCount = extractions.length || 3;

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ borderBottom: `1px solid ${tokens.color.border}`, padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: tokens.color.text.sub }}>
          <span style={{ fontWeight: 600, color: tokens.color.ink }}>decouple</span>
          <span>&rsaquo;</span>
          <span>Prepare your picture (disclosure)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: tokens.color.surface.panel, border: `1px solid ${tokens.color.border}`, fontSize: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E' }} />
            <span style={{ fontWeight: 600 }}>Private view</span>
          </div>
          {hasShared && (
            <span style={{ fontSize: 11, color: tokens.color.text.muted }}>V1 Last updated 21/04/2026</span>
          )}
          {/* G2: Disclose dropdown */}
          <div style={{ position: 'relative' }}>
            <button type="button" onClick={() => setDiscloseOpen(!discloseOpen)} style={{
              padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: '#DC2626', color: '#fff', fontSize: 12, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              Disclose your position <span style={{ fontSize: 10 }}>▼</span>
            </button>
            {discloseOpen && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: 4, zIndex: 50,
                background: '#fff', border: `1px solid ${tokens.color.border}`, borderRadius: 8,
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)', overflow: 'hidden', minWidth: 200,
              }}>
                {['Share with your ex', 'Share with a mediator', 'Share with your solicitor'].map(opt => (
                  <button key={opt} type="button" onClick={() => { setDiscloseOpen(false); setShareModal('form'); }} style={{
                    display: 'block', width: '100%', padding: '10px 14px', border: 'none',
                    background: 'transparent', cursor: 'pointer', fontSize: 13, textAlign: 'left',
                    color: tokens.color.ink,
                  }}>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 600 }}>S</div>
        </div>
      </header>

      {/* Dev toggles */}
      <div style={{ padding: '6px 20px', background: '#F5F5F4', borderBottom: `1px solid ${tokens.color.border}`, display: 'flex', gap: 12, fontSize: 11, flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
          <input type="checkbox" checked={bankOpen} onChange={() => setBankOpen(!bankOpen)} /> Bank panel open
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
          <input type="checkbox" checked={childrenDisclosed} onChange={() => setChildrenDisclosed(!childrenDisclosed)} /> Children disclosed
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
          <input type="checkbox" checked={outgoingsConfirmed} onChange={() => setOutgoingsConfirmed(!outgoingsConfirmed)} /> Outgoings confirmed
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
          <input type="checkbox" checked={hasShared} onChange={() => setHasShared(!hasShared)} /> Post-share state
        </label>
      </div>

      {/* 3-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 260px', flex: 1 }}>

        {/* G13: Left rail — full Form E nav */}
        <nav style={{ padding: '16px 12px', borderRight: `1px solid ${tokens.color.border}`, background: '#fff', position: 'sticky', top: 0, alignSelf: 'start', maxHeight: '100dvh', overflow: 'auto' }}>
          <Link href="/dev/proto/post-connect-dashboard" style={{ display: 'block', fontSize: 12, color: tokens.color.text.sub, textDecoration: 'none', marginBottom: 12 }}>
            &lt; Back to Dashboard
          </Link>
          <NavSection items={LEFT_NAV} />
        </nav>

        {/* Middle column */}
        <main style={{ padding: '20px 28px 60px', background: '#fff' }}>
          {/* G8: Post-share banner */}
          {hasShared && (
            <div style={{
              padding: '16px 20px', marginBottom: 20, borderRadius: 10,
              background: '#14532D', color: '#fff', textAlign: 'center',
            }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>You can now access your shared position</div>
              <button type="button" style={{
                padding: '8px 20px', borderRadius: 6, border: '2px solid #fff',
                background: 'transparent', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>
                Go to shared position
              </button>
            </div>
          )}

          <p style={{ margin: '0 0 4px', fontSize: 13, color: tokens.color.text.sub, lineHeight: 1.5 }}>
            This is your private space to work out your own position and then you can choose to disclose
          </p>
          <h1 style={{ margin: '0 0 6px', fontFamily: tokens.font.serif, fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: tokens.color.ink }}>
            Sarah&rsquo;s Picture
          </h1>
          <p style={{ margin: '0 0 24px', fontSize: 13, color: tokens.color.text.sub, lineHeight: 1.5 }}>
            A structured record of what you own, owe, earn and spend, as of 20 April 2026.
            Based on 247 transactions across 12 months from your connected accounts, plus items you&rsquo;ve added yourself.
          </p>

          {/* G3: Bank accounts accordion */}
          <div style={{ marginBottom: 24, borderRadius: 10, overflow: 'hidden', border: `1px solid ${tokens.color.border}` }}>
            <button type="button" onClick={() => setBankOpen(!bankOpen)} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', border: 'none', cursor: 'pointer',
              background: '#F0FDF4',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#22C55E', fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: tokens.color.ink }}>
                  {bankOpen ? `${accountCount} Bank accounts` : `${accountCount} Bank accounts connected so far`}
                </span>
              </div>
              {!bankOpen && (
                <span style={{ padding: '6px 14px', borderRadius: 6, background: '#DC2626', color: '#fff', fontSize: 12, fontWeight: 600 }}>
                  Connect another bank
                </span>
              )}
            </button>
            {bankOpen && (
              <div style={{ padding: '16px', borderTop: `1px solid ${tokens.color.border}`, background: '#FAFAF9' }}>
                {/* Barclays */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 13, color: tokens.color.ink }}>Barclays</span>
                      <span style={{ fontSize: 11, color: tokens.color.text.muted, marginLeft: 8 }}>This connection last for 87 days</span>
                    </div>
                    <button type="button" style={{ fontSize: 10, padding: '4px 8px', borderRadius: 4, border: `1px solid ${tokens.color.border}`, background: '#fff', color: tokens.color.text.sub, cursor: 'pointer' }}>
                      Disconnect and clear data
                    </button>
                  </div>
                  <div style={{ fontSize: 12, color: tokens.color.ink, paddingLeft: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={{ color: '#22C55E' }}>✓</span> Current account xxxx2312 &nbsp; 12 months of transaction data from 9th April 2027
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: '#22C55E' }}>✓</span> Joint account xxxx7818 &nbsp; 12 months of transaction data from 9th April 2027
                    </div>
                  </div>
                </div>
                {/* Monzo */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 13, color: tokens.color.ink }}>Monzo</span>
                      <span style={{ fontSize: 11, color: tokens.color.text.muted, marginLeft: 8 }}>This connection last for 72 days</span>
                    </div>
                    <button type="button" style={{ fontSize: 10, padding: '4px 8px', borderRadius: 4, border: `1px solid ${tokens.color.border}`, background: '#fff', color: tokens.color.text.sub, cursor: 'pointer' }}>
                      Disconnect and clear data
                    </button>
                  </div>
                  <div style={{ fontSize: 12, color: tokens.color.ink, paddingLeft: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: '#22C55E' }}>✓</span> Current account xxxx2312 &nbsp; 12 months of transaction data from 9th April 2027
                    </div>
                  </div>
                </div>
                <button type="button" style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: '#22C55E', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  Connect another bank
                </button>
              </div>
            )}
          </div>

          {/* G4: Children section */}
          <section style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: tokens.color.text.muted }}>§1</span>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: tokens.color.ink }}>The children</h2>
              <span style={{ fontSize: 13, color: tokens.color.text.muted }}>&mdash; 2 dependants</span>
              <span style={{ marginLeft: 'auto', fontSize: 16, color: tokens.color.text.muted, cursor: 'pointer' }}>⌄</span>
            </div>
            {childrenDisclosed ? (
              <div style={{ paddingLeft: 20 }}>
                <p style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: tokens.color.ink }}>Emma (7) · Jake (4)</p>
                <p style={{ margin: '0 0 4px', fontSize: 13, color: tokens.color.text.sub }}>Primary care: Sarah · Contact with Mark: to be agreed</p>
                <p style={{ margin: '0 0 12px', fontSize: 13, color: tokens.color.text.sub }}>School: St Mary&rsquo;s Primary (state, no fees)</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: tokens.color.ink }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: tokens.color.ink, display: 'inline-block' }} />
                  Bright Horizons Nursery &mdash; childcare
                  <span style={{ padding: '2px 8px', borderRadius: 4, background: '#FEF3C7', color: '#92400E', fontSize: 10, fontWeight: 600 }}>
                    Verified from Barclays xxxx2312
                  </span>
                  <span style={{ marginLeft: 'auto', fontWeight: 600 }}>£600 / month</span>
                </div>
              </div>
            ) : (
              <div style={{ paddingLeft: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 13, color: tokens.color.text.muted }}>Nothing disclosed yet</span>
                <button type="button" style={{
                  padding: '8px 16px', borderRadius: 6, border: 'none',
                  background: tokens.color.ink, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>
                  Add your children information now
                </button>
              </div>
            )}
          </section>

          {/* G5: Your home section */}
          <section style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: tokens.color.text.muted }}>§</span>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: tokens.color.ink }}>Your home</h2>
              <span style={{ fontSize: 13, color: tokens.color.text.muted }}>&mdash; 12 Oak Road, Exeter</span>
              <span style={{ marginLeft: 'auto', fontSize: 16, color: tokens.color.text.muted, cursor: 'pointer' }}>⌄</span>
            </div>
            <div style={{ paddingLeft: 20 }}>
              <p style={{ margin: '0 0 12px', fontSize: 13, color: tokens.color.text.sub }}>
                Joint ownership with Mark · Sarah and children live here; Mark moved out.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 13 }}>
                <span style={{ color: '#D97706' }}>⚡</span>
                Value &mdash; estimated
                <span style={{ padding: '4px 10px', borderRadius: 4, background: '#F97316', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Upload valuation</span>
                <span style={{ marginLeft: 'auto', fontWeight: 600, color: tokens.color.ink }}>£450,000</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: tokens.color.ink, display: 'inline-block' }} />
                Mortgage (Halifax)
                <span style={{ padding: '4px 10px', borderRadius: 4, background: '#F97316', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Upload statement</span>
                <span style={{ marginLeft: 'auto', fontWeight: 600, color: '#DC2626' }}>(£220,000)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, fontSize: 13, borderTop: `1px solid ${tokens.color.border}`, paddingTop: 8 }}>
                <span>Net equity</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: tokens.color.ink }}>£230,000</div>
                  <div style={{ fontSize: 11, color: tokens.color.text.muted }}>(£115,000 each @ 50:50)</div>
                </div>
              </div>
            </div>
          </section>

          {/* Empty sections with + add */}
          {['Other property', 'Debts', 'Pensions', 'Other assets'].map(label => (
            <section key={label} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: tokens.color.ink }}>{label}</h2>
                <button type="button" style={{
                  width: 22, height: 22, borderRadius: '50%', border: 'none',
                  background: tokens.color.ink, color: '#fff', fontSize: 14, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
                }}>+</button>
              </div>
              <p style={{ margin: 0, paddingLeft: 0, fontSize: 13, color: tokens.color.text.muted }}>Nothing disclosed yet</p>
            </section>
          ))}

          {/* G6/G7: Outgoings section */}
          <section style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: tokens.color.ink }}>Outgoings</h2>
              {outgoingsConfirmed ? (
                <button type="button" style={{ fontSize: 12, color: tokens.color.phase.build.accent, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Edit</button>
              ) : (
                <button type="button" style={{
                  width: 22, height: 22, borderRadius: '50%', border: 'none',
                  background: tokens.color.ink, color: '#fff', fontSize: 14, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
                }}>+</button>
              )}
            </div>

            {!outgoingsConfirmed && OUTGOINGS.length > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', marginBottom: 12,
                borderRadius: 8, background: '#F0F9FF', border: `1px solid #BAE6FD`,
              }}>
                <span style={{ fontSize: 16 }}>ℹ</span>
                <div style={{ flex: 1, fontSize: 13, color: tokens.color.ink }}>
                  Complete your spending disclosure based on your real banking transaction data now
                </div>
                <button type="button" onClick={() => setOutgoingsConfirmed(true)} style={{
                  padding: '8px 14px', borderRadius: 6, border: 'none', whiteSpace: 'nowrap',
                  background: tokens.color.ink, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>
                  Complete your spending disclosure
                </button>
              </div>
            )}

            {OUTGOINGS.length === 0 ? (
              <p style={{ margin: 0, fontSize: 13, color: tokens.color.text.muted }}>Nothing disclosed yet</p>
            ) : (
              <div>
                {OUTGOINGS.map(o => (
                  <div key={o.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: `1px solid ${tokens.color.border}` }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{o.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: tokens.color.ink }}>{o.label}</div>
                      {o.sub && <div style={{ fontSize: 12, color: tokens.color.text.muted }}>{o.sub}</div>}
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: tokens.color.ink }}>{o.amount}</div>
                      <span style={{
                        display: 'inline-block', padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 600, marginTop: 2,
                        background: outgoingsConfirmed ? '#D1FAE5' : '#FEF3C7',
                        color: outgoingsConfirmed ? '#047857' : '#92400E',
                      }}>
                        {outgoingsConfirmed ? 'Barclays Bank' : 'Estimated'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>

        {/* Right rail */}
        <aside style={{ padding: '20px 16px', borderLeft: `1px solid ${tokens.color.border}`, background: '#fff', position: 'sticky', top: 0, alignSelf: 'start', maxHeight: '100dvh', overflow: 'auto' }}>
          {/* Snapshot */}
          <div style={{ marginBottom: 16, padding: '14px', borderRadius: 10, background: tokens.color.surface.panel, border: `1px solid ${tokens.color.border}` }}>
            <p style={{ margin: '0 0 8px', fontSize: 9.5, fontWeight: 700, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Snapshot</p>
            {SNAPSHOT.map(m => (
              <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
                <span style={{ color: tokens.color.text.sub }}>{m.label}</span>
                <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>

          {/* G12: Contextual to-do panel */}
          <div style={{
            marginBottom: 16, padding: '14px', borderRadius: 10, minHeight: 180,
            background: '#E5E5E5', border: `1px solid ${tokens.color.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <p style={{ margin: 0, fontSize: 12, color: tokens.color.text.muted, textAlign: 'center', lineHeight: 1.5, padding: '0 8px' }}>
              Contextual to-do panel exposing the section relevant to-dos &mdash; need to design
            </p>
          </div>

          {/* Data sources */}
          <div style={{ marginBottom: 16, padding: '14px', borderRadius: 10, background: tokens.color.surface.panel, border: `1px solid ${tokens.color.border}` }}>
            <p style={{ margin: '0 0 8px', fontSize: 9.5, fontWeight: 700, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Data sources</p>
            {(extractions.length > 0 ? extractions : [{ provider: 'Barclays', account_type: 'Current' }, { provider: 'Barclays', account_type: 'Joint' }, { provider: 'Monzo', account_type: 'Current' }]).map((e: Record<string, string>, i: number) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', fontSize: 12 }}>
                <span style={{ color: tokens.color.ink }}>{e.provider} {e.account_type}</span>
                <span style={{ padding: '2px 7px', borderRadius: 999, background: '#D1FAE5', color: '#047857', fontSize: 10, fontWeight: 600 }}>connected</span>
              </div>
            ))}
          </div>

          {/* Needs attention */}
          <div style={{ marginBottom: 16, padding: '14px', borderRadius: 10, background: tokens.color.surface.panel, border: `1px solid ${tokens.color.border}` }}>
            <p style={{ margin: '0 0 8px', fontSize: 9.5, fontWeight: 700, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Needs your attention</p>
            {['Pensions — no data yet', 'Other assets — no data yet', 'Debts — no data yet'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', fontSize: 12, color: tokens.color.text.sub }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: '#D97706', flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>

          {/* Share CTA */}
          <button type="button" onClick={() => setShareModal('form')} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', height: 46, borderRadius: 11, border: 'none',
            background: '#9A3412', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
            Share with Mark
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '1px 7px', borderRadius: 999, fontSize: 12 }}>3</span>
          </button>
        </aside>
      </div>

      {/* G9: Share modal */}
      {shareModal !== 'closed' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setShareModal('closed')}>
          <div style={{
            background: '#fff', borderRadius: 12, padding: '32px', maxWidth: 480, width: '90%',
            position: 'relative',
          }} onClick={e => e.stopPropagation()}>
            <button type="button" onClick={() => setShareModal('closed')} style={{
              position: 'absolute', top: 16, right: 16, background: 'none', border: 'none',
              fontSize: 24, cursor: 'pointer', color: tokens.color.ink,
            }}>×</button>

            {shareModal === 'form' ? (
              <>
                <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700, color: tokens.color.ink }}>Share your picture</h2>
                <p style={{ margin: '0 0 20px', fontSize: 14, color: tokens.color.text.sub }}>Who do you want to share your picture with?</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: tokens.color.ink, marginBottom: 4 }}>First name</label>
                    <input type="text" style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: `1px solid ${tokens.color.border}`, fontSize: 14, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: tokens.color.ink, marginBottom: 4 }}>Last name</label>
                    <input type="text" style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: `1px solid ${tokens.color.border}`, fontSize: 14, boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: tokens.color.ink, marginBottom: 4 }}>Email address</label>
                  <input type="email" style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: `1px solid ${tokens.color.border}`, fontSize: 14, boxSizing: 'border-box' }} />
                </div>
                <button type="button" onClick={() => { setShareModal('sent'); setHasShared(true); }} style={{
                  padding: '12px 24px', borderRadius: 6, border: 'none',
                  background: '#DC2626', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}>
                  Share my picture now
                </button>
              </>
            ) : (
              <>
                <h2 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 700, color: tokens.color.ink }}>Your invite has been sent</h2>
                <p style={{ margin: '0 0 4px', fontSize: 14, color: tokens.color.text.sub }}>You have sent a shared link via email to Mark:</p>
                <p style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 600, color: tokens.color.ink }}>Mark.Smith365@gmail.com</p>
                <button type="button" onClick={() => setShareModal('closed')} style={{
                  padding: '12px 24px', borderRadius: 6, border: 'none',
                  background: '#DC2626', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}>
                  Complete
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* G11: Footer */}
      <footer style={{ borderTop: `1px solid ${tokens.color.border}`, padding: '32px 40px', background: '#FAFAF9' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, maxWidth: 1200, margin: '0 auto', marginBottom: 24 }}>
          {[
            { heading: 'Support', links: ['Help centre', 'Contact us', 'Speak to an advisor', 'FAQs', 'Find a mediator', 'Find a solicitor', 'Placeholder text'] },
            { heading: 'Preparation', links: [] },
            { heading: 'Sharing & Collaboration', links: [] },
            { heading: 'Finalisation', links: [] },
          ].map(col => (
            <div key={col.heading}>
              <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: tokens.color.ink }}>{col.heading}</h4>
              {col.links.map(link => (
                <div key={link} style={{ marginBottom: 6 }}>
                  <a href="#" style={{ fontSize: 13, color: tokens.color.text.sub, textDecoration: 'underline' }}>{link}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: tokens.color.text.muted, maxWidth: 1200, margin: '0 auto' }}>
          <span>Privacy</span>
          <span>Copyright Decouple 2026</span>
        </div>
      </footer>
    </div>
  );
}
