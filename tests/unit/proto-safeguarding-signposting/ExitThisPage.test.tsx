import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExitThisPage } from '@/app/dev/proto/safeguarding-signposting/_components/ExitThisPage';

describe('ExitThisPage component', () => {
  it('renders without throwing', () => {
    expect(() => render(<ExitThisPage />)).not.toThrow();
  });

  it('renders a link to BBC News', () => {
    render(<ExitThisPage />);
    const link = screen.getByRole('link', { name: /exit this page/i });
    expect(link.getAttribute('href')).toBe('https://www.bbc.co.uk/news');
  });

  it('opens in same tab (immediate escape, not new tab)', () => {
    render(<ExitThisPage />);
    const link = screen.getByRole('link', { name: /exit this page/i });
    expect(link.getAttribute('target')).toBeNull();
  });

  it('carries the data-testid for page-level assertions', () => {
    render(<ExitThisPage />);
    expect(screen.getByTestId('exit-this-page')).toBeTruthy();
  });
});
