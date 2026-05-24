'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { tokens } from '@/styles/tokens';
import { getAllTestScenarios } from '@/lib/bank/test-scenarios';
import type { TestScenario } from '@/lib/bank/test-scenarios';

type State =
  | { phase: 'select' }
  | { phase: 'connecting' }
  | { phase: 'success'; scenario: TestScenario }
  | { phase: 'error'; message: string };

export default function BankConnectPage() {
  const [state, setState] = useState<State>({ phase: 'select' });
  const scenarios = getAllTestScenarios();

  const handleTinkMessage = useCallback((e: MessageEvent) => {
    if (e.data?.type === 'tink-complete' && Array.isArray(e.data.results)) {
      const first = e.data.results[0];
      if (first?.extraction) {
        const synth: TestScenario = {
          id: 'live-connected',
          name: `${first.extraction.provider} — Live`,
          description: 'Connected via Open Banking',
          provider: first.extraction.provider,
          accountType: first.extraction.account_type === 'SAVINGS' ? 'savings' : 'current',
          isJoint: false,
          transactions: first.extraction.transactions ?? [],
          expectedIncomes: [],
          expectedPayments: [],
          expectedQuestions: [],
          expectedGaps: [],
          expectedClassifiedRate: 0,
        };
        setState({ phase: 'success', scenario: synth });
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleTinkMessage);
    return () => window.removeEventListener('message', handleTinkMessage);
  }, [handleTinkMessage]);

  async function launchTinkLink() {
    setState({ phase: 'connecting' });
    try {
      const res = await fetch('/api/bank/connect', { method: 'POST' });
      const data = await res.json();
      if (!res.ok || data.error) {
        setState({ phase: 'error', message: data.error || 'Failed to start bank connection' });
        return;
      }
      window.open(data.url, 'tink-link', 'width=480,height=720');
    } catch {
      setState({ phase: 'error', message: 'Network error — could not reach the server' });
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: tokens.color.surface.page, fontFamily: tokens.font.sans }}>
      <header style={{
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: `1px solid ${tokens.color.border}`, background: tokens.color.surface.panel,
      }}>
        <Link href="/dev/proto" aria-label="Back" style={{ color: tokens.color.ink, textDecoration: 'none', fontSize: 20 }}>
          &larr;
        </Link>
        <h1 style={{ margin: 0, fontSize: tokens.type['17'], fontWeight: 600, color: tokens.color.ink }}>
          Connect your bank
        </h1>
      </header>

      <main style={{ maxWidth: 480, margin: '0 auto', padding: '24px 20px 40px' }}>
        {state.phase === 'select' && (
          <SelectView
            scenarios={scenarios}
            onSelect={(s) => setState({ phase: 'success', scenario: s })}
            onLaunchLive={launchTinkLink}
            onSimulateError={() => setState({ phase: 'error', message: 'Simulated connection error for testing' })}
          />
        )}
        {state.phase === 'connecting' && <ConnectingView />}
        {state.phase === 'success' && <SuccessView scenario={state.scenario} />}
        {state.phase === 'error' && (
          <ErrorView message={state.message} onRetry={() => setState({ phase: 'select' })} />
        )}
      </main>
    </div>
  );
}

function SelectView({ scenarios, onSelect, onLaunchLive, onSimulateError }: {
  scenarios: TestScenario[];
  onSelect: (s: TestScenario) => void;
  onLaunchLive: () => void;
  onSimulateError: () => void;
}) {
  return (
    <>
      <button type="button" onClick={onLaunchLive} style={{
        width: '100%', padding: '16px 20px', borderRadius: 10, border: 'none',
        background: tokens.color.ink, color: '#fff', fontWeight: 600,
        fontSize: tokens.type['14-5'], cursor: 'pointer', fontFamily: tokens.font.sans,
        marginBottom: 8,
      }}>
        Connect with Open Banking
      </button>
      <p style={{ margin: '0 0 28px', fontSize: 12, color: tokens.color.text.muted, textAlign: 'center' }}>
        Launches Tink Link — requires configured credentials
      </p>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
      }}>
        <div style={{ flex: 1, height: 1, background: tokens.color.border }} />
        <span style={{ fontSize: 12, color: tokens.color.text.muted, fontFamily: tokens.font.mono }}>
          Dev: test scenarios
        </span>
        <div style={{ flex: 1, height: 1, background: tokens.color.border }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {scenarios.map((s) => (
          <button key={s.id} type="button" onClick={() => onSelect(s)} style={{
            textAlign: 'left', padding: '14px 16px', borderRadius: 10,
            border: `1px solid ${tokens.color.border}`, background: tokens.color.surface.panel,
            cursor: 'pointer', fontFamily: tokens.font.sans,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
              <span style={{ fontWeight: 600, fontSize: tokens.type['14-5'], color: tokens.color.ink }}>
                {s.name}
              </span>
              <span style={{ fontSize: 12, color: tokens.color.phase.build.accent }}>
                {s.provider}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: tokens.color.text.sub, lineHeight: 1.4 }}>
              {s.description}
            </p>
            <div style={{ marginTop: 6, fontSize: 11, color: tokens.color.text.muted }}>
              {s.accountType} · {s.transactions.length} transactions
            </div>
          </button>
        ))}
      </div>

      <button type="button" data-testid="simulate-error" onClick={onSimulateError} style={{
        marginTop: 16, width: '100%', padding: '10px', borderRadius: 8,
        border: `1px dashed ${tokens.color.border}`, background: 'transparent',
        color: tokens.color.text.muted, fontSize: 12, cursor: 'pointer',
        fontFamily: tokens.font.mono,
      }}>
        Dev: simulate error
      </button>
    </>
  );
}

