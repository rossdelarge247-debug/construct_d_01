'use client'

import type { ReactNode } from 'react'
import { Check, Plus } from 'lucide-react'
import type { BankStatementExtraction } from '@/lib/ai/extraction-schemas'
import type { ConnectedAccount, SectionConfirmation } from '@/types/hub'

interface FinancialSummaryPageProps {
  extractions: BankStatementExtraction[]
  connectedAccounts: ConnectedAccount[]
  confirmations: SectionConfirmation[]
  onBack: () => void
}

type BadgeVariant = 'bank' | 'self'

function SourceBadge({ variant, bankName }: { variant: BadgeVariant; bankName?: string }) {
  return (
    <span
      className="text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{
        backgroundColor: variant === 'bank' ? 'var(--color-green-50)' : 'var(--color-amber-50)',
        color: variant === 'bank' ? 'var(--color-green-600)' : 'var(--color-amber-600)',
      }}
    >
      {variant === 'bank' ? `${bankName ?? 'Bank'} confirmed` : 'Self disclosed'}
    </span>
  )
}

function SummaryRow({ label, badge, bankName }: { label: string; badge: BadgeVariant; bankName?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <div className="flex items-start gap-2.5">
        <div className="w-5 h-5 mt-0.5 rounded-full bg-green-600 flex items-center justify-center shrink-0">
          <Check size={11} className="text-white" strokeWidth={3} />
        </div>
        <span className="text-[15px] text-ink">{label}</span>
      </div>
      <SourceBadge variant={badge} bankName={bankName} />
    </div>
  )
}

