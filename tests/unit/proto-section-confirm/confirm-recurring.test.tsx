import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ConfirmRecurringPage from '@/app/dev/proto/section-confirm/confirm-recurring/page';

describe('section-confirm confirm-recurring page', () => {
  it('renders FormTop title + step', () => {
    render(<ConfirmRecurringPage />);
    expect(screen.getByText('Confirm fixed expense')).toBeTruthy();
    expect(screen.getByText('3 to confirm')).toBeTruthy();
  });

  it('renders anchor TxnRow (Halifax Mortgage £1,150/mo)', () => {
    render(<ConfirmRecurringPage />);
    expect(screen.getByText('Halifax Mortgage')).toBeTruthy();
    expect(screen.getByText('DD · 12 of 12 months · £1,150')).toBeTruthy();
    expect(screen.getByText('−£1,150/mo')).toBeTruthy();
  });

  it('renders the question heading', () => {
    render(<ConfirmRecurringPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Add to your fixed monthly expenses?' })).toBeTruthy();
  });

  it('renders the 4 suggested-entry fields', () => {
    render(<ConfirmRecurringPage />);
    expect(screen.getByText('Housing · Mortgage')).toBeTruthy();
    expect(screen.getByText('Joint (Sarah & Mark)')).toBeTruthy();
    expect(screen.getByText('£1,150.00')).toBeTruthy();
    expect(screen.getByText('Monthly DD')).toBeTruthy();
  });

  it('renders the AIMarginCard title', () => {
    render(<ConfirmRecurringPage />);
    expect(screen.getByText(/Consistent across all 12 months/)).toBeTruthy();
  });

  it('renders both CTA buttons', () => {
    render(<ConfirmRecurringPage />);
    expect(screen.getByRole('button', { name: 'Not a fixed expense' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Add to expenses' })).toBeTruthy();
  });
});
