import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Page from '@/app/dev/proto/bank-connect/page';

vi.mock('@/lib/bank/test-scenarios', () => ({
  getAllTestScenarios: () => [
    {
      id: 'sarah-employed-homeowner',
      name: 'Sarah — Employed homeowner, 2 children',
      description: 'Classic employed homeowner scenario.',
      provider: 'Barclays',
      accountType: 'current',
      isJoint: false,
      transactions: Array.from({ length: 142 }, (_, i) => ({
        date: '2025-01-15', description: `TX ${i}`, amount: 100,
      })),
      expectedIncomes: [],
      expectedPayments: [],
      expectedQuestions: [],
      expectedGaps: [],
      expectedClassifiedRate: 0.85,
    },
    {
      id: 'marcus-self-employed-renter',
      name: 'Marcus — Self-employed renter',
      description: 'Self-employed scenario.',
      provider: 'Monzo',
      accountType: 'current',
      isJoint: false,
      transactions: Array.from({ length: 98 }, () => ({
        date: '2025-02-10', description: 'TX', amount: 50,
      })),
      expectedIncomes: [],
      expectedPayments: [],
      expectedQuestions: [],
      expectedGaps: [],
      expectedClassifiedRate: 0.80,
    },
  ],
}));

describe('/dev/proto/bank-connect page', () => {
  it('renders without throwing', () => {
    expect(() => render(<Page />)).not.toThrow();
  });

  it('renders the back-link to /dev/proto', () => {
    render(<Page />);
    const back = screen.getByRole('link', { name: /back/i });
    expect(back.getAttribute('href')).toBe('/dev/proto');
  });

  it('renders scenario cards from test-scenarios (AC-1)', () => {
    render(<Page />);
    expect(screen.getByText(/Sarah/)).toBeTruthy();
    expect(screen.getByText(/Marcus/)).toBeTruthy();
  });

  it('shows provider and account type on each card (AC-1)', () => {
    render(<Page />);
    expect(screen.getByText(/Barclays/)).toBeTruthy();
    expect(screen.getByText(/Monzo/)).toBeTruthy();
  });

  it('transitions to success state when a scenario card is clicked (AC-1 + AC-3)', () => {
    render(<Page />);
    fireEvent.click(screen.getByText(/Sarah/));
    expect(screen.getByText(/Bank connected/i)).toBeTruthy();
    expect(screen.getByText(/142 transactions/i)).toBeTruthy();
  });

  it('shows provider name in success state (AC-3)', () => {
    render(<Page />);
    fireEvent.click(screen.getByText(/Sarah/));
    expect(screen.getByText(/Barclays/)).toBeTruthy();
  });

  it('shows connected accounts list (AC-3)', () => {
    render(<Page />);
    fireEvent.click(screen.getByText(/Sarah/));
    expect(screen.getByRole('list', { name: /connected accounts/i })).toBeTruthy();
  });

  it('shows "+ Connect another bank" button (AC-3)', () => {
    render(<Page />);
    fireEvent.click(screen.getByText(/Sarah/));
    expect(screen.getByTestId('connect-another')).toBeTruthy();
  });

  it('shows Moment 3 gap notice (reconciliation flag)', () => {
    render(<Page />);
    fireEvent.click(screen.getByText(/Sarah/));
    expect(screen.getByText(/Moment 3/i)).toBeTruthy();
  });

  it('shows "Continue to your dashboard" CTA in success state (AC-3)', () => {
    render(<Page />);
    fireEvent.click(screen.getByText(/Sarah/));
    expect(screen.getByRole('link', { name: /continue/i })).toBeTruthy();
  });

  it('dashboard CTA links to post-connect-dashboard (AC-3)', () => {
    render(<Page />);
    fireEvent.click(screen.getByText(/Sarah/));
    const link = screen.getByRole('link', { name: /continue/i });
    expect(link.getAttribute('href')).toBe('/dev/proto/post-connect-dashboard');
  });

  it('shows "Try again" button in error state (AC-4)', () => {
    render(<Page />);
    fireEvent.click(screen.getByTestId('simulate-error'));
    expect(screen.getByText(/try again/i)).toBeTruthy();
  });

  it('"Try again" resets to initial state (AC-4)', () => {
    render(<Page />);
    fireEvent.click(screen.getByTestId('simulate-error'));
    fireEvent.click(screen.getByText(/try again/i));
    expect(screen.getByText(/Sarah/)).toBeTruthy();
  });

  it('renders the Open Banking CTA (AC-2)', () => {
    render(<Page />);
    expect(screen.getByRole('button', { name: /open banking/i })).toBeTruthy();
  });
});
