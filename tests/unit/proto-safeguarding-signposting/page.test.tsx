import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import Page from '@/app/dev/proto/safeguarding-signposting/page';

describe('/dev/proto/safeguarding-signposting page', () => {
  it('renders without throwing', () => {
    expect(() => render(<Page />)).not.toThrow();
  });

  it('renders the back-link to /dev/proto', () => {
    render(<Page />);
    const back = screen.getByRole('link', { name: /back/i });
    expect(back.getAttribute('href')).toBe('/dev/proto');
  });

  it('renders the title "Before we go further — something important" (AC-1)', () => {
    render(<Page />);
    expect(
      screen.getByRole('heading', { name: /before we go further/i, level: 1 }),
    ).toBeTruthy();
  });

  it('renders the honest framing copy verbatim (AC-1)', () => {
    render(<Page />);
    expect(
      screen.getByText(/We want to be honest about where we fit/),
    ).toBeTruthy();
    expect(
      screen.getByText(/It.s not a domestic abuse service/),
    ).toBeTruthy();
  });

  it('renders all six crisis helplines (AC-2)', () => {
    render(<Page />);
    expect(screen.getByText(/Women's Aid/)).toBeTruthy();
    expect(screen.getByText(/National Domestic Abuse Helpline/)).toBeTruthy();
    expect(screen.getByText(/Men's Advice Line/)).toBeTruthy();
    expect(screen.getByText(/Refuge/)).toBeTruthy();
    expect(screen.getByText(/Surviving Economic Abuse/)).toBeTruthy();
    expect(screen.getByText(/Samaritans/)).toBeTruthy();
  });

  it('renders tel: links for phone numbers (AC-2)', () => {
    render(<Page />);
    const telLinks = screen.getAllByRole('link').filter(
      (a) => a.getAttribute('href')?.startsWith('tel:'),
    );
    expect(telLinks.length).toBeGreaterThanOrEqual(4);
  });

  it('renders external links with rel="noopener noreferrer" (AC-2)', () => {
    render(<Page />);
    const externalLinks = screen.getAllByRole('link').filter(
      (a) => a.getAttribute('href')?.startsWith('https://') && !a.getAttribute('href')?.includes('bbc'),
    );
    for (const link of externalLinks) {
      expect(link.getAttribute('rel')).toContain('noopener');
      expect(link.getAttribute('rel')).toContain('noreferrer');
      expect(link.getAttribute('target')).toBe('_blank');
    }
  });

  it('renders the 999 emergency line (AC-2)', () => {
    render(<Page />);
    expect(screen.getByText(/in immediate danger/i)).toBeTruthy();
    expect(screen.getByRole('link', { name: /999/i })).toBeTruthy();
  });

  it('renders three CTAs (AC-3)', () => {
    render(<Page />);
    expect(screen.getByRole('link', { name: /continue/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /exit to a safe site/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /more support/i })).toBeTruthy();
  });

  it('"Exit to a safe site" links to BBC News (AC-3)', () => {
    render(<Page />);
    const exit = screen.getByRole('link', { name: /exit to a safe site/i });
    expect(exit.getAttribute('href')).toBe('https://www.bbc.co.uk/news');
  });

  it('renders the reassurance paragraph (AC-5)', () => {
    render(<Page />);
    expect(
      screen.getByText(/Decouple can still help once you.re safe/),
    ).toBeTruthy();
  });

  it('renders the Exit this page quick-escape component (AC-4)', () => {
    render(<Page />);
    expect(screen.getByTestId('exit-this-page')).toBeTruthy();
  });
});
