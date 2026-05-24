'use client';

import Link from 'next/link';
import { tokens } from '@/styles/tokens';
import { SignedInHeader } from '@/components/layout/signed-in-header';
import { useBankData } from '../_context/bank-data-context';
import type { ConfirmationSectionKey } from '@/lib/bank/confirmation-questions';

const FORM_ROUTES: Record<string, { href: string; label: string }[]> = {
  income:      [{ href: '/dev/proto/section-confirm/income', label: 'Confirm income' }],
  property:    [{ href: '/dev/proto/section-confirm/property', label: 'Confirm property' }],
  accounts:    [{ href: '/dev/proto/section-confirm/accounts', label: 'Confirm accounts' }],
  pensions:    [{ href: '/dev/proto/section-confirm/pensions', label: 'Confirm pensions' }],
  debts:       [{ href: '/dev/proto/section-confirm/debts', label: 'Confirm debts' }],
  business:    [{ href: '/dev/proto/section-confirm/business', label: 'Confirm business' }],
  other_assets: [{ href: '/dev/proto/section-confirm/other_assets', label: 'Confirm other assets' }],
};

const SECTION_FORM_E: Record<string, string> = {
  income: '2.15–2.20', property: '2.1–2.2', accounts: '2.3–2.4',
  pensions: '2.13', debts: '2.14', business: '2.10–2.11', other_assets: '2.4–2.9',
};

const SECTION_LABELS: Record<string, string> = {
  income: 'Income', property: 'Property', accounts: 'Accounts',
  pensions: 'Pensions', debts: 'Debts', business: 'Business', other_assets: 'Other assets',
};

export default function SectionConfirmHubPage() {
  const { sectionSteps, extractions } = useBankData();
  const hasData = extractions.length > 0;

  const sections = (['income', 'property', 'accounts', 'pensions', 'debts', 'business', 'other_assets'] as ConfirmationSectionKey[]).map(key => {
    const steps = sectionSteps[key] ?? [];
    const questionCount = steps.length;
    return {
      key,
      label: SECTION_LABELS[key],
      formE: SECTION_FORM_E[key],
      questions: questionCount,
      status: questionCount === 0 ? 'confirmed' as const : 'needs-review' as const,
      formTypes: FORM_ROUTES[key] ?? [],
    };
  });

  const totalQ = sections.reduce((n, s) => n + s.questions, 0);

  return (
    <div style={{ minHeight: '100vh', background: tokens.color.surface.page, fontFamily: tokens.font.sans, color: tokens.color.ink }}>
      <SignedInHeader pageLabel="Confirm your data" />
    <main style={{ padding: '28px 20px 64px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <Link href="/dev/proto/extraction-results" style={{
          display: 'inline-block', fontSize: 12, color: tokens.color.text.sub,
          textDecoration: 'none', marginBottom: 16,
        }}>
          &larr; Back to what we found
        </Link>

        <h1 style={{
          fontFamily: tokens.font.serif, fontSize: 28, fontWeight: 600,
          letterSpacing: '-0.015em', margin: '0 0 8px',
        }}>
          Confirm your data
        </h1>
        <p style={{ fontSize: tokens.type['14-5'], color: tokens.color.text.sub, margin: '0 0 6px', lineHeight: 1.55 }}>
          {hasData
            ? 'Go through each section to confirm or correct what we found in your bank data. Confirmed items build your financial picture with full evidence.'
            : 'No bank data loaded yet. Connect a bank first to generate confirmation questions.'}
        </p>
        {hasData && (
          <p style={{ fontSize: 12, color: tokens.color.text.muted, margin: '0 0 24px' }}>
            {totalQ} question{totalQ !== 1 ? 's' : ''} to review across {sections.filter(s => s.questions > 0).length} sections
          </p>
        )}

        <div data-testid="section-list" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sections.map((s) => {
            const isConfirmed = s.status === 'confirmed';
            const stColor = isConfirmed ? '#15803D' : '#D97706';
            const stBg = isConfirmed ? '#DCFCE7' : '#FEF3C7';
            const stIcon = isConfirmed ? '✓' : '!';
            return (
              <div key={s.key} data-section={s.key} data-status={s.status} style={{
                background: tokens.color.surface.panel, border: `1px solid ${tokens.color.border}`,
                borderRadius: 12, padding: '16px 18px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: s.formTypes.length > 0 ? 10 : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%', display: 'inline-flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
                      color: stColor, background: stBg,
                    }}>
                      {stIcon}
                    </span>
                    <div>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{s.label}</span>
                      <span style={{ fontSize: 11, color: tokens.color.text.muted, marginLeft: 8 }}>Form E {s.formE}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6, color: stColor, background: stBg }}>
                    {s.questions > 0 ? `${s.questions} to review` : 'Done'}
                  </span>
                </div>

                {s.formTypes.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                    {s.formTypes.map((f) => (
                      <Link key={f.label} href={f.href} style={{
                        fontSize: 12, padding: '5px 10px', borderRadius: 6,
                        background: isConfirmed ? tokens.color.surface.page : '#FEF3C7',
                        color: isConfirmed ? tokens.color.text.muted : '#92400E',
                        textDecoration: 'none', border: `1px solid ${tokens.color.border}`,
                      }}>
                        {f.label} →
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Link href="/dev/proto/your-picture" style={{
          display: 'block', padding: '14px 20px', marginTop: 24, borderRadius: 10,
          background: tokens.color.ink, color: '#fff', textAlign: 'center',
          fontWeight: 600, fontSize: tokens.type['14-5'], textDecoration: 'none',
        }}>
          View your picture →
        </Link>
      </div>
    </main>
    </div>
  );
}
