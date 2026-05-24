'use client';

import { useState } from 'react';
import { tokens } from '@/styles/tokens';
import { FormTop } from '../_components/FormTop';
import { AIMarginCard } from '../_components/AIMarginCard';

const CATEGORIES = [
  'Cash withdrawal', 'Cash gift received', 'Cash payment made',
  'Private sale', 'Freelance income', 'Loan to/from family',
] as const;

const FREQUENCIES = ['one-off', 'monthly', 'quarterly', 'annual'] as const;

export default function ManualEntryPage() {
  const [freq, setFreq] = useState<string>('one-off');

  const fieldStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: `1px solid ${tokens.color.border}`, fontFamily: tokens.font.sans,
    fontSize: tokens.type['14-5'],
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', margin: '0 0 6px', fontSize: 13,
    fontWeight: 600, color: tokens.color.ink,
  };

  return (
    <main style={{ height: '100vh', background: tokens.color.surface.page, display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: tokens.font.sans }}>
      <FormTop title="Manual entry" step="Add item" />
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px 40px' }}>
        <AIMarginCard title="Add a missing transaction" body="Can't find a transaction? Add it manually — cash payments, private sales, gifts, or anything not in your bank data." />

        <div style={{ maxWidth: 480, margin: '16px auto 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label htmlFor="me-desc" style={labelStyle}>Description</label>
            <input id="me-desc" type="text" placeholder="e.g. Cash rent from lodger" style={fieldStyle} />
          </div>

          <div>
            <label htmlFor="me-amount" style={labelStyle}>Amount</label>
            <input id="me-amount" type="text" placeholder="e.g. £500" style={fieldStyle} />
          </div>

          <div>
            <label htmlFor="me-category" style={labelStyle}>Category</label>
            <select id="me-category" style={fieldStyle} defaultValue="">
              <option value="" disabled>Select category…</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="me-date" style={labelStyle}>Date</label>
            <input id="me-date" type="date" style={fieldStyle} />
          </div>

          <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend style={labelStyle}>Frequency</legend>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {FREQUENCIES.map((f) => (
                <button key={f} type="button" onClick={() => setFreq(f)} style={{
                  padding: '8px 14px', borderRadius: 20, border: `1px solid ${tokens.color.border}`,
                  background: freq === f ? tokens.color.ink : 'transparent',
                  color: freq === f ? '#fff' : tokens.color.text.sub,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
                }}>
                  {f.replace('-', ' ')}
                </button>
              ))}
            </div>
          </fieldset>

          <button type="button" style={{
            width: '100%', padding: '14px', borderRadius: 10, border: 'none',
            background: tokens.color.ink, color: '#fff', fontWeight: 600,
            fontSize: tokens.type['14-5'], cursor: 'pointer', fontFamily: tokens.font.sans,
          }}>
            Save to your picture
          </button>
        </div>
      </div>
    </main>
  );
}
