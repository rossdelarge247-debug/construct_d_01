import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BankDataProvider } from '@/app/dev/proto/_context/bank-data-context';
import SectionConfirmHubPage from '@/app/dev/proto/section-confirm/page';

function renderPage() {
  return render(<BankDataProvider><SectionConfirmHubPage /></BankDataProvider>);
}

describe('section-confirm hub page', () => {
  it('renders the heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: 'Confirm your data' })).toBeTruthy();
  });

  it('renders all 7 sections', () => {
    renderPage();
    const list = screen.getByTestId('section-list');
    expect(list.querySelectorAll('[data-section]').length).toBe(7);
  });

  it('links form types to existing confirm pages', () => {
    renderPage();
    const links = screen.getAllByRole('link').filter(l => l.getAttribute('href')?.includes('/section-confirm/'));
    expect(links.length).toBeGreaterThanOrEqual(4);
  });

  it('back-link to extraction-results', () => {
    renderPage();
    const back = screen.getByRole('link', { name: /Back to what we found/ });
    expect(back.getAttribute('href')).toBe('/dev/proto/extraction-results');
  });

  it('primary CTA links to your-picture', () => {
    renderPage();
    const cta = screen.getByRole('link', { name: /View your picture/ });
    expect(cta.getAttribute('href')).toBe('/dev/proto/your-picture');
  });

  it('shows empty-state copy when no data loaded', () => {
    renderPage();
    expect(screen.getByText(/No bank data loaded/i)).toBeTruthy();
  });
});
