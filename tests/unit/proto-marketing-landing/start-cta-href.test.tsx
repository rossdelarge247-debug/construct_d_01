import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MarketingLandingPage from '@/app/dev/proto/marketing-landing/page';

function findLinkByText(text: string): HTMLAnchorElement | null {
  const matches = screen.getAllByText(text, { selector: 'a' });
  return (matches[0] as HTMLAnchorElement) ?? null;
}

describe('marketing-landing top-nav CTAs', () => {
  it('Start CTA href resolves to /dev/proto/pre-signup-interview (outbound, not #start)', () => {
    render(<MarketingLandingPage />);
    const start = findLinkByText('Start your free plan');
    expect(start, 'Start CTA not found').not.toBeNull();
    expect(start!.getAttribute('href')).toBe('/dev/proto/pre-signup-interview');
  });

  it('Pricing top-nav href resolves to /dev/proto/pricing (outbound, not #pricing)', () => {
    render(<MarketingLandingPage />);
    const pricing = findLinkByText('Pricing');
    expect(pricing, 'Pricing nav link not found').not.toBeNull();
    expect(pricing!.getAttribute('href')).toBe('/dev/proto/pricing');
  });

  it('Sign in top-nav href still resolves to #signin (deferred outbound)', () => {
    render(<MarketingLandingPage />);
    const signin = findLinkByText('Sign in');
    expect(signin, 'Sign in nav link not found').not.toBeNull();
    expect(signin!.getAttribute('href')).toBe('#signin');
  });
});
