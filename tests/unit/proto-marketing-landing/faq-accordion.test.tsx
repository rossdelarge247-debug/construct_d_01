import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MarketingLandingPage from '@/app/dev/proto/marketing-landing/page';

function getFaqToggles() {
  return screen.getAllByRole('button').filter(
    (b) => b.getAttribute('aria-controls')?.startsWith('faq-panel-'),
  );
}

describe('MarketingLandingPage FAQ accordion', () => {
  it('renders all FAQ toggles closed initially', () => {
    render(<MarketingLandingPage />);
    const toggles = getFaqToggles();
    expect(toggles.length).toBeGreaterThan(0);
    toggles.forEach((t) => expect(t.getAttribute('aria-expanded')).toBe('false'));
  });

  it('opens a toggle on click', () => {
    render(<MarketingLandingPage />);
    const [first] = getFaqToggles();
    fireEvent.click(first);
    expect(first.getAttribute('aria-expanded')).toBe('true');
    const panelId = first.getAttribute('aria-controls')!;
    expect(document.getElementById(panelId)).not.toBeNull();
  });

  it('closes the previous toggle when a new one opens (single-open)', () => {
    render(<MarketingLandingPage />);
    const toggles = getFaqToggles();
    fireEvent.click(toggles[0]);
    fireEvent.click(toggles[1]);
    expect(toggles[0].getAttribute('aria-expanded')).toBe('false');
    expect(toggles[1].getAttribute('aria-expanded')).toBe('true');
  });

  it('closes a toggle when clicked twice', () => {
    render(<MarketingLandingPage />);
    const [first] = getFaqToggles();
    fireEvent.click(first);
    fireEvent.click(first);
    expect(first.getAttribute('aria-expanded')).toBe('false');
  });
});
