'use client'

import { useState } from 'react'
import { cn } from '@/utils/cn'
import type { FinancialPictureItem, DocumentUpload } from '@/types/workspace'

interface DocumentChecklistProps {
  items: FinancialPictureItem[]
  documents: DocumentUpload[]
  hasChildren: boolean
  hasProperty: boolean
  isSelfEmployed: boolean
}

interface ChecklistItem {
  label: string
  why: string
  status: 'done' | 'pending' | 'not_needed' | 'awaiting'
  detail?: string
}

export function DocumentChecklist({ items, documents, hasChildren, hasProperty, isSelfEmployed }: DocumentChecklistProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Build checklist dynamically from what's been provided
  const checklist: ChecklistItem[] = []

  // Current account statements
  const hasCurrentAccount = items.some(i => i.subcategory === 'current_account' || (i.category === 'income' && i.source_document_id))
  const hasBankStatements = documents.some(d => d.classification === 'bank_statement')
  checklist.push({
    label: 'Current account statements (12 months)',
    why: 'Shows income, spending patterns, and regular commitments',
    status: hasBankStatements || hasCurrentAccount ? 'done' : 'pending',
  })

  // Savings
  const hasSavings = items.some(i => i.subcategory === 'savings' || i.subcategory === 'investment')
  checklist.push({
    label: 'Savings & investment statements',
    why: 'Confirms balances across all savings accounts',
    status: hasSavings ? 'done' : 'pending',
  })

  // Payslips
  const hasPayslips = documents.some(d => d.classification === 'payslip' || d.classification === 'p60')
  checklist.push({
    label: 'Payslips (3 months) or P60',
    why: 'Confirms gross and net income, tax, pension contributions',
    status: hasPayslips ? 'done' : 'pending',
  })

  // Mortgage
  if (hasProperty) {
    const hasMortgage = items.some(i => i.subcategory === 'mortgage') || documents.some(d => d.classification === 'mortgage_statement')
    checklist.push({
      label: 'Mortgage statement',
      why: 'Shows outstanding balance, monthly payment, interest rate',
      status: hasMortgage ? 'done' : 'pending',
    })
  }

  // Property valuation
  if (hasProperty) {
    const hasValuation = items.some(i => i.category === 'property' && i.confidence === 'known')
    checklist.push({
      label: 'Property valuation',
      why: 'Establishes property value for settlement. Free from estate agents.',
      status: hasValuation ? 'done' : 'pending',
    })
  }

  // Pension CETVs
  const hasPension = items.some(i => i.category === 'pension')
  const pensionAwaiting = items.some(i => i.category === 'pension' && i.status === 'awaiting')
  checklist.push({
    label: 'Pension CETV letter(s)',
    why: 'Cash Equivalent Transfer Value — takes up to 3 months to receive',
    status: pensionAwaiting ? 'awaiting' : hasPension && items.some(i => i.category === 'pension' && i.confidence === 'known') ? 'done' : 'pending',
    detail: pensionAwaiting ? 'Requested — waiting for response' : undefined,
  })

  // Debts
  const hasDebts = items.some(i => i.category === 'liability' || i.subcategory === 'debt')
  checklist.push({
    label: 'Credit card & loan statements',
    why: 'Shows outstanding debts and monthly payments',
    status: hasDebts ? 'done' : 'pending',
  })

  // Business accounts
  if (isSelfEmployed) {
    const hasBusiness = documents.some(d => d.classification === 'business_accounts' || d.classification === 'tax_return')
    checklist.push({
      label: 'Business accounts & tax returns (2-3 years)',
      why: 'Required for self-employment income assessment',
      status: hasBusiness ? 'done' : 'pending',
    })
  }

  // Partner's income
  const hasPartnerIncome = items.some(i => i.ownership === 'partners' && i.category === 'income')
  checklist.push({
    label: 'Partner\'s income evidence',
    why: 'Their income affects settlement calculations. May come via disclosure.',
    status: hasPartnerIncome ? 'done' : 'pending',
    detail: !hasPartnerIncome ? 'May be provided through formal disclosure later' : undefined,
  })

  const doneCount = checklist.filter(c => c.status === 'done').length
  const totalCount = checklist.length

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-depth px-4 py-2.5 text-sm font-medium text-cream shadow-[var(--shadow-lg)] transition-all hover:bg-ink active:scale-95"
      >
        <span>{doneCount}/{totalCount}</span>
        <span className="hidden sm:inline">documents</span>
      </button>

      {/* Slide-out panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-ink/20 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto bg-surface border-l-[var(--border-card)] border-cream-dark shadow-[var(--shadow-lg)] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-lg font-semibold text-ink">What do I still need?</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-ink-faint hover:text-ink transition-colors text-lg"
              >
                ×
              </button>
            </div>

            <p className="text-sm text-ink-light mb-6 leading-relaxed">
              {doneCount === totalCount
                ? 'You\'ve gathered everything. Your picture is well-evidenced.'
                : `${doneCount} of ${totalCount} document types provided. Each one strengthens your picture.`}
            </p>

            <div className="space-y-3">
              {checklist.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    'rounded-[var(--radius-sm)] border p-3 transition-all',
                    item.status === 'done' ? 'border-sage-light bg-sage-light/10' :
                    item.status === 'awaiting' ? 'border-amber-light bg-amber-light/10' :
                    'border-cream-dark',
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className={cn(
                      'mt-0.5 text-sm shrink-0',
                      item.status === 'done' ? 'text-sage' :
                      item.status === 'awaiting' ? 'text-amber' :
                      'text-ink-faint',
                    )}>
                      {item.status === 'done' ? '✓' : item.status === 'awaiting' ? '⏳' : '○'}
                    </span>
                    <div>
                      <p className={cn(
                        'text-sm',
                        item.status === 'done' ? 'text-ink-light line-through decoration-sage/30' : 'text-ink',
                      )}>
                        {item.label}
                      </p>
                      <p className="text-xs text-ink-faint mt-0.5">{item.why}</p>
                      {item.detail && (
                        <p className="text-xs text-amber mt-1 italic">{item.detail}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-cream-dark">
              <p className="text-xs text-ink-faint leading-relaxed">
                Not every document is essential right away. You can share your picture with a mediator once the key items are in place, and add the rest as they become available.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  )
}
