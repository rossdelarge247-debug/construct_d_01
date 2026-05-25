'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useBankData } from '../_context/bank-data-context';
import { useProfiling } from '../_context/profiling-context';
import type { BankStatementExtraction } from '@/lib/ai/extraction-schemas';
import styles from './your-picture.module.css';

const FALLBACK_SNAPSHOT = [
  { label: 'Net position', value: '£54,560', negative: false },
  { label: 'Assets', value: '£282,240', negative: false },
  { label: 'Debts', value: '(£227,680)', negative: true },
  { label: 'Monthly gap', value: '(£892)', negative: true },
];

const FALLBACK_OUTGOINGS: OutgoingItem[] = [
  { icon: '🏠', label: 'Household utilities & maintenance', amount: '£300 p/m', sub: null },
  { icon: '🏠', label: 'Personal & Living Expenses', amount: '£380 p/m', sub: null },
  { icon: '🚗', label: 'Transportation costs', amount: '£560 p/m', sub: null },
  { icon: '👶', label: 'Child expenses', amount: '£400 p/m', sub: 'Nursery… Clothing…' },
  { icon: '🏠', label: 'Leisure & other expenditure', amount: '£250 p/m', sub: 'Gym… Cinema…' },
];

type OutgoingItem = { icon: string; label: string; amount: string; sub: string | null };

const CATEGORY_ICONS: Record<string, string> = {
  Housing: '🏠', Groceries: '🛒', Transport: '🚗', Utilities: '🏠',
  'Dining & entertainment': '🍽️', Childcare: '👶', Subscriptions: '📺',
  Insurance: '🛡️',
};

function buildSnapshot(exts: BankStatementExtraction[]) {
  const totalBalance = exts.reduce((s, e) => s + (e.closing_balance ?? 0), 0);
  const totalIncome = exts.flatMap(e => e.income_deposits).reduce((s, i) => s + i.amount, 0);
  const totalSpending = exts.flatMap(e => e.spending_categories).reduce((s, c) => s + c.monthly_average, 0);
  const mortgageMonthly = exts.flatMap(e => e.regular_payments.filter(r => r.likely_category === 'mortgage')).reduce((s, p) => s + p.amount, 0);
  const estimatedMortgageDebt = mortgageMonthly > 0 ? mortgageMonthly * 12 * 20 : 220000;
  const assets = totalBalance + 450000;
  const netPosition = assets - estimatedMortgageDebt;
  const gap = totalIncome - totalSpending;
  return [
    { label: 'Net position', value: `£${netPosition.toLocaleString()}`, negative: netPosition < 0 },
    { label: 'Assets', value: `£${assets.toLocaleString()}`, negative: false },
    { label: 'Debts', value: `(£${estimatedMortgageDebt.toLocaleString()})`, negative: true },
    { label: 'Monthly gap', value: gap < 0 ? `(£${Math.abs(gap).toLocaleString()})` : `£${gap.toLocaleString()}`, negative: gap < 0 },
  ];
}

function buildOutgoings(exts: BankStatementExtraction[]): OutgoingItem[] {
  return exts.flatMap(e => e.spending_categories).map(c => ({
    icon: CATEGORY_ICONS[c.category] ?? '🏠',
    label: c.category,
    amount: `£${c.monthly_average.toLocaleString()} p/m`,
    sub: null,
  }));
}

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
  if (progress < 0) return <span className={styles.progressNotStarted}>Not ready to start yet</span>;
  const pct = Math.round(progress * 100);
  const fillClass = pct === 100 ? styles.progressComplete : styles.progressPartial;
  return (
    <div className={styles.progressTrack}>
      {pct > 0 && <div className={`${styles.progressFill} ${fillClass}`} style={{ width: `${pct}%` }} />}
    </div>
  );
}

type NavItem = { id: string; label: string; progress?: number; level?: number; children?: NavItem[] };

