'use client'

import { useState } from 'react'
import type { ConfigAnswers } from '@/types/hub'

interface DiscoveryFlowProps {
  config: ConfigAnswers
  onConfigUpdate: (updates: Partial<ConfigAnswers>) => void
  onConfigComplete: () => void
}

type ConfigStep = 'welcome' | 'v1_replay' | 'employment' | 'property' | 'pensions' | 'savings' | 'debts' | 'other_assets' | 'summary'

const STEP_ORDER: ConfigStep[] = ['welcome', 'employment', 'property', 'pensions', 'savings', 'debts', 'other_assets', 'summary']

export function DiscoveryFlow({ config, onConfigUpdate, onConfigComplete }: DiscoveryFlowProps) {
  const [currentStep, setCurrentStep] = useState<ConfigStep>('welcome')
  const stepIndex = STEP_ORDER.indexOf(currentStep)
  const totalSteps = STEP_ORDER.length

  const goNext = () => {
    const nextIndex = stepIndex + 1
    if (nextIndex < totalSteps) {
      setCurrentStep(STEP_ORDER[nextIndex])
    }
  }

  const goBack = () => {
    const prevIndex = stepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(STEP_ORDER[prevIndex])
    }
  }

  return (
    <div className="bg-white rounded-lg p-8" style={{ boxShadow: 'var(--shadow-hero)' }}>
      {/* Progress bar */}
      <div className="w-full h-1 bg-grey-100 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-ink rounded-full"
          style={{
            width: `${((stepIndex + 1) / totalSteps) * 100}%`,
            transition: 'width var(--transition-progress)',
          }}
        />
      </div>

      {currentStep === 'welcome' && (
        <WelcomeStep onNext={goNext} />
      )}
      {currentStep === 'employment' && (
        <EmploymentStep config={config} onUpdate={onConfigUpdate} onNext={goNext} onBack={goBack} />
      )}
      {currentStep === 'property' && (
        <PropertyStep config={config} onUpdate={onConfigUpdate} onNext={goNext} onBack={goBack} />
      )}
      {currentStep === 'pensions' && (
        <PensionsStep config={config} onUpdate={onConfigUpdate} onNext={goNext} onBack={goBack} />
      )}
      {currentStep === 'savings' && (
        <SavingsStep config={config} onUpdate={onConfigUpdate} onNext={goNext} onBack={goBack} />
      )}
      {currentStep === 'debts' && (
        <DebtsStep config={config} onUpdate={onConfigUpdate} onNext={goNext} onBack={goBack} />
      )}
      {currentStep === 'other_assets' && (
        <OtherAssetsStep config={config} onUpdate={onConfigUpdate} onNext={goNext} onBack={goBack} />
      )}
      {currentStep === 'summary' && (
        <SummaryStep config={config} onComplete={onConfigComplete} onBack={goBack} />
      )}
    </div>
  )
}

// ═══ Shared layout ═══

function StepLayout({
  label,
  children,
  onNext,
  onBack,
}: {
  label: string
  children: React.ReactNode
  onNext: () => void
  onBack?: () => void
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide mb-2">{label}</p>
      {children}
      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={onNext}
          className="px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-md hover:opacity-90 transition-opacity"
        >
          Next
        </button>
        {onBack && (
          <button onClick={onBack} className="text-sm text-blue-600 hover:underline">
            Back
          </button>
        )}
      </div>
    </div>
  )
}

function RadioOption({
  name,
  value,
  label,
  checked,
  onChange,
  children,
}: {
  name: string
  value: string
  label: string
  checked: boolean
  onChange: (value: string) => void
  children?: React.ReactNode
}) {
  return (
    <div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          className="w-4 h-4 border-grey-200 text-ink focus:ring-blue-600"
        />
        <span className="text-sm text-ink">{label}</span>
      </label>
      {checked && children && (
        <div className="ml-7 mt-2">{children}</div>
      )}
    </div>
  )
}

// ═══ Step: Welcome ═══

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-ink tracking-tight">
        Start building your financial picture now
      </h2>
      <p className="mt-4 text-sm text-ink-secondary leading-relaxed">
        Start with rough estimates, or a recent current account bank statement, it takes seconds to begin
        preparing your disclosure picture. We will guide you through exactly what is needed, and you can come
        back as many times as needed.
      </p>
      <button
        onClick={onNext}
        className="mt-6 px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-md hover:opacity-90 transition-opacity"
      >
        Get started
      </button>
    </div>
  )
}

