'use client';

import { useState } from 'react';
import { tokens } from '@/styles/tokens';
import { FormTop } from '../_components/FormTop';
import { TxnRow } from '../_components/TxnRow';
import { AIMarginCard } from '../_components/AIMarginCard';

const ORIGINAL = { logo: 'T', logoBg: '#DCFCE7', logoColor: '#166534', merchant: 'TESCO SUPERSTORE', sub: '22 Mar · Groceries', amount: '£156.80' };

const CATEGORY_OPTIONS = ['Groceries', 'Household', 'Children', 'Clothing', 'Other'] as const;

export default function SplitPage() {
  const [splitA, setSplitA] = useState('120.00');
  const [splitB, setSplitB] = useState('36.80');

  const fieldStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: `1px solid ${tokens.color.border}`, fontFamily: tokens.font.sans,
    fontSize: tokens.type['14-5'],
  };

  return (
    <main style={{ minHeight: '100vh', background: tokens.color.surface.page, display: 'flex', flexDirection: 'column',  fontFamily: tokens.font.sans }}>
      <FormTop title="Split transaction" step="Q19 of 22" />
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px 40px' }}>
        <AIMarginCard title="Split across categories" body="This transaction looks like it might cover more than one category. Split it so each part is counted correctly." />

        <div style={{ maxWidth: 640, margin: '16px auto 0' }}>
          <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Original transaction
          </p>
          <TxnRow {...ORIGINAL} />

          <div style={{ margin: '24px 0 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ padding: '14px 16px', borderRadius: 10, border: `1px solid ${tokens.color.border}`, background: tokens.color.surface.panel }}>
              <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: tokens.color.text.muted }}>Split A</p>
              <label htmlFor="split-a-amount" style={{ fontSize: 13, fontWeight: 600, color: tokens.color.ink, display: 'block', marginBottom: 4 }}>Amount</label>
              <input id="split-a-amount" type="text" value={splitA} onChange={(e) => setSplitA(e.target.value)} style={fieldStyle} />
              <label htmlFor="split-a-cat" style={{ fontSize: 13, fontWeight: 600, color: tokens.color.ink, display: 'block', margin: '10px 0 4px' }}>Category</label>
              <select id="split-a-cat" style={fieldStyle} defaultValue="Groceries">
                {CATEGORY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ padding: '14px 16px', borderRadius: 10, border: `1px solid ${tokens.color.border}`, background: tokens.color.surface.panel }}>
              <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: tokens.color.text.muted }}>Split B</p>
              <label htmlFor="split-b-amount" style={{ fontSize: 13, fontWeight: 600, color: tokens.color.ink, display: 'block', marginBottom: 4 }}>Amount</label>
              <input id="split-b-amount" type="text" value={splitB} onChange={(e) => setSplitB(e.target.value)} style={fieldStyle} />
              <label htmlFor="split-b-cat" style={{ fontSize: 13, fontWeight: 600, color: tokens.color.ink, display: 'block', margin: '10px 0 4px' }}>Category</label>
              <select id="split-b-cat" style={fieldStyle} defaultValue="Children">
                {CATEGORY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <button type="button" style={{
            width: '100%', marginTop: 20, padding: '14px', borderRadius: 10, border: 'none',
            background: tokens.color.ink, color: '#fff', fontWeight: 600,
            fontSize: tokens.type['14-5'], cursor: 'pointer', fontFamily: tokens.font.sans,
          }}>
            Save split
          </button>
        </div>
      </div>
    </main>
  );
}