function NavSection({ items, depth = 0 }: { items: NavItem[]; depth?: number }) {
  return (
    <>
      {items.map(item => (
        <div key={item.id}>
          <div
            className={`${styles.navItem} ${item.children ? styles.navItemParent : styles.navItemChild}`}
            style={{ padding: `4px ${depth * 12}px`, marginTop: depth === 0 && !item.children ? 12 : 2 }}
          >
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
  const { extractions, scenario } = useBankData();
  const { answers: profiling } = useProfiling();
  const [bankOpen, setBankOpen] = useState(false);
  const [childrenDisclosed, setChildrenDisclosed] = useState(true);
  const [outgoingsConfirmed, setOutgoingsConfirmed] = useState(false);
  const [hasShared, setHasShared] = useState(false);
  const [discloseOpen, setDiscloseOpen] = useState(false);
  const [shareModal, setShareModal] = useState<'closed' | 'form' | 'sent'>('closed');

  const hasData = extractions.length > 0;
  const snapshot = useMemo(() => hasData ? buildSnapshot(extractions) : FALLBACK_SNAPSHOT, [extractions, hasData]);
  const outgoings = useMemo(() => hasData ? buildOutgoings(extractions) : FALLBACK_OUTGOINGS, [extractions, hasData]);
  const accountCount = extractions.length || 3;
  const mortgageProvider = useMemo(() => {
    if (profiling.mortgageProvider) return profiling.mortgageProvider;
    const mp = extractions.flatMap(e => e.regular_payments).find(p => p.likely_category === 'mortgage');
    return mp?.payee ?? 'Halifax';
  }, [extractions, profiling.mortgageProvider]);
  const mortgageAmount = useMemo(() => {
    const mp = extractions.flatMap(e => e.regular_payments).find(p => p.likely_category === 'mortgage');
    return mp ? mp.amount * 12 * 20 : 220000;
  }, [extractions]);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.breadcrumb}>
          <span className={styles.breadcrumbBrand}>decouple</span>
          <span>&rsaquo;</span>
          <span>Prepare your picture (disclosure)</span>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.statusBadge}>
            <span className={styles.statusDot} />
            <span style={{ fontWeight: 600 }}>Private view</span>
          </div>
          {hasShared && (
            <span className={styles.versionLabel}>V1 Last updated 21/04/2026</span>
          )}
          {/* G2: Disclose dropdown */}
          <div style={{ position: 'relative' }}>
            <button type="button" onClick={() => setDiscloseOpen(!discloseOpen)} className={`${styles.btn} ${styles.discloseBtn}`}>
              Disclose your position <span className={styles.discloseArrow}>▼</span>
            </button>
            {discloseOpen && (
              <div className={styles.discloseDropdown}>
                {['Share with your ex', 'Share with a mediator', 'Share with your solicitor'].map(opt => (
                  <button key={opt} type="button" onClick={() => { setDiscloseOpen(false); setShareModal('form'); }} className={styles.discloseOption}>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className={styles.avatar}>S</div>
        </div>
      </header>

      {/* Dev toggles */}
      <div className={styles.devToggles}>
        <label className={styles.toggleLabel}>
          <input type="checkbox" checked={bankOpen} onChange={() => setBankOpen(!bankOpen)} /> Bank panel open
        </label>
        <label className={styles.toggleLabel}>
          <input type="checkbox" checked={childrenDisclosed} onChange={() => setChildrenDisclosed(!childrenDisclosed)} /> Children disclosed
        </label>
        <label className={styles.toggleLabel}>
          <input type="checkbox" checked={outgoingsConfirmed} onChange={() => setOutgoingsConfirmed(!outgoingsConfirmed)} /> Outgoings confirmed
        </label>
        <label className={styles.toggleLabel}>
          <input type="checkbox" checked={hasShared} onChange={() => setHasShared(!hasShared)} /> Post-share state
        </label>
      </div>

      {/* 3-column layout */}
      <div className={styles.layout}>

        {/* G13: Left rail — full Form E nav */}
        <nav className={styles.navRail}>
          <Link href="/dev/proto/post-connect-dashboard" className={styles.navBack}>
            &lt; Back to Dashboard
          </Link>
          <NavSection items={LEFT_NAV} />
        </nav>

        {/* Middle column */}
        <main className={styles.mainContent}>
          {/* G8: Post-share banner */}
          {hasShared && (
            <div className={styles.shareBanner}>
              <div className={styles.shareBannerTitle}>You can now access your shared position</div>
              <button type="button" className={styles.shareBannerBtn}>
                Go to shared position
              </button>
            </div>
          )}

          <p className={styles.introSub}>
            This is your private space to work out your own position and then you can choose to disclose
          </p>
          <h1 className={styles.title}>
            Sarah&rsquo;s Picture
          </h1>
          <p className={styles.description}>
            A structured record of what you own, owe, earn and spend, as of 20 April 2026.
            Based on 247 transactions across 12 months from your connected accounts, plus items you&rsquo;ve added yourself.
          </p>

          {/* G3: Bank accounts accordion */}
          <div className={styles.accordion}>
            <button type="button" onClick={() => setBankOpen(!bankOpen)} className={styles.accordionTrigger}>
              <div className={styles.accordionTriggerLabel}>
                <span className={styles.accordionCheck}>✓</span>
                <span className={styles.accordionTitle}>
                  {bankOpen ? `${accountCount} Bank accounts` : `${accountCount} Bank accounts connected so far`}
                </span>
              </div>
              {!bankOpen && (
                <span className={`${styles.btn} ${styles.btnPrimary}`}>
                  Connect another bank
                </span>
              )}
            </button>
            {bankOpen && (
              <div className={styles.accordionContent}>
                {/* Barclays */}
                <div className={styles.bankProvider}>
                  <div className={styles.bankProviderHeader}>
                    <div>
                      <span className={styles.bankProviderName}>Barclays</span>
                      <span className={styles.bankProviderExpiry}>This connection last for 87 days</span>
                    </div>
                    <button type="button" className={styles.btnDisconnect}>
                      Disconnect and clear data
                    </button>
                  </div>
                  <div className={styles.bankAccounts}>
                    <div className={styles.bankAccountRow}>
                      <span className={styles.bankAccountCheck}>✓</span> Current account xxxx2312 &nbsp; 12 months of transaction data from 9th April 2027
                    </div>
                    <div className={styles.bankAccountRow}>
                      <span className={styles.bankAccountCheck}>✓</span> Joint account xxxx7818 &nbsp; 12 months of transaction data from 9th April 2027
                    </div>
                  </div>
                </div>
                {/* Monzo */}
                <div className={styles.bankProvider}>
                  <div className={styles.bankProviderHeader}>
                    <div>
                      <span className={styles.bankProviderName}>Monzo</span>
                      <span className={styles.bankProviderExpiry}>This connection last for 72 days</span>
                    </div>
                    <button type="button" className={styles.btnDisconnect}>
                      Disconnect and clear data
                    </button>
                  </div>
                  <div className={styles.bankAccounts}>
                    <div className={styles.bankAccountRow}>
                      <span className={styles.bankAccountCheck}>✓</span> Current account xxxx2312 &nbsp; 12 months of transaction data from 9th April 2027
                    </div>
                  </div>
                </div>
                <button type="button" className={`${styles.btn} ${styles.btnSuccess}`}>
                  Connect another bank
                </button>
              </div>
            )}
          </div>

          {/* G4: Children section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionId}>§1</span>
              <h2 className={styles.sectionTitle}>The children</h2>
              <span className={styles.sectionSub}>&mdash; 2 dependants</span>
              <span className={styles.sectionCollapse}>⌄</span>
            </div>
            {childrenDisclosed ? (
              <div className={styles.sectionContent}>
                <p className={styles.childrenDetail}>Emma (7) · Jake (4)</p>
                <p className={styles.childrenSub}>Primary care: Sarah · Contact with Mark: to be agreed</p>
                <p className={styles.childrenSub} style={{ marginBottom: 12 }}>School: St Mary&rsquo;s Primary (state, no fees)</p>
                <div className={styles.childrenRow}>
                  <span className={styles.homeDot} />
                  Bright Horizons Nursery &mdash; childcare
                  <span className={`${styles.chip} ${styles.chipVerified} ${styles.chipEstimated}`}>
                    Verified from Barclays xxxx2312
                  </span>
                  <span className={styles.childrenAmount}>£600 / month</span>
                </div>
              </div>
            ) : (
              <div className={styles.sectionContent} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span className={styles.sectionEmpty}>Nothing disclosed yet</span>
                <button type="button" className={`${styles.btn} ${styles.btnNeutral}`}>
                  Add your children information now
                </button>
              </div>
            )}
          </section>

          {/* G5: Your home section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionId}>§</span>
              <h2 className={styles.sectionTitle}>Your home</h2>
              <span className={styles.sectionSub}>&mdash; 12 Oak Road, Exeter</span>
              <span className={styles.sectionCollapse}>⌄</span>
            </div>
            <div className={styles.sectionContent}>
              <p className={styles.childrenSub} style={{ marginBottom: 12 }}>
                Joint ownership with Mark · Sarah and children live here; Mark moved out.
              </p>
              <div className={styles.homeRow}>
                <span className={styles.warningIcon}>⚡</span>
                Value &mdash; estimated
                <button type="button" className={`${styles.btn} ${styles.btnUpload}`}>Upload valuation</button>
                <span className={styles.homeValue}>£450,000</span>
              </div>
              <div className={styles.homeRow} style={{ marginBottom: 8 }}>
                <span className={styles.homeDot} />
                Mortgage ({mortgageProvider})
                <button type="button" className={`${styles.btn} ${styles.btnUpload}`}>Upload statement</button>
                <span className={styles.homeValueDebt}>(£{mortgageAmount.toLocaleString()})</span>
              </div>
              <div className={styles.homeEquity}>
                <span>Net equity</span>
                <div style={{ textAlign: 'right' }}>
                  <div className={styles.homeEquityValue}>£230,000</div>
                  <div className={styles.homeEquitySplit}>(£115,000 each @ 50:50)</div>
                </div>
              </div>
            </div>
          </section>

          {/* Empty sections with + add */}
          {['Other property', 'Debts', 'Pensions', 'Other assets'].map(label => (
            <section key={label} className={styles.section}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <h2 className={styles.sectionTitleBold}>{label}</h2>
                <button type="button" className={styles.btnIcon}>+</button>
              </div>
              <p className={styles.sectionEmpty}>Nothing disclosed yet</p>
            </section>
          ))}

          {/* G6/G7: Outgoings section */}
          <section className={styles.section}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <h2 className={styles.sectionTitleBold}>Outgoings</h2>
              {outgoingsConfirmed ? (
                <button type="button" className={styles.btnEdit}>Edit</button>
              ) : (
                <button type="button" className={styles.btnIcon}>+</button>
              )}
            </div>

            {!outgoingsConfirmed && outgoings.length > 0 && (
              <div className={styles.infoBanner}>
                <span className={styles.infoBannerIcon}>ℹ</span>
                <div className={styles.infoBannerText}>
                  Complete your spending disclosure based on your real banking transaction data now
                </div>
                <button type="button" onClick={() => setOutgoingsConfirmed(true)} className={`${styles.btn} ${styles.btnNeutral}`} style={{ whiteSpace: 'nowrap' }}>
                  Complete your spending disclosure
                </button>
              </div>
            )}

            {outgoings.length === 0 ? (
              <p className={styles.sectionEmpty}>Nothing disclosed yet</p>
            ) : (
              <div>
                {outgoings.map(o => (
                  <div key={o.label} className={styles.outgoingRow}>
                    <span className={styles.outgoingIcon}>{o.icon}</span>
                    <div className={styles.outgoingBody}>
                      <div className={styles.outgoingLabel}>{o.label}</div>
                      {o.sub && <div className={styles.outgoingSub}>{o.sub}</div>}
                    </div>
                    <div className={styles.outgoingAmount}>
                      <div className={styles.outgoingValue}>{o.amount}</div>
                      <span className={`${styles.chip} ${outgoingsConfirmed ? styles.chipConfirmed : styles.chipEstimated}`} style={{ marginTop: 2 }}>
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
        <aside className={styles.rightRail}>
          {/* Snapshot */}
          <div className={styles.card}>
            <p className={styles.cardHeading}>Snapshot</p>
            {snapshot.map(m => (
              <div key={m.label} className={styles.snapshotRow}>
                <span className={styles.snapshotLabel}>{m.label}</span>
                <span className={styles.snapshotValue} style={{ color: m.negative ? 'var(--ds-color-danger)' : 'var(--ds-color-ink)' }}>{m.value}</span>
              </div>
            ))}
          </div>

          {/* G12: Contextual to-do panel */}
          <div className={styles.todoPlaceholder}>
            <p className={styles.todoPlaceholderText}>
              Contextual to-do panel exposing the section relevant to-dos &mdash; need to design
            </p>
          </div>

          {/* Data sources */}
          <div className={styles.card}>
            <p className={styles.cardHeading}>Data sources</p>
            {(extractions.length > 0 ? extractions.map(x => ({ provider: x.provider, account_type: x.account_type })) : [{ provider: 'Barclays', account_type: 'Current' }, { provider: 'Barclays', account_type: 'Joint' }, { provider: 'Monzo', account_type: 'Current' }]).map((e, i) => (
              <div key={i} className={styles.dataSourceRow}>
                <span className={styles.dataSourceName}>{e.provider} {e.account_type}</span>
                <span className={`${styles.chip} ${styles.chipConfirmed} ${styles.chipConnected}`}>connected</span>
              </div>
            ))}
          </div>

          {/* Needs attention */}
          <div className={styles.card}>
            <p className={styles.cardHeading}>Needs your attention</p>
            {['Pensions — no data yet', 'Other assets — no data yet', 'Debts — no data yet'].map(item => (
              <div key={item} className={styles.attentionRow}>
                <span className={styles.attentionDot} />
                {item}
              </div>
            ))}
          </div>

          {/* Share CTA */}
          <button type="button" onClick={() => setShareModal('form')} className={`${styles.btn} ${styles.btnShare}`}>
            Share with Mark
            <span className={styles.btnShareCount}>3</span>
          </button>
        </aside>
      </div>

      {/* G9: Share modal */}
      {shareModal !== 'closed' && (
        <div className={styles.modalOverlay} onClick={() => setShareModal('closed')}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button type="button" onClick={() => setShareModal('closed')} className={styles.modalClose}>×</button>

            {shareModal === 'form' ? (
              <>
                <h2 className={styles.modalTitle}>Share your picture</h2>
                <p className={styles.modalBody}>Who do you want to share your picture with?</p>
                <div className={styles.formGrid}>
                  <div>
                    <label className={styles.formLabel}>First name</label>
                    <input type="text" className={styles.formInput} />
                  </div>
                  <div>
                    <label className={styles.formLabel}>Last name</label>
                    <input type="text" className={styles.formInput} />
                  </div>
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Email address</label>
                  <input type="email" className={styles.formInput} />
                </div>
                <button type="button" onClick={() => { setShareModal('sent'); setHasShared(true); }} className={`${styles.btn} ${styles.btnPrimary}`} style={{ padding: '12px 24px', fontSize: 14 }}>
                  Share my picture now
                </button>
              </>
            ) : (
              <>
                <h2 className={styles.modalTitle} style={{ marginBottom: 12 }}>Your invite has been sent</h2>
                <p className={styles.modalBody} style={{ marginBottom: 4 }}>You have sent a shared link via email to Mark:</p>
                <p style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 600, color: 'var(--ds-color-ink)' }}>Mark.Smith365@gmail.com</p>
                <button type="button" onClick={() => setShareModal('closed')} className={`${styles.btn} ${styles.btnPrimary}`} style={{ padding: '12px 24px', fontSize: 14 }}>
                  Complete
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* G11: Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          {[
            { heading: 'Support', links: ['Help centre', 'Contact us', 'Speak to an advisor', 'FAQs', 'Find a mediator', 'Find a solicitor', 'Placeholder text'] },
            { heading: 'Preparation', links: [] },
            { heading: 'Sharing & Collaboration', links: [] },
            { heading: 'Finalisation', links: [] },
          ].map(col => (
            <div key={col.heading}>
              <h4 className={styles.footerHeading}>{col.heading}</h4>
              {col.links.map(link => (
                <div key={link} style={{ marginBottom: 6 }}>
                  <a href="#" className={styles.footerLink}>{link}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className={styles.footerBottom}>
          <span>Privacy</span>
          <span>Copyright Decouple 2026</span>
        </div>
      </footer>
    </div>
  );
}