export function FinancialSummaryPage({
  extractions,
  connectedAccounts,
  confirmations,
  onBack,
}: FinancialSummaryPageProps) {
  const bankName = connectedAccounts[0]?.bankName ?? 'Bank'
  const accountCount = connectedAccounts.length
  const salary = extractions.flatMap((e) => e.income_deposits).find((i) => i.type === 'employment')
  const benefits = extractions.flatMap((e) => e.income_deposits).filter((i) => i.type === 'benefits')
  const mortgage = extractions.flatMap((e) => e.regular_payments).find((p) => p.likely_category === 'mortgage')
  const answers = confirmations.reduce((acc: Record<string, string>, c: SectionConfirmation) => ({ ...acc, ...c.answers }), {})
  const propertyValue = answers['property-value'] ? parseInt(answers['property-value'].replace(/,/g, ''), 10) : null
  const mortgageBalance = answers['property-mortgage-balance'] ? parseInt(answers['property-mortgage-balance'].replace(/,/g, ''), 10) : null
  const htbBalance = answers['property-htb-balance'] ? parseInt(answers['property-htb-balance'].replace(/,/g, ''), 10) : null
  const isJoint = answers['property-joint'] === 'joint_partner'
  const scheme = answers['property-scheme']
  const ownershipPct = answers['property-ownership-pct'] ? parseInt(answers['property-ownership-pct'], 10) : null
  const ownsProperty = answers['property-mortgage'] === 'yes' || answers['property-no-signal'] === 'yes_mortgage' || answers['property-no-signal'] === 'yes_outright'

  // Equity calculation matching the new property tree
  let equity: number | null = null
  if (propertyValue) {
    if (scheme === 'shared_ownership' && ownershipPct) {
      equity = Math.round(propertyValue * (ownershipPct / 100)) - (mortgageBalance ?? 0)
    } else if (scheme === 'help_to_buy' && htbBalance) {
      equity = propertyValue - (mortgageBalance ?? 0) - htbBalance
    } else if (mortgageBalance) {
      equity = propertyValue - mortgageBalance
    } else {
      equity = propertyValue // own outright
    }
  }
  const hasPension = confirmations.some((c: SectionConfirmation) =>
    c.sectionKey === 'pensions' && c.confirmedFacts.some((f: string) => f.includes('at least one')),
  )
  const hasDebts = confirmations.some((c: SectionConfirmation) =>
    c.sectionKey === 'debts' && c.confirmedFacts.some((f: string) => f.includes('debts to disclose')),
  )

  return (
    <div className="max-w-[var(--content-max-width)] mx-auto pb-12">
      <button
        onClick={onBack}
        className="text-[13px] font-medium text-blue-600 hover:underline mb-8 inline-block"
      >
        &larr; Back to dashboard
      </button>

      <h2 className="text-[28px] font-bold text-ink mb-8">Your financial picture</h2>

      {/* ═══ Accounts card ═══ */}
      <SectionCard title="Accounts" delay={0}>
        <SummaryRow
          label={`${accountCount} ${bankName} account${accountCount !== 1 ? 's' : ''}`}
          badge="bank"
          bankName={bankName}
        />
        <p className="text-[12px] text-ink-tertiary ml-7 -mt-1 mb-2">
          12 months of transaction data
        </p>
        <AddButton label="Connect another bank account" />
      </SectionCard>

      {/* ═══ Income card ═══ */}
      <SectionCard title="Income" delay={100}>
        {salary && (
          <>
            <SummaryRow label={`Employed by ${salary.source}`} badge="bank" bankName={bankName} />
            <SummaryRow label={`\u00A3${salary.amount.toLocaleString()} net monthly salary`} badge="bank" bankName={bankName} />
          </>
        )}
        {benefits.map((b, i) => (
          <div key={i}>
            <SummaryRow label={`\u00A3${b.amount}/month in ${b.source}`} badge="bank" bankName={bankName} />
          </div>
        ))}
        <AddButton label="Add income not in connected account" />
      </SectionCard>

      {/* ═══ Property card ═══ */}
      <SectionCard title="Property" delay={200}>
        {ownsProperty && propertyValue ? (
          <>
            <SummaryRow
              label={`${isJoint ? 'Jointly own' : 'Own'} property${scheme === 'shared_ownership' && ownershipPct ? ` (${ownershipPct}% shared ownership)` : scheme === 'help_to_buy' ? ' (Help to Buy)' : ''} — estimated \u00A3${propertyValue.toLocaleString()}`}
              badge="self"
            />
            {mortgageBalance && (
              <SummaryRow label={`Mortgage balance: \u00A3${mortgageBalance.toLocaleString()}`} badge={mortgage ? 'bank' : 'self'} bankName={bankName} />
            )}
            {htbBalance && (
              <SummaryRow label={`Help to Buy loan: \u00A3${htbBalance.toLocaleString()}`} badge="self" />
            )}
            {isJoint && (
              <SummaryRow label="Jointly owned — starting position 50/50" badge="self" />
            )}
            {equity !== null && (
              <SummaryRow
                label={equity >= 0
                  ? `Equity: \u00A3${equity.toLocaleString()}${isJoint ? ` — \u00A3${Math.round(equity / 2).toLocaleString()} each` : ''}`
                  : `Negative equity: mortgage exceeds value by \u00A3${Math.abs(equity).toLocaleString()}`}
                badge="self"
              />
            )}
            {mortgage && (
              <SummaryRow label={`Mortgage with ${mortgage.payee}`} badge="bank" bankName={bankName} />
            )}
          </>
        ) : ownsProperty ? (
          <SummaryRow label="Property owned — details to be confirmed" badge="self" />
        ) : (
          <SummaryRow label="No property to disclose" badge="self" />
        )}
        <AddButton label="Declare further property" />
      </SectionCard>

      {/* ═══ Spending card (TBC) ═══ */}
      <SectionCard title="Spending" delay={300}>
        <div className="py-6 text-center">
          <p className="text-[13px] text-ink-tertiary">Panel design pending</p>
        </div>
        <AddButton label="Add spending details" />
      </SectionCard>

      {/* ═══ Debts card (TBC) ═══ */}
      <SectionCard title="Debts" delay={400}>
        {hasDebts ? (
          <div className="py-2">
            <SummaryRow label="Debts to disclose" badge="self" />
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-[13px] text-ink-tertiary">No debts disclosed</p>
          </div>
        )}
        <AddButton label="Add debt details" />
      </SectionCard>

      {/* ═══ Empty sections ═══ */}
      <EmptySection label={hasPension ? 'Pensions disclosed' : 'No pensions disclosed'} delay={500} />
      <EmptySection label="No businesses disclosed" delay={600} />
      <EmptySection label="No other assets disclosed" delay={700} />

      {/* ═══ Non-financial sections ═══ */}
      <div className="mt-8 space-y-4">
        <NonFinancialCard label="Build your children picture" action="Start outline" />
        <NonFinancialCard label="Your needs after separation" action="Complete needs picture" />
      </div>
    </div>
  )
}

// ═══ Sub-components ═══

function SectionCard({
  title,
  delay,
  children,
}: {
  title: string
  delay: number
  children: ReactNode
}) {
  return (
    <div
      className="mb-4 bg-white overflow-hidden animate-fade-in"
      style={{
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
      }}
    >
      <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--color-grey-100)' }}>
        <span className="text-[16px] font-semibold text-ink">{title}</span>
      </div>
      <div className="px-6 py-3">{children}</div>
    </div>
  )
}

function AddButton({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-2 text-[13px] text-blue-600 hover:underline py-2 mt-1">
      <Plus size={14} />
      <span>{label}</span>
    </button>
  )
}

function EmptySection({ label, delay }: { label: string; delay: number }) {
  return (
    <div
      className="mb-4 bg-white px-6 py-5 flex items-center justify-between animate-fade-in"
      style={{
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
      }}
    >
      <span className="text-[13px] text-ink-secondary">{label}</span>
      <button className="text-blue-600 hover:underline">
        <Plus size={16} />
      </button>
    </div>
  )
}

function NonFinancialCard({ label, action }: { label: string; action: string }) {
  return (
    <div
      className="bg-white px-6 py-5 flex items-center justify-between"
      style={{
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <span className="text-[15px] text-ink">{label}</span>
      <button className="text-[13px] font-medium text-blue-600 hover:underline">{action}</button>
    </div>
  )
}
