import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ManualEntry from '@/app/dev/proto/section-confirm/manual-entry/page';
import ResolveDuplicate from '@/app/dev/proto/section-confirm/resolve-duplicate/page';
import Split from '@/app/dev/proto/section-confirm/split/page';
import BalanceCheck from '@/app/dev/proto/section-confirm/balance-check/page';

describe('manual-entry form', () => {
  it('renders without throwing', () => {
    expect(() => render(<ManualEntry />)).not.toThrow();
  });

  it('renders the form title', () => {
    render(<ManualEntry />);
    expect(screen.getByText(/manual entry/i)).toBeTruthy();
  });

  it('renders description, amount, and category fields', () => {
    render(<ManualEntry />);
    expect(screen.getByLabelText(/description/i)).toBeTruthy();
    expect(screen.getByLabelText(/amount/i)).toBeTruthy();
    expect(screen.getByLabelText(/category/i)).toBeTruthy();
  });

  it('renders frequency selector', () => {
    render(<ManualEntry />);
    expect(screen.getByText(/one.off/i)).toBeTruthy();
    expect(screen.getByText(/monthly/i)).toBeTruthy();
  });

  it('renders a save button', () => {
    render(<ManualEntry />);
    expect(screen.getByRole('button', { name: /save/i })).toBeTruthy();
  });
});

describe('resolve-duplicate form', () => {
  it('renders without throwing', () => {
    expect(() => render(<ResolveDuplicate />)).not.toThrow();
  });

  it('renders the form title', () => {
    render(<ResolveDuplicate />);
    expect(screen.getAllByText(/possible duplicate/i).length).toBeGreaterThanOrEqual(1);
  });

  it('shows two transactions for comparison', () => {
    render(<ResolveDuplicate />);
    expect(screen.getByText(/Transaction A/i)).toBeTruthy();
    expect(screen.getByText(/Transaction B/i)).toBeTruthy();
  });

  it('renders keep-both and merge options', () => {
    render(<ResolveDuplicate />);
    expect(screen.getByText(/keep both/i)).toBeTruthy();
    expect(screen.getByText(/merge/i)).toBeTruthy();
  });
});

describe('split form', () => {
  it('renders without throwing', () => {
    expect(() => render(<Split />)).not.toThrow();
  });

  it('renders the form title', () => {
    render(<Split />);
    expect(screen.getByText(/split transaction/i)).toBeTruthy();
  });

  it('renders the original transaction label', () => {
    render(<Split />);
    expect(screen.getByText(/original transaction/i)).toBeTruthy();
  });

  it('renders two split amount fields', () => {
    render(<Split />);
    const amounts = screen.getAllByLabelText(/amount/i);
    expect(amounts.length).toBe(2);
  });

  it('renders a save split button', () => {
    render(<Split />);
    expect(screen.getByRole('button', { name: /save split/i })).toBeTruthy();
  });
});

describe('balance-check form', () => {
  it('renders without throwing', () => {
    expect(() => render(<BalanceCheck />)).not.toThrow();
  });

  it('renders the form title', () => {
    render(<BalanceCheck />);
    expect(screen.getAllByText(/confirm balance/i).length).toBeGreaterThanOrEqual(1);
  });

  it('shows the detected balance', () => {
    render(<BalanceCheck />);
    expect(screen.getByText(/detected closing balance/i)).toBeTruthy();
  });

  it('renders confirm and correct options', () => {
    render(<BalanceCheck />);
    expect(screen.getByText(/that.s correct/i)).toBeTruthy();
    expect(screen.getByText(/enter the correct amount/i)).toBeTruthy();
  });
});
