import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import SectionConfirmHubPage from '@/app/dev/proto/section-confirm/page';

describe('section-confirm hub page', () => {
  it('renders the heading', () => {
    render(<SectionConfirmHubPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Confirm your data' })).toBeTruthy();
  });

  it('renders all 7 spec-22 sections', () => {
    render(<SectionConfirmHubPage />);
    const list = screen.getByTestId('section-list');
    expect(list.querySelectorAll('[data-section]').length).toBe(7);
  });

  it('shows completion progress', () => {
    render(<SectionConfirmHubPage />);
    expect(screen.getByText(/% complete/)).toBeTruthy();
  });

  it('links form types to existing confirm pages', () => {
    render(<SectionConfirmHubPage />);
    const links = screen.getAllByRole('link').filter(l => l.getAttribute('href')?.includes('/section-confirm/'));
    expect(links.length).toBeGreaterThanOrEqual(4);
  });

  it('back-link to extraction-results', () => {
    render(<SectionConfirmHubPage />);
    const back = screen.getByRole('link', { name: /Back to what we found/ });
    expect(back.getAttribute('href')).toBe('/dev/proto/extraction-results');
  });

  it('primary CTA links to your-picture', () => {
    render(<SectionConfirmHubPage />);
    const cta = screen.getByRole('link', { name: /View your picture/ });
    expect(cta.getAttribute('href')).toBe('/dev/proto/your-picture');
  });

  it('renders status indicators per section', () => {
    render(<SectionConfirmHubPage />);
    const list = screen.getByTestId('section-list');
    expect(list.querySelectorAll('[data-status]').length).toBe(7);
  });
});
