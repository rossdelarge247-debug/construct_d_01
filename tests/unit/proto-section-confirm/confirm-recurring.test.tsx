import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ConfirmRecurringPage from '@/app/dev/proto/section-confirm/confirm-recurring/page';

describe('section-confirm confirm-recurring page', () => {
  it('renders FormTop title + step', () => {
    render(<ConfirmRecurringPage />);
    expect(screen.getByText('Confirm fixed expense')).toBeTruthy();
    expect(screen.getByText('3 to confirm')).toBeTruthy();
  });

  it('renders anchor TxnRow (Octopus Energy + £178/mo avg)', () => {
    render(<ConfirmRecurringPage />);
    expect(screen.getByText('Octopus Energy')).toBeTruthy();
    expect(screen.getByText('DD · 12 of 12 months · £142–£218')).toBeTruthy();
    expect(screen.getByText('−£178/mo avg')).toBeTruthy();
  });

  it('renders the question heading', () => {
    render(<ConfirmRecurringPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Add to your fixed monthly expenses?' })).toBeTruthy();
  });

  it('renders the 4 suggested-entry fields', () => {
    render(<ConfirmRecurringPage />);
    expect(screen.getByText('Utilities · Energy')).toBeTruthy();
    expect(screen.getByText('Joint household')).toBeTruthy();
    expect(screen.getByText('£178.00')).toBeTruthy();
    expect(screen.getByText('Monthly DD')).toBeTruthy();
  });

  it('renders the AIMarginCard title', () => {
    render(<ConfirmRecurringPage />);
    expect(screen.getByText(/Average across 12 months/)).toBeTruthy();
  });

  it('renders both CTA buttons', () => {
    render(<ConfirmRecurringPage />);
    expect(screen.getByRole('button', { name: 'Not a fixed expense' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Add to expenses' })).toBeTruthy();
  });
});
