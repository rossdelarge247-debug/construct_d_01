'use client';

import { useState } from 'react';
import { tokens } from '@/styles/tokens';
import { BrandBar } from '../components/BrandBar';
import { BucketPicker } from '../components/BucketPicker';
import { ExpansionToggle } from '../components/ExpansionToggle';
import { Footer } from '../components/Footer';
import { TopBar } from '../components/TopBar';
import { useProto } from '../lib/proto-context';
import type {
  DebtsBracket,
  IncomeBracket,
  PensionValueBracket,
  PropertyEquityBracket,
  Quantitative,
  SavingsCashBracket,
  TotalAssetsBracket,
} from '../lib/types';

const INCOME_OPTIONS: ReadonlyArray<{ value: IncomeBracket; label: string }> = [
  { value: '<2k', label: '<£2k' },
  { value: '2-4k', label: '£2-4k' },
  { value: '4-6k', label: '£4-6k' },
  { value: '6-10k', label: '£6-10k' },
  { value: '>10k', label: '>£10k' },
];

const TOTAL_ASSETS_OPTIONS: ReadonlyArray<{ value: TotalAssetsBracket; label: string }> = [
  { value: '<10k', label: '<£10k' },
  { value: '10-50k', label: '£10-50k' },
  { value: '50-200k', label: '£50-200k' },
  { value: '200-500k', label: '£200-500k' },
  { value: '500k-1M', label: '£500k-1M' },
  { value: '>1M', label: '>£1M' },
];

const PROPERTY_EQUITY_OPTIONS: ReadonlyArray<{ value: PropertyEquityBracket; label: string }> = [
  { value: '<50k', label: '<£50k' },
  { value: '50-150k', label: '£50-150k' },
  { value: '150-300k', label: '£150-300k' },
  { value: '300-500k', label: '£300-500k' },
  { value: '500k+', label: '£500k+' },
];

const SAVINGS_OPTIONS: ReadonlyArray<{ value: SavingsCashBracket; label: string }> = [
  { value: '<5k', label: '<£5k' },
  { value: '5-20k', label: '£5-20k' },
  { value: '20-50k', label: '£20-50k' },
  { value: '50-100k', label: '£50-100k' },
  { value: '100k+', label: '£100k+' },
];

const DEBTS_OPTIONS: ReadonlyArray<{ value: DebtsBracket; label: string }> = [
  { value: 'none', label: 'None' },
  { value: '<5k', label: '<£5k' },
  { value: '5-15k', label: '£5-15k' },
  { value: '15-30k', label: '£15-30k' },
  { value: '30k+', label: '£30k+' },
];

const PENSION_OPTIONS: ReadonlyArray<{ value: PensionValueBracket; label: string }> = [
  { value: 'none', label: 'None' },
  { value: '<25k', label: '<£25k' },
  { value: '25-100k', label: '£25-100k' },
  { value: '100-300k', label: '£100-300k' },
  { value: '300k+', label: '£300k+' },
];

export function O6_6() {
  const { answers, setAnswer, next, back } = useProto();
  const [expanded, setExpanded] = useState(false);

  const quantitative: Quantitative = answers.quantitative ?? {};
  const showPropertyEquity = answers.situation?.home !== 'rent';

  const update = <K extends keyof Quantitative>(key: K, value: Quantitative[K]) => {
    setAnswer('quantitative', { ...quantitative, [key]: value });
  };

  return (
    <main
      style={{
        width: '100%',
        maxWidth: 480,
        margin: '0 auto',
        paddingTop: 24,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <BrandBar />
      <TopBar step={6} total={8} onBack={back} />

      <div
        style={{
          padding: '12px 24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        <h1
          style={{
            margin: 0,
            font: `600 24px/1.15 ${tokens.font.serif}`,
            letterSpacing: '-0.02em',
            color: tokens.color.ink,
          }}
        >
          Your finances at a glance
        </h1>

        <p
          style={{
            margin: 0,
            font: `400 13.5px/1.45 ${tokens.font.sans}`,
            color: tokens.color.text.muted,
            background: 'rgba(0,0,0,0.025)',
            padding: '10px 12px',
            borderRadius: 10,
          }}
        >
          None of this is exact — bucket ranges only. After you sign up and
          connect your bank, we&apos;ll work from the real figures. These
          buckets just help your plan land closer to your actual situation.
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            background: '#FFFFFF',
            border: `1px solid ${tokens.color.border}`,
            borderRadius: 14,
            padding: 14,
          }}
        >
          <BucketPicker<IncomeBracket>
            id="o66-income"
            label="Combined monthly take-home (you and your ex)"
            options={INCOME_OPTIONS}
            selected={quantitative.combined_monthly_income}
            onChange={(value) => update('combined_monthly_income', value)}
          />
          <BucketPicker<TotalAssetsBracket>
            id="o66-total-assets"
            label="Total assets you're aware of (savings + property equity + pensions + other)"
            options={TOTAL_ASSETS_OPTIONS}
            selected={quantitative.total_assets}
            onChange={(value) => update('total_assets', value)}
          />
        </div>

        <ExpansionToggle
          id="o66-expansion"
          label="Add property, savings, debts and pension — unlocks consent-order complexity tier"
          rationale={
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Total assets above £500k typically need a more detailed consent order.</li>
              <li style={{ marginTop: 4 }}>Pension value drives whether pension sharing is in scope.</li>
              <li style={{ marginTop: 4 }}>Debts shape the &ldquo;what to clear before settling&rdquo; steps in your plan.</li>
            </ul>
          }
          open={expanded}
          onToggle={() => setExpanded((v) => !v)}
        >
          {showPropertyEquity && (
            <BucketPicker<PropertyEquityBracket>
              id="o66-property-equity"
              label="Property equity"
              options={PROPERTY_EQUITY_OPTIONS}
              selected={quantitative.property_equity}
              onChange={(value) => update('property_equity', value)}
            />
          )}
          <BucketPicker<SavingsCashBracket>
            id="o66-savings"
            label="Savings and cash"
            options={SAVINGS_OPTIONS}
            selected={quantitative.savings_cash}
            onChange={(value) => update('savings_cash', value)}
          />
          <BucketPicker<DebtsBracket>
            id="o66-debts"
            label="Debts (excluding mortgage)"
            options={DEBTS_OPTIONS}
            selected={quantitative.debts_non_mortgage}
            onChange={(value) => update('debts_non_mortgage', value)}
          />
          <BucketPicker<PensionValueBracket>
            id="o66-pension"
            label="Pension value (rough)"
            options={PENSION_OPTIONS}
            selected={quantitative.pension_value}
            onChange={(value) => update('pension_value', value)}
          />
        </ExpansionToggle>
      </div>

      <div style={{ flex: 1 }} />

      <Footer
        ctaLabel="Continue"
        onContinue={next}
        secondaryActions={
          <button
            type="button"
            onClick={next}
            style={{
              background: 'transparent',
              color: tokens.color.text.sub,
              border: 'none',
              padding: '4px 8px',
              font: `500 13.5px/1.3 ${tokens.font.sans}`,
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            Skip this screen
          </button>
        }
      />
    </main>
  );
}
