import { describe, expect, it } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { BankDataProvider, useBankData } from '@/app/dev/proto/_context/bank-data-context';
import { getAllTestScenarios } from '@/lib/bank/test-scenarios';

function Consumer() {
  const ctx = useBankData();
  return (
    <div>
      <span data-testid="scenario">{ctx.scenario?.name ?? 'none'}</span>
      <span data-testid="sections">{ctx.sectionSummaries.length}</span>
      <span data-testid="extractions">{ctx.extractions.length}</span>
      <button onClick={() => ctx.loadScenario('sarah-employed-homeowner')}>load-sarah</button>
      <button onClick={() => ctx.loadScenario('marcus-self-employed-renter')}>load-marcus</button>
      <button onClick={() => ctx.clear()}>clear</button>
    </div>
  );
}

describe('BankDataProvider', () => {
  it('starts with no scenario loaded', () => {
    render(<BankDataProvider><Consumer /></BankDataProvider>);
    expect(screen.getByTestId('scenario').textContent).toBe('none');
    expect(screen.getByTestId('extractions').textContent).toBe('0');
  });

  it('loads Sarah scenario and generates extractions', () => {
    render(<BankDataProvider><Consumer /></BankDataProvider>);
    act(() => screen.getByText('load-sarah').click());
    expect(screen.getByTestId('scenario').textContent).toContain('Sarah');
    expect(Number(screen.getByTestId('extractions').textContent)).toBeGreaterThan(0);
  });

  it('generates section summaries from extractions', () => {
    render(<BankDataProvider><Consumer /></BankDataProvider>);
    act(() => screen.getByText('load-sarah').click());
    expect(Number(screen.getByTestId('sections').textContent)).toBeGreaterThanOrEqual(7);
  });

  it('loads Marcus scenario with different data', () => {
    render(<BankDataProvider><Consumer /></BankDataProvider>);
    act(() => screen.getByText('load-marcus').click());
    expect(screen.getByTestId('scenario').textContent).toContain('Marcus');
  });

  it('clears scenario data', () => {
    render(<BankDataProvider><Consumer /></BankDataProvider>);
    act(() => screen.getByText('load-sarah').click());
    act(() => screen.getByText('clear').click());
    expect(screen.getByTestId('scenario').textContent).toBe('none');
    expect(screen.getByTestId('extractions').textContent).toBe('0');
  });

  it('all 5 test scenarios are loadable', () => {
    const scenarios = getAllTestScenarios();
    expect(scenarios.length).toBe(5);
  });
});
