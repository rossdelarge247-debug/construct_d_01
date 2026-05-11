import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { ProgressPill } from '@/app/dev/proto/pre-signup-interview/components/ProgressPill';

describe('ProgressPill', () => {
  it('exposes the canvas-canon aria-label "Step X of Y"', () => {
    const { getByRole } = render(<ProgressPill step={3} total={8} />);
    expect(getByRole('progressbar').getAttribute('aria-label')).toBe('Step 3 of 8');
  });

  it('defaults total to TOTAL_STEPS (8) when omitted', () => {
    const { getByRole } = render(<ProgressPill step={2} />);
    expect(getByRole('progressbar').getAttribute('aria-label')).toBe('Step 2 of 8');
  });

  it('renders fill width as (step/total)*100 within the pill', () => {
    const { container } = render(<ProgressPill step={4} total={8} />);
    const fill = container.querySelector('[data-testid="progress-pill-fill"]') as HTMLElement;
    expect(fill.style.width).toBe('50%');
  });

  it('renders 0% fill on the (0, 0) boundary without NaN', () => {
    const { container } = render(<ProgressPill step={0} total={0} />);
    const fill = container.querySelector('[data-testid="progress-pill-fill"]') as HTMLElement;
    expect(fill.style.width).toBe('0%');
    expect(fill.style.width).not.toContain('NaN');
  });

  it('renders 0% fill when step is 0 and total is positive (no division-by-zero edge)', () => {
    const { container } = render(<ProgressPill step={0} total={8} />);
    const fill = container.querySelector('[data-testid="progress-pill-fill"]') as HTMLElement;
    expect(fill.style.width).toBe('0%');
  });

  it('caps fill width at 100% when step >= total', () => {
    const { container } = render(<ProgressPill step={10} total={8} />);
    const fill = container.querySelector('[data-testid="progress-pill-fill"]') as HTMLElement;
    expect(fill.style.width).toBe('100%');
  });

  it('clamps negative step to 0% fill', () => {
    const { container } = render(<ProgressPill step={-1} total={8} />);
    const fill = container.querySelector('[data-testid="progress-pill-fill"]') as HTMLElement;
    expect(fill.style.width).toBe('0%');
  });

  it('renders the visual "Step X / Y" slash label alongside the pill', () => {
    const { container } = render(<ProgressPill step={3} total={8} />);
    expect(container.textContent).toContain('Step 3 / 8');
  });
});
