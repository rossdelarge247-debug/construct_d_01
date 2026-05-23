import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '@/app/dev/proto/share-flow/page';

describe('/dev/proto/share-flow page', () => {
  it('renders without throwing', () => {
    expect(() => render(<Page />)).not.toThrow();
  });

  it('renders the back-link to /dev/proto', () => {
    render(<Page />);
    const back = screen.getByRole('link', { name: /back/i });
    expect(back.getAttribute('href')).toBe('/dev/proto');
  });

  it('renders the page title "Reconcile"', () => {
    render(<Page />);
    expect(screen.getByRole('heading', { name: /reconcile/i, level: 1 })).toBeTruthy();
  });

  it('renders the C-S1 page-level copy verbatim (AC-2)', () => {
    render(<Page />);
    expect(screen.getByText('This is your private view. You choose what to share.')).toBeTruthy();
  });

  it('renders the joined-avatars hero (AC-1)', () => {
    const { container } = render(<Page />);
    expect(container.querySelector('[data-testid="joined-avatars-hero"]')).toBeTruthy();
  });

  it('renders the state-1 headline (AC-1)', () => {
    render(<Page />);
    expect(screen.getByText('Share your picture with Mark to begin.')).toBeTruthy();
  });

  it('renders the R-M2 body copy verbatim (AC-1)', () => {
    render(<Page />);
    expect(
      screen.getByText(
        /Reconciliation opens as soon as Mark shares his picture\. Until then, you can keep refining yours/,
      ),
    ).toBeTruthy();
  });

  it('renders the Mark Status card with Share CTA (AC-1 + AC-2)', () => {
    render(<Page />);
    expect(screen.getByRole('button', { name: /share with mark/i })).toBeTruthy();
  });

  it('renders the soft-reminder caption verbatim (AC-1)', () => {
    const { container } = render(<Page />);
    const reminder = container.querySelector('[data-testid="soft-reminder"]');
    expect(reminder).toBeTruthy();
    expect(reminder!.textContent).toMatch(/You.ll get a notification when Mark shares/);
  });
});
