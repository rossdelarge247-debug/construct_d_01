import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BankDataProvider } from '@/app/dev/proto/_context/bank-data-context';
import Page from '@/app/dev/proto/extraction-results/page';

function renderPage() {
  return render(<BankDataProvider><Page /></BankDataProvider>);
}

describe('/dev/proto/extraction-results page', () => {
  it('renders without throwing', () => {
    expect(() => renderPage()).not.toThrow();
  });

  it('renders the headline', () => {
    renderPage();
    expect(screen.getByText(/Here.s what we found/i)).toBeTruthy();
  });

  it('shows empty state when no data loaded', () => {
    renderPage();
    expect(screen.getByText(/No bank data loaded/i)).toBeTruthy();
  });

  it('renders section cards container', () => {
    renderPage();
    expect(screen.getByTestId('section-cards')).toBeTruthy();
  });

  it('renders the primary CTA linking to section-confirm', () => {
    renderPage();
    const cta = screen.getByRole('link', { name: /confirm/i });
    expect(cta.getAttribute('href')).toBe('/dev/proto/section-confirm');
  });

  it('renders a skip link to your-picture', () => {
    renderPage();
    const skip = screen.getByRole('link', { name: /skip/i });
    expect(skip.getAttribute('href')).toBe('/dev/proto/your-picture');
  });
});
