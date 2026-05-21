import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import PricingPage from '@/app/dev/proto/pricing/page';

describe('PricingPage shell', () => {
  it('renders the title as H1', () => {
    render(<PricingPage />);
    const heading = screen.getByRole('heading', { level: 1, name: 'One settlement. Two paths.' });
    expect(heading).toBeTruthy();
  });

  it('renders the sub line referencing the £14,561 baseline', () => {
    render(<PricingPage />);
    expect(screen.getByText(/£14,561 solicitor-led journey/)).toBeTruthy();
  });

  it('renders both tier names', () => {
    render(<PricingPage />);
    expect(screen.getByRole('heading', { level: 2, name: 'Start' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'Complete' })).toBeTruthy();
  });

  it('renders both tier prices', () => {
    render(<PricingPage />);
    expect(screen.getByText('Free')).toBeTruthy();
    expect(screen.getByText('From £800')).toBeTruthy();
  });

  it('renders the back-to-hub link', () => {
    render(<PricingPage />);
    const link = screen.getByRole('link', { name: /back to hub/i });
    expect(link.getAttribute('href')).toBe('/dev/proto');
  });

  it('renders both CTA buttons in disabled state', () => {
    render(<PricingPage />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(2);
    for (const btn of buttons) {
      expect((btn as HTMLButtonElement).disabled).toBe(true);
    }
  });
});
