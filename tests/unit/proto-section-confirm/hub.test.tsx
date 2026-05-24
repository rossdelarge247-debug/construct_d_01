import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import SectionConfirmHubPage from '@/app/dev/proto/section-confirm/page';

describe('section-confirm hub page', () => {
  it('renders the H1', () => {
    render(<SectionConfirmHubPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Per-section confirmation' })).toBeTruthy();
  });

  it('links to the categorise demo', () => {
    render(<SectionConfirmHubPage />);
    const link = screen.getByRole('link', { name: /Categorise/ });
    expect(link.getAttribute('href')).toBe('/dev/proto/section-confirm/categorise');
  });

  it('links to the confirm-recurring demo', () => {
    render(<SectionConfirmHubPage />);
    const link = screen.getByRole('link', { name: /Confirm recurring/ });
    expect(link.getAttribute('href')).toBe('/dev/proto/section-confirm/confirm-recurring');
  });

  it('back-link to your-picture', () => {
    render(<SectionConfirmHubPage />);
    const back = screen.getByRole('link', { name: /Back to Your Picture/ });
    expect(back.getAttribute('href')).toBe('/dev/proto/your-picture');
  });
});