// ═══ Step: Employment ═══

function EmploymentStep({
  config,
  onUpdate,
  onNext,
  onBack,
}: {
  config: ConfigAnswers
  onUpdate: (u: Partial<ConfigAnswers>) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <StepLayout label="Income : Employment" onNext={onNext} onBack={onBack}>
      <h3 className="text-lg font-medium text-ink">How do you earn your income?</h3>
      <div className="mt-4 space-y-3">
        <RadioOption name="employment" value="employed" label="Employed (salary/wages)" checked={config.employment === 'employed'} onChange={(v) => onUpdate({ employment: v as ConfigAnswers['employment'] })} />
        <RadioOption name="employment" value="self_employed" label="Self-employed or company director" checked={config.employment === 'self_employed'} onChange={(v) => onUpdate({ employment: v as ConfigAnswers['employment'] })}>
          <div className="space-y-2">
            <p className="text-xs text-ink-tertiary">What&apos;s your business structure?</p>
            {(['sole_trader', 'limited', 'partnership', 'llp'] as const).map((s) => (
              <RadioOption key={s} name="business" value={s} label={{ sole_trader: 'Sole trader', limited: 'Limited company', partnership: 'Partnership', llp: 'LLP' }[s]} checked={config.businessStructure === s} onChange={(v) => onUpdate({ businessStructure: v as ConfigAnswers['businessStructure'] })} />
            ))}
          </div>
        </RadioOption>
        <RadioOption name="employment" value="both" label="Both" checked={config.employment === 'both'} onChange={(v) => onUpdate({ employment: v as ConfigAnswers['employment'] })} />
        <RadioOption name="employment" value="not_working" label="Not currently working" checked={config.employment === 'not_working'} onChange={(v) => onUpdate({ employment: v as ConfigAnswers['employment'] })} />
        <RadioOption name="employment" value="retired" label="Retired" checked={config.employment === 'retired'} onChange={(v) => onUpdate({ employment: v as ConfigAnswers['employment'] })} />
      </div>
    </StepLayout>
  )
}

// ═══ Step: Property ═══

function PropertyStep({
  config,
  onUpdate,
  onNext,
  onBack,
}: {
  config: ConfigAnswers
  onUpdate: (u: Partial<ConfigAnswers>) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <StepLayout label="Assets : Property" onNext={onNext} onBack={onBack}>
      <h3 className="text-lg font-medium text-ink">Do you own a property?</h3>
      <div className="mt-4 space-y-3">
        <RadioOption name="property" value="own_home" label="Yes — I own (or jointly own) my home" checked={config.ownsProperty && config.propertyCount <= 1} onChange={() => onUpdate({ ownsProperty: true, propertyCount: 1 })}>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-ink-tertiary">Do you know the estimated value?</label>
              <input
                type="number"
                placeholder="£"
                value={config.propertyEstimate || ''}
                onChange={(e) => onUpdate({ propertyEstimate: e.target.value ? Number(e.target.value) : null })}
                className="mt-1 w-48 px-3 py-2 text-sm border border-grey-100 rounded-sm focus:border-ink focus:ring-0"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={config.hasMortgage} onChange={(e) => onUpdate({ hasMortgage: e.target.checked })} className="w-4 h-4 rounded border-grey-200 text-ink focus:ring-blue-600" />
                <span className="text-xs text-ink-secondary">I have a mortgage</span>
              </label>
              {config.hasMortgage && (
                <div className="ml-7">
                  <label className="text-xs text-ink-tertiary">Roughly how much is outstanding?</label>
                  <input
                    type="number"
                    placeholder="£"
                    value={config.mortgageEstimate || ''}
                    onChange={(e) => onUpdate({ mortgageEstimate: e.target.value ? Number(e.target.value) : null })}
                    className="mt-1 w-48 px-3 py-2 text-sm border border-grey-100 rounded-sm focus:border-ink focus:ring-0"
                  />
                </div>
              )}
            </div>
          </div>
        </RadioOption>
        <RadioOption name="property" value="own_multiple" label="Yes — I own other property too (buy-to-let, abroad, land)" checked={config.ownsProperty && config.propertyCount > 1} onChange={() => onUpdate({ ownsProperty: true, propertyCount: 2 })} />
        <RadioOption name="property" value="both" label="Both" checked={false} onChange={() => onUpdate({ ownsProperty: true, propertyCount: 2 })} />
        <RadioOption name="property" value="rent" label="No — I rent" checked={!config.ownsProperty} onChange={() => onUpdate({ ownsProperty: false, propertyCount: 0 })} />
        <RadioOption name="property" value="complicated" label="It's complicated" checked={false} onChange={() => onUpdate({ ownsProperty: true })} />
      </div>
    </StepLayout>
  )
}

