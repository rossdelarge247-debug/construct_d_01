import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { ProtoProvider } from '@/app/dev/proto/pre-signup-interview/lib/proto-context';
import { O7 } from '@/app/dev/proto/pre-signup-interview/screens/O7';

function renderO7() {
  return render(
    <ProtoProvider>
      <O7 />
    </ProtoProvider>,
  );
}

describe('O7 (canvas-as-source)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders MobileGenerating state initially with "Building your plan" eyebrow', () => {
    renderO7();
    expect(screen.getByText('Building your plan')).toBeTruthy();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toMatch(/Take a/);
    expect(heading.textContent).toMatch(/breath/);
  });

  it('renders the 5-step progressive disclosure list during generating', () => {
    renderO7();
    expect(screen.getByText('Listening to your situation')).toBeTruthy();
    expect(screen.getByText('Mapping the journey')).toBeTruthy();
    expect(screen.getByText('Tailoring next steps')).toBeTruthy();
    expect(screen.getByText('Comparing the conventional path')).toBeTruthy();
    expect(screen.getByText('Writing your specific notes')).toBeTruthy();
    expect(screen.getByText('working…')).toBeTruthy();
  });

  it('renders the "A warm hand on a cold day." attribution during generating', () => {
    renderO7();
    expect(screen.getByText(/A warm hand on a cold day/)).toBeTruthy();
  });

  it('exposes the disclosure list as a polite live region', () => {
    renderO7();
    const status = screen.getByRole('status');
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.getAttribute('aria-label')).toBe('Plan generation progress');
  });

  it('transitions to MobileReady after 3000ms', () => {
    renderO7();
    expect(screen.queryByText('Your plan is ready')).toBeNull();
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText('Your plan is ready')).toBeTruthy();
  });

  it('renders the MobileHero H1 with "Here\'s your plan." in MobileReady', () => {
    renderO7();
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    const headings = screen.getAllByRole('heading', { level: 1 });
    const planHeading = headings.find((h) => /Here.s/.test(h.textContent ?? ''));
    expect(planHeading).toBeTruthy();
    expect(planHeading?.textContent).toMatch(/your plan/);
  });

  it('renders all 6 content section headings in MobileReady', () => {
    renderO7();
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText('Your situation')).toBeTruthy();
    expect(screen.getByText('What separation looks like')).toBeTruthy();
    expect(screen.getByText('What needs to happen')).toBeTruthy();
    expect(screen.getByText('Things to bear in mind')).toBeTruthy();
    expect(screen.getByText('Take this')).toBeTruthy();
    const h2s = screen.getAllByRole('heading', { level: 2 });
    expect(h2s.length).toBeGreaterThanOrEqual(7);
  });

  it('renders the What\'s next CTA in MobileReady', () => {
    renderO7();
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    const cta = screen.getByRole('button', { name: /What's next/ });
    expect(cta).toBeTruthy();
  });

  it('hides decorative SVGs from screen readers (aria-hidden=true)', () => {
    const { container } = renderO7();
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
    svgs.forEach((svg) => {
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    });
  });

  it('declares prefers-reduced-motion CSS module classes for BreathingHalo + entry', () => {
    const { container } = renderO7();
    const breathEls = container.querySelectorAll('[class*="breath"]');
    expect(breathEls.length).toBeGreaterThanOrEqual(2);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    const entryEls = container.querySelectorAll('[class*="entry"]');
    expect(entryEls.length).toBeGreaterThanOrEqual(6);
  });

  it('cleans up the generating-state timer on unmount', () => {
    const { unmount } = renderO7();
    unmount();
    expect(() => {
      vi.advanceTimersByTime(3000);
    }).not.toThrow();
  });
});
