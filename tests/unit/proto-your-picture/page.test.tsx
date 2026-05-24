import { describe, expect, it } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { BankDataProvider } from '@/app/dev/proto/_context/bank-data-context';
import Page from '@/app/dev/proto/your-picture/page';

function renderWithData() {
  const Consumer = () => {
    const { loadScenario } = require('@/app/dev/proto/_context/bank-data-context');
    return null;
  };
  return render(
    <BankDataProvider><Page /></BankDataProvider>
  );
}

describe('/dev/proto/your-picture page', () => {
  it('renders without throwing', () => {
    expect(() => render(<BankDataProvider><Page /></BankDataProvider>)).not.toThrow();
  });

  it('shows empty state when no data loaded', () => {
    render(<BankDataProvider><Page /></BankDataProvider>);
    expect(screen.getByText(/No bank data loaded/i)).toBeTruthy();
  });

  it('renders the page title', () => {
    render(<BankDataProvider><Page /></BankDataProvider>);
    expect(screen.getAllByText(/Picture/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders the Share with Mark CTA (spec 68b B-S1)', () => {
    render(<BankDataProvider><Page /></BankDataProvider>);
    expect(screen.getByRole('button', { name: /share with mark/i })).toBeTruthy();
  });

  it('links to bank-connect when no data', () => {
    render(<BankDataProvider><Page /></BankDataProvider>);
    expect(screen.getByRole('link', { name: /connect a bank/i })).toBeTruthy();
  });
});
