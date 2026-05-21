import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import HowItWorksPage from '@/app/dev/proto/how-it-works/page';

describe('HowItWorksPage shell', () => {
  it('renders the title as H1', () => {
    render(<HowItWorksPage />);
    const heading = screen.getByRole('heading', { level: 1, name: 'How it works' });
    expect(heading).toBeTruthy();
  });

  it('renders the sub line', () => {
    render(<HowItWorksPage />);
    expect(screen.getByText(/Decouple — the complete picture, end-to-end\./)).toBeTruthy();
  });

  it('renders all four step kickers', () => {
    render(<HowItWorksPage />);
    for (const kicker of ['Disclose', 'Reconcile', 'Settle', 'Finalise']) {
      expect(screen.getByText(new RegExp(`· ${kicker}`))).toBeTruthy();
    }
  });

  it('renders the back-to-hub link', () => {
    render(<HowItWorksPage />);
    const link = screen.getByRole('link', { name: /back to hub/i });
    expect(link.getAttribute('href')).toBe('/dev/proto');
  });
});
