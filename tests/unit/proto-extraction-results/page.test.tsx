import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '@/app/dev/proto/extraction-results/page';

describe('/dev/proto/extraction-results page', () => {
  it('renders without throwing', () => {
    expect(() => render(<Page />)).not.toThrow();
  });

  it('renders the headline (spec 22 L3 — signal → confirmed fact)', () => {
    render(<Page />);
    expect(screen.getByText(/Here.s what we found/i)).toBeTruthy();
  });

  it('renders provenance copy about bank data source', () => {
    render(<Page />);
    expect(screen.getAllByText(/Barclays/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders all 7 spec-22 sections as cards', () => {
    render(<Page />);
    const sections = screen.getByTestId('section-cards');
    expect(sections.querySelectorAll('[data-section]').length).toBe(7);
  });

  it('renders section names matching spec 22 order', () => {
    render(<Page />);
    expect(screen.getAllByText(/Income/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Property/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Accounts/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Pensions/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Debts/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Spending/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Business/i).length).toBeGreaterThanOrEqual(1);
  });

  it('shows item counts per section', () => {
    render(<Page />);
    expect(screen.getAllByText(/found/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders the primary CTA linking to section-confirm', () => {
    render(<Page />);
    const cta = screen.getByRole('link', { name: /confirm/i });
    expect(cta.getAttribute('href')).toBe('/dev/proto/section-confirm');
  });

  it('renders a skip link to your-picture', () => {
    render(<Page />);
    const skip = screen.getByRole('link', { name: /skip/i });
    expect(skip.getAttribute('href')).toBe('/dev/proto/your-picture');
  });

  it('renders confidence indicators per section', () => {
    render(<Page />);
    const sections = screen.getByTestId('section-cards');
    expect(sections.querySelectorAll('[data-confidence]').length).toBe(7);
  });
});