function ConnectingView() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <div style={{
        width: 48, height: 48, margin: '0 auto 20px', borderRadius: '50%',
        border: `3px solid ${tokens.color.border}`,
        borderTopColor: tokens.color.phase.build.accent,
        animation: 'spin 1s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <h2 style={{ margin: '0 0 8px', fontSize: tokens.type['17'], fontWeight: 600, color: tokens.color.ink }}>
        Connecting to your bank&hellip;
      </h2>
      <p style={{ margin: 0, fontSize: tokens.type['14-5'], color: tokens.color.text.sub }}>
        Complete the connection in the popup window.
      </p>
    </div>
  );
}

function SuccessView({ scenario }: { scenario: TestScenario }) {
  const dateRange = scenario.transactions.length > 0
    ? `${scenario.transactions[0].date} — ${scenario.transactions[scenario.transactions.length - 1].date}`
    : 'No date range';

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 56, height: 56, margin: '0 auto 16px', borderRadius: '50%',
        background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, color: tokens.color.phase.finalise.accent,
      }}>
        &#10003;
      </div>
      <h2 style={{ margin: '0 0 8px', fontSize: tokens.type['21'], fontWeight: 600, color: tokens.color.ink }}>
        Bank connected
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: tokens.type['14-5'], color: tokens.color.text.sub }}>
        Here are the accounts we connected.
      </p>

      <div role="list" aria-label="Connected accounts" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
        <div role="listitem" style={{
          padding: '16px', borderRadius: 10, border: `1px solid ${tokens.color.border}`,
          background: tokens.color.surface.panel, textAlign: 'left',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, color: tokens.color.ink }}>{scenario.provider}</span>
            <span style={{ fontSize: 13, color: tokens.color.text.sub, textTransform: 'capitalize' }}>
              {scenario.accountType.replace('_', ' ')}
            </span>
          </div>
          <div style={{ fontSize: 13, color: tokens.color.text.sub, lineHeight: 1.8 }}>
            <div>{scenario.transactions.length} transactions</div>
            <div>{dateRange}</div>
            {scenario.isJoint && <div style={{ color: tokens.color.phase.reconcile.accent }}>Joint account</div>}
          </div>
        </div>
      </div>

      <button type="button" data-testid="connect-another" style={{
        width: '100%', padding: '10px', marginBottom: 24, borderRadius: 8,
        border: `1px solid ${tokens.color.border}`, background: 'transparent',
        color: tokens.color.phase.build.accent, fontSize: 13, fontWeight: 600,
        cursor: 'pointer', fontFamily: tokens.font.sans,
      }}>
        + Connect another bank
      </button>

      <div style={{
        padding: '12px 16px', borderRadius: 8, marginBottom: 20,
        background: tokens.color.phase.build.soft, textAlign: 'left',
        border: `1px solid ${tokens.color.phase.build.accent}20`,
      }}>
        <p style={{ margin: 0, fontSize: 12, color: tokens.color.text.sub, lineHeight: 1.5 }}>
          Next step: section-by-section confirmation of what we found (Moment 3).
          This flow is not yet built — continuing to dashboard for now.
        </p>
      </div>

      <Link href="/dev/proto/extraction-results" style={{
        display: 'block', width: '100%', padding: '14px 20px', borderRadius: 10,
        background: tokens.color.ink, color: '#fff', fontWeight: 600,
        fontSize: tokens.type['14-5'], textAlign: 'center', textDecoration: 'none',
        fontFamily: tokens.font.sans,
      }}>
        See what we found &rarr;
      </Link>
    </div>
  );
}

function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <div style={{
        width: 56, height: 56, margin: '0 auto 16px', borderRadius: '50%',
        background: tokens.color.danger + '18', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: 28, color: tokens.color.danger,
      }}>
        !
      </div>
      <h2 style={{ margin: '0 0 8px', fontSize: tokens.type['17'], fontWeight: 600, color: tokens.color.ink }}>
        Connection failed
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: tokens.type['14-5'], color: tokens.color.text.sub, lineHeight: 1.5 }}>
        {message}
      </p>
      <button type="button" onClick={onRetry} style={{
        width: '100%', padding: '14px 20px', borderRadius: 10, border: 'none',
        background: tokens.color.ink, color: '#fff', fontWeight: 600,
        fontSize: tokens.type['14-5'], cursor: 'pointer', fontFamily: tokens.font.sans,
      }}>
        Try again
      </button>
    </div>
  );
}
