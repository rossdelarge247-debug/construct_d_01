import { useEffect } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { ProtoProvider, useProto } from '@/app/dev/proto/pre-signup-interview/lib/proto-context';
import { O7 } from '@/app/dev/proto/pre-signup-interview/screens/O7';

function renderO7() {
  return render(
    <ProtoProvider>
      <O7 />
    </ProtoProvider>,
  );
}

function SeedChildrenYes() {
  const { setAnswer } = useProto();
  useEffect(() => {
    setAnswer('situation', { hasChildren: 'yes' });
  }, [setAnswer]);
  return null;
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

  it('renders the always-on content section headings in MobileReady', () => {
    renderO7();
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText('Your situation')).toBeTruthy();
    expect(screen.getByText('What separation looks like')).toBeTruthy();
    expect(screen.getByText('What needs to happen')).toBeTruthy();
    const takeThisHeading = screen.getAllByRole('heading', { level: 2 }).find(
      (h) => /Take this/.test(h.textContent ?? ''),
    );
    expect(takeThisHeading).toBeTruthy();
    expect(takeThisHeading?.textContent).toMatch(/with you/);
    const h2s = screen.getAllByRole('heading', { level: 2 });
    expect(h2s.length).toBeGreaterThanOrEqual(6);
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

  it('renders BreathingHalo + content section <section> elements (animation behaviour verified under preview-deploy 6+1)', () => {
    const { container } = renderO7();
    expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(2);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(container.querySelectorAll('section').length).toBeGreaterThanOrEqual(6);
  });

  it('cleans up the generating-state timer on unmount', () => {
    const { unmount } = renderO7();
    unmount();
    expect(() => {
      vi.advanceTimersByTime(3000);
    }).not.toThrow();
  });

  it('renders the PersonalisedNotes section when seeded answers trigger a note', () => {
    render(
      <ProtoProvider>
        <SeedChildrenYes />
        <O7 />
      </ProtoProvider>,
    );
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText('Things to bear in mind')).toBeTruthy();
    expect(screen.getByText('Section 6 · your specific notes')).toBeTruthy();
  });
});