// ═══ Step: Pensions ═══

function PensionsStep({
  config,
  onUpdate,
  onNext,
  onBack,
}: {
  config: ConfigAnswers
  onUpdate: (u: Partial<ConfigAnswers>) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <StepLayout label="Assets : Pensions" onNext={onNext} onBack={onBack}>
      <h3 className="text-lg font-medium text-ink">Do you have any pensions?</h3>
      <div className="mt-4 space-y-3">
        <RadioOption name="pensions" value="yes_workplace" label="Yes — workplace pension" checked={config.hasPensions} onChange={() => onUpdate({ hasPensions: true })}>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-ink-tertiary">Do you have any idea what it might be worth?</label>
              <input type="number" placeholder="£" value={config.pensionEstimate || ''} onChange={(e) => onUpdate({ pensionEstimate: e.target.value ? Number(e.target.value) : null })} className="mt-1 w-48 px-3 py-2 text-sm border border-grey-100 rounded-sm focus:border-ink focus:ring-0" />
            </div>
          </div>
        </RadioOption>
        <RadioOption name="pensions" value="yes_personal" label="Yes — private/personal pension" checked={false} onChange={() => onUpdate({ hasPensions: true })} />
        <RadioOption name="pensions" value="yes_multiple" label="Yes — more than one" checked={false} onChange={() => onUpdate({ hasPensions: true })} />
        <RadioOption name="pensions" value="not_sure" label="I'm not sure" checked={false} onChange={() => onUpdate({ hasPensions: true })} />
        <RadioOption name="pensions" value="no" label="No" checked={!config.hasPensions} onChange={() => onUpdate({ hasPensions: false, pensionEstimate: null })} />
      </div>
    </StepLayout>
  )
}

// ═══ Step: Savings ═══

function SavingsStep({
  config,
  onUpdate,
  onNext,
  onBack,
}: {
  config: ConfigAnswers
  onUpdate: (u: Partial<ConfigAnswers>) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <StepLayout label="Assets : Savings" onNext={onNext} onBack={onBack}>
      <h3 className="text-lg font-medium text-ink">Do you have any savings, ISAs, or investments?</h3>
      <div className="mt-4 space-y-3">
        <RadioOption name="savings" value="yes_savings" label="Yes — savings accounts" checked={config.hasSavings} onChange={() => onUpdate({ hasSavings: true })}>
          <div>
            <label className="text-xs text-ink-tertiary">Roughly how much across all accounts?</label>
            <input type="number" placeholder="£" value={config.savingsEstimate || ''} onChange={(e) => onUpdate({ savingsEstimate: e.target.value ? Number(e.target.value) : null })} className="mt-1 w-48 px-3 py-2 text-sm border border-grey-100 rounded-sm focus:border-ink focus:ring-0" />
          </div>
        </RadioOption>
        <RadioOption name="savings" value="yes_investments" label="Yes — ISAs, shares, bonds, or investment funds" checked={false} onChange={() => onUpdate({ hasSavings: true })} />
        <RadioOption name="savings" value="yes_both" label="Yes — both" checked={false} onChange={() => onUpdate({ hasSavings: true })} />
        <RadioOption name="savings" value="no" label="No" checked={!config.hasSavings} onChange={() => onUpdate({ hasSavings: false, savingsEstimate: null })} />
      </div>
    </StepLayout>
  )
}

// ═══ Step: Debts ═══

