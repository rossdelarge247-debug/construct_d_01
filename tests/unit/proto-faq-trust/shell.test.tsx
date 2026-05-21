import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import FaqTrustPage from '@/app/dev/proto/faq-trust/page';

describe('FaqTrustPage shell', () => {
  it('renders the title as H1', () => {
    render(<FaqTrustPage />);
    const heading = screen.getByRole('heading', { level: 1, name: 'Questions answered.' });
    expect(heading).toBeTruthy();
  });

  it('renders the sub line', () => {
    render(<FaqTrustPage />);
    expect(screen.getByText('Trust through transparency.')).toBeTruthy();
  });

  it('renders all three FAQ questions', () => {
    render(<FaqTrustPage />);
    expect(screen.getByText('Is my financial data safe?')).toBeTruthy();
    expect(screen.getByText('What if we disagree on something?')).toBeTruthy();
    expect(screen.getByText('Is Decouple legally binding?')).toBeTruthy();
  });

  it('renders all three trust-signal labels', () => {
    render(<FaqTrustPage />);
    expect(screen.getByText('Read-only bank access')).toBeTruthy();
    expect(screen.getByText('Solicitor-reviewable')).toBeTruthy();
    expect(screen.getByText('UK-jurisdiction first')).toBeTruthy();
  });

  it('renders the back-to-hub link', () => {
    render(<FaqTrustPage />);
    const link = screen.getByRole('link', { name: /back to hub/i });
    expect(link.getAttribute('href')).toBe('/dev/proto');
  });

  it('FAQ section is labelled by its H2', () => {
    render(<FaqTrustPage />);
    const faqHeading = screen.getByRole('heading', { level: 2, name: 'Frequently asked' });
    expect(faqHeading.getAttribute('id')).toBe('faq-heading');
    const section = faqHeading.closest('section');
    expect(section?.getAttribute('aria-labelledby')).toBe('faq-heading');
  });

  it('trust section is labelled by its H2', () => {
    render(<FaqTrustPage />);
    const trustHeading = screen.getByRole('heading', { level: 2, name: 'Trust signals' });
    expect(trustHeading.getAttribute('id')).toBe('trust-heading');
    const section = trustHeading.closest('section');
    expect(section?.getAttribute('aria-labelledby')).toBe('trust-heading');
  });
});
