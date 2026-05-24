'use client';

import { tokens } from '@/styles/tokens';
import { AI_PURPLE_DEEP, SparkGlyph } from '../_components/SparkGlyph';
import { AIMarginCard } from '../_components/AIMarginCard';
import { FormTop } from '../_components/FormTop';
import { SectionLabel } from '../_components/SectionLabel';
import { TxnRow } from '../_components/TxnRow';

export default function ConfirmRecurringPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: tokens.color.surface.page,
        display: 'flex',
        flexDirection: 'column',
        
        fontFamily: tokens.font.sans,
      }}
    >
      <FormTop title="Confirm fixed expense" step="3 to confirm" />
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '14px 16px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          maxWidth: 640,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          style={{
            background: tokens.color.surface.panel,
            border: `1px solid ${tokens.color.border}`,
            borderRadius: 12,
            padding: '6px 14px',
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: tokens.color.text.muted,
              marginTop: 8,
            }}
          >
            Detected · 12 months
          </div>
          <TxnRow
            logo="H"
            logoBg="#DBEAFE"
            logoColor="#1E40AF"
            merchant="Halifax Mortgage"
            sub="DD · 12 of 12 months · £1,150"
            amount="£1,150/mo"
          />
        </div>

        <div>
          <h1
            style={{
              fontFamily: tokens.font.serif,
              fontSize: 19,
              fontWeight: 600,
              letterSpacing: '-0.015em',
              color: tokens.color.ink,
              lineHeight: 1.25,
              margin: 0,
            }}
          >
            Add to your fixed monthly expenses?
          </h1>
          <p
            style={{
              fontSize: 12.5,
              color: tokens.color.text.sub,
              marginTop: 4,
              lineHeight: 1.45,
            }}
          >
            Used in needs-based budgeting and ongoing-costs schedule.
          </p>
        </div>

        <div
          style={{
            background: tokens.color.surface.panel,
            border: `1px solid ${tokens.color.border}`,
            borderRadius: 12,
            padding: '12px 14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <SectionLabel>Suggested entry</SectionLabel>
            <span
              style={{
                fontSize: 11,
                color: AI_PURPLE_DEEP,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <SparkGlyph size={10} color={AI_PURPLE_DEEP} /> AI pre-filled
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            <Field label="Category" value="Housing · Mortgage" />
            <Field label="Whose" value="Joint (Sarah & Mark)" />
            <Field label="Monthly" value="£1,150.00" tabular />
            <Field label="Frequency" value="Monthly DD" />
          </div>
          <button
            type="button"
            style={{
              marginTop: 10,
              fontSize: 11.5,
              color: tokens.color.text.sub,
              background: 'none',
              border: 'none',
              padding: 0,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Edit details →
          </button>
        </div>

        <AIMarginCard
          kind="tip"
          severity="info"
          title="Consistent across all 12 months — fixed-rate mortgage."
          body="Your Halifax mortgage payment of £1,150 has been the same every month for the past 12 months, consistent with a fixed-rate deal. This is your largest single outgoing and goes into both housing costs and the property section of your picture."
          citation="Form E §2.1 · Property / §3 · Housing costs"
          relatedTo={{ label: 'Property · Mortgage' }}
        />
      </div>

      <div
        style={{
          padding: '10px 16px 12px',
          background: tokens.color.surface.page,
          borderTop: `1px solid ${tokens.color.border}`,
          display: 'flex',
          gap: 8,
          maxWidth: 640,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <button
          type="button"
          style={{
            flex: '0 0 auto',
            padding: '0 14px',
            height: 46,
            borderRadius: 11,
            background: tokens.color.surface.panel,
            color: tokens.color.ink,
            border: `1px solid ${tokens.color.border}`,
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Not a fixed expense
        </button>
        <button
          type="button"
          style={{
            flex: 1,
            height: 46,
            borderRadius: 11,
            background: tokens.color.ink,
            color: '#fff',
            border: 'none',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Add to expenses
        </button>
      </div>
    </main>
  );
}

function Field({ label, value, tabular = false }: { label: string; value: string; tabular?: boolean }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          color: tokens.color.text.muted,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fontWeight: 700,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: tokens.color.ink,
          marginTop: 3,
          fontVariantNumeric: tabular ? 'tabular-nums' : undefined,
        }}
      >
        {value}
      </div>
    </div>
  );
}
