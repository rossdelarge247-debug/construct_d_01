'use client';

import { useState } from 'react';
import { tokens } from '@/styles/tokens';
import { FormTop } from '../_components/FormTop';
import { AIMarginCard } from '../_components/AIMarginCard';
import { RadioRow } from '../_components/RadioRow';

export default function BalanceCheckPage() {
  const [choice, setChoice] = useState<string>('confirm');

  return (
    <main style={{ minHeight: '100vh', background: tokens.color.surface.page, display: 'flex', flexDirection: 'column',  fontFamily: tokens.font.sans }}>
      <FormTop title="Confirm balance" step="Q21 of 22" />
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px 40px' }}>
        <AIMarginCard title="Verify your balance" body="We detected your closing balance from your connected bank data. Please confirm it's correct, or enter the actual figure." />

        <div style={{ maxWidth: 640, margin: '16px auto 0' }}>
          <div style={{
            padding: '20px', borderRadius: 12, background: tokens.color.surface.panel,
            border: `1px solid ${tokens.color.border}`, textAlign: 'center', marginBottom: 24,
          }}>
            <p style={{ margin: '0 0 4px', fontSize: 12, color: tokens.color.text.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Detected closing balance
            </p>
            <p style={{ margin: 0, fontSize: 32, fontWeight: 700, color: tokens.color.ink, fontFamily: tokens.font.mono }}>
              £4,231.67
            </p>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: tokens.color.text.muted }}>
              Barclays Current Account · as of 20 Apr 2026
            </p>
          </div>

          <fieldset style={{ border: 'none', padding: 0, margin: '0 0 20px' }}>
            <legend style={{ fontSize: 14, fontWeight: 600, color: tokens.color.ink, marginBottom: 8 }}>
              Is this correct?
            </legend>
            <RadioRow label="Yes, that's correct" sub="We'll use this as your current account balance." checked={choice === 'confirm'} onClick={() => setChoice('confirm')} recommended />
            <RadioRow label="No, I'll enter the correct amount" sub="The actual balance is different from what we detected." checked={choice === 'correct'} onClick={() => setChoice('correct')} />
          </fieldset>

          {choice === 'correct' && (
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="bc-actual" style={{ display: 'block', margin: '0 0 6px', fontSize: 13, fontWeight: 600, color: tokens.color.ink }}>
                Actual balance
              </label>
              <input id="bc-actual" type="text" placeholder="e.g. £4,100.00" style={{
                width: '100%', padding: '10px 12px', borderRadius: 8,
                border: `1px solid ${tokens.color.border}`, fontFamily: tokens.font.sans,
                fontSize: tokens.type['14-5'],
              }} />
            </div>
          )}

          <button type="button" style={{
            width: '100%', padding: '14px', borderRadius: 10, border: 'none',
            background: tokens.color.ink, color: '#fff', fontWeight: 600,
            fontSize: tokens.type['14-5'], cursor: 'pointer', fontFamily: tokens.font.sans,
          }}>
            Confirm balance
          </button>
        </div>
      </div>
    </main>
  );
}
