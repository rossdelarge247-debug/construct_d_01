'use client';

import { useState } from 'react';
import { tokens } from '@/styles/tokens';
import { AIMarginCard } from '../_components/AIMarginCard';
import { FormTop } from '../_components/FormTop';
import { RadioRow } from '../_components/RadioRow';
import { TxnRow } from '../_components/TxnRow';

type CategoriseChoice = 'joint_life' | 'my_life' | 'critical_illness' | 'not_insurance';

const OPTIONS: ReadonlyArray<{
  id: CategoriseChoice;
  label: string;
  sub: string;
  recommended?: boolean;
}> = [
  {
    id: 'joint_life',
    label: 'Joint life cover (you + Mark)',
    sub: 'Both adults, often with kids included. Splits or transfers at settlement.',
    recommended: true,
  },
  {
    id: 'my_life',
    label: 'Just my life cover',
    sub: 'Single policy in your name only. Stays with you.',
  },
  {
    id: 'critical_illness',
    label: 'Critical illness only',
    sub: 'Pays out on diagnosis, not death.',
  },
  {
    id: 'not_insurance',
    label: 'Not insurance — I miscategorised it',
    sub: 'Send back to general transactions.',
  },
];

export default function CategorisePage() {
  const [choice, setChoice] = useState<CategoriseChoice>('joint_life');

  return (
    <div
      style={{
        height: '100vh',
        background: tokens.color.surface.page,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: tokens.font.sans,
      }}
    >
      <FormTop title="Categorise" step="Q20 of 22" />
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '14px 16px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          maxWidth: 420,
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
            From your Halifax joint account
          </div>
          <TxnRow
            logo="A"
            logoBg="#FFE4D6"
            logoColor="#9A3412"
            merchant="Aviva Life Insurance"
            sub="DD · monthly · since 2019"
            amount="£1,250.00"
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
            What kind of policy is this?
          </h1>
          <p
            style={{
              fontSize: 12.5,
              color: tokens.color.text.sub,
              marginTop: 4,
              lineHeight: 1.45,
            }}
          >
            We need this so the right person carries it forward in the settlement.
          </p>
        </div>

        <div role="radiogroup" aria-label="Policy type" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {OPTIONS.map((opt) => (
            <RadioRow
              key={opt.id}
              checked={choice === opt.id}
              label={opt.label}
              sub={opt.sub}
              recommended={opt.recommended}
              onClick={() => setChoice(opt.id)}
            />
          ))}
        </div>

        <AIMarginCard
          kind="tip"
          severity="info"
          title="Aviva typically bundles life + critical illness for couples with children."
          body="Your DD is £1,250/mo on a joint Halifax account, started 2019 — that's a year after your second child. Pattern fits a family-cover bundle. 'Joint life cover' is the safer answer; you can add a note if it's CI-only."
          citation={null}
          relatedTo={{ label: 'Halifax joint · DD £1,250' }}
          defaultOpenReasoning
        />
      </div>

      <div
        style={{
          padding: '10px 16px 12px',
          background: tokens.color.surface.page,
          borderTop: `1px solid ${tokens.color.border}`,
          display: 'flex',
          gap: 8,
          maxWidth: 420,
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
          Skip
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
          Save & continue →
        </button>
      </div>
    </div>
  );
}
