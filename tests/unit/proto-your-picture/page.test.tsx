import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BankDataProvider } from '@/app/dev/proto/_context/bank-data-context';
import Page from '@/app/dev/proto/your-picture/page';

describe('/dev/proto/your-picture page', () => {
  it('renders without throwing', () => {
    expect(() => render(<BankDataProvider><Page /></BankDataProvider>)).not.toThrow();
  });

  it('renders Sarah\'s Picture heading', () => {
    render(<BankDataProvider><Page /></BankDataProvider>);
    expect(screen.getAllByText(/Picture/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders the Share with Mark CTA', () => {
    render(<BankDataProvider><Page /></BankDataProvider>);
    expect(screen.getByRole('button', { name: /share with mark/i })).toBeTruthy();
  });

  it('renders the Disclose your position button (G2)', () => {
    render(<BankDataProvider><Page /></BankDataProvider>);
    expect(screen.getByRole('button', { name: /disclose your position/i })).toBeTruthy();
  });

  it('renders bank accounts accordion (G3)', () => {
    render(<BankDataProvider><Page /></BankDataProvider>);
    expect(screen.getByText(/Bank accounts connected so far/i)).toBeTruthy();
  });

  it('renders children section (G4)', () => {
    render(<BankDataProvider><Page /></BankDataProvider>);
    expect(screen.getByText(/The children/i)).toBeTruthy();
  });

  it('renders home section with net equity (G5)', () => {
    render(<BankDataProvider><Page /></BankDataProvider>);
    expect(screen.getByText(/Your home/i)).toBeTruthy();
    expect(screen.getByText(/£230,000/)).toBeTruthy();
  });

  it('renders snapshot card in right rail', () => {
    render(<BankDataProvider><Page /></BankDataProvider>);
    expect(screen.getByText(/Snapshot/i)).toBeTruthy();
    expect(screen.getByText(/£54,560/)).toBeTruthy();
  });

  it('renders outgoings section with categories (G6/G7)', () => {
    render(<BankDataProvider><Page /></BankDataProvider>);
    expect(screen.getAllByText(/Outgoings/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Household utilities/i)).toBeTruthy();
  });

  it('renders left rail Form E nav structure (G13)', () => {
    render(<BankDataProvider><Page /></BankDataProvider>);
    expect(screen.getByText(/Prepare your disclosure/i)).toBeTruthy();
    expect(screen.getAllByText(/Shared position/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Settle and agree/i)).toBeTruthy();
    expect(screen.getAllByText(/Finalisation/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders footer (G11)', () => {
    render(<BankDataProvider><Page /></BankDataProvider>);
    expect(screen.getByText(/Copyright Decouple 2026/i)).toBeTruthy();
  });
});
