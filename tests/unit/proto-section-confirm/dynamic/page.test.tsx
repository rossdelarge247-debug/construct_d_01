import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BankDataProvider } from '@/app/dev/proto/_context/bank-data-context';

vi.mock('next/navigation', () => ({
  useParams: () => ({ section: 'income' }),
}));

import DynamicSectionPage from '@/app/dev/proto/section-confirm/[section]/page';

function renderPage() {
  return render(<BankDataProvider><DynamicSectionPage /></BankDataProvider>);
}

describe('dynamic section-confirm page', () => {
  it('renders without throwing', () => {
    expect(() => renderPage()).not.toThrow();
  });

  it('renders the section name in the heading', () => {
    renderPage();
    expect(screen.getByText(/Income/i)).toBeTruthy();
  });

  it('shows empty state when no data loaded', () => {
    renderPage();
    expect(screen.getByText(/No bank data/i)).toBeTruthy();
  });

  it('renders a back link to section-confirm hub', () => {
    renderPage();
    const back = screen.getByRole('link', { name: /back/i });
    expect(back.getAttribute('href')).toBe('/dev/proto/section-confirm');
  });
});