function DebtsStep({
  config,
  onUpdate,
  onNext,
  onBack,
}: {
  config: ConfigAnswers
  onUpdate: (u: Partial<ConfigAnswers>) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <StepLayout label="Liabilities : Debts" onNext={onNext} onBack={onBack}>
      <h3 className="text-lg font-medium text-ink">Do you have any debts, loans, or credit cards?</h3>
      <div className="mt-4 space-y-3">
        <RadioOption name="debts" value="yes_cards" label="Yes — credit cards" checked={config.hasDebts} onChange={() => onUpdate({ hasDebts: true })}>
          <div>
            <label className="text-xs text-ink-tertiary">Roughly, how much do you owe in total?</label>
            <input type="number" placeholder="£" value={config.debtsEstimate || ''} onChange={(e) => onUpdate({ debtsEstimate: e.target.value ? Number(e.target.value) : null })} className="mt-1 w-48 px-3 py-2 text-sm border border-grey-100 rounded-sm focus:border-ink focus:ring-0" />
          </div>
        </RadioOption>
        <RadioOption name="debts" value="yes_loans" label="Yes — loans (personal, car, student)" checked={false} onChange={() => onUpdate({ hasDebts: true })} />
        <RadioOption name="debts" value="yes_both" label="Yes — both" checked={false} onChange={() => onUpdate({ hasDebts: true })} />
        <RadioOption name="debts" value="no" label="No" checked={!config.hasDebts} onChange={() => onUpdate({ hasDebts: false, debtsEstimate: null })} />
      </div>
    </StepLayout>
  )
}

// ═══ Step: Other assets ═══

function OtherAssetsStep({
  config,
  onUpdate,
  onNext,
  onBack,
}: {
  config: ConfigAnswers
  onUpdate: (u: Partial<ConfigAnswers>) => void
  onNext: () => void
  onBack: () => void
}) {
  const toggleAsset = (asset: string) => {
    const current = config.otherAssets
    const updated = current.includes(asset)
      ? current.filter((a) => a !== asset)
      : [...current, asset]
    onUpdate({ otherAssets: updated })
  }

  const assets = [
    { value: 'crypto', label: 'Cryptocurrency or digital assets' },
    { value: 'vehicle', label: 'A vehicle worth over £500' },
    { value: 'valuables', label: 'Valuables (jewellery, art, collections) worth over £500' },
    { value: 'life_insurance', label: 'Life insurance or endowment policies' },
    { value: 'overseas', label: 'Assets in another country' },
  ]

  return (
    <StepLayout label="Assets : Other" onNext={onNext} onBack={onBack}>
      <h3 className="text-lg font-medium text-ink">Do you have any of these?</h3>
      <div className="mt-4 space-y-3">
        {assets.map((asset) => (
          <label key={asset.value} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.otherAssets.includes(asset.value)}
              onChange={() => toggleAsset(asset.value)}
              className="w-4 h-4 rounded border-grey-200 text-ink focus:ring-blue-600"
            />
            <span className="text-sm text-ink">{asset.label}</span>
          </label>
        ))}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.otherAssets.length === 0}
            onChange={() => onUpdate({ otherAssets: [] })}
            className="w-4 h-4 rounded border-grey-200 text-ink focus:ring-blue-600"
          />
          <span className="text-sm text-ink">None of these</span>
        </label>
      </div>
    </StepLayout>
  )
}

// ═══ Step: Summary ═══

function SummaryStep({
  config,
  onComplete,
  onBack,
}: {
  config: ConfigAnswers
  onComplete: () => void
  onBack: () => void
}) {
  const lozenges = generateLozengeLabels(config)

  return (
    <div>
      <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide mb-2">End of the beginning</p>
      <h3 className="text-lg font-medium text-ink">We now know everything you need to prepare</h3>
      <div className="mt-6 flex flex-wrap gap-2">
        {lozenges.map((label) => (
          <span key={label} className="px-4 py-1.5 bg-slate-700 text-white text-xs font-medium rounded-pill">
            {label}
          </span>
        ))}
      </div>
      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={onComplete}
          className="px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-md hover:opacity-90 transition-opacity"
        >
          Next
        </button>
        <button onClick={onBack} className="text-sm text-blue-600 hover:underline">
          Back
        </button>
      </div>
    </div>
  )
}

function generateLozengeLabels(config: ConfigAnswers): string[] {
  const labels: string[] = ['Income']

  if (config.ownsProperty) {
    labels.push(config.propertyCount > 1 ? `${config.propertyCount} Properties` : '1 Mortgage')
  }

  labels.push(config.hasSavings ? '2 Accounts' : '1 Account')

  if (config.hasPensions) labels.push('Pensions')

  labels.push('Spending')

  if (config.hasDebts) labels.push('Debts')

  if (config.otherAssets.length > 0) {
    labels.push(`${config.otherAssets.length} Other asset${config.otherAssets.length > 1 ? 's' : ''}`)
  }

  if (config.employment === 'self_employed' || config.employment === 'both') {
    labels.push('Business')
  }

  return labels
}
