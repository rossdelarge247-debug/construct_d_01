'use client';

import { useState } from 'react';
import { tokens } from '@/styles/tokens';
import { FormTop } from '../_components/FormTop';
import { TxnRow } from '../_components/TxnRow';
import { AIMarginCard } from '../_components/AIMarginCard';
import { RadioRow } from '../_components/RadioRow';

const TXN_A = { logo: 'A', logoBg: '#EEF2FF', logoColor: '#4338CA', merchant: 'AVIVA LIFE INS', sub: '15 Mar · Insurance', amount: '£42.50' };
const TXN_B = { logo: 'A', logoBg: '#EEF2FF', logoColor: '#4338CA', merchant: 'AVIVA LIFE INSURANCE', sub: '15 Mar · Insurance', amount: '£42.50' };

export default function ResolveDuplicatePage() {
  const [choice, setChoice] = useState<string>('merge');

  return (
    <main style={{ minHeight: '100vh', background: tokens.color.surface.page, display: 'flex', flexDirection: 'column',  fontFamily: tokens.font.sans }}>
      <FormTop title="Possible duplicate" step="Q18 of 22" />
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px 40px' }}>
        <AIMarginCard title="Possible duplicate detected" body="These two transactions look very similar — same amount, same date, similar description. Are they the same payment recorded twice, or two separate payments?" />

        <div style={{ maxWidth: 640, margin: '16px auto 0' }}>
          <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Transaction A
          </p>
          <TxnRow {...TXN_A} />

          <p style={{ margin: '16px 0 8px', fontSize: 12, fontWeight: 600, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Transaction B
          </p>
          <TxnRow {...TXN_B} />

          <fieldset style={{ border: 'none', padding: 0, margin: '24px 0 0' }}>
            <legend style={{ fontSize: 14, fontWeight: 600, color: tokens.color.ink, marginBottom: 8 }}>
              What would you like to do?
            </legend>
            <RadioRow label="Merge — it's the same payment" sub="We'll keep one and remove the duplicate." checked={choice === 'merge'} onClick={() => setChoice('merge')} recommended />
            <RadioRow label="Keep both — they're separate payments" sub="Two genuine payments on the same date." checked={choice === 'keep-both'} onClick={() => setChoice('keep-both')} />
          </fieldset>

          <button type="button" style={{
            width: '100%', marginTop: 24, padding: '14px', borderRadius: 10, border: 'none',
            background: tokens.color.ink, color: '#fff', fontWeight: 600,
            fontSize: tokens.type['14-5'], cursor: 'pointer', fontFamily: tokens.font.sans,
          }}>
            Confirm
          </button>
        </div>
      </div>
    </main>
  );
}
