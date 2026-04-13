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
      className="text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{
        backgroundColor: variant === 'bank' ? 'var(--color-green-50)' : 'var(--color-amber-50)',
        color: variant === 'bank' ? 'var(--color-green-600)' : 'var(--color-amber-600)',
      }}
    >
      {variant === 'bank' ? `${bankName ?? 'Bank'} connection` : 'Self disclosed'}
    </span>
  )
}

function SummaryRow({ label, badge, bankName }: { label: string; badge: BadgeVariant; bankName?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2">
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
  const answers = confirmations[0]?.answers ?? {}
  const propertyValue = answers['property-value'] ? parseInt(answers['property-value'].replace(/,/g, ''), 10) : null
  const isJoint = answers['property-joint'] === 'yes'
  const hasPension = confirmations.some((c: SectionConfirmation) =>
    c.sectionKey === 'pensions' && c.confirmedFacts.some((f: string) => f.includes('at least one')),
  )
  const hasDebts = confirmations.some((c: SectionConfirmation) =>
    c.sectionKey === 'debts' && c.confirmedFacts.some((f: string) => f.includes('debts to disclose')),
  )

  return (
    <div className="px-6 pt-8 pb-12">
      <div className="max-w-[var(--content-max-width)] mx-auto">
        <button
          onClick={onBack}
          className="text-sm font-medium text-blue-600 hover:underline mb-6"
        >
          &larr; Back to your dashboard
        </button>

        <h2 className="text-2xl font-bold text-ink mb-6">Your financial picture</h2>

        {/* ═══ Accounts card ═══ */}
        <SectionCard title="Accounts" delay={0}>
          <SummaryRow
            label={`${accountCount} ${bankName} bank account${accountCount !== 1 ? 's' : ''}`}
            badge="bank"
            bankName={bankName}
          />
          <p className="text-xs text-ink-tertiary ml-7 -mt-1 mb-2">
            12 months of transaction data
          </p>
          <AddButton label="Connect another bank account" />
        </SectionCard>

        {/* ═══ Income card ═══ */}
        <SectionCard title="Income" delay={100}>
          {salary && (
            <>
              <SummaryRow label={`You are employed by ${salary.source}`} badge="bank" bankName={bankName} />
              <SummaryRow label={`You receive £${salary.amount.toLocaleString()} net monthly salary`} badge="bank" bankName={bankName} />
            </>
          )}
          {benefits.map((b, i) => (
            <div key={i}>
              <SummaryRow label={`You receive £${b.amount}/month in ${b.source}`} badge="bank" bankName={bankName} />
            </div>
          ))}
          <AddButton label={`Manually add income not shown in connected ${bankName} account`} />
        </SectionCard>

        {/* ═══ Property card ═══ */}
        <SectionCard title="Property" delay={200}>
          {propertyValue && (
            <SummaryRow
              label={`You ${isJoint ? 'jointly own' : 'own'} a property estimated value £${propertyValue.toLocaleString()}`}
              badge="self"
            />
          )}
          {mortgage && (
            <SummaryRow label={`You have a mortgage with ${mortgage.payee}`} badge="bank" bankName={bankName} />
          )}
          <SummaryRow label="You have no second property" badge="self" />
          <AddButton label="Declare further property interests" />
        </SectionCard>

        {/* ═══ Spending card (TBC) ═══ */}
        <SectionCard title="Spending" delay={300}>
          <div className="py-4 text-center">
            <p className="text-sm text-ink-tertiary">Panel design pending</p>
          </div>
          <AddButton label="Add spending details" />
        </SectionCard>

        {/* ═══ Debts card (TBC) ═══ */}
        <SectionCard title="Debts" delay={400}>
          {hasDebts ? (
            <div className="py-2">
              <SummaryRow label="You have debts to disclose" badge="self" />
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="text-sm text-ink-tertiary">No debts disclosed</p>
            </div>
          )}
          <AddButton label="Add debt details" />
        </SectionCard>

        {/* ═══ Empty sections ═══ */}
        <EmptySection label={hasPension ? 'Pensions disclosed' : 'No pensions disclosed'} delay={500} />
        <EmptySection label="No businesses disclosed" delay={600} />
        <EmptySection label="No other assets disclosed" delay={700} />

        {/* ═══ Non-financial sections ═══ */}
        <div className="mt-6 space-y-3">
          <NonFinancialCard label="Build your children picture now" action="Start outline now" />
          <NonFinancialCard label="Your needs after separation" action="Complete needs picture" />
        </div>
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
      className="mb-3 bg-white rounded-lg border border-grey-100 overflow-hidden animate-fade-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="px-5 py-3 border-b border-grey-100">
        <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">{title}</span>
      </div>
      <div className="px-5 py-2">{children}</div>
    </div>
  )
}

function AddButton({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-2 text-sm text-blue-600 hover:underline py-2 mt-1">
      <Plus size={14} />
      <span>{label}</span>
    </button>
  )
}

function EmptySection({ label, delay }: { label: string; delay: number }) {
  return (
    <div
      className="mb-3 bg-white rounded-lg border border-grey-100 px-5 py-4 flex items-center justify-between animate-fade-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <span className="text-sm text-ink-secondary">{label}</span>
      <button className="text-blue-600 hover:underline">
        <Plus size={16} />
      </button>
    </div>
  )
}

function NonFinancialCard({ label, action }: { label: string; action: string }) {
  return (
    <div className="bg-white rounded-lg border border-grey-100 px-5 py-4 flex items-center justify-between">
      <span className="text-[15px] text-ink">{label}</span>
      <button className="text-sm font-medium text-blue-600 hover:underline">{action}</button>
    </div>
  )
}
